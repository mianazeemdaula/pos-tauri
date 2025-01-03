import { db } from "@/prisma/db";


export default async function SaledViewPage(
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const sale = await db.order.findFirst({
        where: {
            id: (id),
        },
        include: {
            customer: true,
            user: true,
            OrderDetail: {
                include: {
                    product: true,
                },
            },
        },
    });
    if (!sale) {
        return <div>Not Found</div>
    }
    return (
        <div>
            <h1>Sale View</h1>
            <div>{id}</div>
            <div className="flex gap-4">
                <div className="bg-white shadow-md rounded p-4 mb-4">
                    <h2 className="text-xl font-bold mb-2">Customer Details</h2>
                    <p className="text-gray-700"><span className="font-semibold">Name:</span> {sale.customer.name}</p>
                    <p className="text-gray-700"><span className="font-semibold">City:</span> {sale.customer.city}</p>
                    <p className="text-gray-700"><span className="font-semibold">Phone:</span> {sale.customer.phone}</p>
                </div>
                <div className="bg-white shadow-md rounded p-4 mb-4">
                    <h2 className="text-xl font-bold mb-2">Salesman Details</h2>
                    <p className="text-gray-700"><span className="font-semibold">Name:</span> {sale.user.name}</p>
                    <p className="text-gray-700"><span className="font-semibold">Email:</span> {sale.user.username}</p>
                </div>
            </div>
            <div>
                <h2>Order Details</h2>
                <table className="table-fixed w-full mt-4 border-collapse">
                    <thead className="bg-gray-100 text-sm">
                        <tr>
                            <th className="p-2">Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Discount</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm bg-white">
                        {sale.OrderDetail.map((od) => (
                            <tr key={od.id}>
                                <td className="p-2">{od.product.name}</td>
                                <td>{od.quantity}</td>
                                <td>{od.price}</td>
                                <td>{od.discount}</td>
                                <td>{od.price * od.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}