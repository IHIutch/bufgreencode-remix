module.exports = {
  serverBuildTarget: 'vercel',
  // When running locally in development mode, we use the built in remix
  // server. This does not understand the vercel lambda module format,
  // so we default back to the standard build output.
  server: process.env.NODE_ENV === 'development' ? undefined : './server.js',
  ignoredRouteFiles: ['.*'],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "api/index.js",
  // publicPath: "/build/",
  serverDependenciesToBundle: [
    'remark-*',
    // Needed for remark-toc and Remix
    'mdast-*',
    'unist-*',

    // Needed for remark-gfm and Remix
    'micromark-*',
    'micromark-*',
    'ccount',
    'decode-named-character-reference',
    'character-entities',
    'markdown-table',

    // Needed for rehype-slug and Remix
    'rehype-slug',
    'hast-*',
  ],
}
