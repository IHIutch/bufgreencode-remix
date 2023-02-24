import groupBy from 'lodash/groupBy'
import * as Accordion from '@radix-ui/react-accordion'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { NavLink, useLoaderData, useParams } from '@remix-run/react'

export default function GlobalNavComponent() {
  const { articles } = useLoaderData()
  const params = useParams()

  const groupedArticles = groupBy(articles, 'articleSlug')

  const defaultArticleIdx = Object.keys(groupedArticles).findIndex(
    (articleSlug) => {
      return articleSlug === params.article
    }
  )
  const [activeIdx, setActiveIdx] = useState(
    defaultArticleIdx ? [`content-${defaultArticleIdx}`] : []
  )

  return (
    <Accordion.Root
      asChild
      type="multiple"
      defaultValue={activeIdx}
      onValueChange={setActiveIdx}
    >
      <ul className="px-2 py-1 text-sm">
        {Object.keys(groupedArticles).map((articleSlug, idx) => (
          <Accordion.Item asChild key={idx} value={`content-${idx}`}>
            <li className="px-2 pb-1">
              <Accordion.Trigger className="w-full text-left">
                <div className="flex w-full items-center text-gray-600 hover:text-gray-900">
                  <div className="grow px-2 py-1">
                    <span className="font-medium">
                      {groupedArticles[articleSlug][0].articleNumber}.{' '}
                      {groupedArticles[articleSlug][0].articleTitle}
                    </span>
                  </div>
                  <div>
                    <div
                      className={clsx(
                        'duration-200',
                        activeIdx.includes(`content-${idx}`)
                          ? 'rotate-180'
                          : 'rotate-0'
                      )}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Accordion.Trigger>
              <Accordion.Content
                className={clsx(
                  'overflow-hidden transition-all data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up',
                  'py-1 pl-3'
                )}
              >
                <ul
                  className={clsx(
                    'border-l border-gray-300 pb-1',
                    'transition-all duration-200',
                    activeIdx.includes(`content-${idx}`)
                      ? 'translate-y-0 opacity-100'
                      : '-translate-y-4 opacity-0'
                  )}
                >
                  {groupedArticles[articleSlug].map((section, sIdx) => (
                    <li key={sIdx}>
                      <NavLink
                        prefetch="intent"
                        className={clsx(
                          'block w-full truncate py-1.5 text-gray-600 hover:text-gray-900',
                          '-ml-px transition-all duration-200'
                        )}
                        to={`/${section.slug}`}
                      >
                        {({ isActive }) => (
                          <div
                            className={clsx(
                              'border-l-2 px-2',
                              'transition-all duration-200',
                              isActive
                                ? 'border-green-700'
                                : 'border-transparent'
                            )}
                          >
                            <span
                              className={clsx(
                                'truncate',
                                isActive ? 'text-green-700' : ''
                              )}
                            >
                              {section.articleNumber}.{section.sectionNumber}{' '}
                              {section.sectionTitle}
                            </span>
                          </div>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </Accordion.Content>
            </li>
          </Accordion.Item>
        ))}
      </ul>
    </Accordion.Root>
  )
}
