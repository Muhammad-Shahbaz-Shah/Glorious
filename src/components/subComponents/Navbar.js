"use client";
import ProfileDropdown from "@/components/kokonutui/profile-dropdown";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import Image from "next/image";
import { Spinner } from "../ui/spinner";

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Categories", href: "/categories" },
    ...(session
      ? [
          { name: "Orders", href: "/orders" },
          { name: "Cart", href: "/cart" },
        ]
      : [
          { name: "About", href: "/about" },
          { name: "Contact", href: "/contact" },
        ]),
  ];

  const url = usePathname();

  const user = session?.user;
  if (url === "/signin" || url === "/signup" || url.includes("admin"))
    return null;

  return (
    <nav className="sticky top-0 z-50 flex w-full h-16 px-3 md:px-12 items-center justify-between bg-background backdrop-blur-md border-b border-border/40">
      <div className="max-w-[25%]">
        <Link href="/" className="flex items-center py-2 gap-1">
          <Image width={55} height={55} src="/logo.png" alt="G" />
        </Link>
      </div>
      <div className="hidden   md:flex items-center justify-end min-w-[40%]">
        <ul className="flex space-x-3.5 text-sm font-medium">
          {navItems.map((item, index) => {
            return (
              <Link href={item.href} key={index}>
                {" "}
                <li
                  className={
                    url.includes(item.href) && item.name !== "Home"
                      ? "text-primary  border-b border-border cursor-pointer"
                      : "cursor-pointer"
                  }
                >
                  {item.name}
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
      <div className="flex items-center justify-end gap-2   min-w-[25%]">
        <div className="flex items-center justify-end w-full">
          {" "}
          {user ? (
            <ProfileDropdown data={user} />
          ) : isPending ? (
            <Spinner className={"w-6 h-6 text-primary"} />
          ) : (
            <Link href="/signin">
              <Button variant="outline">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
