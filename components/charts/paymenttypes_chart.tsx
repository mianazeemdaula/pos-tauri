"use client";
import { Eye } from 'lucide-react';
import Link from 'next/link';
import { Pie, PieChart } from 'recharts';


export default function PaymentTypeChart(rows: any) {
    return (
        <div className='flex flex-col items-center'>
            <h1 className='text-sm text-primary'>Accounts</h1>
            <table className='w-full mt-4'>
                <thead className='bg-gray-100 text-sm'>
                    <tr>
                        <th className='p-2 text-left'>Name</th>
                        <th className='p-2 text-left'>Balance</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className='text-sm bg-white divide-y'>
                    {rows.data.map((d: any) => (
                        <tr key={d.name} className='p-2'>
                            <td className='p-2 text-left'>{d.name}</td>
                            <td className='text-left' >{d.value}</td>
                            <td className='text-center'>
                                <Link href={`/admin/ledger/${d.id}`} className='text-center'>
                                    <Eye size={16} />
                                </Link>
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