import mainStyle from '@/styles/main.css'
import type { LoaderArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { getMetaTags } from './utils'
import { getArticles } from './models/articles.server'
import SidebarLayout from './layouts/SidebarLayout'

export const links = () => {
  return [
    // Preload
    { rel: 'preload', href: mainStyle, as: 'style' },
    // Styles
    { rel: 'stylesheet', href: mainStyle },
    // Preconnect scripts
    {
      rel: 'preconnect',
      href: 'https://BH4D9OD16A-dsn.algolia.net',
      crossOrigin: 'true',
    },
  ]
}

export const meta: MetaFunction = () => {
  const metaTags = getMetaTags()
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    ...metaTags,
    'google-site-verification': '2uJ6hXsUDukLmTfNK7Y7jCmnaqyiLptsVDmZ2Ct7Zzk',
  }
}

export async function loader(args: LoaderArgs) {
  const articles = await getArticles()
  if (!articles) {
    throw new Response('Not Found', {
      status: 404,
    })
  }

  // This is necessary for exposing client side env vars with Remix. Read: https://remix.run/docs/en/v1/guides/envvars
  const ENV = {
    PUBLIC_ALGOLIA_API_KEY: process.env.PUBLIC_ALGOLIA_API_KEY,
    PUBLIC_ALGOLIA_APP_ID: process.env.PUBLIC_ALGOLIA_APP_ID,
    PUBLIC_ALGOLIA_INDEX_NAME: process.env.PUBLIC_ALGOLIA_INDEX_NAME,
  }

  return json({ articles, ENV })
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <SidebarLayout>
          <Outlet />
        </SidebarLayout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
