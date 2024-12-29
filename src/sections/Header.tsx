import Logo from "@/assets/logo.svg";
import MenuIcon from "@/assets/icon-menu.svg";
import { NavLinks } from "@/lib/constants";
import Button from "@/components/Button";

export const Header = () => {
  return <header className="py-4 border-b border-border md:border-none sticky top-0 z-max backdrop-blur md:backdrop-filter-none">
    <div className="container">
      <div className="flex flex-row justify-between items-center md:border border-border md:p-2.5 rounded-2xl max-w-2xl mx-auto md:backdrop-blur">
        <div className="h-10 w-10 flex items-center justify-center border border-border rounded-lg cursor-pointer">
          <Logo className="h-6 w-6" />
        </div>
        <div className="hidden md:block">
          <nav className="flex flex-row gap-8 *:text-neutral-300/90 hover:*:text-neutral-50 *:text-sm *:transition">
            {NavLinks.map((link)=>(
              <a key={link.name + "-header"} href={link.link}>{link.name}</a>
            ))}
          </nav>
        </div>  
        <div className="flex flex-row gap-4 items-center">
          <Button>Join waitlist</Button>
          <MenuIcon className="cursor-pointer md:hidden" />
        </div>
      </div>
    </div>
  </header>;
};