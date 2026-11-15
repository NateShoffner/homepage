---
title: A Mostly Proper Keyword Search for Discord
date: 2026-11-14 12:00 -05:00
description: >-
  Poking at the internals of Discord search and building a bot that turns it
  into a mostly proper keyword search.
type: post
image: elasticsearch-unmasked-cover.png
tags:
  - Discord
  - Search
  - API
  - Elasticsearch
  - Lucene
  - Python
categories:
  - Search
  - Elastic
  - Discord
---

Anybody who has spent time in a large Discord server knows how painful it can be to try and search for a particular phrase. The [filters](https://support.discord.com/hc/en-us/articles/115000468588-How-to-Use-Search-on-Discord) are a handful of `from:`, `in:` and `has:` style operators plus whatever words you type. You cannot search for an exact phrase. You cannot exclude a word, so "pizza" but not "ranch" is impossible. Words get stemmed whether you like it or not, so "bake" also finds "baked" and "baking". On top of that, results are capped no matter how many messages actually match. Users have been raising these issues for years, with very little response from Discord.

#### ~~The Endpoint~~ The Starting Point

There's no TOS-friendly way to poke at this from a user perspective, as using a user token programmatically is considered self-botting. Bots historically had even less access to guild search. That changed on [March 19, 2026](https://docs.discord.com/developers/change-log#march-19-2026), when Discord opened [`GET /guilds/{guild.id}/messages/search`](https://docs.discord.com/developers/resources/message#search-guild-messages) to bots. The endpoint itself is not new. The client has always used it. Bots were just locked out of it until now. The only requirements are the [Message Content privileged intent](https://docs.discord.com/developers/events/gateway#privileged-intents) and [Read Message History](https://docs.discord.com/developers/topics/permissions#permissions-bitwise-permission-flags) in the channels it is searching.

Naturally, the follow-up question is: how much more can this endpoint do than the client lets on, and can you build a better search on top of it? It takes 24 query parameters in total. Most mirror the client's filters: `content`, `author_id`, `channel_id`, `has`, `mentions`, `pinned`, `min_id` and `max_id` for a time window, `sort_by` and `sort_order`. A few are not in the client at all. `slop`, 0 to 100 with a default of 2, is described only as how many words may sit between your search terms. `author_type` separates users from bots and webhooks. `channel_id` and `author_id` take lists.

The ones that matter most are the boring ones. `limit` maxes out at 25 and `offset` at 9,975, so any single query can show you at most 10,000 results. The response also includes `total_results`, which will very helpfully report that 400,000 messages match while handing you 10,000 of them.

That 10,000 cap kills any approach of pulling everything and filtering it locally. Discord indexes stop words, so on a server with a couple of million messages, "the" alone can match a few hundred thousand and you can page through 10,000.

#### Fuzzing the Fuzziness

We don't really know anything about how matching actually works: stemming, typo tolerance, accents, tokenization, what `slop` counts, whether code blocks are indexed, what the rate limit is, etc. All of it decides whether keyword search is usable, so I measured it the old-fashioned way by posting messages containing nonsense words I know the answer for, searching for them, and seeing what comes back.

```python
STEM = "zqxjkvwump"

CANARIES = [
    ("plain",       f"{STEM}hello"),
    ("suffixed",    f"{STEM}jumping"),             # stemming?
    ("prefixed",    f"pre{STEM}fix"),              # infix matching?
    ("hyphen",      f"{STEM}-dashy"),              # does - split a word?
    ("underscore",  f"{STEM}_undery"),             # does _ split a word?
    ("camel",       f"{STEM}Humpy{STEM}Lumpy"),    # camelCase?
    ("diacritic",   f"{STEM}über"),                # accent folding?
    ("in_code",     f"```\n{STEM}code = 1\n```"),  # are code blocks indexed?
    ("in_spoiler",  f"||{STEM}hush||"),
    ("stopwords",   f"{STEM}left the a of and {STEM}right"),
    ("slop0",       f"{STEM}salt {STEM}pepper"),
    ("slop1",       f"{STEM}salt one {STEM}pepper"),
    ("slop3",       f"{STEM}salt one two three {STEM}pepper"),
    ("slop8",       f"{STEM}salt one two three four five six seven eight {STEM}pepper"),
    ("reversed",    f"{STEM}pepper {STEM}salt"),   # does order matter?
]
```

The index can take up to about 30 seconds to catch up. Then you can search for `zqxjkvwump` and each variant and see which canaries come back. The `slop` ones get searched as the phrase `zqxjkvwumpsalt zqxjkvwumppepper` at each slop value:

| `slop` | Matches | What got in |
|---|---|---|
| 0 | 1 | only the adjacent, in-order canary |
| 1 | 2 | one filler word allowed |
| 2 | 3 | the reversed canary now matches (and 2 is the default) |
| 3 | 4 | three filler words |
| 5 | 4 | nothing new, no canary sits 4 or 5 words apart |
| 8 | 5 | eight filler words |
| 100 | 5 | nothing new, every canary was already in |

From this we have a few findings. English stemming is on. Matching is case insensitive. Code blocks, URLs, bold and spoilers are all indexed as plain text. Hyphens and slashes split words, while underscores, dots and camelCase do not. There is no typo tolerance at all. Accents are not folded, so `café` and `cafe` are different words. Quotes inside `content` are just punctuation. A "phrase" is whatever `slop` says it is. Obviously this isn't an exhaustive list but it gives us quite a lot to go off of.

It's worth noting that `slop` is not a fuzziness knob. It counts word positions and swapping two adjacent words costs 2 of them. That is the jump from 2 to 3 matches at `slop=2`: the default already matches your terms in either order, and `slop=100` is effectively "all these words, anywhere in the message." Discord gives you a boolean AND and never mentions it. If a swap costing exactly 2 rings a bell, hold that thought.

The rate limit, going by the [response headers](https://docs.discord.com/developers/topics/rate-limits), is 6 requests per roughly 2 seconds, applied per server rather than per application.

#### Unmasking Elasticsearch

<div class="text-center">

![Scooby Doo unmasking: the Discord mask comes off and it was Elasticsearch all along](elasticsearch-unmasked.png)

</div>

Thanks to some really cool blog posts by the Discord engineering team, we know that Discord search runs on Elasticsearch. There's a [2017 post](https://discord.com/blog/how-discord-indexes-billions-of-messages) on the original setup and a later one on [rebuilding it](https://discord.com/blog/how-discord-indexes-trillions-of-messages) as a series of small clusters on Kubernetes. That probably explains the slop quirk too. A swap costing 2 is just [edit distance](https://en.wikipedia.org/wiki/Edit_distance), and that is exactly how [phrase slop](https://lucene.apache.org/core/10_3_0/core/org/apache/lucene/search/PhraseQuery.html#getSlop()) works in Lucene, the engine Elasticsearch is built on. While I knew that before diving into this experiment, I didn't expect their configuration to essentially be Elasticsearch defaults.

The 10,000 result ceiling looks like [`index.max_result_window`](https://www.elastic.co/docs/reference/elasticsearch/index-settings/index-modules), which defaults to 10,000, and the offset cap of 9,975 plus a page of 25 adds up to exactly that. The exact `total_results` past that point would be `track_total_hits: true`. The `slop` parameter is almost certainly [`match_phrase`](https://www.elastic.co/docs/reference/query-languages/query-dsl/query-dsl-match-query-phrase) slop passed straight through, with the default raised from 0 to 2. The analyzer behaves like the stock `english` stemmer with no stop filter. Even the 202 "index not yet available" response matches the lazy indexing described in the 2017 post: a server gets indexed the first time anybody searches it and the first searcher waits for that to warm up.

#### Building the Bot

I'm personally a big fan of [discord.py](https://discordpy.readthedocs.io/en/stable/), so I'll be using it to create a bot that works as a sort of advanced keyword search for a server. The API gets us things the client never offers, like exact phrases and proper date ranges, and post-search filtering handles everything the API cannot do on its own.

There's no wrapper for the search endpoint yet, but the library exposes a raw `Route` and its own rate-limited HTTP client, so writing one is a dozen lines:

```python
from discord.http import HTTPClient, Route

async def search_page(
    http: HTTPClient, guild_id: int, params: list[tuple[str, str]],
    *, limit: int = 25, offset: int = 0,
) -> tuple[int, list[dict]]:
    route = Route("GET", "/guilds/{guild_id}/messages/search", guild_id=guild_id)
    params = [*params, ("limit", str(limit)), ("offset", str(offset))]
    data = await http.request(route, params=params)

    # "Index not yet available" is a 202, which discord.py treats as success
    # so check the actual response
    if "messages" not in data:
        raise IndexNotReady(retry_after=data.get("retry_after", 1.0))

    # messages is an array of arrays (a context-grouping feature nobody uses)
    return data["total_results"], [m for group in data["messages"] for m in group]
```

The split is simple once you think of the API as Elasticsearch behind a 10k limitation. Whatever Discord can filter on, let it, since that is the only place anything gets *found*. Everything it cannot do (exclusions, OR, regex, code-only search, length, time of day) happens afterwards on whatever came back, which means those filters can only ever throw things out. The query syntax is really just deciding which side of that line each piece lands on.

```
/search query: "pizza night" in:#food -ranch after:2y len:>100
```

`in:`, `after:` and the words go to Discord and the quotes drop `slop` to 0 so the server does the phrase matching. The rest runs locally. Roughly:

```python
api = ApiQuery(
    content="pizza night",
    slop=0,
    channel_ids=[food.id],
    min_id=time_snowflake(now - 2 years),                 # ids encode time, see below
)
post = PostFilter(
    phrases=[Phrase(words=["pizza", "night"], slop=0)],  # re-verify adjacency
    exclude_words=["ranch"],                              # API has no negation
    length=Range(min=100),
)
```

OR is one API query per term, merged. AND over scattered words is every term pushed with `slop:100`, then verified locally. Regex works because once you have the text you can do whatever you like with it.

#### Slicing Up Time

The 10,000 ceiling is per query, not per server, and that serves as a bit of a loophole for us. Discord message ids are [snowflakes](https://docs.discord.com/developers/reference#snowflakes): 64-bit numbers with a millisecond timestamp packed into the top 42 bits, and a few bits of bookkeeping underneath.

<div class="plain-image">

![A Discord snowflake id split into its 64 bits: a 42-bit millisecond timestamp, 5-bit worker, 5-bit process and 12-bit increment](snowflake-layout.png)

</div>

Shift one right by 22 and add Discord's epoch, the first millisecond of 2015, and you have the moment the message was sent:

```python
DISCORD_EPOCH_MS = 1420070400000

snowflake = 175928847299117063
ms = (snowflake >> 22) + DISCORD_EPOCH_MS   # 2016-04-30 11:18:25.796 UTC

def time_to_snowflake(when: datetime, high: bool = False) -> int:
    ms = int(when.timestamp() * 1000) - DISCORD_EPOCH_MS
    return (ms << 22) | (0x3FFFFF if high else 0)
```

Run it backwards on any datetime and you get an id for that moment, which is all `min_id` and `max_id` need. discord.py ships both directions as `discord.utils.snowflake_time` and `discord.utils.time_snowflake`, so the bot uses those. A time window is just an id range, and a query that reports 30,000 matches across three years is roughly three queries of 10,000 across one year each. So `exhaustive:true` counts a window, and if it comes back over 10k, splits it in half and asks again:

```python
MAX_REACHABLE = 10000  # offset cap of 9,975 plus one last page of 25

async def plan_slices(
    client: SearchClient, guild_id: int, query: ApiQuery,
    lower: int, upper: int, depth: int = 0,
) -> list[ApiQuery]:
    scoped = query.narrowed(min_id=lower, max_id=upper)
    total = await client.count(guild_id=guild_id, query=scoped)
    if total <= MAX_REACHABLE:
        return [scoped] if total else []
    if depth >= 12 or upper - lower <= (1 << 22):
        # 1 << 22 is one millisecond of ids; nothing finer to split on
        return [scoped]
    mid = lower + (upper - lower) // 2
    left = await plan_slices(client=client, guild_id=guild_id, query=query,
                             lower=lower, upper=mid, depth=depth + 1)
    right = await plan_slices(client=client, guild_id=guild_id, query=query,
                              lower=mid, upper=upper, depth=depth + 1)
    return left + right
```

Every split costs a request, so this is for rare words only. Point it at a common word and you are in for thousands of requests and a very long wait. That is partly what the count line is for: it tells you how big the pile is before you start digging.

#### Who Asked?

The endpoint checks permissions against the *bot*, not against whoever ran the command. Give the bot read access to a private moderator channel and it will happily hand that channel's messages to anyone who types `/search` like an Nvidia CEO disclosing trade secrets. Our bot needs to be the arbiter of the information that's eventually returned to the user by scoping the search twice. Before the request, work out which channels the caller can read and push that list in as `channel_id` filters, so Discord only looks where they are allowed to look. After the response, check every message's channel against that same list anyway. It's inexpensive and helps act as a quick sanity check:

```python
def can_read(channel: discord.abc.GuildChannel | discord.Thread, member: discord.Member) -> bool:
    perms = channel.permissions_for(member)
    if not (perms.view_channel and perms.read_message_history):
        return False
    if isinstance(channel, discord.Thread) and channel.is_private():
        # view_channel on the parent is not access to a private thread
        return perms.manage_threads or any(m.id == member.id for m in channel.members)
    return True

readable = {c.id for c in list(guild.channels) + list(guild.threads)
            if can_read(channel=c, member=caller)}
api.channel_ids = sorted(readable)[:500]                 # pass 1: push down
results = [m for m in results
           if int(m["channel_id"]) in readable]          # pass 2: verify
```

The second pass looks paranoid until you learn that the endpoint silently ignores parameters it does not recognize. Misspell one and you get an unscoped search that looks scoped. The first pass has its own gaps: `channel_id` stops at 500 values, permissions can change mid-search, and access to a channel is not access to its private threads. The inverse is also true: the bot's own access is the limiting factor, so if the caller can read a channel the bot cannot, the API returns nothing from it and the caller has no way of knowing. Better to check the bot's permissions as well and say how many channels were skipped than to quietly come back with fewer results.

#### Search Results Results

Side by side, this is where the client, the endpoint and the bot ended up.

| | Client | API | Bot |
|---|---|---|---|
| Keywords, channel, author, `has`, date range | yes | yes | passed straight through |
| Stemming | yes | yes | yes, same engine |
| Typo tolerance, accent folding | no | no | no |
| Exact phrase | quotes do nothing | `slop=0` | `"quoted"`, re-checked for adjacency |
| Word proximity | stuck on the default | `slop` 0 to 100 | `slop:N` |
| Every term, any order | no | no | `all:(a b c)`, slop 100 then verified |
| OR | no | no | `any:(a b c)`, one request per term |
| Exclude a word or phrase | no | no | `-word`, `-"phrase"` |
| Users vs bots vs webhooks | no | `author_type` | `type:bot`, `-type:webhook` |
| Regex | no | no | `/pattern/` |
| Only inside code blocks | no | no | `scope:code` |
| Message length, time of day | no | no | `len:>100`, `hour:9-17` |
| Honest count | a total, 10,000 reachable | `total_results`, 10,000 reachable | kept vs fetched vs reported, every time |
| Past the 10,000 ceiling | no | no | `exhaustive:true`, bisecting the time range |
| Whose permissions | yours | the bot's | the caller's, checked twice |

Most of the bot's column is just throwing out messages you did not want, which is easy once you have them.

The catch is getting handed the right things in the first place. If Discord did not match a message, the bot never sees it, so there is still no typo tolerance and no accent folding. Both can be worked around by searching for likely variants as well, or by keeping a local index, but each of those is its own project.

<div class="text-center">

![Demo #food channel with made-up pizza night chatter](discord-search-posts.png)

</div>

<div class="text-center">

![Ephemeral search results with paging and an Explain view](discord-search-results.png)

</div>

The bot is available on [GitHub](https://github.com/NateShoffner/discord-keyword-search-poc). It covers everything above: the query syntax, the two-pass scoping and the time slicing, with results in an ephemeral embed and an Explain view that shows what Discord searched, what the bot filtered, and what was kept.

The engine was never the problem. The knobs were there the whole time, and until recently nobody outside Discord was allowed to touch them. Seven years of people asking for quotes to mean something, and the answer was one query parameter away. Everything else is just sugar on top.
