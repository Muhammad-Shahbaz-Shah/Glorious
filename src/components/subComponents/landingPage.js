import ParticleButton from "@/components/kokonutui/particle-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Bus, Eye, Star, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const LandingPage = () => {
  const badges = [
    {
      name: "Premium Quality",
      icon: <Star className="text-yellow-600 " />,
      description: "Quality that you can trust",
    },
    {
      name: "Best Deals",
      icon: <TrendingUp className="text-green-600" />,
      description: " Best Deals of the market",
    },
    {
      name: "Fast Shipping",
      icon: <Bus className="text-blue-600" />,
      description: " Fastest and reliable shipping",
    },
  ];

  return (
    <div className="w-full  flex flex-col md:flex-row items-center md:justify-center ">
      <div className="w-full md:w-1/2 md:items-start flex gap-3 flex-col items-center p-6 md:px-12">
        <Tooltip>
          <TooltipTrigger>
            <Badge variant={"secondary"}>
              <Star className="fill-accent-foreground" />
              Limited Time Offer
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="tracking-wider font-mono capitalize">
              Offer is valid for limited time only
            </p>
          </TooltipContent>
        </Tooltip>

        <h1 className="md:text-4xl text-3xl text-center md:text-left font-semibold bg-linear-to-r from-secondary-foreground to-primary/75 bg-clip-text text-transparent">
          One Store. Endless New Possibilities.
        </h1>

        <p className="text-md text-center md:text-left tracking-wide text-muted-foreground ">
          Where quality meets curiosity. Explore our handpicked collection of
          clothing, shoes, and modern classics.
        </p>

        <div className=" space-x-2">
          <Link href={"/shop"}>
            <ParticleButton className="bg-linear-to-r hover:scale-95 from-primary/90 to-accent-foreground hover:from-secondary-foreground hover:to-secondary-foreground/60 text-white shadow-lg transition-all">
              Shop Now
            </ParticleButton>
          </Link>
          <Link href={"/about"}>
            <Button className={"hover:scale-95 shadow-xs"} variant="secondary">
              <Eye />
              About Us{" "}
            </Button>
          </Link>
        </div>
        <div className=" mt-2 flex flex-wrap justify-center gap-3 md:justify-start   ">
          {badges.map((badge, index) => {
            return (
              <Tooltip key={index}>
                <TooltipTrigger>
                  <Badge variant={"outline"}>
                    {badge.icon}
                    {badge.name}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="tracking-wider font-mono capitalize">
                    {badge.description}
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
        <div className="flex items-center gap-9 mt-4">
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-primary text-xl font-semibold">50K+</h3>
            <p className="text-muted-foreground text-center text-sm">
              Happy Customers
            </p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <h3 className="text-primary text-xl font-semibold">4.9</h3>
            <p className="text-muted-foreground text-center text-sm">
              Customer Rating
            </p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <h3 className="text-primary text-xl font-semibold">24/7</h3>
            <p className="text-muted-foreground text-center text-sm">
              Customer Support
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-center md:w-1/2 p-1">
        <div className="p-3 bg-primary/10 w-full flex justify-center items-center relative rounded-2xl border border-border">
          {" "}
          <Image
            className="animate-float"
            src={"/landingPageMan.png"}
            width={300}
            height={300}
            alt="Landing Page Man"
            priority={true}
          />
          <div className=" rounded-full bg-linear-to-r shadow-2xs from-primary to-accent-foreground absolute   top-20 left-15 animate-float p-2  flex items-center justify-center">
            <Bus className="text-zinc-300 w-7 h-7" />
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-linear-to-r shadow-2xs from-yellow-500 to-yellow-200 animate-float  bottom-5  absolute  right-10 ">
            {" "}
            <Star className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
