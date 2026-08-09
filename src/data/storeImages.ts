/**
 * Image slots for Krishna Jewellers.
 * Collections stay on placeholders until category shoots are ready.
 * All other surfaces use curated photos (local heroes + Unsplash).
 */
export const IMAGE_PLACEHOLDER = '/placeholders/image.svg';
export const HERO_PLACEHOLDER = '/krishna-jewellers-hero.avif';
export const LOGO_PLACEHOLDER = '/placeholders/logo.svg';

const unsplash = (photoPath: string, w = 1400) =>
  `https://images.unsplash.com/${photoPath}?auto=format&fit=crop&w=${w}&q=80`;

/** Shared catalogue / page heroes (not collections). */
export const SECTION_IMAGES = {
  brandStory: '/krishna-jewellers-hero.avif',
  craftsmanship: unsplash('photo-1715374033196-0ff662284a7e'),
  showroom: unsplash('photo-1573408301185-9146fe634ad0'),
  findUs: unsplash('photo-1601121141461-9d6647bca1ed'),
  rates: unsplash('photo-1611591437281-460bfbe1220a'),
  about: '/hero-2.png',
  contact: unsplash('photo-1515562141207-7a88fb7ce338'),
  galleryBanner: '/hero-3.png',
} as const;

const P = IMAGE_PLACEHOLDER;

export const STORE_PHOTOS = {
  showroom: SECTION_IMAGES.showroom,
  findUs: SECTION_IMAGES.findUs,

  /** Featured product photos per collection (Cloudinary). */
  collections: {
    bridal:
      'https://res.cloudinary.com/dbsskv4bf/image/upload/v1786239087/krishna-jewellers-jajpur/products/qjwubuf7cxqxjduissfy.jpg',
    goldNecklaces:
      'https://res.cloudinary.com/dbsskv4bf/image/upload/v1786239696/krishna-jewellers-jajpur/products/bk6zphz5zfcwcxrlywvy.jpg',
    goldChains:
      'https://res.cloudinary.com/dbsskv4bf/image/upload/v1786212094/krishna-jewellers-jajpur/products/utkebwrbx6wacd0ablqy.jpg',
    goldRings: P,
    bangles:
      'https://res.cloudinary.com/dbsskv4bf/image/upload/v1786212277/krishna-jewellers-jajpur/products/vq6omqmcotdxayrn9vy6.jpg',
    bracelets:
      'https://res.cloudinary.com/dbsskv4bf/image/upload/v1786211629/krishna-jewellers-jajpur/products/srglzg2ournubkmyel91.jpg',
    earrings:
      'https://res.cloudinary.com/dbsskv4bf/image/upload/v1786212072/krishna-jewellers-jajpur/products/u1fft4rbomuagnbhbuwl.jpg',
    pendants:
      'https://res.cloudinary.com/dbsskv4bf/image/upload/v1786211907/krishna-jewellers-jajpur/products/hbyuvlmtfdgnjyxzuyfn.jpg',
    temple: P,
    mangalsutra:
      'https://res.cloudinary.com/dbsskv4bf/image/upload/v1786240270/krishna-jewellers-jajpur/products/al6egpvizrm6zwxeaxqk.jpg',
    silver: P,
    kids: P,
    dailyWear: P,
    coins:
      'https://res.cloudinary.com/dbsskv4bf/image/upload/v1786211683/krishna-jewellers-jajpur/products/fyypmyfzuxk7jpuyw2ug.jpg',
    watches:
      'https://res.cloudinary.com/dbsskv4bf/image/upload/v1786211495/krishna-jewellers-jajpur/products/oq8tixdtu0mlgzkdigjk.jpg',
  },

  products: {
    floralRing: unsplash('photo-1605100804763-247f67b3557e'),
    traditionalNecklace: unsplash('photo-1601121141461-9d6647bca1ed'),
    kidsBracelet: unsplash('photo-1611591437281-460bfbe1220a'),
    designerEarrings: unsplash('photo-1535632066927-ab7c9ab60908'),
    elegantBangles: unsplash('flagged/photo-1570055349452-29232699cc63'),
    dailyChain: unsplash('photo-1599643478518-a784e5dc4c8f'),
    chainsDisplay: unsplash('photo-1515562141207-7a88fb7ce338'),
    chainDelicate1: unsplash('photo-1602173574767-37ac01994b2a'),
    chainWheatBraid: unsplash('photo-1611591437281-460bfbe1220a'),
    chainTwistedRope: unsplash('photo-1601121141461-9d6647bca1ed'),
    chainFlatLink: unsplash('photo-1515562141207-7a88fb7ce338'),
    chainRoundedLink: unsplash('photo-1573408301185-9146fe634ad0'),
    chainSlimBraid: unsplash('photo-1602173574767-37ac01994b2a'),
    chainDelicate2: unsplash('photo-1599643478518-a784e5dc4c8f'),
    braceletLeafCharm: unsplash('photo-1611591437281-460bfbe1220a'),
    braceletOrnatePlaque: unsplash('flagged/photo-1570055349452-29232699cc63'),
    braceletCurbClassic: unsplash('photo-1605100804763-247f67b3557e'),
    braceletTwistedThin: unsplash('photo-1535632066927-ab7c9ab60908'),
    braceletSLink: unsplash('photo-1611591437281-460bfbe1220a'),
    braceletChevron: unsplash('photo-1515562141207-7a88fb7ce338'),
    braceletCurbWide: unsplash('photo-1573408301185-9146fe634ad0'),
    templePendant: unsplash('photo-1601121141461-9d6647bca1ed'),
    floralPendant: unsplash('photo-1535632066927-ab7c9ab60908'),
    rosePendant: unsplash('photo-1599643478518-a784e5dc4c8f'),
    weddingChoker: unsplash('flagged/photo-1570055349452-29232699cc63'),
    bridalHaram: unsplash('photo-1601121141461-9d6647bca1ed'),
    bridalBibSet: unsplash('photo-1573408301185-9146fe634ad0'),
    bridalPaisleySet: unsplash('photo-1515562141207-7a88fb7ce338'),
    bridalTempleSet: unsplash('flagged/photo-1570055349452-29232699cc63'),
    bridalBangleSet: unsplash('photo-1611591437281-460bfbe1220a'),
    floralNecklace: unsplash('photo-1602173574767-37ac01994b2a'),
    heartNecklace: unsplash('photo-1535632066927-ab7c9ab60908'),
    necklaceBangleDisplay: unsplash('photo-1573408301185-9146fe634ad0'),
    circularNecklace: unsplash('photo-1601121141461-9d6647bca1ed'),
    jhumkaDisplay: unsplash('photo-1599643478518-a784e5dc4c8f'),
    ornateEarrings: unsplash('photo-1535632066927-ab7c9ab60908'),
    earringsSunburst: unsplash('photo-1599643478518-a784e5dc4c8f'),
    earringsAssortment: unsplash('photo-1515562141207-7a88fb7ce338'),
    silverBracelets: unsplash('photo-1611591437281-460bfbe1220a'),
    silverBraceletsAlt: unsplash('photo-1605100804763-247f67b3557e'),
    silverChains: unsplash('photo-1602173574767-37ac01994b2a'),
    banglesWall: unsplash('flagged/photo-1570055349452-29232699cc63'),
    banglesWhiteLeft: unsplash('photo-1611591437281-460bfbe1220a'),
    banglesWhiteRight: unsplash('photo-1573408301185-9146fe634ad0'),
    banglesGoldRedLeft: unsplash('flagged/photo-1570055349452-29232699cc63'),
    banglesGoldRedRight: unsplash('photo-1601121141461-9d6647bca1ed'),
    banglesBridalLeft: unsplash('photo-1515562141207-7a88fb7ce338'),
    banglesBridalRight: unsplash('photo-1535632066927-ab7c9ab60908'),
    banglesRedGoldPairs: unsplash('flagged/photo-1570055349452-29232699cc63'),
  },

  gallery: [
    {
      id: 'g1',
      src: '/krishna-jewellers-hero.avif',
      alt: 'Bridal gold jewellery at Krishna Jewellers',
      span: 'wide' as const,
    },
    {
      id: 'g2',
      src: '/hero-2.png',
      alt: 'Gold necklace detail',
      span: 'normal' as const,
    },
    {
      id: 'g3',
      src: '/hero-3.png',
      alt: 'Traditional earrings and bridal gold',
      span: 'tall' as const,
    },
    {
      id: 'g4',
      src: unsplash('photo-1573408301185-9146fe634ad0'),
      alt: 'Hallmarked gold jewellery display',
      span: 'normal' as const,
    },
    {
      id: 'g5',
      src: unsplash('photo-1601121141461-9d6647bca1ed'),
      alt: 'Temple-town gold necklace',
      span: 'wide' as const,
    },
    {
      id: 'g6',
      src: unsplash('photo-1535632066927-ab7c9ab60908'),
      alt: 'Gold earrings close-up',
      span: 'normal' as const,
    },
    {
      id: 'g7',
      src: unsplash('flagged/photo-1570055349452-29232699cc63'),
      alt: 'Bridal gold and bangles',
      span: 'tall' as const,
    },
    {
      id: 'g8',
      src: unsplash('photo-1515562141207-7a88fb7ce338'),
      alt: 'Fine jewellery composition',
      span: 'normal' as const,
    },
  ],
} as const;
