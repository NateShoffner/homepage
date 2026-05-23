import { getAllPosts } from '@/lib/blog'
import { Feed } from 'feed'

const siteUrl = 'https://nateshoffner.com'

export function GET() {
  const posts = getAllPosts()

  const feed = new Feed({
    title: 'Nate Shoffner',
    description: 'Personal homepage and blog for Nate Shoffner.',
    id: siteUrl,
    link: siteUrl,
    copyright: '',
  })

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      description: post.description,
      date: post.date ? new Date(post.date) : new Date(),
      link: siteUrl + post.url,
      guid: siteUrl + post.url,
    })
  })

  return new Response(feed.rss2(), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
