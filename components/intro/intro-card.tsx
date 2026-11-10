"use client";

import {
  ArrowUpRight01Icon,
  Calendar03Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Copy01Icon,
  GithubIcon,
  Globe02Icon,
  InstagramIcon,
  Linkedin01Icon,
  Location01Icon,
  Mail01Icon,
  NewTwitterIcon,
  QrCodeIcon,
  Share08Icon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Cover } from "@/components/cover";
import { HalftoneField } from "@/components/halftone-field";
import { HalftoneIcon } from "@/components/halftone-icon";
import { HalftoneLogo } from "@/components/halftone-logo";
import { Icon } from "@/components/icon";
import { QrPanel, type QrTarget } from "@/components/intro/qr-panel";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import {
  aiLabs,
  ambassadorships,
  experience,
  mediconecto,
  person,
  SITE_URL,
} from "@/lib/site";

type Paths = { site: string; book: string; intro: string };

// One tap each, in the order people reach for them after an event.
const channelsFor = (t: Dictionary["intro"], paths: Paths) => [
  { label: "LinkedIn", href: person.social.linkedin, icon: Linkedin01Icon },
  { label: t.email, href: `mailto:${person.email}`, icon: Mail01Icon },
  { label: "GitHub", href: person.social.github, icon: GithubIcon },
  { label: "X", href: person.social.x, icon: NewTwitterIcon },
  { label: "Instagram", href: person.social.instagram, icon: InstagramIcon },
  { label: t.site, href: paths.site, icon: Globe02Icon },
];

const devStatValues = ["6+", "1K+", "75+"];

// Inverted and quiet variants of the one button shape.
const inkBtn =
  "[--btn-bg:var(--color-ink)] [--btn-fg:var(--color-paper)] [--btn-bg-hover:var(--color-accent)] [--btn-fg-hover:var(--color-snow)]";
const quietBtn =
  "[--btn-bg:var(--color-surface)] [--btn-fg:var(--color-ink)] [--btn-bg-hover:var(--color-lilac)] [--btn-fg-hover:var(--color-ink)]";
const paperBtn =
  "[--btn-bg:var(--color-paper)] [--btn-fg:var(--color-ink)] [--btn-bg-hover:var(--color-lilac)] [--btn-fg-hover:var(--color-ink)]";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-ink/15 border-t px-4 pt-5 pb-8 sm:px-7 lg:px-12 lg:pt-7 lg:pb-12">
      <h2 className="mb-5 text-muted text-small">{title}</h2>
      {children}
    </section>
  );
}

/**
 * A pocket profile for the minute after "nice to meet you". It serves three people:
 *
 * - Walter, holding his phone out: the QR button in the action bar opens a sheet
 *   with the code at full size, and /intro#qr lands straight on it.
 * - Whoever just scanned it: who he is on the first screen, then one tap to save
 *   his contact, book a call or reach him on any channel.
 * - That person passing him on: Share sends the card through the phone's own share
 *   sheet, and the same QR sheet lets them show it to someone next to them.
 *
 * Phones get a short cover and a fixed action bar in thumb reach. From lg the
 * cover is pinned on the left, the actions sit in the page and the QR is inline,
 * ready to scan with a phone. The screen stays awake while the card is open.
 */
export function IntroCard({
  targets,
  vcf,
  t,
  lang,
  paths,
}: {
  targets: QrTarget[];
  /** URL of the downloadable vCard in the page's language. */
  vcf: string;
  t: Dictionary["intro"];
  lang: Locale;
  paths: Paths;
}) {
  const channels = channelsFor(t, paths);
  const devStats = devStatValues.map((value, i) => ({
    value,
    label: t.devStats[i],
  }));
  const [copied, setCopied] = useState(false);
  const sheetRef = useRef<HTMLDialogElement>(null);

  // Keep the screen on while someone is scanning.
  useEffect(() => {
    let lock: WakeLockSentinel | null = null;
    const request = async () => {
      try {
        lock = (await navigator.wakeLock?.request("screen")) ?? null;
      } catch {
        lock = null;
      }
    };
    const onVisible = () => document.visibilityState === "visible" && request();
    request();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      lock?.release();
    };
  }, []);

  function showQr() {
    const sheet = sheetRef.current;
    if (sheet && !sheet.open) sheet.showModal();
  }

  // /intro#qr opens with the code already up: the link Walter keeps on his home
  // screen. From lg the code is inline and the browser scrolls to it instead.
  useEffect(() => {
    const fromHash = () => {
      if (window.location.hash !== "#qr") return;
      if (window.matchMedia("(min-width: 64rem)").matches) return;
      const sheet = sheetRef.current;
      if (sheet && !sheet.open) sheet.showModal();
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const cardUrl = `${SITE_URL}${paths.intro}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(cardUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked: nothing to confirm.
    }
  }

  async function share() {
    if (!navigator.share) return copyLink();
    try {
      await navigator.share({
        title: person.name,
        text: t.shareText,
        url: cardUrl,
      });
    } catch {
      // The visitor closed the share sheet.
    }
  }

  return (
    <main
      id="contenido"
      className="relative z-10 min-h-svh bg-paper text-ink lg:grid lg:grid-cols-2"
    >
      {/* Short on phones, so the actions under it land on the first screen;
          pinned and a full screen tall from lg. */}
      <Cover
        as="header"
        nameId="intro-name"
        portraitLabel={t.portrait}
        className="[--cover:max(15rem,min(46svh,24rem))] lg:sticky lg:top-0 lg:[--cover:100svh]"
      >
        <div className="relative z-10 flex items-center justify-between px-4 pt-[max(0.5rem,env(safe-area-inset-top))] sm:px-7 lg:px-10 lg:pt-8">
          <Link
            href={paths.site}
            className="inline-flex min-h-11 items-center font-semibold text-small"
          >
            <span className="link-underline">wmorales.dev</span>
          </Link>
          <p className="flex items-center gap-1 text-small">
            <Icon icon={Location01Icon} size={16} />
            {person.city}
          </p>
        </div>
      </Cover>

      <div className="lg:pt-6">
        <div className="px-4 pt-5 pb-8 sm:px-7 lg:px-12 lg:pt-12 lg:pb-12">
          <p className="font-semibold text-lead leading-tight">{t.headline}</p>
          <p className="mt-2 text-muted text-body leading-snug">{t.blurb}</p>

          <div className="mt-5 grid grid-cols-[1fr_auto_auto] gap-2">
            <Link href={paths.book} className="btn col-span-3 min-h-12">
              <Icon icon={Calendar03Icon} size={18} />
              {t.bookCall}
            </Link>
            {/* From lg the action bar is gone, so its actions live here. */}
            <a href={vcf} className={`btn hidden lg:inline-flex ${inkBtn}`}>
              <Icon icon={UserAdd01Icon} size={18} />
              {t.save}
            </a>
            <button
              type="button"
              onClick={share}
              className={`btn hidden lg:inline-flex ${quietBtn}`}
            >
              <Icon icon={Share08Icon} size={18} />
              {t.share}
            </button>
            <button
              type="button"
              onClick={copyLink}
              aria-label={copied ? t.copied : t.copyLink}
              className={`btn hidden aspect-square px-0 lg:inline-flex ${quietBtn}`}
            >
              <Icon
                icon={copied ? CheckmarkCircle02Icon : Copy01Icon}
                size={18}
              />
            </button>
          </div>

          {/* Every channel, one tap away. */}
          <nav aria-label={t.connect} className="mt-2">
            <ul className="grid grid-cols-3 gap-2">
              {channels.map((c) => {
                const external = c.href.startsWith("http");
                return (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      className="press flex min-h-[4.25rem] flex-col justify-between bg-surface p-3 transition-colors duration-200 hover:bg-ink hover:text-paper"
                    >
                      <span className="flex items-start justify-between">
                        <Icon icon={c.icon} size={20} />
                        <Icon
                          icon={ArrowUpRight01Icon}
                          size={14}
                          className="opacity-50"
                        />
                      </span>
                      <span className="font-semibold text-small">
                        {c.label}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <Section title={t.now}>
          <ul className="space-y-6">
            <li>
              <Link
                href={`${paths.site}#ai-labs`}
                className="press grid grid-cols-[3rem_1fr_auto] items-start gap-x-4"
              >
                <HalftoneIcon shape="sparkle" className="size-12 text-accent" />
                <div>
                  <div
                    role="img"
                    aria-label="Ai Labs"
                    className="aspect-[1295/324] w-32 bg-ink [mask:url(/ailabs-lockup-horizontal.svg)_left/contain_no-repeat]"
                  />
                  <p className="mt-2 font-semibold text-small">Co-Founder</p>
                  <p className="mt-0.5 text-muted text-small leading-snug">
                    {aiLabs.line[lang]}
                  </p>
                </div>
                <Icon icon={ArrowUpRight01Icon} size={18} />
              </Link>
            </li>
            <li>
              <a
                href={mediconecto.url}
                target="_blank"
                rel="noreferrer"
                className="press grid grid-cols-[3rem_1fr_auto] items-start gap-x-4"
              >
                <HalftoneIcon shape="plus" className="size-12 text-accent" />
                <div>
                  <p className="display text-[1.375rem] leading-none">
                    {mediconecto.name}
                  </p>
                  <p className="mt-2 font-semibold text-small">
                    {mediconecto.role}
                  </p>
                  <p className="mt-0.5 text-muted text-small leading-snug">
                    {mediconecto.line[lang]}
                  </p>
                </div>
                <Icon icon={ArrowUpRight01Icon} size={18} />
              </a>
            </li>
          </ul>
        </Section>

        <Section title={t.ambassador}>
          <ul className="grid grid-cols-2 gap-1.5">
            {ambassadorships.map((a, i) => (
              <li
                key={a.name}
                data-icon-hover
                className={`group flex aspect-[4/3] flex-col justify-between p-3.5 ${
                  i === 0 ? "bg-accent text-snow" : "bg-ink text-paper"
                }`}
              >
                <HalftoneLogo
                  name={a.logo}
                  className={`size-12 ${i === 0 ? "text-snow" : "text-lilac"}`}
                />
                <div>
                  <p className="font-semibold text-body leading-tight">
                    {a.name}
                  </p>
                  <p className="mt-0.5 text-small opacity-70">{a.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={t.developer}>
          <dl className="grid grid-cols-3 gap-3">
            {devStats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="display text-[2rem] leading-none text-accent">
                  {s.value}
                </dd>
                <dd className="mt-1 text-muted text-small">{s.label}</dd>
              </div>
            ))}
          </dl>
          <ol className="mt-6 divide-y divide-ink/10 border-ink/10 border-y">
            {experience.slice(1, 5).map((job) => (
              <li
                key={job.name}
                className="grid grid-cols-[2.75rem_1fr] gap-x-3 py-2.5"
              >
                <span className="text-muted text-small tabular-nums">
                  {job.year}
                </span>
                <p className="text-small leading-snug">
                  <span className="font-semibold">{job.name}</span>
                  <span className="text-muted">, {job.role}</span>
                </p>
              </li>
            ))}
          </ol>
          <a
            href={person.social.github}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex min-h-11 items-center gap-1.5 font-semibold text-small"
          >
            <Icon icon={GithubIcon} size={16} />
            <span className="link-underline">{t.github}</span>
          </a>
        </Section>

        {/* The hand-off: whoever read this far can pass the card on. */}
        <Section title={t.pass}>
          <div className="lg:grid lg:grid-cols-[1fr_15rem] lg:items-start lg:gap-10">
            <div>
              <p className="max-w-[26ch] font-semibold text-lead leading-tight">
                {t.passBody}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={share}
                  className="btn col-span-2 min-h-12"
                >
                  <Icon icon={Share08Icon} size={18} />
                  {t.share}
                </button>
                <button
                  type="button"
                  onClick={copyLink}
                  className={`btn max-lg:px-3 lg:col-span-2 ${quietBtn}`}
                >
                  <Icon
                    icon={copied ? CheckmarkCircle02Icon : Copy01Icon}
                    size={18}
                  />
                  {copied ? t.copied : t.copyLink}
                </button>
                <button
                  type="button"
                  onClick={showQr}
                  className={`btn max-lg:px-3 lg:hidden ${inkBtn}`}
                >
                  <Icon icon={QrCodeIcon} size={18} />
                  {t.showQr}
                </button>
              </div>
              <p aria-live="polite" className="sr-only">
                {copied ? t.copied : ""}
              </p>
            </div>
            <div id="qr" className="hidden scroll-mt-8 lg:block">
              <QrPanel
                id="qr-inline"
                targets={targets}
                tabsLabel={t.qrTabs}
                codeLabel={t.qrCode}
              />
            </div>
          </div>
        </Section>

        {/* A closing band of the cover's field; the footer under it leaves the
            room the action bar needs. */}
        <div className="relative h-24 overflow-clip bg-accent lg:h-28">
          <HalftoneField
            seed={3.1}
            fade="up"
            className="absolute inset-0 text-accent-deep"
          />
        </div>
      </div>

      {/* Action bar, in thumb reach: keep him, show him, pass him on. It leaves
          the right corner to the Tools button, which sits in the same row. */}
      <div className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 right-[4.75rem] z-30 md:right-[5.25rem] lg:hidden">
        <div className="grid grid-cols-[1fr_auto_auto] gap-1.5 bg-ink p-1.5 shadow-[0_18px_50px_-12px_rgb(18_13_38/0.5)]">
          <a
            href={vcf}
            className="btn px-3 [--btn-bg-hover:var(--color-accent-deep)]"
          >
            <Icon icon={UserAdd01Icon} size={18} />
            <span className="min-[380px]:hidden">{t.saveShort}</span>
            <span className="max-[379px]:hidden">{t.save}</span>
          </a>
          <button
            type="button"
            onClick={showQr}
            aria-label={t.showQr}
            className={`btn aspect-square px-0 ${paperBtn}`}
          >
            <Icon icon={QrCodeIcon} size={20} />
          </button>
          <button
            type="button"
            onClick={share}
            aria-label={t.share}
            className={`btn aspect-square px-0 ${paperBtn}`}
          >
            <Icon icon={Share08Icon} size={20} />
          </button>
        </div>
      </div>

      {/* The QR at full size: a bottom sheet on phones, a centred card on tablets.
          A native dialog, so Escape, focus and the backdrop come with it. */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: the click only closes on the backdrop; the dialog handles Escape itself. */}
      <dialog
        ref={sheetRef}
        aria-labelledby="qr-sheet-title"
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
        className="fixed inset-x-0 top-auto bottom-0 m-0 max-h-none w-full max-w-none border-0 bg-transparent p-0 text-ink backdrop:bg-night/75 open:animate-sheet-up motion-reduce:animate-none sm:inset-0 sm:m-auto sm:max-w-[26rem]"
      >
        <div className="bg-paper px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 id="qr-sheet-title" className="font-semibold text-body">
              {t.scan}
            </h2>
            <button
              type="button"
              onClick={() => sheetRef.current?.close()}
              aria-label={t.close}
              className="press grid size-11 place-items-center bg-surface"
            >
              <Icon icon={Cancel01Icon} size={18} />
            </button>
          </div>
          <QrPanel
            id="qr-sheet"
            targets={targets}
            tabsLabel={t.qrTabs}
            codeLabel={t.qrCode}
            className="mx-auto max-w-[min(100%,58svh)]"
          />
        </div>
      </dialog>
    </main>
  );
}
