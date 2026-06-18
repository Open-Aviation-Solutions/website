// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
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
			customCss: ['./src/styles/custom.css'],
			title: siteInfo.siteName,
			components: {
				SiteTitle: './src/components/SiteTitle.astro',
				Hero: './src/components/Hero.astro',
				Footer: './src/components/Footer.astro',
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
					label: 'About',
					items: [
						{ label: 'About Open Aviation Solutions', slug: 'about' },
						{ label: 'Licensing', slug: 'licensing' },
					],
				},
			],
		}),
	],
});
