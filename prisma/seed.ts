import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const categories: Prisma.CategoryCreateInput[] = [
    { name: 'PVC', slug: 'pvc' },
    { name: 'Pipes', slug: 'pipes' },
    { name: 'Fittings', slug: 'fittings' },
    { name: 'Valves', slug: 'valves' },
    { name: 'Pumps', slug: 'pumps' },
    { name: 'Tools', slug: 'tools' },
    { name: 'Electrical', slug: 'electrical' },
    { name: 'Hoses', slug: 'hoses' },
    { name: 'Accessories', slug: 'accessories' },
    { name: 'Other', slug: 'other' },
];

const brands: Prisma.BrandCreateInput[] = [
    { name: 'Al itehad', slug: 'al-itehad' },
    { name: 'Adam Gee', slug: 'adam-gee' },
    { name: 'Dura PVC', slug: 'dura-pvc' },
    { name: 'Asli Punjab', slug: 'asli-punjab' },
];

const parties: Prisma.PartyCreateInput[] = [
    { name: 'Al itehad PVC', phone: '1234567890', city: 'Depalpur', address: '123 Main St' },
    { name: 'Punjab Pipes', phone: '1234567890', city: 'Lahore', address: '123 Main St' },
    { name: 'Sindh Fittings', phone: '1234567890', city: 'Karachi', address: '123 Main St' },
    { name: 'Balochistan Valves', phone: '1234567890', city: 'Islamabad', address: '123 Main St' },
    { name: 'KPK Pumps', phone: '1234567890', city: 'Peshawar', address: '123 Main St' },
    { name: 'Ali Chohan', phone: '1234567890', city: 'Depalpur', address: '123 Main St' },
    { name: 'Noman Ahmad', phone: '1234567890', city: 'Lahore', address: '123 Main St' },
];

const paymentTypes: Prisma.PaymentTypeCreateInput[] = [
    { name: 'Cash', },
    { name: 'Credit', },
    { name: 'Cheque', },
    { name: 'Bank Transfer' },
    { name: 'Online', },
    { name: 'Other' },
];

const prodcuts: Prisma.ProductCreateInput[] = [
    { name: 'PVC Pipe', price: 250, discount: 5, code: 'A0001', stock: 100, category: { connect: { slug: 'pipes' } }, brand: { connect: { slug: 'al-itehad' } } },
    { name: 'PVC Fitting', price: 150, discount: 4, code: 'A0002', stock: 100, category: { connect: { slug: 'fittings' } }, brand: { connect: { slug: 'adam-gee' } } },
    { name: 'PVC Valve', price: 200, discount: 6, code: 'A0003', stock: 100, category: { connect: { slug: 'valves' } }, brand: { connect: { slug: 'dura-pvc' } } },
    { name: 'PVC Pump', price: 300, discount: 5.5, code: 'A0004', stock: 100, category: { connect: { slug: 'pumps' } }, brand: { connect: { slug: 'asli-punjab' } } },
    { name: 'PVC Tool', price: 100, discount: 8.5, code: 'A0005', stock: 100, category: { connect: { slug: 'tools' } }, brand: { connect: { slug: 'al-itehad' } } },
    { name: 'PVC Electrical', price: 150, discount: 12, code: 'A0006', stock: 100, category: { connect: { slug: 'electrical' } }, brand: { connect: { slug: 'adam-gee' } } },
    { name: 'PVC Hose', price: 50, discount: 15, code: 'A0007', stock: 100, category: { connect: { slug: 'hoses' } }, brand: { connect: { slug: 'dura-pvc' } } },
    { name: 'PVC Accessory', price: 50, discount: 22.50, code: 'A0008', stock: 100, category: { connect: { slug: 'accessories' } }, brand: { connect: { slug: 'asli-punjab' } } },
    { name: 'PVC Other', price: 50, discount: 5.7, code: 'A0009', stock: 100, category: { connect: { slug: 'other' } }, brand: { connect: { slug: 'al-itehad' } } },
];


async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'Alice',
            username: 'alice',
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