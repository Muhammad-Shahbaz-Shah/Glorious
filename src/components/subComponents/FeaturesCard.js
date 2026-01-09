import React from "react";
import { Progress } from "../ui/progress";

const FeaturesCard = ({ name, desc, icon, progress }) => {
  return (
    <div className="group relative p-5 bg-card hover:bg-accent/10 border-border border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 max-w-[260px] flex flex-col items-start gap-4 overflow-hidden">
      {/* Icon with a soft background glow */}
      <div className="relative z-10 p-2.5 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
        {React.cloneElement(icon, { size: 20 })}
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-bold leading-none tracking-tight text-foreground">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {desc}
        </p>
      </div>

      <div className="w-full space-y-2 mt-auto">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Usage
          </span>
          <span className="text-xs font-bold text-primary">{progress}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      {/* Subtle hover effect: top border or accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </div>
  );
};

export default FeaturesCard;
