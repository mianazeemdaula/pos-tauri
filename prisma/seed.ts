import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const categories: Prisma.CategoryCreateInput[] = [
    { name: 'PVC', slug: 'pvc' },
    { name: 'Fittings', slug: 'fittings' },
];

const brands: Prisma.BrandCreateInput[] = [
    { name: 'Popular', slug: 'popular' },
    { name: 'Adam Gee', slug: 'adam-gee' },
    { name: 'Dura PVC', slug: 'dura-pvc' },
];

const parties: Prisma.PartyCreateInput[] = [
    { name: 'Dura PVC', phone: '1234567890', city: 'Faisalabad', address: '123 Main St' },
];

const paymentTypes: Prisma.PaymentTypeCreateInput[] = [
    { name: 'Cash', },
    { name: 'Meezan Bank' },
    { name: 'Jazz Cash' },
];

const prodcuts: Prisma.ProductCreateInput[] = [
];

const sizes: Prisma.SizeCreateInput[] = [
    { name: "1/2''" },
    { name: "3/4''" },
    { name: "1''" },
    { name: "1-1/4''" },
    { name: "1-1/2''" },
    { name: "2''" },
    { name: "2-1/2''" },
    { name: "3''" },
    { name: "4''" },
    { name: "5''" },
    { name: "6''" },
];


async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'Nadeem Daula',
            username: 'nadeem',
            password: 'password',
        }
    })
    for (const category of categories) {
        await prisma.category.create({
            data: category,
        })
    }
    for (const brand of brands) {
        await prisma.brand.create({
            data: brand,
        })
    }

    for (const size of sizes) {
        await prisma.size.create({
            data: size,
        })
    }

    for (const party of parties) {
        await prisma.party.create({
            data: party,
        })
    }
    for (const paymentType of paymentTypes) {
        await prisma.paymentType.create({
            data: paymentType,
        })
    }

    for (const product of prodcuts) {
        await prisma.product.create({
            data: product,
        })
    }
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })