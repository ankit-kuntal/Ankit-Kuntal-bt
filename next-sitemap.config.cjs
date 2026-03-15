/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://ankit-kuntal-bt.vercel.app', // tumhara live URL
  generateRobotsTxt: true,                       // robots.txt bhi banega
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000, // optional, agar bahut saare pages hain
}