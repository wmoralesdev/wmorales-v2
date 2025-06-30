"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Menu, Code2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SignInButton } from "@/components/auth/sign-in-button";
import Link from 'next/link';

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    {
      name: "Home", href: "/", children: [
        { name: "About", href: "#about", description: "Quick intro, nothing fancy" },
        { name: "Experience", href: "#experience", description: "Projects and clients I've worked with" },
        { name: "Contact", href: "#contact", description: "Don't be shy, say hi!" },
      ],
      description: "Welcome to my website! Here you can find information about me, my projects, and how to get in touch."
    },
    { name: "Guestbook", href: "/guestbook" },
    { name: "Cursor", href: "/cursor" },
  ];

  const scrollToSection = (href: string) => {
    if (href === "/guestbook" || href === "/cursor") {
      router.push(href);
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <Code2 className="h-6 w-6 text-primary transition-all duration-300 group-hover:text-purple-400 group-hover:rotate-12" />
            <span className="font-bold text-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent">
              WM
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => {
                  if (item.children) {
                    return (
                      <NavigationMenuItem key={item.name}>
                        <NavigationMenuTrigger
                          className={cn(
                            navigationMenuTriggerStyle(),
                            "cursor-pointer"
                          )}
                          onClick={() => scrollToSection(item.href)}
                        >
                          {item.name}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                              <NavigationMenuLink asChild>
                                <a
                                  className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                                  href="/"
                                >
                                  <div className="mt-4 mb-2 text-lg font-bold">
                                    &lt;/&gt; WM
                                  </div>
                                  <p className="text-muted-foreground text-sm leading-tight">
                                    {item.description}
                                  </p>
                                </a>
                              </NavigationMenuLink>
                            </li>
                            {item.children.map((child) => (
                              <ListItem key={child.name} href={child.href} title={child.name}>
                                {child.description}
                              </ListItem>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    )
                  }

                  return (
                    <NavigationMenuItem key={item.name}>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "cursor-pointer"
                        )}
                        onClick={() => scrollToSection(item.href)}
                      >
                        {item.name}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )

                })}
              </NavigationMenuList>
            </NavigationMenu>
            <SignInButton variant="outline" size="sm" />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            <SignInButton variant="ghost" size="sm" />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Button
                      key={item.name}
                      variant="ghost"
                      onClick={() => scrollToSection(item.href)}
                      className="justify-start text-left"
                    >
                      {item.name}
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
