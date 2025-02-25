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
    { name: 'PVC Pipe', price: 250, discount: 5, code: 'A0001', stock: 100, category: { connect: { slug: 'pipes' } }, brand: { connect: { slug: 'al-itehad' } }, size: { connect: { id: 1 } } },
    { name: 'PVC Fitting', price: 150, discount: 4, code: 'A0002', stock: 100, category: { connect: { slug: 'fittings' } }, brand: { connect: { slug: 'adam-gee' } }, size: { connect: { id: 2 } } },
    { name: 'PVC Valve', price: 200, discount: 6, code: 'A0003', stock: 100, category: { connect: { slug: 'valves' } }, brand: { connect: { slug: 'dura-pvc' } }, size: { connect: { id: 3 } } },
    { name: 'PVC Pump', price: 300, discount: 5.5, code: 'A0004', stock: 100, category: { connect: { slug: 'pumps' } }, brand: { connect: { slug: 'asli-punjab' } }, size: { connect: { id: 4 } } },
    { name: 'PVC Tool', price: 100, discount: 8.5, code: 'A0005', stock: 100, category: { connect: { slug: 'tools' } }, brand: { connect: { slug: 'al-itehad' } }, size: { connect: { id: 5 } } },
    { name: 'PVC Electrical', price: 150, discount: 12, code: 'A0006', stock: 100, category: { connect: { slug: 'electrical' } }, brand: { connect: { slug: 'adam-gee' } }, size: { connect: { id: 6 } } },
    { name: 'PVC Hose', price: 50, discount: 15, code: 'A0007', stock: 100, category: { connect: { slug: 'hoses' } }, brand: { connect: { slug: 'dura-pvc' } }, size: { connect: { id: 7 } } },
    { name: 'PVC Accessory', price: 50, discount: 22.50, code: 'A0008', stock: 100, category: { connect: { slug: 'accessories' } }, brand: { connect: { slug: 'asli-punjab' } }, size: { connect: { id: 8 } } },
    { name: 'PVC Other', price: 50, discount: 5.7, code: 'A0009', stock: 100, category: { connect: { slug: 'other' } }, brand: { connect: { slug: 'al-itehad' } }, size: { connect: { id: 9 } } },
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