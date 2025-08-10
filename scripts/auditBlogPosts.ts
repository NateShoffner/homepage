import fs from 'fs';
import path from 'path';

import { unified } from 'unified';
import remarkParse from 'remark-parse';

const postsDir = path.resolve(process.cwd(), 'src/_posts')


function getAllMarkdownFiles(dir: string): string[] {
  return fs.readdirSync(dir).flatMap(entry => {
    const fullPath = path.join(dir, entry)
    if (fs.statSync(fullPath).isDirectory()) return getAllMarkdownFiles(fullPath)
    return fullPath.endsWith('.md') ? [fullPath] : []
  })
}

function hasLiquidSyntax(content: string): boolean {
  const liquidPatterns = [
    /{%\s*[^}]+%}/, // {% include ... %}, {% if ... %}
    /{{\s*[^}]+}}/, // {{ variable }}
  ];
  return liquidPatterns.some((regex) => regex.test(content));
}

function isValidMarkdown(content: string): boolean {
  try {
    unified().use(remarkParse).parse(content);
    return true;
  } catch (e) {
    return false;
  }
}

function checkBlogPosts() {
  const files = getAllMarkdownFiles(postsDir);

  const results: {
    file: string;
    hasLiquid: boolean;
    invalidMarkdown: boolean;
  }[] = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const hasLiquid = hasLiquidSyntax(content);
    const validMarkdown = isValidMarkdown(content);

    if (hasLiquid || !validMarkdown) {
      results.push({
        file,
        hasLiquid,
        invalidMarkdown: !validMarkdown,
      });
    }
  }

  if (results.length === 0) {
    console.log('✅ All blog posts are clean!');
  } else {
    console.log('🚨 Issues found in the following files:\n');
    results.forEach(({ file, hasLiquid, invalidMarkdown }) => {
      console.log(`- ${file}`);
      if (hasLiquid) console.log(`  ⚠ Contains Liquid syntax`);
      if (invalidMarkdown) console.log(`  ❌ Invalid Markdown`);
    });
  }
}

checkBlogPosts();
