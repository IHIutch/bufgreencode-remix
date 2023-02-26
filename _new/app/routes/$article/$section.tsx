import type { ReactNode } from 'react'
import React from 'react'
import Markdoc from '@markdoc/markdoc'
import { useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'
import { getArticle } from '@/models/articles.server'
import { getMetaTags } from '@/utils'
import type { LoaderArgs } from '@remix-run/node'
import type { MetaFunction } from '@remix-run/node'
import TableSmall from '@/components/content/TableSmall'
import FigureImg from '@/components/content/FigureImg'
import TableResponsive from '@/components/content/TableResponsive'
import PageToc from '@/components/PageToc'
import Heading from '@/components/content/Heading'

export default function Post() {
  const { content, frontmatter, headings } = useLoaderData<typeof loader>()

  return (
    <div className="flex">
      <div className="my-12 w-full px-4 md:px-8 xl:w-3/4">
        <div className="max-w-prose xl:mx-auto">
          <h1 className="mb-2 text-5xl font-medium leading-tight">
            {frontmatter.title}
          </h1>
          {frontmatter.lead ? (
            <p className="text-lg text-gray-700">{frontmatter.lead}</p>
          ) : null}
          <div className="page-content prose">
            {Markdoc.renderers.react(content, React, {
              components: {
                Heading,
                TableSmall,
                TableResponsive,
                FigureImg,
                Sup: ({ children }: { children: ReactNode }) => (
                  <sup>{children}</sup>
                ),
              },
            })}
          </div>
        </div>
      </div>
      <aside className="hidden shrink-0 lg:w-80 xl:block">
        {headings?.length > 0 ? (
          <div className="fixed top-0 h-screen pt-16">
            <div className="h-full overflow-y-auto">
              <div className="my-12 pr-4">
                <div className="mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    On this Page
                  </span>
                </div>
                <PageToc headings={headings} />
              </div>
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  )
}

export const meta: MetaFunction = ({ data, location }) => {
  const pageTitle = data?.frontmatter?.title || ''
  const slug = location?.pathname || ''
  return getMetaTags({
    pageTitle,
    slug,
  })
}

export const headers = () => {
  return {
    'Cache-Control': 'max-age=31536000, immutable',
  }
}

export const loader = async ({ params }: LoaderArgs) => {
  const { article, section } = params
  const { content, frontmatter, headings } = await getArticle(
    `/${article}/${section}`
  )

  if (!content) {
    throw new Response('Not Found', {
      status: 404,
    })
  }

  return json({ content, frontmatter, headings })
}
