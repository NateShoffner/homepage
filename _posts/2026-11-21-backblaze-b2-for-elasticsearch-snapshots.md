---
title: Backblaze B2 for Elasticsearch Snapshots
date: 2026-11-21 12:00 -05:00
description: >-
  Setting up Backblaze B2 as an Elasticsearch snapshot repository and how it
  holds up on recent versions.
type: post
image: b2-elasticsearch-cover.png
tags:
  - Elasticsearch
  - Backblaze
  - B2
  - S3
categories:
  - Elastic
---

I've used Backblaze B2 for about a decade now and I really like it. It's been reliable and cheap (about [$0.007 per GB per month](https://www.backblaze.com/cloud-storage/pricing) against [$0.023 for S3 Standard](https://aws.amazon.com/s3/pricing/) at the time of writing). It also has an [S3-compatible API](https://www.backblaze.com/apidocs/introduction-to-the-s3-compatible-api), so I got curious whether it could serve as an Elasticsearch snapshot repository.

A [write-up from 2024](https://linsomniac.com/post/2024-08-19-elasticsearch_snapshots_to_backblaze_b2/) shows it working, so I was hopeful and decided to spin up a new Elasticsearch 9.5 instance and point it at a bucket.

#### Registering the Repository

This is standard [S3 repository](https://www.elastic.co/docs/deploy-manage/tools/snapshot-and-restore/s3-repository) configuration pointed at a different endpoint. In B2, create a bucket and an [application key](https://help.backblaze.com/hc/en-us/articles/360047425453-Getting-Started-with-the-S3-Compatible-API) restricted to that bucket. The key's `keyID` and `applicationKey` go in the keystore on every node:

```bash
bin/elasticsearch-keystore add s3.client.b2.access_key
bin/elasticsearch-keystore add s3.client.b2.secret_key
```

The [client settings](https://www.elastic.co/docs/reference/elasticsearch/configuration-reference/s3-repository-settings) go in `elasticsearch.yml` on every node, followed by a restart. Use the endpoint and region shown for your bucket:

```yaml
s3.client.b2.endpoint: "https://s3.us-west-004.backblazeb2.com"
s3.client.b2.region: "us-west-004"
s3.client.b2.path_style_access: true
```

Then register the repository:

```json
PUT _snapshot/b2
{
  "type": "s3",
  "settings": {
    "client": "b2",
    "bucket": "my-bucket",
    "base_path": "snapshots"
  }
}
```

Immediately I was hit with this:

```
s3_exception: A header you provided implies functionality that is not implemented
(Service: S3, Status Code: 501)
```

Odd. It seemingly worked in the 2024 write-up, but not here. After some digging, the header B2 doesn't like turned out to be `If-None-Match`. Elasticsearch now writes its repository metadata as a conditional write, meaning "only create this object if it doesn't already exist". B2 doesn't implement conditional writes yet, so it answers with the 501 above.

To check that it really did work back then, I tried 8.15, a version from around the time of that write-up. Using the same bucket, it registered the repository and took a snapshot without complaining. It worked in 2024 because Elasticsearch wasn't sending that header yet. Before 9.2 it didn't use conditional writes on any S3 backend, AWS included. In the words of the [issue that changed this](https://github.com/elastic/elasticsearch/issues/128565), it "simply ignores it and hopes for the best." AWS [added the feature](https://aws.amazon.com/about-aws/whats-new/2024/08/amazon-s3-conditional-writes/) in August 2024, literally the day after that write-up was published. Elasticsearch started relying on it in 9.2 and B2 simply hasn't followed suit.

I'm not the first to run into this since the Proxmox Backup Server developers [hit the same problem with B2](https://lists.proxmox.com/pipermail/pbs-devel/2025-July/014234.html) last year, along with people using [OVH](https://forum.proxmox.com/threads/169520/) and [DataCore Swarm](https://discuss.elastic.co/t/s3-compatible-storage-are-not-able-to-mounted-for-snapshot/386444). Nearly two years ago someone [asked on the Backblaze subreddit](https://www.reddit.com/r/backblaze/comments/1i11qa7/b2_support_for_conditional_writes/) whether support was planned. The only reply is from another Elasticsearch user with the same problem.

If you like living ~~dangerously~~ traditionally, Elasticsearch has a repository setting for storage like this:

```json
"unsafely_incompatible_with_s3_conditional_writes": true
```

With it on, Elasticsearch stops sending the condition and B2 works. Snapshots succeed and restores come back identical. Everything you'd normally check passes. What you lose is the guard that stops two writers from overwriting each other's changes to the repository. The setting is also [deprecated as of 9.2.4](https://www.elastic.co/docs/reference/elasticsearch/configuration-reference/s3-repository-settings).

#### Intentionally Breaking It

I wanted to see what actually happens to a repository without that guard. It sounds similar to what I've seen when [two clusters write to the same repository](https://www.elastic.co/docs/troubleshoot/elasticsearch/diagnosing-corrupted-repositories) and corrupt it.

For some context, every repository has a small file at its root, `index-N`, that lists which snapshots exist. Each change writes the next one. If two writers both start from `index-2` and both write `index-3`, the last write wins and the other change is lost. To reproduce that I saved an old copy of the index and wrote it back myself:

```bash
# save the current index
aws s3api get-object --bucket $BUCKET --key $BASE/index-2 index-2.captured

# Elasticsearch deletes a snapshot and writes index-3
curl -X DELETE "$ES/_snapshot/$REPO/snap-3"

# write the old copy over it
aws s3api put-object --bucket $BUCKET --key $BASE/index-3 --body index-2.captured --if-none-match '*'

# re-register so Elasticsearch re-reads the repository
curl -X DELETE "$ES/_snapshot/$REPO"
curl -X PUT "$ES/_snapshot/$REPO" -H 'Content-Type: application/json' -d @repo.json
```

The third command is the only step I manually intervened on. Storage that supports conditional writes rejects it with a 412 (Precondition Failed) because the object already exists. With B2, the AWS CLI didn't even get the 501 back and the connection just closed every time. I dropped the flag and sent a plain write the way the unsafe setting does.

#### The Damage

I ran it twice, overwriting the index with an old copy after two different changes.

| What Elasticsearch had just done | What happened | Can you fix it? |
|---|---|---|
| Deleted a snapshot | Listing snapshots returns an error | Yes, delete the snapshot the error names |
| Taken a new snapshot | The new snapshot is gone and nothing reports an error | No |

In both cases the repository still passes verification and you can still take and restore other snapshots. Running [cleanup](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-snapshot-cleanup-repository) doesn't help in either.

I ran the same test against AWS S3 from the same cluster. It registered with default settings, rejected the old index every time and came out intact. It also passes Elasticsearch's [repository analysis](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-snapshot-repository-analyze), which B2 fails.

#### Where That Leaves B2

Before 9.2, B2 was as safe as S3 because neither had this check. If you upgrade a cluster that already has a B2 repository, you can still list and restore your existing snapshots. So you can still use B2 as an Elasticsearch snapshot repository, with a catch. Taking new ones means turning on the unsafe setting and going back to the old behavior. That setting only exists from 9.2.3 onward and it's already deprecated. Elastic's [guidance for S3-compatible storage](https://www.elastic.co/docs/deploy-manage/tools/snapshot-and-restore/s3-repository#repository-s3-compatible-services) says options like it aren't supported past the current major version. Unless Backblaze implements conditional writes, there isn't much of a path forward for B2 once that setting is gone.

I should mention that everything here is geared towards self-managed clusters. If you try it on Elastic Cloud Hosted, expect the client settings to be refused as "not allowed" since it only [supports](https://www.elastic.co/docs/deploy-manage/tools/snapshot-and-restore/elastic-cloud-hosted) AWS S3, Google Cloud Storage and Azure. A custom plugin might get around that if your subscription level allows uploading one but that's a bit out of scope for today.

I simulated the damage above. It isn't a picture of real-world usage and S3 repositories ran this way for years. You're just missing a safety check that has since become standard.
If Backblaze ever decides to support the header, I'll definitely be digging into this more.
