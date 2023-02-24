export const getMetaTags = ({
  pageTitle = '',
  pathname = '',
  description = 'Buffalo Green Code Unified Development Ordinance',
}) => {
  const siteUrl = 'https://bufgreencode.com'
  const siteTitle = 'Buffalo Green Code'

  const url = pathname ? `${siteUrl}${pathname}` : siteUrl
  const title = pageTitle ? `${pageTitle} · ${siteTitle}` : siteTitle

  const image = `${siteUrl}/meta/meta-img.png`

  return {
    title,
    description,
    'og:type': 'website',
    'og:title': title,
    'og:url': url,
    'og:description': description,
    'og:image': image,
    'og:image:alt':
      'The city of buffalo overlayed with a semitransparent green background and the Buffalo Green Code logo in the middle',
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:url': url,
    'twitter:description': description,
    'twitter:image': image,
  }
}
