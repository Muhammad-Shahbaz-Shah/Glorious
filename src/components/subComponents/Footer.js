import React from "react";

const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <div>
      <p className="text-xs text-muted-foreground text-center">
        © {currentYear} Glorious Store — Built with ❤️ by Syed
      </p>
    </div>
  );
};

export default Footer;
