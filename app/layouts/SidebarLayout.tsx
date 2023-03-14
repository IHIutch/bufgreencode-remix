import ArticlesAccordion from '@/components/ArticlesAccordion'
import NavbarComponent from '@/components/NavbarComponent'
import SubnavComponent from '@/components/SubnavComponent'
import { useTransition } from '@remix-run/react'
import clsx from 'clsx'
import type { ReactNode } from 'react'

export default function SidebarLayout({ children }: { children: ReactNode }) {
  const transition = useTransition()
  const isLoading = transition.state === 'loading'

  return (
    <div className="antialiased">
      <div className="fixed top-0 z-10 w-full">
        <NavbarComponent />
        <SubnavComponent>
          <ArticlesAccordion />
        </SubnavComponent>
      </div>
      <div className="mx-auto flex max-w-screen-2xl">
        <div className="fixed top-0 hidden h-full shrink-0 pt-16 md:block md:w-72 2xl:w-80">
          <nav className="sticky h-full overflow-y-auto border-r">
            <div className="py-8">
              <ArticlesAccordion />
            </div>
          </nav>
        </div>
        <div className="w-full pt-20 md:ml-72 md:pt-16 2xl:ml-80">
          <div
            className={clsx(
              'flex',
              'position-absolute w-full transition-all duration-200',
              isLoading ? 'opacity-0' : 'opacity-100'
            )}
          >
            <main className="w-full">{children}</main>
          </div>
        </div>
      </div>
    </div>
  )
}
