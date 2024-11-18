import Link from "next/link";

interface footerProps {
  description: string;
  textLink: string;
  link: string;
}

export function Footer({ description, link, textLink }: footerProps) {
  return (
    <div className="w-full flex justify-center mt-3">
      <span className="text-[12px]">
        {description} {""}
        <Link href={link} className="font-bold">{textLink}</Link>
      </span>
    </div>
  );
}
