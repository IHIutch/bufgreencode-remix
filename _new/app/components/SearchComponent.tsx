import { useState } from 'react'
import { DocSearchModal } from '@docsearch/react'
import { Loader, Search } from 'lucide-react'
import { useHydrated } from 'remix-utils'
import clsx from 'clsx'
import { Link, useLoaderData } from '@remix-run/react'

export default function SearchComponent() {
  const { ENV } = useLoaderData()
  const [isOpen, setIsOpen] = useState(false)
  let isHydrated = useHydrated()

  return (
    <div className="h-full w-full">
      <button
        className={clsx(
          isHydrated ? 'bg-gray-100' : 'cursor-not-allowed bg-gray-300',
          'h-full w-full rounded-lg border px-4 py-2 text-left text-gray-500 transition-colors'
        )}
        onClick={() => setIsOpen(true)}
        disabled={!isHydrated}
      >
        <div className="flex items-center">
          {isHydrated ? (
            <Search className="h-4 w-4" />
          ) : (
            <Loader className="h-4 w-4 animate-spin" />
          )}
          <span className="ml-2">Search the docs...</span>
        </div>
      </button>
      {isOpen && isHydrated ? (
        <DocSearchModal
          initialScrollY={window.scrollY}
          appId={ENV.ALGOLIA_APP_ID}
          indexName={ENV.ALGOLIA_INDEX_NAME}
          apiKey={ENV.ALGOLIA_API_KEY}
          onClose={() => setIsOpen(false)}
          placeholder="Search the docs..."
          hitComponent={Hit}
          transformItems={(items) => {
            return items.map((item, index) => {
              console.log({ item })
              const a = document.createElement('a')
              a.href = item.url

              if (item.hierarchy?.lvl0) {
                item.hierarchy.lvl0 = item.hierarchy.lvl0.replace(/&amp;/g, '&')
              }

              if (item._highlightResult?.hierarchy?.lvl0?.value) {
                item._highlightResult.hierarchy.lvl0.value =
                  item._highlightResult.hierarchy.lvl0.value.replace(
                    /&amp;/g,
                    '&'
                  )
              }

              return {
                ...item,
                url: `${a.pathname}${a.hash}`,
                __is_result: () => true,
                // __is_parent: () =>
                //   item.type === 'lvl1' && items.length > 1 && index === 0,
                // __is_child: () =>
                //   item.type !== 'lvl1' &&
                //   items.length > 1 &&
                //   items[0].type === 'lvl1' &&
                //   index !== 0,
                __is_first: () => index === 1,
                __is_last: () => index === items.length - 1 && index !== 0,
              }
            })
          }}
        />
      ) : null}
    </div>
  )
}

const Hit = ({ hit, children }) => {
  return (
    <Link
      prefetch="intent"
      to={hit.url}
      className={clsx({
        'DocSearch-Hit--Result': hit.__is_result?.(),
        // 'DocSearch-Hit--Parent': hit.__is_parent?.(),
        // 'DocSearch-Hit--Child': hit.__is_child?.(),
        'DocSearch-Hit--FirstChild': hit.__is_first?.(),
        'DocSearch-Hit--LastChild': hit.__is_last?.(),
      })}
    >
      {children}
    </Link>
  )
}
