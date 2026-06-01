// Single source of truth for business-identity facts surfaced in the footer,
// the contact page, and the Organization JSON-LD block in the site <head>.
export const siteInfo = {
	url: 'https://openaviation.solutions',
	siteName: 'Open Aviation Solutions',
	tagline: 'Improving pilot safety with open learning and training resources.',
	legalName: 'Michael Andrew Nelson',
	owner: 'Michael Nelson',
	registeredBusinessName: 'Open Aviation Solutions',
	abn: '96 917 566 113',
	email: 'openaviation.solutions@gmail.com',
	githubOrg: 'https://github.com/open-aviation-solutions',
	ogImage: '/og-image.png',
} as const;

export const organizationJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'Organization',
	name: siteInfo.registeredBusinessName,
	legalName: siteInfo.legalName,
	url: siteInfo.url,
	logo: `${siteInfo.url}/favicon.svg`,
	email: siteInfo.email,
	sameAs: [siteInfo.githubOrg],
	identifier: {
		'@type': 'PropertyValue',
		propertyID: 'ABN',
		value: siteInfo.abn,
	},
};
