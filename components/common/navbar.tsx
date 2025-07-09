'use client';

import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { SignInButton } from '@/components/auth/sign-in-button';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '../ui/navigation-menu';
import { Clock } from './clock';

const MotionMenuItem = motion(NavigationMenuItem);

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

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, _setScrolled] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Guestbook', href: '/guestbook' },
    { name: 'Cursor', children: [
      { name: 'Surveys', href: '/surveys' },
      { name: 'Polls', href: '/polls' },
      { name: 'Cursor', href: '/cursor' },
    ] },
  ];

  return (
    <motion.nav
      animate="visible"
      className={cn(
        'fixed top-0 right-0 left-0 z-50 inline-flex items-center justify-between border-b transition-all duration-300 lg:px-8',
        scrolled ? 'bg-background/95 shadow-lg backdrop-blur-md' : 'bg-background/80 backdrop-blur-md'
      )}
      initial="hidden"
      variants={navVariants}
    >
      {/* Logo */}
      <Link className="group flex cursor-pointer items-center gap-2" href="/">
        <div>
          <Image
            alt="Walter Morales"
            className="h-6 w-6 transform-gpu transition-transform duration-200 ease-in-out group-hover:rotate-180"
            height={24}
            priority
            quality={100}
            src="/wm.ico"
            width={24}
          />
        </div>
        <span className="font-bold text-lg text-white tracking-tighter group-hover:text-purple-400">WM</span>
      </Link>
      <div className="mx-auto px-4 lg:container sm:px-6 lg:px-20">
        <div className="flex h-16 items-center justify-between lg:w-full">


          {/* Desktop Navigation */}
          <NavigationMenu className="hidden items-center space-x-8 md:flex">
            <NavigationMenuList>
              <MotionMenuItem
                animate="visible"
                initial="hidden"
                key="home"
                variants={menuItemVariants}
              >
                <NavigationMenuLink
                  className="relative"
                  href="/"
                  key="home"
                >
                  <Button
                    className={cn(
                      'relative cursor-pointer font-medium text-sm transition-colors',
                      pathname === '/' ? 'text-purple-400' : 'hover:text-purple-400'
                    )}
                    variant="ghost"
                  >
                    <motion.span transition={{ duration: 0.2 }} whileHover={{ y: -2 }}>
                      Home
                    </motion.span>

                    {/* Active indicator */}
                    <AnimatePresence>
                      {pathname === '/' && (
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
                </NavigationMenuLink>
              </MotionMenuItem>

              <MotionMenuItem
                animate="visible"
                initial="hidden"
                key="guestbook"
                variants={menuItemVariants}
              >
                <NavigationMenuLink
                  className="relative"
                  href="/guestbook"
                  key="guestbook"
                >
                  <Button
                    className={cn(
                      'relative cursor-pointer font-medium text-sm transition-colors',
                      pathname === '/guestbook' ? 'text-purple-400' : 'hover:text-purple-400'
                    )}
                    variant="ghost"
                  >
                    <motion.span transition={{ duration: 0.2 }} whileHover={{ y: -2 }}>
                      Guestbook
                    </motion.span>

                    {/* Active indicator */}
                    <AnimatePresence>
                      {pathname === '/guestbook' && (
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
                </NavigationMenuLink>
              </MotionMenuItem>

              <MotionMenuItem
                animate="visible"
                initial="hidden"
                key="cursor"
                variants={menuItemVariants}
              >
                <NavigationMenuTrigger
                  className="relative"
                >
                  <span
                    className={cn(
                      'relative cursor-pointer font-medium text-sm transition-colors',
                      ['/surveys', '/polls', '/cursor'].includes(pathname) ? 'text-purple-400' : 'hover:text-purple-400'
                    )}
                  >
                    <motion.span transition={{ duration: 0.2 }} whileHover={{ y: -2 }}>
                      Cursor
                    </motion.span>

                    {/* Active indicator */}
                    <AnimatePresence>
                      {['/surveys', '/polls', '/cursor'].includes(pathname) && (
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
                  </span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    <li className="row-span-2">
                      <NavigationMenuLink
                        asChild
                        href="/cursor"
                      >
                        {/** biome-ignore lint/a11y/useValidAnchor: controlled by the NavigationMenuLink */}
                        <a className="flex h-full w-full justify-end from-muted/50 to-muted">
                          <div className="mt-4 mb-2 font-medium text-lg">
                            Ambassador
                          </div>
                          <p className="mb-4 text-muted-foreground text-sm leading-tight">
                            Answer questions to help us improve Cursor's community.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        className="flex h-full w-full from-muted/50 to-muted"
                        href="/surveys"
                      >
                        <div>
                          Surveys
                        </div>
                        <p className="text-muted-foreground text-sm leading-tight">
                          Answer questions to help us improve Cursor's community.
                        </p>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        className="flex h-full w-full from-muted/50 to-muted"
                        href="/polls"
                      >
                        <div>
                          Polls
                        </div>
                        <p className="text-muted-foreground text-sm leading-tight">
                          Vote in real-time polls. See what others think.
                        </p>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </MotionMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-2 md:hidden">
            <SignInButton size="sm" variant="ghost" />
            <Sheet onOpenChange={setIsOpen} open={isOpen}>
              <SheetTitle className="sr-only">Menu</SheetTitle>
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
                      {/* {navItems.map((item, index) => (
                        <MotionMenuItem
                          animate="visible"
                          custom={index}
                          href={item.href}
                          initial="hidden"
                          key={item.name}
                          variants={menuItemVariants}
                        >
                          <Button
                            className={`w-full justify-start text-left ${
                              pathname === item.href ? 'bg-purple-400/10 text-purple-400' : ''
                            }`}
                            variant="ghost"
                          >
                            <motion.span transition={{ duration: 0.2 }} whileHover={{ x: 5 }}>
                              {item.name}
                            </motion.span>
                          </Button>
                        </MotionMenuItem>
                      ))} */}
                    </motion.div>
                  </SheetContent>
                )}
              </AnimatePresence>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Sign In Button */}
      <motion.div
        animate="visible"
        className="inline-flex items-center gap-4"
        custom={navItems.length + 1}
        initial="hidden"
        variants={menuItemVariants}
      >
        <Clock className="hidden font-medium text-muted-foreground text-sm md:block" />
        <SignInButton variant="ghost" />
      </motion.div>
    </motion.nav>
  );
}
