'use client';

import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { Code2, Menu } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { SignInButton } from '@/components/auth/sign-in-button';
import { Button } from '@/components/ui/button';
import { NavigationMenuLink } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

function _ListItem({ title, children, href, ...props }: React.ComponentPropsWithoutRef<'li'> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="font-medium text-sm leading-none">{title}</div>
          <p className="line-clamp-2 text-muted-foreground text-sm leading-snug">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  // Handle scroll for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = navItems.map((item) => item.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && window.scrollY >= section.offsetTop - 100) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  // Animation variants
  const navVariants: Variants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const logoVariants: Variants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.1,
      rotate: [0, -10, 10, -10, 0],
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const menuItemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };

  const mobileMenuVariants: Variants = {
    hidden: { x: '100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 20,
      },
    },
    exit: {
      x: '100%',
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.nav
      animate="visible"
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/95 shadow-lg backdrop-blur-md' : 'bg-background/80 backdrop-blur-md'
      } border-b`}
      initial="hidden"
      variants={navVariants}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            className="group flex cursor-pointer items-center gap-2"
            onClick={() => scrollToSection('#home')}
            variants={logoVariants}
            whileHover="hover"
          >
            <motion.div transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }} whileHover={{ rotate: 360 }}>
              <Code2 className="h-6 w-6 text-primary transition-all duration-300 group-hover:text-purple-400" />
            </motion.div>
            <motion.span
              className="font-bold text-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent"
              transition={{ duration: 0.3 }}
              whileHover={{ letterSpacing: '0.05em' }}
            >
              WM
            </motion.span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {navItems.map((item, index) => (
              <motion.div
                animate="visible"
                className="relative"
                custom={index}
                initial="hidden"
                key={item.name}
                variants={menuItemVariants}
              >
                <Button
                  className={`relative font-medium text-sm transition-colors ${
                    activeSection === item.href.slice(1) ? 'text-purple-400' : 'hover:text-purple-400'
                  }`}
                  onClick={() => scrollToSection(item.href)}
                  variant="ghost"
                >
                  <motion.span transition={{ duration: 0.2 }} whileHover={{ y: -2 }}>
                    {item.name}
                  </motion.span>

                  {/* Active indicator */}
                  <AnimatePresence>
                    {activeSection === item.href.slice(1) && (
                      <motion.div
                        animate={{ scaleX: 1 }}
                        className="absolute right-0 bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400"
                        exit={{ scaleX: 0 }}
                        initial={{ scaleX: 0 }}
                        transition={{
                          duration: 0.3,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                      />
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-2 md:hidden">
            <SignInButton size="sm" variant="ghost" />
            <Sheet onOpenChange={setIsOpen} open={isOpen}>
              <SheetTrigger asChild>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button size="sm" variant="ghost">
                    <motion.div animate={isOpen ? { rotate: 90 } : { rotate: 0 }} transition={{ duration: 0.3 }}>
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  </Button>
                </motion.div>
              </SheetTrigger>
              <AnimatePresence>
                {isOpen && (
                  <SheetContent className="w-64" side="right">
                    <motion.div
                      animate="visible"
                      className="mt-8 flex flex-col space-y-4"
                      exit="exit"
                      initial="hidden"
                      variants={mobileMenuVariants}
                    >
                      {navItems.map((item, index) => (
                        <motion.div
                          animate="visible"
                          custom={index}
                          initial="hidden"
                          key={item.name}
                          variants={menuItemVariants}
                        >
                          <Button
                            className={`w-full justify-start text-left ${
                              activeSection === item.href.slice(1) ? 'bg-purple-400/10 text-purple-400' : ''
                            }`}
                            onClick={() => scrollToSection(item.href)}
                            variant="ghost"
                          >
                            <motion.span transition={{ duration: 0.2 }} whileHover={{ x: 5 }}>
                              {item.name}
                            </motion.span>
                          </Button>
                        </motion.div>
                      ))}
                    </motion.div>
                  </SheetContent>
                )}
              </AnimatePresence>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
