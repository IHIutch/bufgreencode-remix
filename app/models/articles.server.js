import fs from 'fs'
import Markdoc from '@markdoc/markdoc'
import yaml from 'js-yaml'
import { heading } from '~/markdoc/schema/heading.markdoc'
import matter from 'gray-matter'

const getHeadings = (node, sections = []) => {
  if (node?.name) {
    // 'Heading' is defined in markdoc/schema/heading.markdoc.js
    if (node.name.match('Heading')) {
      const title = node.children[0]

      if (typeof title === 'string') {
        sections.push({
          ...node.attributes,
          title,
        })
      }
    }

    if (node.children) {
      for (const child of node.children) {
        getHeadings(child, sections)
      }
    }
  }

  return sections
}

export async function getArticles() {
  const contentDir = process.cwd() + '/app/content'
  const contentPaths = fs.readdirSync(contentDir)

  const articlePaths = contentPaths.reduce((acc, path) => {
    const paths = fs.readdirSync(`${contentDir}/${path}`)
    return acc.concat(
      paths.map((p) => ({
        path: `${contentDir}/${path}/${p}`,
        articleSlug: path,
        pageSlug: `${path}/${p}`.split('.').slice(0, -1).join('.'),
      }))
    )
  }, [])

  const articles = await Promise.all(
    articlePaths.map(async (ap) => {
      const source = fs.readFileSync(ap.path, 'utf8', (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        return data
      })

      const { data: frontmatter } = matter(source)
      return { ...frontmatter, slug: ap.pageSlug, articleSlug: ap.articleSlug }
    })
  )

  return articles
}

export async function getArticle({ article, section }) {
  try {
    const contentDir = process.cwd() + '/app/content'
    const source = fs.readFileSync(
      `${contentDir}/${article}/${section}.mdx`,
      'utf8',
      (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        return data
      }
    )

    const ast = Markdoc.parse(source)
    const frontmatter = ast.attributes.frontmatter
      ? yaml.load(ast.attributes.frontmatter)
      : {}

    const content = Markdoc.transform(ast, {
      tags: {
        tableSmall: {
          render: 'TableSmall',
        },
        figureImg: {
          render: 'FigureImg',
          attributes: {
            caption: {
              type: 'String',
            },
          },
        },
        tableResponsive: {
          render: 'TableResponsive',
        },
        sup: {
          render: 'Sup',
        },
      },
      nodes: {
        heading,
      },
    })
    const headings = getHeadings(content)

    return { content, frontmatter, headings }
  } catch (error) {
    console.log(error)
    return null
  }
}
