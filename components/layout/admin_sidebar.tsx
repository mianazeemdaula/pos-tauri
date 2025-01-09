"use client";

import { LayoutDashboard, Package, LogOutIcon, Split, Handshake, Users, ScanBarcode, Settings, ShoppingCart, Receipt, HandCoins, Landmark } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions/actions";

export function AdminSidebar() {
    const pathname = usePathname();
    const sidebarLinks = [
        { href: '/admin', label: "Dashboard", icon: LayoutDashboard },
        { href: '/admin/parties', label: "Parties", icon: Users },
        { href: '/admin/category', label: "Categories", icon: Split },
        { href: '/admin/products', label: "Products", icon: Package },
        { href: '/admin/sales', label: "Sales", icon: ShoppingCart },
        { href: '/admin/purchase', label: "Purchases", icon: ScanBarcode },
        { href: '/admin/payments', label: "Payments", icon: HandCoins },
        { href: '/admin/receivings', label: "Receivings", icon: Landmark },
        { href: '/admin/settings', label: "Settings", icon: Settings },
    ];

    return (
        <div className="flex flex-col space-y-1 p-4 w-64 border-r">
            {sidebarLinks.map((link) => {
                const Icon = link.icon;
                return (
                    <Link
                        replace={true}
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md hover:bg-secondary hover:text-white transition-colors ${pathname === link.href ? "bg-secondary text-white" : "transparent"}`
                        }
                    >
                        <Icon className="h-5 w-5" />
                        {link.label}
                    </Link>
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