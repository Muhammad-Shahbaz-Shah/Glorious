"use client";

import { cn } from "@/lib/utils";
import { FileText, LayoutDashboard, LogOut, Phone, User } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useState } from "react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

const sampleData = {
    name: "Eugene An",
    email: "eugene@kokonutui.com",
    avatar: "/logo.png",
    subscription: "PRO",
    model: "Gemini 2.0 Flash",
};

export default function ProfileDropdown({
    data = sampleData,
    className,
    ...props
}) {
    const [isOpen, setIsOpen] = React.useState(false);

    const menuItems = [
        {
            label: "Profile",
            href: "/user",
            icon: <User className="w-4 h-4" />,
        },

        {
            label: "Contact",
            href: "/contact",
            icon: <Phone className="w-4 h-4" />,
        },
        {
            label: "About",
            href: "/about",
            icon: <FileText className="h-4 w-4" />,
            external: true,
        },


    ];

    if (data.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        menuItems.unshift({
            label: "Dashboard",
            href: "/-admin/dashboard",
            icon: <LayoutDashboard className="w-4 h-4" />,
        });
    } else
        console.log("not an admin email is ",data.email)


    const logout = () => {
        authClient.signOut();
    };

    const [imgSrc, setImgSrc] = useState(data.image || "/profile.png");

    return (
        <div className={cn("relative", className)} {...props}>
            <DropdownMenu onOpenChange={setIsOpen}>
                <div className="group relative ">
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="flex items-center gap-12 md:gap-16 p-3 rounded-2xl bg-background border border-border hover:border-border hover:bg-accent/50 hover:shadow-sm transition-all duration-200 focus:outline-none">
                            <div className="text-left  flex-1">
                                <div className="text-sm font-semibold text-foreground tracking-tight leading-tight">
                                    {data.name}
                                </div>
                                <div className="text-xs font-mono text-muted-foreground tracking-tight leading-tight">
                                    {data.email}
                                </div>

                            </div>
                            <div className="relative">
                                {/* Gradient kept as a design feature, but inner bg uses variable */}
                                <div className="w-10 h-10 rounded-full bg-linear-to-br from-accent-foreground  to-primary p-0.5">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-background">
                                        {data.image ? <img
                                            src={imgSrc}
                                            alt={data.name}
                                            onError={(e) => setImgSrc("/profile.png")}
                                            width={36}
                                            height={36}
                                            className="w-full h-full object-cover rounded-full"
                                        /> : <div className="w-full select-none  h-full rounded-full overflow-hidden flex items-center justify-center text-2xl bg-background">
                                            {data.name.split("")[0].toUpperCase()}
                                        </div>}
                                    </div>
                                </div>
                            </div>
                        </button>
                    </DropdownMenuTrigger>

                    <div
                        className={cn(
                            "absolute -right-3 top-1/2 -translate-y-1/2 transition-all duration-200",
                            isOpen ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                        )}>
                        <svg
                            width="12"
                            height="24"
                            viewBox="0 0 12 24"
                            fill="none"
                            className={cn("transition-all duration-200",
                                isOpen ? "text-primary scale-110" : "text-muted-foreground/60 group-hover:text-muted-foreground"
                            )}
                            aria-hidden="true">
                            <path
                                d="M2 4C6 8 6 16 2 20"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                fill="none"
                            />
                        </svg>
                    </div>

                    <DropdownMenuContent
                        align="end"
                        sideOffset={4}
                        className="w-64 p-2 bg-popover/95 backdrop-blur-sm border border-border rounded-2xl shadow-xl origin-top-right">
                        <div className="space-y-1">
                            {menuItems.map((item) => (
                                <DropdownMenuItem key={item.label} asChild>
                                    <Link
                                        href={item.href}
                                        className="flex items-center p-3 hover:bg-accent rounded-xl transition-all duration-200 cursor-pointer group hover:shadow-sm border border-transparent hover:border-border/50">
                                        <div className="flex items-center gap-2 flex-1 text-muted-foreground group-hover:text-foreground">
                                            {item.icon}
                                            <span className="text-sm font-medium tracking-tight leading-tight whitespace-nowrap transition-colors">
                                                {item.label}
                                            </span>
                                        </div>
                                        <div className="shrink-0 ml-auto">
                                            {item.value && (
                                                <span className="text-[10px] font-bold rounded-md py-0.5 px-2 tracking-tight bg-primary/10 text-primary border border-primary/10 uppercase">
                                                    {item.value}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </div>

                        <DropdownMenuSeparator className="my-3 bg-linear-to-r from-transparent via-border to-transparent" />

                        <DropdownMenuItem asChild>
                            <button
                                onClick={logout}
                                type="button"
                                className="w-full flex items-center gap-3 p-3 duration-200 bg-destructive/10 rounded-xl hover:bg-destructive/20 cursor-pointer border border-transparent hover:border-destructive/30 hover:shadow-sm transition-all group">
                                <LogOut className="w-4 h-4 text-destructive group-hover:text-destructive" />
                                <span className="text-sm font-medium text-destructive">
                                    Logout
                                </span>
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </div>
            </DropdownMenu>
        </div>
    );
}   