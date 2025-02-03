import DailySaleChart from '@/components/charts/daily_sale_chart';
import PaymentTypeChart from '@/components/charts/paymenttypes_chart';
import { auth } from '@/lib/auth';
import { db } from '@/prisma/db';
export default async function Dashboard() {
    const session = await auth();
    const salesData = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const sales = await db.sale.aggregate({
            _sum: {
                total: true,
            },
            where: {
                createdAt: {
                    gte: new Date(date.setHours(0, 0, 0, 0)),
                    lt: new Date(date.setHours(23, 59, 59, 999)),
                },
            },
        });
        const cashSales = await db.sale.aggregate({
            _sum: {
                total: true,
            },
            where: {
                paymentTypeId: 1,
                createdAt: {
                    gte: new Date(date.setHours(0, 0, 0, 0)),
                    lt: new Date(date.setHours(23, 59, 59, 999)),
                },
            },
        });
        salesData.push({
            date: date.toISOString().split('T')[0],
            sale: sales._sum.total || 0,
            cashSale: cashSales._sum.total || 0,
        });
    }

    const balances = await db.paymentType.findMany({
        include: {
            Transaction: {
                orderBy: {
                    createdAt: 'desc',
                },
                take: 1,
            },
        },
    });
    const pidata = balances.map((balance) => ({
        name: balance.name,
        value: balance.Transaction[0]?.balance ?? 0,
    }));


    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome {session?.user?.name}</p>
            <div className=''>
                <DailySaleChart data={salesData} />
            </div>
            <div>
                <h2>Balance</h2>
                <PaymentTypeChart data={pidata} />
            </div>
        </div>
    );
}