"use client";

import { LayoutDashboard, Package, LogOutIcon, Split, Handshake, Users, ScanBarcode, Settings, ShoppingCart, Receipt, HandCoins, Landmark, User2, UserCheck, CodeSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions/actions";

export function AdminSidebar() {
    const pathname = usePathname();
    const sidebarLinks = [
        { href: '/admin', label: "Dashboard", icon: LayoutDashboard },
        { href: '/admin/brands', label: "Brands", icon: CodeSquare },
        { href: '/admin/category', label: "Categories", icon: Split },
        { href: '/admin/parties', label: "Parties", icon: Users },
        { href: '/admin/products', label: "Products", icon: Package },
        { href: '/admin/sales', label: "Sales", icon: ShoppingCart },
        { href: '/admin/purchase', label: "Purchases", icon: ScanBarcode },
        { href: '/admin/payments', label: "Payments", icon: HandCoins },
        { href: '/admin/receivings', label: "Receivings", icon: Landmark },
        {
            href: '#', label: "Agents", icon: UserCheck, submenu: [
                { href: '/admin/agents', label: "Agents", icon: User2 },
                { href: '/admin/agents/commission', label: "Commissions", icon: Handshake },
            ]
        },
        { href: '/admin/settings', label: "Settings", icon: Settings },
    ];

    return (
        <div className="flex flex-col space-y-1 p-4 w-64 border-r print:hidden">
            {sidebarLinks.map((link) => {
                const Icon = link.icon;
                return (
                    <div key={link.href} className="flex flex-col space-y-1">
                        <Link
                            replace={true}
                            href={link.href}
                            className={`flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md hover:bg-secondary hover:text-white transition-colors ${pathname === link.href ? "bg-secondary text-white" : "transparent"}`}
                        >
                            <Icon className="h-5 w-5" />
                            {link.label}
                        </Link>
                        {link.submenu && (
                            <div className="ml-4 flex flex-col space-y-1">
                                {link.submenu.map((sublink) => {
                                    const SubIcon = sublink.icon;
                                    return (
                                        <Link
                                            replace={true}
                                            key={sublink.href}
                                            href={sublink.href}
                                            className={`flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md hover:bg-secondary hover:text-white transition-colors ${pathname === sublink.href ? "bg-secondary text-white" : "transparent"}`}
                                        >
                                            <SubIcon className="h-5 w-5" />
                                            {sublink.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}

            <button
                onClick={logout}
                className="flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md hover:bg-secondary transition-colors"
            >
                <LogOutIcon className="h-5 w-5" />
                {"Sign out"}
            </button>

        </div >
    );
}