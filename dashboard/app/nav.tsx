import Link from "next/link";

export const Nav = () => {
  return (
    <nav className="flex items-center justify-between w-full">
      <Link href="/" className="font-bold text-4xl">
        DKSH LLE
      </Link>
    </nav>
  );
};
