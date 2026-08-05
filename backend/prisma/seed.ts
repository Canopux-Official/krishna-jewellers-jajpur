import { PrismaClient, OfferStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const STORE_ADDRESS =
  'Krishna Jewellers\nX42J+2Q2, Bank St, Dolipur\nByasanagar, Odisha – 755019\nIn front of Misrilal Petrol Pump';

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Admin User ──────────────────────────────────────────────
  const email = process.env.ADMIN_EMAIL || 'admin@krishnajewellersjajpur.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@1234';
  const name = process.env.ADMIN_NAME || 'Store Admin';

  const passwordHash = await bcrypt.hash(password, 10);
  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (!existing) {
    await prisma.adminUser.create({ data: { email, passwordHash, name } });
    console.log(`✅ Admin user created: ${email}`);
  } else {
    await prisma.adminUser.update({
      where: { email },
      data: { passwordHash, name },
    });
    console.log(`✅ Admin user updated: ${email}`);
  }

  // Remove legacy login emails if present
  for (const legacyEmail of ['admin@newdarshanjewellery.in']) {
    const legacy = await prisma.adminUser.findUnique({ where: { email: legacyEmail } });
    if (legacy) {
      await prisma.adminUser.delete({ where: { email: legacyEmail } });
      console.log(`✅ Removed legacy ${legacyEmail}`);
    }
  }

  // ─── Categories ──────────────────────────────────────────────
  const activeCategories = [
    { name: 'Bridal Collection', slug: 'bridal-collection' },
    { name: 'Gold Necklaces', slug: 'gold-necklaces' },
    { name: 'Gold Chains', slug: 'gold-chains' },
    { name: 'Bangles', slug: 'bangles' },
    { name: 'Gold Bracelets', slug: 'gold-bracelets' },
    { name: 'Gold Earrings', slug: 'earrings' },
    { name: 'Gold Pendants', slug: 'gold-pendants' },
    { name: 'Silver Bracelets', slug: 'silver-bracelets' },
  ];

  const inactiveSlugs = [
    'gold-rings',
    'pendants',
    'bracelets',
    'temple-jewellery',
    'mangalsutra',
    'silver-collection',
    'kids-collection',
    'daily-wear-collection',
    'coins',
  ];

  for (const cat of activeCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, isActive: true },
      create: { name: cat.name, slug: cat.slug, isActive: true },
    });
  }

  for (const slug of inactiveSlugs) {
    await prisma.category.updateMany({
      where: { slug },
      data: { isActive: false },
    });
  }
  console.log(`✅ ${activeCategories.length} active categories seeded (${inactiveSlugs.length} deactivated)`);

  // ─── Gold Rates ──────────────────────────────────────────────
  const rateCount = await prisma.goldRate.count();
  if (rateCount === 0) {
    await prisma.goldRate.create({ data: { gold24k: 7420, gold22k: 6803, gold18k: 5565, silver: 94 } });
    console.log('✅ Initial gold rates seeded');
  }

  // ─── Store Settings (always update branding) ─────────────────
  const existingSettings = await prisma.storeSettings.findFirst();
  const settingsData = {
    storeName: 'Krishna Jewellers',
    adminName: name,
    email,
    phone: '',
    whatsapp: '',
    address: STORE_ADDRESS,
    weekdayHours: '10:00 AM – 8:30 PM',
    sundayHours: '10:00 AM – 8:30 PM',
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=20.9500125%2C86.131891%20(Krishna%20Jewellers%2C%20X42J%2B2Q2%2C%20Bank%20St%2C%20Dolipur%2C%20Byasanagar)',
  };

  if (existingSettings) {
    await prisma.storeSettings.update({
      where: { id: existingSettings.id },
      data: settingsData,
    });
    console.log('✅ Store settings updated');
  } else {
    await prisma.storeSettings.create({ data: settingsData });
    console.log('✅ Store settings seeded');
  }

  // ─── Hero Banners — left empty (use placeholders / admin uploads) ──
  console.log('⏭ Skipping hero banner seed (placeholders only)');

  // ─── Gallery — do not seed images ────────────────────────────
  // Admin-uploaded Cloudinary media only.

  // ─── Testimonials ────────────────────────────────────────────
  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: [
      { name: 'Priyanka Mishra', city: 'Byasanagar', quote: 'We bought our bridal set from Krishna Jewellers — the staff guided us with patience, and every piece felt pure and complete for our wedding.', rating: 5, isApproved: true },
      { name: 'Satyabrata Nayak', city: 'Jajpur', quote: 'Transparent rates and honest making charges. For our family, this is the trusted jewellery house in Jajpur Road.', rating: 5, isApproved: true },
      { name: 'Ananya Das', city: 'Jajpur', quote: 'From festival bangles to our daughter’s mangalsutra, Krishna Jewellers has been part of every celebration.', rating: 5, isApproved: true },
    ],
  });
  console.log('✅ Testimonials seeded');

  // ─── Offers ──────────────────────────────────────────────────
  const offerCount = await prisma.offer.count();
  if (offerCount === 0) {
    await prisma.offer.createMany({
      data: [
        { title: 'Akshaya Tritiya Special', description: 'Get 0% making charges on all gold coins above 5g.', status: OfferStatus.ACTIVE, startDate: new Date('2026-07-01'), endDate: new Date('2026-07-31') },
        { title: 'Bridal Season Offer', description: '5% discount on complete bridal sets above ₹3L.', status: OfferStatus.ACTIVE, startDate: new Date('2026-06-15'), endDate: new Date('2026-09-15') },
      ],
    });
    console.log('✅ Offers seeded');
  }

  // ─── Sample Products — removed for redesign ──────────────────
  // Catalogue starts empty; add products via admin.

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
