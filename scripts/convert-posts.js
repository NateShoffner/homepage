#!/usr/bin/env node
// One-shot script: converts Jekyll Liquid shortcodes in _posts/ and _drafts/ to standard markdown.
// Run once with: node scripts/convert-posts.js

const fs = require('fs')
const path = require('path')

const POSTS_DIRS = [
  path.join(__dirname, '..', '_posts'),
  path.join(__dirname, '..', '_drafts'),
]

function convertContent(content) {
  // {% post_image filename="F" [alt="A"] [title="T"] [class="C"] %}
  content = content.replace(
    /\{%\s*post_image\s+((?:[a-z]+="[^"]*"\s*)+)%\}/g,
    (match, attrs) => {
      const get = (name) => {
        const m = attrs.match(new RegExp(`${name}="([^"]*?)"`))
        return m ? m[1] : ''
      }
      const filename = get('filename')
      const alt = get('alt')
      const title = get('title')
      const titlePart = title ? ` "${title}"` : ''
      return `![${alt}](/assets/images/posts/${filename}${titlePart})`
    }
  )

  // {% post_images filenames="a,b,c" [group="G"] %}
  content = content.replace(
    /\{%\s*post_images\s+((?:[a-z]+="[^"]*"\s*)+)%\}/g,
    (match, attrs) => {
      const m = attrs.match(/filenames="([^"]*)"/)
      if (!m) return match
      const filenames = m[1].split(',').map((f) => f.trim())
      return filenames.map((f) => `![](/assets/images/posts/${f})`).join('\n')
    }
  )

  // {% amazon asin="A" text="T" %}
  content = content.replace(
    /\{%\s*amazon\s+asin="([^"]+)"(?:\s+text="([^"]*)")?\s*%\}/g,
    (match, asin, text) => `[${text || asin}](https://www.amazon.com/dp/${asin})`
  )

  // {% highlight lang %} ... {% endhighlight %}
  content = content.replace(/\{%\s*highlight\s+(\w+)\s*%\}/g, '```$1')
  content = content.replace(/\{%\s*endhighlight\s*%\}/g, '```')

  // {% include post_image.liquid filename="F" [class="C"] %}
  content = content.replace(
    /\{%\s*include\s+post_image\.liquid\s+((?:[a-z]+="[^"]*"\s*)+)%\}/g,
    (match, attrs) => {
      const m = attrs.match(/filename="([^"]*)"/)
      if (!m) return match
      return `![](/assets/images/posts/${m[1]})`
    }
  )

  // <img ... src="{{ site.baseurl}}/assets/images/posts/F" ... />
  content = content.replace(
    /<img[^>]+src="\{\{\s*site\.baseurl\s*\}\}\/assets\/images\/posts\/([^"]+)"[^>]*\/?>/g,
    (match, filename) => `![](/assets/images/posts/${filename})`
  )

  // <a href="URL" target="_blank">T</a>
  content = content.replace(
    /<a\s+href="([^"]+)"\s+target="_blank">([^<]+)<\/a>/g,
    '[$2]($1)'
  )

  return content
}

let changed = 0
let skipped = 0

for (const dir of POSTS_DIRS) {
  if (!fs.existsSync(dir)) continue
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'))
  for (const file of files) {
    const filepath = path.join(dir, file)
    const original = fs.readFileSync(filepath, 'utf8')
    const converted = convertContent(original)
    if (converted !== original) {
      fs.writeFileSync(filepath, converted, 'utf8')
      console.log(`  converted: ${file}`)
      changed++
    } else {
      skipped++
    }
  }
}

console.log(`\nDone. ${changed} file(s) converted, ${skipped} already clean.`)
