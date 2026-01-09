"use client";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function BreadCrumb({ array }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {array.map((item, index) => {
          return (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={array.href}>{array.name}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadCrumb;
