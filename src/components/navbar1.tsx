'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import ThemeToggle from '@/components/theme/theme-toggle';
import { BrandMark } from '@/components/brand-mark';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';

interface MenuItem {
  title: string;
  url: string;
}

const DEFAULT_MENU: MenuItem[] = [
  { title: 'Home', url: '/' },
  { title: 'Projects', url: '/projects' },
  { title: 'Blog', url: '/blog' },
  { title: 'Contact', url: '/contact' },
];

interface Navbar1Props {
  className?: string;
  menu?: MenuItem[];
}

const Navbar1 = ({ className, menu = DEFAULT_MENU }: Navbar1Props) => {
  const pathname = usePathname();

  const isActive = (url: string) => {
    if (url === '/') return pathname === '/';
    return pathname === url || pathname.startsWith(`${url}/`);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60',
        className
      )}
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between px-8 py-3">
        {/* Desktop Menu */}
        <nav className="hidden w-full items-center justify-between lg:flex">
          {/* Logo: icon + wordmark on desktop */}
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label={`${siteConfig.author.name} — Home`}
          >
            <BrandMark size={22} aria-hidden />
            <span className="text-base font-semibold tracking-tight">
              {siteConfig.author.name}
            </span>
          </Link>

          {/* Center nav */}
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              {menu.map((item) => (
                <NavigationMenuItem key={item.url}>
                  <NavigationMenuLink asChild active={isActive(item.url)}>
                    <Link
                      href={item.url}
                      className={cn(
                        'inline-flex h-9 w-max items-center justify-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                        isActive(item.url) && 'bg-accent text-accent-foreground'
                      )}
                    >
                      {item.title}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="flex w-full items-center justify-between lg:hidden">
          {/* Logo: icon-only on mobile to save space */}
          <Link
            href="/"
            className="flex items-center"
            aria-label={`${siteConfig.author.name} — Home`}
          >
            <BrandMark size={28} />
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="hover:cursor-pointer"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-72">
                <SheetHeader>
                  <SheetTitle className="text-left text-base font-semibold">
                    {siteConfig.author.name}
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 p-4">
                  {menu.map((item) => (
                    <Link
                      key={item.url}
                      href={item.url}
                      className={cn(
                        'rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                        isActive(item.url) && 'bg-accent text-accent-foreground'
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export { Navbar1 };
