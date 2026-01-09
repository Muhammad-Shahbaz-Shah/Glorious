"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import {
  Home,
  ShoppingBag,
  LayoutGrid,
  ShoppingCart,
  Package,
  Info,
  Phone,
} from "lucide-react";

const BottomNavbar = () => {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);
  const { data: session } = authClient.useSession();

  const navItems = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Shop", icon: ShoppingBag, href: "/shop" },
    { name: "Categories", icon: LayoutGrid, href: "/categories" },
    ...(session
      ? [
          { name: "Cart", icon: ShoppingCart, href: "/cart" },
          { name: "Orders", icon: Package, href: "/orders" },
        ]
      : [
          { name: "About", icon: Info, href: "/about" },
          { name: "Contact", icon: Phone, href: "/contact" },
        ]),
  ];

  useEffect(() => {
    const index = navItems.findIndex((item) => item.href === pathname);
    if (index !== -1) {
      setActiveIndex(index);
    }
  }, [pathname, navItems.length]);

  if (
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname.includes("admin")
  )
    return null;
  return (
    <div className="fixed bottom-6 left-6 right-6 md:hidden z-50">
      <nav className="bg-background/80 backdrop-blur-lg border border-border/50 px-6 py-2 rounded-4xl shadow-2xl relative h-16 flex items-center justify-between transition-all duration-300">
        {/* Active Indicator Moving Background */}
        <div
          className="absolute -top-10 w-14 h-14 bg-primary rounded-full border-4 border-background flex items-center justify-center transition-all duration-300 ease-in-out shadow-lg shadow-primary/20"
          style={{
            left: `calc(12px + ((100% - 24px) / ${navItems.length} * ${activeIndex}) + ((100% - 24px) / ${navItems.length} / 2) - 28px)`,
          }}
        >
          {/* The Curves - These span left and right to create the liquid feel */}
          <div className="absolute hidden top-[50%] -left-[22px] w-6 h-6 bg-transparent rounded-tr-full shadow-[6px_-6px_0_0_hsl(var(--background))]"></div>
          <div className="absolute hidden top-[50%] -right-[22px] w-6 h-6 bg-transparent rounded-tl-full shadow-[-6px_-6px_0_0_hsl(var(--background))]"></div>

          <div className="text-white">
            {React.createElement(navItems[activeIndex].icon, { size: 24 })}
          </div>
        </div>

        <ul className="flex w-full justify-between items-center relative z-10">
          {navItems.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={index} className="flex-1 flex justify-center">
                <Link
                  href={item.href}
                  onClick={() => setActiveIndex(index)}
                  className={`flex flex-col items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "text-primary"
                      : "text-gray-400 hover:text-primary"
                  }`}
                >
                  {/* Icon is hidden in the list when active, as it appears in the floating bubble */}
                  <item.icon
                    size={24}
                    className={`${isActive ? "opacity-0" : ""} mb-1`}
                  />
                  <span className="text-[10px] font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default BottomNavbar;
