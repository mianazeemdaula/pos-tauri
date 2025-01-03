import { auth } from '@/lib/auth';
export default async function Dashboard() {
    const session = await auth();
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <h1 className="text-4xl font-bold">Dashboard</h1>
                <p className="text-lg text-gray-600">{`Welcome back! You're now logged in.`}</p>
                <div>
                    {JSON.stringify(session, null, 2)}
                </div>
            </main>
        </div>
    );
}