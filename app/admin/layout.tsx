import { AdminSidebar } from "@/components/layout/admin_sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen flex flex-col bg-gray-50">
            <div className="flex-1 flex">
                <AdminSidebar />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}