"use client";
import Link from 'next/link';
import { Pie, PieChart } from 'recharts';


export default function PaymentTypeChart(rows: any) {
    return (
        <div className='flex flex-col items-center'>
            <h1 className='text-sm text-primary'>Daily Sale Chart</h1>
            <table className='w-full mt-4'>
                <thead className='bg-gray-100 text-sm'>
                    <tr>
                        <th className='p-2'>Name</th>
                        <th className='p-2'>Value</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className='text-sm bg-white'>
                    {rows.data.map((d: any) => (
                        <tr key={d.name} className='p-2'>
                            <td>{d.name}</td>
                            <td>{d.value}</td>
                            <td>
                                <Link href={`/admin/ledger/${d.id}`} className='bg-primary text-white px-2 py-1 rounded'>View</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='text-xs'>
                <PieChart width={250} height={250}>
                    <Pie data={rows.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#8884d8" />
                </PieChart>
            </div>
        </div>
    );
}