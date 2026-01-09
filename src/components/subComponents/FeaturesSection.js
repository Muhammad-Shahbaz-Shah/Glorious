"use client"
import {
  IconHeadset,
  IconMoneybagMinus,
  IconShieldCheck,
  IconZap
} from "@tabler/icons-react";
import { TruckElectric } from "lucide-react";
import FeaturesCard from "./FeaturesCard";

const FeaturesSection = () => {
  const features = [
    {
      name: "Discounted Price",
      progress: 50,
      desc: "Get the most competitive rates in the market, guaranteed.",
      icon: <IconMoneybagMinus />,
    },
    {
      name: "Secure Payments",
      progress: 95,
      desc: "Your transactions are protected by industry-leading encryption.",
      icon: <IconShieldCheck />,
    },
    {
      name: "Fast Delivery",
      progress: 80,
      desc: "Experience lightning-fast processing on every single order.",
      icon: <TruckElectric />,
    },
    {
      name: "24/7 Support",
      progress: 100,
      desc: "Our dedicated team is here to help you at any time of day.",
      icon: <IconHeadset />,
    },
  ];

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      {/* Refined Header Section */}
      <div className="flex items-center justify-center w-full mb-10 gap-6">
        <div className="h-[1px] hidden sm:block flex-1 bg-gradient-to-r from-transparent via-border to-border" />
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Why Choose Us?
          </h2>
          <p className="text-muted-foreground text-sm max-w-[300px] mx-auto">
            Experience the best-in-class service tailored for your needs.
          </p>
        </div>
        <div className="h-[1px] hidden sm:block flex-1 bg-gradient-to-l from-transparent via-border to-border" />
      </div>

      {/* Grid Layout - Better Spacing and Centering */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 justify-items-center">
        {features.map((feature, index) => (
          <FeaturesCard
            key={index}
            name={feature.name}
            progress={feature.progress}
            desc={feature.desc}
            icon={feature.icon}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
