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

const customers: Prisma.CustomerCreateInput[] = [
    { name: 'Cash', phone: '1234567890', city: 'Depalpur', address: '123 Main St' },
    { name: 'Ali', phone: '1234567890', city: 'Lahore', address: '123 Main St' },
    { name: 'Ahmed', phone: '1234567890', city: 'Karachi', address: '123 Main St' },
    { name: 'Asad', phone: '1234567890', city: 'Islamabad', address: '123 Main St' },
    { name: 'Ahsan', phone: '1234567890', city: 'Peshawar', address: '123 Main St' },
    { name: 'Aamir', phone: '1234567890', city: 'Quetta', address: '123 Main St' },
    { name: 'Adeel', phone: '1234567890', city: 'Multan', address: '123 Main St' },
    { name: 'Afaq', phone: '1234567890', city: 'Faisalabad', address: '123 Main St' },
    { name: 'Aftab', phone: '1234567890', city: 'Sialkot', address: '123 Main St' },
    { name: 'Arif', phone: '1234567890', city: 'Gujranwala', address: '123 Main St' },
];

const sellers: Prisma.SellerCreateInput[] = [
    { name: 'Al itehad PVC', phone: '1234567890', city: 'Depalpur', address: '123 Main St' },
    { name: 'Punjab Pipes', phone: '1234567890', city: 'Lahore', address: '123 Main St' },
    { name: 'Sindh Fittings', phone: '1234567890', city: 'Karachi', address: '123 Main St' },
    { name: 'Balochistan Valves', phone: '1234567890', city: 'Islamabad', address: '123 Main St' },
    { name: 'KPK Pumps', phone: '1234567890', city: 'Peshawar', address: '123 Main St' },
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
    for (const customer of customers) {
        await prisma.customer.create({
            data: customer,
        })
    }
    for (const seller of sellers) {
        await prisma.seller.create({
            data: seller,
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