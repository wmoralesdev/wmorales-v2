import gsap from "gsap";

// Ambient motion for the big "Walter Morales" type, shared by the home hero and
// the intro cover. Both take letter groups: each group is one letter, plus any
// twin copies of it that must move in lockstep (the hero prints the name twice).

/** The name prints in as halftone dots that merge into type, then a ripple of dots passes through it now and then. */
export function printName(pairs: HTMLElement[][]) {
  const step = 0.045;
  const intro = gsap.timeline();
  pairs.forEach((pair, i) => {
    intro.fromTo(
      pair,
      { "--r": "0em" },
      { "--r": "0.1em", duration: 1.1, ease: "power1.in" },
      0.15 + i * step,
    );
  });
  intro.call(() => {
    for (const c of pairs.flat()) c.dataset.solid = "";
  });

  const ripple = gsap.timeline({ repeat: -1, repeatDelay: 6.5, delay: 4 });
  ripple.call(() => {
    for (const c of pairs.flat()) delete c.dataset.solid;
  });
  pairs.forEach((pair, i) => {
    ripple.to(
      pair,
      {
        "--r": "0.026em",
        duration: 0.32,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      },
      i * 0.035,
    );
  });
  ripple.call(() => {
    for (const c of pairs.flat()) c.dataset.solid = "";
  });
}

/** A swell of weight runs along the letters, thin and back, on a slow loop. */
export function weightWave(pairs: HTMLElement[][]) {
  const base = Number.parseInt(getComputedStyle(pairs[0][0]).fontWeight, 10);
  const target = base >= 600 ? 300 : 800;
  const wave = gsap.timeline({ repeat: -1, repeatDelay: 1.2, delay: 1.6 });
  pairs.forEach((pair, i) => {
    wave.to(
      pair,
      {
        fontWeight: target,
        duration: 0.55,
        ease: "sine.inOut",
        yoyo: true,
        repeat: 1,
      },
      i * 0.07,
    );
  });
}
