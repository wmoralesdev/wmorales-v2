"use client";

import {
  CheckmarkCircle02Icon,
  Download04Icon,
  Location01Icon,
  Share08Icon,
} from "@hugeicons/core-free-icons";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
} from "motion/react";
import Link from "next/link";
import {
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { HalftonePhoto } from "@/components/halftone-photo";
import { Icon } from "@/components/icon";
import { photos, SITE_URL } from "@/lib/site";

export type QrTarget = {
  id: string;
  label: string;
  caption: string;
  value: string;
  svg?: string;
};

/**
 * A pocket business card: show the screen, the other person scans. The screen stays
 * awake while it's open, and the code can point to the site, the calendar or a vCard.
 */
export function IntroCard({
  targets,
  vcard,
}: {
  targets: QrTarget[];
  vcard: string;
}) {
  const [active, setActive] = useState(0);
  const [shared, setShared] = useState(false);
  const reduce = useReducedMotion();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const rx = useSpring(0, { stiffness: 150, damping: 20 });
  const ry = useSpring(0, { stiffness: 150, damping: 20 });
  const current = targets[active];

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

  function tilt(e: PointerEvent<HTMLElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
  }

  function resetTilt() {
    rx.set(0);
    ry.set(0);
  }

  function onKey(e: KeyboardEvent) {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + targets.length) % targets.length;
    setActive(next);
    tabs.current[next]?.focus();
  }

  function saveContact() {
    const url = URL.createObjectURL(
      new Blob([vcard], { type: "text/vcard;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "walter-morales.vcf";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function share() {
    const data = { title: "Walter Morales · Consultor de IA", url: SITE_URL };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(SITE_URL);
      setShared(true);
      setTimeout(() => setShared(false), 1800);
    } catch {
      // The visitor closed the share sheet.
    }
  }

  return (
    <main
      id="contenido"
      className="flex min-h-svh flex-col items-center justify-center bg-night px-4 py-[max(1.25rem,env(safe-area-inset-top))] [perspective:1200px]"
    >
      <motion.article
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", duration: 0.7, bounce: 0.15 }}
        style={{ rotateX: rx, rotateY: ry }}
        onPointerMove={tilt}
        onPointerLeave={resetTilt}
        className="w-full max-w-[25rem] overflow-clip bg-paper text-ink"
        aria-labelledby="intro-name"
      >
        <div className="relative h-28 sm:h-36">
          <HalftonePhoto
            photo={photos.portrait}
            fill
            priority
            reveal={false}
            tone="bg-accent text-ink"
            sizes="400px"
            className="[&_img]:object-[50%_22%] [&>div]:[mask-position:50%_22%]"
          />
          <div
            role="img"
            aria-label="Ai Labs"
            className="absolute bottom-3 left-4 aspect-[1295/324] w-28 bg-paper [mask:url(/ailabs-lockup-horizontal.svg)_left/contain_no-repeat]"
          />
        </div>

        <div className="px-5 pt-5 pb-6">
          <h1
            id="intro-name"
            className="display whitespace-nowrap text-[min(11.4vw,3.4rem)]"
          >
            Walter Morales
          </h1>
          <p className="mt-1.5 font-semibold text-body">
            Consultor de IA · Fundador de Ai Labs
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-muted text-small">
            <Icon icon={Location01Icon} size={16} />
            San Salvador, El Salvador
          </p>

          <div
            id="qr-panel"
            role="tabpanel"
            aria-label={current.label}
            className="mt-5 grid aspect-square place-items-center bg-surface p-5"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={current.id}
                role="img"
                aria-label={`Código QR: ${current.caption}`}
                initial={
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.97, filter: "blur(4px)" }
                }
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.97, filter: "blur(4px)" }
                }
                transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                className="size-full [&_svg]:size-full"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG generated on the server by the qrcode library.
                dangerouslySetInnerHTML={{ __html: current.svg ?? "" }}
              />
            </AnimatePresence>
          </div>

          <div
            role="tablist"
            aria-label="Qué abre el código"
            onKeyDown={onKey}
            className="relative mt-3 grid grid-cols-3 bg-surface p-1"
          >
            <span
              aria-hidden="true"
              className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] bg-ink transition-transform duration-250 ease-(--ease-out)"
              style={{ transform: `translateX(${active * 100}%)` }}
            />
            {targets.map((t, i) => (
              <button
                key={t.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-controls="qr-panel"
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                className={`press relative z-10 min-h-11 font-semibold text-small transition-colors duration-200 ${
                  i === active ? "text-paper" : "text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p
            className="mt-3 text-center text-muted text-small"
            aria-live="polite"
          >
            {current.caption}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <button type="button" onClick={saveContact} className="btn">
              <Icon icon={Download04Icon} size={18} />
              Guardar
            </button>
            <button
              type="button"
              onClick={share}
              className="btn [--btn-bg:var(--color-ink)] [--btn-bg-hover:var(--color-accent)]"
            >
              <Icon
                icon={shared ? CheckmarkCircle02Icon : Share08Icon}
                size={18}
              />
              {shared ? "Copiado" : "Compartir"}
            </button>
          </div>
        </div>
      </motion.article>

      <Link
        href="/"
        className="link-underline mt-5 text-night-soft text-small hover:text-paper"
      >
        wmorales.dev
      </Link>
    </main>
  );
}
