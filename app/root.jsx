import mainStyle from '~/styles/main.css'
import hamburgerStyle from '~/styles/hamburgers.css'
import { getMetaTags } from '~/utils'
import SidebarLayout from '~/layouts/SidebarLayout'
import { getArticles } from '~/models/articles.server'
import { json } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import reportWebVitals from './reportWebVitals.client'
import { sendToVercelAnalytics } from './vitals.client'
import { useHydrated } from 'remix-utils'
import { MetronomeLinks } from '@metronome-sh/react'
import { Analytics } from '@vercel/analytics/react'

export function links() {
  return [
    // Preload
    { rel: 'preload', href: mainStyle, as: 'style' },
    { rel: 'preload', href: hamburgerStyle, as: 'style' },
    // Styles
    { rel: 'stylesheet', href: mainStyle },
    { rel: 'stylesheet', href: hamburgerStyle },
    // Preconnect scripts
    {
      rel: 'preconnect',
      href: 'https://BH4D9OD16A-dsn.algolia.net',
      crossOrigin: 'true',
    },
  ]
}

export function meta() {
  const metaTags = getMetaTags({})
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    ...metaTags,
    'google-site-verification': '2uJ6hXsUDukLmTfNK7Y7jCmnaqyiLptsVDmZ2Ct7Zzk',
  }
}

export const loader = async () => {
  const articles = await getArticles()
  if (!articles) {
    throw new Response('Not Found', {
      status: 404,
    })
  }

  const mappedArticles = articles
    .map((a) => ({
      ...a,
      articleTitle: a.article,
      sectionTitle: a.title,
      articleNumber: a.article_number,
      sectionNumber: a.section_number,
      slug: a.slug,
      articleSlug: a.articleSlug,
    }))
    .sort((a, b) => {
      return a.articleNumber - b.articleNumber
    })
    .sort((a, b) => {
      return a.sectionNumber - b.sectionNumber
    })

  // This is necessary for exposing client side env vars with Remix. Read: https://remix.run/docs/en/v1/guides/envvars
  const ENV = {
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    ALGOLIA_INDEX_NAME: process.env.ALGOLIA_INDEX_NAME,
    ALGOLIA_API_KEY: process.env.ALGOLIA_API_KEY,
    VERCEL_ANALYTICS_ID: process.env.VERCEL_ANALYTICS_ID,
  }

  return json({ articles: mappedArticles, ENV })
}

export default function App() {
  const { ENV } = useLoaderData()

  if (useHydrated())
    reportWebVitals(sendToVercelAnalytics, {
      analyticsId: ENV.VERCEL_ANALYTICS_ID,
    })

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <MetronomeLinks />
        <Analytics />
      </head>
      <body>
        <SidebarLayout>
          <Outlet />
        </SidebarLayout>
        <ScrollRestoration />

        {process.env.NODE_ENV === 'production' ? (
          <>
            {/* <script src="/_vercel/insights/script.js" defer></script> */}
            <script
              src="https://delightful-cat.bufgreencode.com/script.js"
              data-site="HWWXLVYL"
              defer
            />
          </>
        ) : null}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
