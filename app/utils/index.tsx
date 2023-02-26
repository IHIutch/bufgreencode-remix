export const getMetaTags = ({
  pageTitle,
  slug,
}: {
  pageTitle?: string
  slug?: string
} = {}) => {
  const siteUrl = 'https://bufgreencode.com'
  // const siteUrl = import.meta.env.SITE
  const siteTitle = 'Buffalo Green Code'

  const url = slug ? `${siteUrl}/${slug}` : siteUrl
  const title = pageTitle ? `${pageTitle} · ${siteTitle}` : siteTitle

  const image = `${siteUrl}/meta/meta-img.jpeg`
  const description = 'Buffalo Green Code Unified Development Ordinance'
  const imageHeight = '600'
  const imageWidth = '1080'
  const imageAlt =
    'The city of buffalo overlayed with a semitransparent green background and the Buffalo Green Code logo in the middle'

  return {
    title,
    description,
    'og:type': 'website',
    'og:title': title,
    'og:url': url,
    'og:description': description,
    'og:image': image,
    'og:image:height': imageHeight,
    'og:image:width': imageWidth,
    'og:image:alt': imageAlt,
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:url': url,
    'twitter:description': description,
    'twitter:image': image,
  }
}

export const getHeadings = (
  node: any,
  sections: { id: string; title: string; level: number }[] = []
) => {
  if (node?.name) {
    // 'Heading' is defined in markdoc/node/heading.ts
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

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return String(error)
}
