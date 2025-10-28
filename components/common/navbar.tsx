"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Globe, LogOut, Menu } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/auth-provider";
import { SignInButton } from "@/components/auth/sign-in-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link, usePathname } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import { Clock } from "./clock";

const MotionMenuItem = motion.create(NavigationMenuItem);

// Locale Toggle Component
type LocaleToggleProps = {
  showLabel?: boolean;
};

function LocaleToggle({ showLabel = true }: LocaleToggleProps) {
  const locale = useLocale();

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "es" : "en";

    // Extract dynamic route parameters from the current URL
    const currentUrl = new URL(window.location.href);
    const pathSegments = currentUrl.pathname.split("/").filter(Boolean);

    // Remove the locale from the path segments
    if (pathSegments[0] === locale) {
      pathSegments.shift();
    }

    // Reconstruct the path for the new locale
    const newPath = `/${newLocale}/${pathSegments.join("/")}`;

    // Add search parameters if they exist
    const searchParams = currentUrl.searchParams.toString();
    const fullUrl = searchParams ? `${newPath}?${searchParams}` : newPath;

    // Use window.location.href for direct navigation to avoid next-intl router issues
    window.location.href = fullUrl;
  };

  return (
    <motion.div
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        className="flex items-center gap-2 font-medium text-sm"
        onClick={toggleLocale}
        size="sm"
        variant="ghost"
      >
        <Globe className="h-4 w-4" />
        {showLabel && (
          <span className="hidden sm:inline">{locale.toUpperCase()}</span>
        )}
      </Button>
    </motion.div>
  );
}

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
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
    },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Mobile User Section Component
function MobileUserSection() {
  const { user, signOut } = useAuth();
  const t = useTranslations("auth");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const pathname = usePathname();

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      toast.success(t("signedOutSuccess"));
    } catch (_error) {
      toast.error(t("signOutError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}?redirectTo=${encodeURIComponent(pathname)}`,
      },
    });
  };

  const handleSignInWithGitHub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}?redirectTo=${encodeURIComponent(pathname)}`,
      },
    });
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  if (user) {
    const displayName =
      user.user_metadata?.full_name || user.email || t("user");
    const initials = getInitials(displayName);

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              alt={displayName}
              src={user.user_metadata?.avatar_url}
            />
            <AvatarFallback className="bg-purple-500/20 text-purple-300">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-sm text-white">
              {displayName}
            </p>
            <p className="truncate text-gray-400 text-xs">{user.email}</p>
          </div>
        </div>
        <Button
          className="w-full border-gray-700 hover:bg-gray-800"
          disabled={isLoading}
          onClick={handleSignOut}
          variant="outline"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoading ? t("loading") : t("signOut")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="font-medium text-gray-400 text-xs uppercase tracking-wider">
        {t("account")}
      </p>
      <div className="space-y-2">
        <Button
          className="w-full justify-start border-gray-700 hover:bg-gray-800"
          onClick={handleSignInWithGoogle}
          variant="outline"
        >
          <Image
            alt="Google"
            className="mr-2"
            height={16}
            src="/google.svg"
            width={16}
          />
          {t("continueWith", { provider: "Google" })}
        </Button>
        <Button
          className="w-full justify-start border-gray-700 hover:bg-gray-800"
          onClick={handleSignInWithGitHub}
          variant="outline"
        >
          <Image
            alt="GitHub"
            className="mr-2"
            height={16}
            src="/github.svg"
            width={16}
          />
          {t("continueWith", { provider: "GitHub" })}
        </Button>
      </div>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled] = useState(false);
  const tCommon = useTranslations("common");

  const t = useTranslations("navigation");

  if (pathname.endsWith("/gallery")) {
    return null;
  }

  return (
    <motion.nav
      animate="visible"
      className={cn(
        "fixed top-0 right-0 left-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "bg-background/95 shadow-lg backdrop-blur-md"
          : "bg-background/80 backdrop-blur-md"
      )}
      initial="hidden"
      variants={navVariants}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            className="group flex cursor-pointer select-none items-center gap-2 outline-none"
            href="/"
          >
            <div>
              <Image
                alt="Walter Morales"
                className="transform-gpu transition-transform duration-200 ease-in-out group-hover:rotate-180"
                height={24}
                priority
                quality={100}
                src="/wm.svg"
                width={24}
              />
            </div>
            <span className="font-bold text-lg text-white tracking-tighter group-hover:text-purple-400">
              WM
            </span>
          </Link>
          {/* Desktop Navigation */}
          <NavigationMenu className="hidden items-center space-x-8 md:flex">
            <NavigationMenuList>
              <MotionMenuItem
                animate="visible"
                initial="hidden"
                key="home"
                variants={menuItemVariants}
              >
                <NavigationMenuLink className="relative" href="/" key="home">
                  <Button
                    className={cn(
                      "relative cursor-pointer font-medium text-sm transition-colors",
                      pathname === "/"
                        ? "text-purple-400"
                        : "hover:text-purple-400"
                    )}
                    variant="ghost"
                  >
                    <motion.span
                      transition={{ duration: 0.2 }}
                      whileHover={{ y: -2 }}
                    >
                      {t("home")}
                    </motion.span>

                    {/* Active indicator */}
                    <AnimatePresence>
                      {pathname === "/" && (
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
                      "relative cursor-pointer font-medium text-sm transition-colors",
                      pathname === "/guestbook"
                        ? "text-purple-400"
                        : "hover:text-purple-400"
                    )}
                    variant="ghost"
                  >
                    <motion.span
                      transition={{ duration: 0.2 }}
                      whileHover={{ y: -2 }}
                    >
                      {t("guestbook")}
                    </motion.span>

                    {/* Active indicator */}
                    <AnimatePresence>
                      {pathname === "/guestbook" && (
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
                key="events"
                variants={menuItemVariants}
              >
                <NavigationMenuLink
                  className="relative"
                  href="/events"
                  key="events"
                >
                  <Button
                    className={cn(
                      "relative cursor-pointer font-medium text-sm transition-colors",
                      pathname === "/events"
                        ? "text-purple-400"
                        : "hover:text-purple-400"
                    )}
                    variant="ghost"
                  >
                    <motion.span
                      transition={{ duration: 0.2 }}
                      whileHover={{ y: -2 }}
                    >
                      {t("events")}
                    </motion.span>

                    <AnimatePresence>
                      {pathname === "/events" && (
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
                <NavigationMenuLink
                  className="relative"
                  href="/cursor"
                  key="cursor"
                >
                  <Button
                    className={cn(
                      "relative cursor-pointer font-medium text-sm transition-colors",
                      pathname === "/cursor"
                        ? "text-purple-400"
                        : "hover:text-purple-400"
                    )}
                    variant="ghost"
                  >
                    <motion.span
                      transition={{ duration: 0.2 }}
                      whileHover={{ y: -2 }}
                    >
                      {t("cursor")}
                    </motion.span>

                    <AnimatePresence>
                      {pathname === "/cursor" && (
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
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop Right Side Elements */}
          <div className="hidden items-center gap-4 md:flex">
            <Clock />
            <LocaleToggle />
            <SignInButton />
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-2 md:hidden">
            <SignInButton size="sm" variant="ghost" />
            <Sheet onOpenChange={setIsOpen} open={isOpen}>
              <SheetTitle className="sr-only">{t("menu")}</SheetTitle>
              <SheetTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button size="icon" variant="ghost">
                    <motion.div
                      animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  </Button>
                </motion.div>
              </SheetTrigger>
              <AnimatePresence>
                {isOpen && (
                  <SheetContent
                    className="w-[300px] overflow-y-auto"
                    side="right"
                  >
                    <motion.div
                      animate="visible"
                      className="mt-8 flex flex-col space-y-2"
                      exit="exit"
                      initial="hidden"
                      variants={mobileMenuVariants}
                    >
                      {/* Logo and Close hint */}
                      <div className="mb-6 flex items-center justify-between px-3">
                        <div className="flex items-center gap-2">
                          <Image
                            alt="Walter Morales"
                            className="h-6 w-6"
                            height={24}
                            src="/wm.svg"
                            width={24}
                          />
                          <span className="font-bold text-lg text-white">
                            WM
                          </span>
                        </div>
                        <p className="hidden text-gray-500 text-xs lg:block">
                          {tCommon("escToClose")}
                        </p>
                      </div>

                      {/* Navigation Links */}
                      <div className="space-y-1">
                        <Link href="/" onClick={() => setIsOpen(false)}>
                          <Button
                            className={cn(
                              "w-full justify-start",
                              pathname === "/" &&
                                "bg-purple-400/10 text-purple-400"
                            )}
                            variant="ghost"
                          >
                            {t("home")}
                          </Button>
                        </Link>

                        <Link
                          href="/guestbook"
                          onClick={() => setIsOpen(false)}
                        >
                          <Button
                            className={cn(
                              "w-full justify-start",
                              pathname === "/guestbook" &&
                                "bg-purple-400/10 text-purple-400"
                            )}
                            variant="ghost"
                          >
                            {t("guestbook")}
                          </Button>
                        </Link>

                        <Link href="/events" onClick={() => setIsOpen(false)}>
                          <Button
                            className={cn(
                              "w-full justify-start",
                              pathname === "/events" &&
                                "bg-purple-400/10 text-purple-400"
                            )}
                            variant="ghost"
                          >
                            {t("events")}
                          </Button>
                        </Link>

                        <Link href="/cursor" onClick={() => setIsOpen(false)}>
                          <Button
                            className={cn(
                              "w-full justify-start",
                              pathname === "/cursor" &&
                                "bg-purple-400/10 text-purple-400"
                            )}
                            variant="ghost"
                          >
                            {t("cursor")}
                          </Button>
                        </Link>
                      </div>

                      {/* Divider */}
                      <div className="my-4 border-gray-800 border-t" />

                      {/* User Section & Actions */}
                      <div className="space-y-4 px-3">
                        {/* Language Toggle */}
                        <div className="space-y-2">
                          <p className="font-medium text-gray-400 text-xs uppercase tracking-wider">
                            {t("language")}
                          </p>
                          <div className="flex rounded-lg bg-gray-800/50 p-1">
                            <button
                              className={cn(
                                "flex-1 rounded-md px-3 py-1.5 font-medium text-sm transition-all",
                                locale === "en"
                                  ? "bg-purple-500 text-white shadow-sm"
                                  : "text-gray-400 hover:text-white"
                              )}
                              onClick={() => {
                                if (locale !== "en") {
                                  const newLocale = "en";

                                  // Extract dynamic route parameters from the current URL
                                  const currentUrl = new URL(
                                    window.location.href
                                  );
                                  const pathSegments = currentUrl.pathname
                                    .split("/")
                                    .filter(Boolean);

                                  // Remove the locale from the path segments
                                  if (pathSegments[0] === locale) {
                                    pathSegments.shift();
                                  }

                                  // Reconstruct the path for the new locale
                                  const newPath = `/${newLocale}/${pathSegments.join("/")}`;

                                  // Add search parameters if they exist
                                  const searchParams =
                                    currentUrl.searchParams.toString();
                                  const fullUrl = searchParams
                                    ? `${newPath}?${searchParams}`
                                    : newPath;

                                  // Use window.location.href for direct navigation
                                  window.location.href = fullUrl;
                                }
                              }}
                            >
                              EN
                            </button>
                            <button
                              className={cn(
                                "flex-1 rounded-md px-3 py-1.5 font-medium text-sm transition-all",
                                locale === "es"
                                  ? "bg-purple-500 text-white shadow-sm"
                                  : "text-gray-400 hover:text-white"
                              )}
                              onClick={() => {
                                if (locale !== "es") {
                                  const newLocale = "es";

                                  // Extract dynamic route parameters from the current URL
                                  const currentUrl = new URL(
                                    window.location.href
                                  );
                                  const pathSegments = currentUrl.pathname
                                    .split("/")
                                    .filter(Boolean);

                                  // Remove the locale from the path segments
                                  if (pathSegments[0] === locale) {
                                    pathSegments.shift();
                                  }

                                  // Reconstruct the path for the new locale
                                  const newPath = `/${newLocale}/${pathSegments.join("/")}`;

                                  // Add search parameters if they exist
                                  const searchParams =
                                    currentUrl.searchParams.toString();
                                  const fullUrl = searchParams
                                    ? `${newPath}?${searchParams}`
                                    : newPath;

                                  // Use window.location.href for direct navigation
                                  window.location.href = fullUrl;
                                }
                              }}
                            >
                              ES
                            </button>
                          </div>
                        </div>

                        {/* User Info & Auth */}
                        <MobileUserSection />
                      </div>
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
