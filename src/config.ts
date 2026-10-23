// Single place for business details, tracking IDs and navigation.
// Business details must match the landing page repo (infrazz/databyte-solution, CLAUDE.md) exactly.

export const SITE = {
  name: 'Databyte Solution',
  legalName: 'Databyte Solution Pte. Ltd.',
  url: 'https://www.databytesolution.com',
  phone: '+65 8839 5009',
  phoneHref: 'tel:+6588395009',
  whatsappHref: 'https://wa.me/6588395009',
  email: 'hello@databytesolution.com',
  address: {
    street: 'IMM Building, 2 Jurong East Street 21, #04-31K',
    locality: 'Singapore',
    postalCode: '609601',
    country: 'SG',
  },
  description:
    'Secure server disposal, data centre decommissioning and onsite data destruction in Singapore and Malaysia. NIST 800-88, ISO 9001 & 14001, NEA licensed.',
  linkedin: 'https://www.linkedin.com/company/databyte-solution',
  serverDisposalLanding: 'https://serverdisposal.databytesolution.com/',
};

export const TRACKING = {
  // GA4 property already used by the Google Site; keep it so history continues.
  ga4: 'G-Q844JS8CQH',
  // Google Ads: fill in once the conversion actions exist (tracker task W-07).
  adsId: '', // e.g. 'AW-123456789'
  conversions: {
    form: '', // e.g. 'AW-123456789/AbCdEfGh'
    call: '',
    whatsapp: '',
    email: '',
  },
  // Analytics only run on the real domain, never on *.pages.dev previews.
  productionHost: 'www.databytesolution.com',
};

export type NavItem = { label: string; href: string; children?: { label: string; href: string }[] };

export const NAV: NavItem[] = [
  {
    label: 'Data Sanitization',
    href: '/data-sanitization',
    children: [
      { label: 'Overview', href: '/data-sanitization' },
      { label: 'Guide to Data Sanitization', href: '/data-sanitization/guide-to-data-sanitization' },
      { label: 'Equipment', href: '/data-sanitization/equipment' },
      { label: 'Standards', href: '/data-sanitization/standards' },
      { label: 'Data Classification', href: '/data-sanitization/data-classification' },
      { label: 'Clear, Purge, Destroy', href: '/data-sanitization/clear-purge-destroy' },
      { label: 'Disposal Bins', href: '/data-sanitization/disposal-bins' },
      { label: 'Best Price Guarantee', href: '/data-sanitization/best-price-guarantee' },
    ],
  },
  { label: 'IT Asset Recycling', href: '/it-asset-recycling' },
  { label: 'For Data Centres', href: '/for-data-centres' },
  {
    label: 'Compliance',
    href: '/compliance',
    children: [
      { label: 'Overview', href: '/compliance' },
      { label: 'ISO 9001 and 14001', href: '/compliance/iso-9001-and-14001' },
      { label: 'Environment', href: '/compliance/environment' },
    ],
  },
  {
    label: 'About Us',
    href: '/about-us',
    children: [
      { label: 'About Us', href: '/about-us' },
      { label: 'Our Clients', href: '/about-us/our-clients' },
    ],
  },
  { label: 'Contact Us', href: '/contact-us' },
];

// Every public page, for the sitemap and the post-build check.
export const PAGES = [
  '/',
  '/data-sanitization',
  '/data-sanitization/guide-to-data-sanitization',
  '/data-sanitization/equipment',
  '/data-sanitization/standards',
  '/data-sanitization/data-classification',
  '/data-sanitization/clear-purge-destroy',
  '/data-sanitization/disposal-bins',
  '/data-sanitization/best-price-guarantee',
  '/it-asset-recycling',
  '/for-data-centres',
  '/compliance',
  '/compliance/iso-9001-and-14001',
  '/compliance/environment',
  '/about-us',
  '/about-us/our-clients',
  '/contact-us',
];
