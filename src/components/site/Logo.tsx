import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-dark"
    >
      <Image src="/logo.png" alt="CSwitch" width={108} height={56} priority />
    </Link>
  );
}
