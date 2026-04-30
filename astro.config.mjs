// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://openaviation.solutions',
	integrations: [
		starlight({
			customCss: ['./src/styles/custom.css'],
			title: 'Open Aviation Solutions',
			components: {
				SiteTitle: './src/components/SiteTitle.astro',
				Hero: './src/components/Hero.astro',
				Footer: './src/components/Footer.astro',
			},
			description:
				'Improving pilot safety with open learning and training resources.',
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/open-aviation-solutions',
				},
			],
			sidebar: [
				{
					label: 'Learning components',
					items: [
						{ label: 'Overview', slug: 'learning-components' },
						{ label: 'Four Forces', slug: 'learning-components/four-forces' },
						{ label: 'Climb Performance', slug: 'learning-components/climb-performance' },
					],
				},
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
