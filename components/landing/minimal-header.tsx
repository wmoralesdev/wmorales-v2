import * as stylex from "@stylexjs/stylex";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { ElSalvadorTime } from "@/components/common/el-salvador-time";
import { LanguageSwitcher } from "@/components/common/language-switcher";
import { NavLink } from "@/components/common/nav-link";
import { NavRail } from "@/components/common/nav-rail";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, fonts } from "@/lib/stylex/tokens.stylex";

const socialLinks = [
  { href: "https://github.com/wmoralesdev", icon: FaGithub, label: "GitHub" },
  {
    href: "https://linkedin.com/in/wmoralesdev",
    icon: FaLinkedin,
    label: "LinkedIn",
  },
  { href: "https://x.com/wmoralesdev", icon: FaXTwitter, label: "X" },
];

const styles = stylex.create({
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  top: {
    display: "flex",
    flexDirection: "column-reverse",
    gap: "1.5rem",
    "@media (min-width: 768px)": {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },
  },
  text: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    "@media (min-width: 768px)": {
      maxWidth: "65%",
    },
  },
  name: {
    fontFamily: fonts.display,
    fontWeight: 600,
    fontSize: "2.25rem",
    color: colors.foreground,
    letterSpacing: "-0.05em",
    textWrap: "balance",
    "@media (min-width: 640px)": {
      fontSize: "3rem",
    },
  },
  nameAccent: {
    color: colors.accent,
  },
  intro: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  role: {
    fontSize: "1.125rem",
    color: colors.mutedForeground,
    lineHeight: 1.625,
    textWrap: "pretty",
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontFamily: fonts.mono,
    color: `color-mix(in oklch, ${colors.mutedForeground}, transparent 20%)`,
    fontSize: "0.875rem",
  },
  bullet: {
    color: `color-mix(in oklch, ${colors.mutedForeground}, transparent 60%)`,
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    paddingTop: "0.25rem",
  },
  badge: {
    flexShrink: 0,
    gap: "0.375rem",
    borderColor: `color-mix(in oklch, ${colors.accent}, transparent 70%)`,
    backgroundColor: `color-mix(in oklch, ${colors.accent}, transparent 90%)`,
    paddingBlock: "0.25rem",
    paddingLeft: "0.25rem",
    paddingRight: "0.625rem",
    fontWeight: 400,
    color: colors.foreground,
  },
  badgeIcon: {
    display: "flex",
    width: "1.25rem",
    height: "1.25rem",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    backgroundColor: `color-mix(in oklch, ${colors.foreground}, transparent 90%)`,
  },
  lightOnly: {
    display: "block",
    ":is(.dark *)": {
      display: "none",
    },
  },
  darkOnly: {
    display: "none",
    ":is(.dark *)": {
      display: "block",
    },
  },
  socials: {
    display: "flex",
    flexShrink: 0,
    alignItems: "center",
    gap: "0.75rem",
  },
  social: {
    color: `color-mix(in oklch, ${colors.mutedForeground}, transparent 30%)`,
    transitionProperty: "color, transform",
    transitionDuration: "200ms",
    ":hover": {
      color: colors.foreground,
      transform: "translateY(-0.125rem)",
    },
  },
  socialIcon: {
    width: 18,
    height: 18,
  },
  divider: {
    height: "0.875rem",
    width: 1,
    flexShrink: 0,
    backgroundColor: colors.border,
  },
  avatarWrap: {
    alignSelf: "flex-start",
  },
  avatar: {
    width: "6rem",
    height: "6rem",
    borderRadius: "1rem",
    transitionProperty: "transform",
    transitionDuration: "200ms",
    ":hover": {
      transform: "rotate(-2deg) scale(1.05)",
    },
    "@media (min-width: 768px)": {
      width: "8rem",
      height: "8rem",
    },
  },
  avatarImage: {
    objectFit: "cover",
  },
  nav: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "1.5rem",
  },
  navInner: {
    display: "flex",
    minWidth: 0,
    flex: 1,
    alignItems: "center",
    gap: "1.5rem",
  },
  mobileNav: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "0.5rem",
    "@media (min-width: 768px)": {
      display: "none",
    },
  },
  desktopNav: {
    display: "none",
    width: "100%",
    "@media (min-width: 768px)": {
      display: "block",
    },
  },
});

export async function MinimalHeader() {
  const t = await getTranslations("homepage.header");
  const tNav = await getTranslations("navigation");

  return (
    <header {...stylex.props(styles.header)}>
      <div {...stylex.props(styles.top)}>
        <div {...stylex.props(styles.text)}>
          <h1 {...stylex.props(styles.name)}>
            {t("name")}{" "}
            <span {...stylex.props(styles.nameAccent)}>{t("nameAccent")}</span>
          </h1>

          <div {...stylex.props(styles.intro)}>
            <p {...stylex.props(styles.role)}>{t("role")}</p>
            <div {...stylex.props(styles.meta)}>
              <span>{t("location")}</span>
              <span aria-hidden="true" {...stylex.props(styles.bullet)}>
                •
              </span>
              <ElSalvadorTime />
            </div>
          </div>

          <div {...stylex.props(styles.actions)}>
            <Badge
              variant="outline"
              {...mergeSx(stylex.props(styles.badge))}
            >
              <div {...stylex.props(styles.badgeIcon)}>
                <Image
                  src="/cube-2d-light.svg"
                  width={14}
                  height={14}
                  alt="Cursor"
                  {...stylex.props(styles.lightOnly)}
                />
                <Image
                  src="/cube-2d-dark.svg"
                  width={14}
                  height={14}
                  alt="Cursor"
                  {...stylex.props(styles.darkOnly)}
                />
              </div>
              <span>{t("ambassador")}</span>
            </Badge>

            <div {...stylex.props(styles.socials)}>
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  aria-label={label}
                  href={href}
                  key={label}
                  rel="noopener noreferrer"
                  target="_blank"
                  {...stylex.props(styles.social)}
                >
                  <Icon {...stylex.props(styles.socialIcon)} />
                </a>
              ))}
            </div>

            <span aria-hidden="true" {...stylex.props(styles.divider)} />
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        <div {...stylex.props(styles.avatarWrap)}>
          <Avatar {...stylex.props(styles.avatar)}>
            <AvatarImage
              src="/me.jpeg"
              alt="Walter Morales"
              {...stylex.props(styles.avatarImage)}
            />
            <AvatarFallback>WM</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <nav {...stylex.props(styles.nav)}>
        <div {...stylex.props(styles.navInner)}>
          <div {...stylex.props(styles.mobileNav)}>
            <NavLink href="/" exact>
              {tNav("home")}
            </NavLink>
            <NavLink href="/blog">{tNav("blog")}</NavLink>
            <NavLink href="/activities">{tNav("activities")}</NavLink>
            <NavLink href="/resources">{tNav("resources")}</NavLink>
            <NavLink href="/design-system">{tNav("designSystem")}</NavLink>
          </div>

          <div {...stylex.props(styles.desktopNav)}>
            <NavRail
              items={[
                { href: "/", label: tNav("home"), exact: true },
                { href: "/blog", label: tNav("blog") },
                { href: "/activities", label: tNav("activities") },
                { href: "/resources", label: tNav("resources") },
                { href: "/design-system", label: tNav("designSystem") },
              ]}
            />
          </div>
        </div>
      </nav>
    </header>
  );
}
