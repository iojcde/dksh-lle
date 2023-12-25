"use client";

import { usePathname } from "next/navigation";

const Footer = () => {
  const path = usePathname();
  if (path.startsWith("/container")) return null;
  return (
    <footer>
      <div className="container mx-auto max-w-5xl px-6 py-3 flex text-sm justify-between items-center">
        DKSH LLE - by 10312 안지호, 10301 김남훈, 10306 김태일
      </div>
    </footer>
  );
};

export default Footer;
