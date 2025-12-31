import express from 'express';

const router = express.Router();

// Generate sitemap.xml
router.get('/sitemap.xml', (req, res) => {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:4200';

    const urls = [
        { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'weekly' },
        { loc: `${baseUrl}/about`, priority: '0.9', changefreq: 'monthly' },
        { loc: `${baseUrl}/projects`, priority: '0.9', changefreq: 'weekly' },
        { loc: `${baseUrl}/skills`, priority: '0.8', changefreq: 'monthly' },
        { loc: `${baseUrl}/experience`, priority: '0.8', changefreq: 'monthly' },
        { loc: `${baseUrl}/blogs`, priority: '0.8', changefreq: 'weekly' },
        { loc: `${baseUrl}/fun-facts`, priority: '0.7', changefreq: 'monthly' },
        { loc: `${baseUrl}/contact`, priority: '0.9', changefreq: 'monthly' }
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
});

// Generate robots.txt
router.get('/robots.txt', (req, res) => {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:4200';

    const robots = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;

    res.header('Content-Type', 'text/plain');
    res.send(robots);
});

export default router;
