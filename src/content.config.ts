import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { blogSchema } from 'starlight-blog/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		// Compose the blog schema so /news posts can carry date, authors, tags, etc.
		schema: docsSchema({
			extend: (context) =>
				blogSchema(context).extend({
					// Site-specific thumbnail shown for a post in the homepage "Latest
					// news" strip (src/components/LatestNews.astro). Deliberately separate
					// from starlight-blog's `cover`, which would also render on the post
					// header and the /news listing, where we can't control its link.
					cardImage: z
						.object({
							src: z.string(),
							alt: z.string(),
						})
						.optional(),
				}),
		}),
	}),
};
