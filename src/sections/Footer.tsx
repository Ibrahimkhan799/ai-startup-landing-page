import Logo from "@/assets/logo.svg";
import { NavLinks } from "@/lib/constants";
import { IoLogoInstagram, IoLogoYoutube } from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";

export const Footer = () => {
  return <footer className="py-5 border-t border-border">
    <div className="container">
      <div className="flex flex-col lg:flex-row lg:justify-between gap-8">
        <div className="flex gap-2 items-center">
          <Logo className="h-6 w-6" />
          <div className="capitalize font-medium">AI Startup Landing Page</div>
        </div>
        <nav className="flex flex-col lg:flex-row lg:gap-7 gap-5 *:w-fit *:text-neutral-300/90 hover:*:text-neutral-50 *:text-xs md:*:text-sm *:transition">
          {NavLinks.map((link) => (
            <a key={link.name + "-footer"} href={link.link}>{link.name}</a>
          ))}
        </nav>
        <div className="flex gap-5 items-center">
          <IoLogoYoutube className="text-neutral-500 cursor-pointer hover:text-neutral-100 text-xl transition" />
          <IoLogoInstagram className="text-neutral-500 cursor-pointer hover:text-neutral-100 text-xl transition" />
          <FaXTwitter className="text-neutral-500 cursor-pointer hover:text-neutral-100 text-xl transition" />
        </div>
      </div>
    </div>
  </footer>;
};
