import { useLoaderData } from '@remix-run/react'
import clsx from 'clsx'
import { useScrollSpy } from '~/hooks/useScrollSpy'

export default function PageToc() {
  const { headings } = useLoaderData()

  const activeId = useScrollSpy(
    [...(headings || [])].reverse().map((heading) => `[id="${heading.id}"]`)
  )

  return headings && headings.length > 0 ? (
    <aside className="hidden lg:w-80 xl:block">
      <div className="fixed top-0 h-screen pt-16">
        <div className="h-full overflow-y-auto">
          <div className="my-12 pr-4">
            <div className="mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                On this Page
              </span>
            </div>
            <ul>
              {headings.map((heading, idx) => (
                <li
                  key={idx}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  <a href={`#${heading.id}`} className="block py-1.5">
                    <div
                      className={clsx(
                        'border-l-2 transition-all duration-200',
                        activeId === heading.id
                          ? ' border-green-700'
                          : ' border-transparent'
                      )}
                    >
                      <div
                        className={clsx(
                          'transition-all duration-200',
                          activeId === heading.id
                            ? 'translate-x-2'
                            : 'translate-x-0'
                        )}
                      >
                        <span
                          className={clsx(
                            'font-medium',
                            activeId === heading.id
                              ? 'text-green-700'
                              : 'text-gray-700'
                          )}
                        >
                          {heading.title}
                        </span>
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </aside>
  ) : null
}
