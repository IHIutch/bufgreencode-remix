import fs from 'fs'
import Markdoc from '@markdoc/markdoc'
import matter from 'gray-matter'
import { config as markdocConfig } from '@/markdoc/config'
import { getErrorMessage, getHeadings } from '@/utils'

export async function getArticles() {
  const contentDir = process.cwd() + '/app/content'
  const contentPaths = fs.readdirSync(contentDir)

  const articlePaths = contentPaths.reduce(
    (acc: { path: string; slug: string }[], path) => {
      const paths = fs.readdirSync(`${contentDir}/${path}`)
      const group = paths.map((p) => ({
        path: `${contentDir}/${path}/${p}`,
        slug: `${path}/${p}`.split('.').slice(0, -1).join('.'),
      }))
      return acc.concat(group)
    },
    []
  )

  const articles = await Promise.all(
    articlePaths.map(async (ap) => {
      const { data: frontmatter } = matter.read(ap.path)
      return {
        title: frontmatter.title,
        article: frontmatter.article,
        article_number: frontmatter.article_number,
        section_number: frontmatter.section_number,
        lead: frontmatter.lead || '',
        slug: ap.slug,
      }
    })
  )

  return articles
}

export async function getArticle(slug: string) {
  try {
    const contentDir = process.cwd() + '/app/content'
    const source = fs.readFileSync(`${contentDir}${slug}.mdx`, 'utf8')

    const ast = Markdoc.parse(source)

    const { data: frontmatter } = matter(
      ast.attributes?.frontmatter
        ? `---\n${ast.attributes?.frontmatter}\n---\n`
        : ''
    )

    const content = Markdoc.transform(ast, markdocConfig)
    const headings = getHeadings(content)

    return {
      content,
      frontmatter: {
        title: frontmatter.title,
        lead: frontmatter.lead || '',
      },
      headings,
    }
  } catch (error) {
    throw new Response('Something went wrong', {
      status: 500,
      statusText: getErrorMessage(error),
    })
  }
}
