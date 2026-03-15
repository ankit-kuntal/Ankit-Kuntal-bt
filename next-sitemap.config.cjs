/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://ankit-kuntal-bt.vercel.app',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  additionalPaths: async () => [
    '/blogs/blog-slug-1',
    '/blogs/blog-slug-2',
    '/projects/project-1',
    '/projects/project-2',
  ],
}