// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import starlightBlog from 'starlight-blog';
import sitemap from '@astrojs/sitemap';
import remarkSmartypants from 'remark-smartypants';
import { siteInfo, organizationJsonLd } from './src/site-info';

const ogImageUrl = `${siteInfo.url}${siteInfo.ogImage}`;

// https://astro.build/config
export default defineConfig({
	site: siteInfo.url,
	// Bind the dev/preview server to all interfaces when running in the dev
	// container (the Makefile sets ASTRO_HOST=1) so the port is reachable from
	// the host. A normal `npm run dev` on the host keeps the default localhost bind.
	server: process.env.ASTRO_HOST ? { host: true } : {},
	markdown: {
		remarkPlugins: [remarkSmartypants],
	},
	integrations: [
		starlight({
			// Fail the build on broken internal links and missing heading anchors.
			// External links are checked separately by `make check-links` (lychee),
			// since they break for reasons outside this repo and need the network.
			plugins: [
				starlightLinksValidator(),
				starlightBlog({
					// Mount the section at /news, with a "News" link at the end of
					// the header (next to the theme/RSS controls). The News group is
					// also added to the main sidebar below.
					prefix: 'news',
					title: 'News',
					navigation: 'header-end',
				}),
			],
			customCss: ['./src/styles/custom.css'],
			title: siteInfo.siteName,
			components: {
				SiteTitle: './src/components/SiteTitle.astro',
				Hero: './src/components/Hero.astro',
				Footer: './src/components/Footer.astro',
					PageTitle: './src/components/PageTitle.astro',
			},
			description: siteInfo.tagline,
			head: [
				{ tag: 'meta', attrs: { property: 'og:image', content: ogImageUrl } },
				{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
				{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
				{ tag: 'meta', attrs: { name: 'twitter:image', content: ogImageUrl } },
				{
					tag: 'script',
					attrs: { type: 'application/ld+json' },
					content: JSON.stringify(organizationJsonLd),
				},
				{
					tag: 'script',
					attrs: {
						defer: true,
						src: 'https://static.cloudflareinsights.com/beacon.min.js',
						'data-cf-beacon': '{"token": "f025be2f23ce4877aa14be3949bb419b"}',
					},
				},
			],
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/open-aviation-solutions',
				},
			],
			sidebar: [
				{ label: 'Open Aviation Components', slug: 'open-aviation-components' },
				{ label: 'Open Aviation Briefings', slug: 'open-aviation-briefings' },
				{ label: 'Open Aviation Software', slug: 'open-aviation-software' },
				{ label: 'VR Simulator Setups', slug: 'vr-simulator-setups' },
				{
					label: 'News',
					collapsed: true,
					items: [
						// Group labels can't be links in Starlight, so a first "All news"
						// item links to the post index; the rest are the posts themselves.
						{ label: 'All news', link: '/news/' },
						{ autogenerate: { directory: 'news' } },
					],
				},
				{
					label: 'About',
					collapsed: true,
					items: [
						{ label: 'About Open Aviation Solutions', slug: 'about' },
						{ label: 'Licensing', slug: 'licensing' },
					],
				},
			],
		}),
		sitemap(),
	],
});
