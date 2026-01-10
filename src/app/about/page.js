import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRightIcon, BaggageClaim, Phone } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="w-full flex flex-col p-4 px-6 ">
      <div className="flex items-center justify-center my-5 w-full mb-10 gap-6">
        <div className="h-px hidden sm:block flex-1 bg-linear-to-r from-transparent via-border to-border" />
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            About Us
          </h2>
          <p className="text-muted-foreground text-sm max-w-[600px] mx-auto">
            We are a team of passionate individuals who are dedicated to
            providing the best possible experience for our customers.
          </p>
        </div>
        <div className="h-px hidden sm:block flex-1 bg-linear-to-l from-transparent via-border to-border" />
      </div>
      <div className="w-full flex flex-col  md:flex-row items-center  justify-between gap-3">
        <div className="w-full md:w-1/2 overflow-hidden rounded-2xl h-[400px]">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
            alt="Our professional team collaborating on quality projects"
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-110"
            loading="lazy"
          />
        </div>
        <div className="w-full md:w-1/2 px-5 flex flex-col items-center gap-3">
          <h2 className="text-3xl font-extrabold text-center text-foreground">
            Collaborative Innovation
          </h2>
          <p className="text-center  text-muted-foreground/70">
            Our team of experts collaborates closely to turn complex challenges
            into seamless solutions. By combining our diverse skills, we ensure
            that every project reflects our commitment to professional excellence
            and collective success.
          </p>
          <Link href="/contact">
            <Button variant="link">
              Contact Us <ArrowUpRightIcon />
            </Button>
          </Link>
        </div>
      </div>
      <div className="w-[90%] rounded-2xl mx-auto shadow-lg -mt-10 bg-background border p-8 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        <div className="flex flex-col items-center text-center space-y-2">
          <h3 className="text-2xl font-bold">10k+</h3>
          <p className="text-sm text-muted-foreground font-medium">
            Happy Customers
          </p>
          <p className="text-xs text-muted-foreground/70">
            Trusted by thousands of users worldwide.
          </p>
        </div>
        <div className="flex flex-col items-center text-center space-y-2">
          <h3 className="text-2xl font-bold">15+</h3>
          <p className="text-sm text-muted-foreground font-medium">
            Years Experience
          </p>
          <p className="text-xs text-muted-foreground/70">
            Over a decade of industry-leading service.
          </p>
        </div>
        <div className="flex flex-col items-center text-center space-y-2">
          <h3 className="text-2xl font-bold">100%</h3>
          <p className="text-sm text-muted-foreground font-medium">
            Quality Assurance
          </p>
          <p className="text-xs text-muted-foreground/70">
            Every product meets our rigorous standards.
          </p>
        </div>
      </div>
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="border-l-4 border-primary pl-8">
            <h2 className="text-3xl font-bold mb-6">Our Expertise & Skills</h2>
            <p className="text-muted-foreground leading-relaxed">
              With years of experience in the industry, we have honed our skills
              to provide the best possible solutions. Our team stays ahead of
              the curve by constantly learning and adapting to new technologies
              and market trends.
            </p>
          </div>
          <div className="space-y-6">
            {[
              { name: "Product Strategy", level: 95 },
              { name: "User Experience", level: 90 },
              { name: "Technical Execution", level: 85 },
              { name: "Market Analysis", level: 80 },
            ].map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-mono font-semibold">
                    {skill.name}
                  </span>
                  <span className="text-sm font-semibold">{skill.level}%</span>
                </div>
                <Progress value={skill.level} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Our Core Team
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            The dedicated professionals driving innovation at Glorious.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {[
            {
              name: "Syed Muhammad Shahbaz Shah Bukhari",
              role: "Lead Developer",
              initials: "SS",
            },
            {
              name: "Shahzain Khan",
              role: "Project Manager",
              initials: "SK",
            },
            {
              name: "Umair Jutt",
              role: "UX Designer",
              initials: "UJ",
            },
            {
              name: "Sabir Biramani",
              role: "Product Specialist",
              initials: "SB",
            },
            {
              name: "Umar Farooq",
              role: "Quality Analyst",
              initials: "UF",
            },
          ].map((member, index) => (
            <div
              key={index}
              className="group relative p-5 rounded-2xl border border-border bg-card/50 transition-all duration-300 hover:bg-card hover:shadow-lg hover:-translate-y-1 flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:rotate-12 transition-all duration-500">
                <span className="text-sm font-bold text-primary group-hover:text-primary-foreground">
                  {member.initials}
                </span>
              </div>
              <h3 className="text-xs md:text-sm font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2 min-h-10 flex items-center justify-center">
                {member.name}
              </h3>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {member.role}
              </p>
              
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-1 h-1 rounded-full bg-primary/40" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative w-full rounded-3xl overflow-hidden min-h-[400px] flex items-center justify-center mb-10">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
          alt="Office Background"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.3]"
        />
        <div className="relative z-10 text-center px-6 py-12">
          <h2 className="md:text-4xl lg:text-5xl text-3xl font-extrabold text-white mb-6 tracking-tight">
            Ready to experience excellence?
          </h2>
          <p className="text-lg md:text-xl text-zinc-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join us in our mission to redefine quality and service. Our team is
            dedicated to helping you achieve your goals with premium solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button
                
                className="w-full  sm:w-auto text-lg h-12 px-8 font-semibold"
              >
                <BaggageClaim /> Explore Products
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="secondary"
                
                className="w-full sm:w-auto text-lg h-12 px-8 bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm"
              >
                <Phone /> Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;

export const metadata = {
  title: {
    default: "About Us ",
    template: "%s | Glorious",
  },
  description:
    " We are committed to providing our customers with the highest quality products and services. Our team of experts is dedicated to ensuring that every product we sell meets the highest standards of quality.",
};
