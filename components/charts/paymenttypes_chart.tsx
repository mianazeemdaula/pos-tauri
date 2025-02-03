"use client";
import { Pie, PieChart } from 'recharts';


export default function PaymentTypeChart(data: any) {
    return (
        <div className='flex flex-col items-center'>
            <h1 className='text-sm text-primary'>Daily Sale Chart</h1>
            <div className='text-xs'>
                <PieChart width={250} height={250}>
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#8884d8" />
                </PieChart>
            </div>
        </div>
    );
}