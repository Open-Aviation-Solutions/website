// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://openaviation.solutions',
	integrations: [
		starlight({
			title: 'Open Aviation Solutions',
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
					],
				},
			],
		}),
	],
});
