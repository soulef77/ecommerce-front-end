import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Admin
  const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPasswordAdmin,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin created:', admin.email);

  // Catégories
  const tshirts = await prisma.category.upsert({
    where: { slug: 't-shirts' },
    update: {},
    create: { name: 'T-Shirts', slug: 't-shirts' },
  });

  const hoodies = await prisma.category.upsert({
    where: { slug: 'hoodies' },
    update: {},
    create: { name: 'Hoodies', slug: 'hoodies' },
  });

  console.log('✅ Categories created');

  // Produits
  const tshirtPremium = await prisma.product.upsert({
    where: { slug: 't-shirt-premium' },
    update: {},
    create: {
      name: 'T-Shirt Premium',
      slug: 't-shirt-premium',
      description: 'T-shirt en coton bio de haute qualité',
      price: 2999,
    },
  });

  await prisma.product.update({
    where: { id: tshirtPremium.id },
    data: {
      categories: { connect: [{ id: tshirts.id }] },
    },
  });

  const hoodieConfort = await prisma.product.upsert({
    where: { slug: 'hoodie-confort' },
    update: {},
    create: {
      name: 'Hoodie Confort',
      slug: 'hoodie-confort',
      description: 'Hoodie ultra-confortable pour l\'hiver',
      price: 4999,
    },
  });

  await prisma.product.update({
    where: { id: hoodieConfort.id },
    data: {
      categories: { connect: [{ id: hoodies.id }] },
    },
  });

  const poloClassique = await prisma.product.upsert({
    where: { slug: 'polo-classique' },
    update: {},
    create: {
      name: 'Polo Classique',
      slug: 'polo-classique',
      description: 'Polo élégant pour toutes occasions',
      price: 3499,
    },
  });

  await prisma.product.update({
    where: { id: poloClassique.id },
    data: {
      categories: { connect: [{ id: tshirts.id }] },
    },
  });

  // Variantes pour le T-Shirt Premium
  await prisma.productVariant.upsert({
    where: { sku: 'TSHIRT-PREM-BLACK-M' },
    update: {},
    create: {
      productId: tshirtPremium.id,
      color: 'Noir',
      size: 'M',
      sku: 'TSHIRT-PREM-BLACK-M',
      stock: 50,
    },
  });

  await prisma.productVariant.upsert({
    where: { sku: 'TSHIRT-PREM-BLACK-L' },
    update: {},
    create: {
      productId: tshirtPremium.id,
      color: 'Noir',
      size: 'L',
      sku: 'TSHIRT-PREM-BLACK-L',
      stock: 30,
    },
  });

  await prisma.productVariant.upsert({
    where: { sku: 'TSHIRT-PREM-WHITE-M' },
    update: {},
    create: {
      productId: tshirtPremium.id,
      color: 'Blanc',
      size: 'M',
      sku: 'TSHIRT-PREM-WHITE-M',
      stock: 45,
    },
  });

  // Variantes pour le Hoodie Confort
  await prisma.productVariant.upsert({
    where: { sku: 'HOODIE-CONF-GREY-L' },
    update: {},
    create: {
      productId: hoodieConfort.id,
      color: 'Gris',
      size: 'L',
      sku: 'HOODIE-CONF-GREY-L',
      stock: 25,
    },
  });

  await prisma.productVariant.upsert({
    where: { sku: 'HOODIE-CONF-GREY-XL' },
    update: {},
    create: {
      productId: hoodieConfort.id,
      color: 'Gris',
      size: 'XL',
      sku: 'HOODIE-CONF-GREY-XL',
      stock: 20,
    },
  });

  console.log('✅ Product variants created');
  console.log('✅ Products created');
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
