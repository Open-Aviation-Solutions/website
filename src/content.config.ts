import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { blogSchema } from 'starlight-blog/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		// Compose the blog schema so /news posts can carry date, authors, tags, etc.
		schema: docsSchema({ extend: (context) => blogSchema(context) }),
	}),
};
