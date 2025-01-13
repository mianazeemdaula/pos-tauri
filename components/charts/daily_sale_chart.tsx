"use client";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';


export default function DailySaleChart(data: any) {
    return (
        <div className='flex flex-col items-center'>
            <h1 className='text-sm text-primary'>Daily Sale Chart</h1>
            <div className='text-xs'>
                <AreaChart width={500} height={250} data={data.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="sale" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="cashSale" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
            </div>
        </div>
    );
}