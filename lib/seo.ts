import type { Metadata } from "next";
import {
  type Locale,
  languages,
  locales,
  ogLocale,
  path,
  type RouteKey,
} from "@/lib/i18n/config";
import { dictionaries } from "@/lib/i18n/dictionaries";
import {
  aiLabs,
  consultantFaqs,
  type Faq,
  faqs,
  mediconecto,
  person,
  SITE_URL,
  services,
} from "@/lib/site";

// Google ignores this tag; Bing and smaller engines still read it. The queries
// that matter also appear in the title, description, FAQ or JSON-LD.
const KEYWORDS: Record<Locale, string[]> = {
  es: [
    "Walter Morales",
    "wmoralesdev",
    "Ai Labs El Salvador",
    "cofundador de Ai Labs",
    "fundador de Ai Labs",
    "ingeniero de IA El Salvador",
    "AI Engineer El Salvador",
    "ingeniero de software El Salvador",
    "consultor de IA El Salvador",
    "consultoría de inteligencia artificial",
    "Cursor Ambassador El Salvador",
    "embajador de Cursor",
    "embajador de Codex",
    "Mistral Ambassador",
    "Cognition Ambassador",
    "SpaceXAI Ambassadors",
    "Cafe Cursor",
    "talleres de Cursor",
    "capacitación en IA para empresas",
    "agentes de IA",
  ],
  en: [
    "Walter Morales",
    "wmoralesdev",
    "Ai Labs El Salvador",
    "Ai Labs co-founder",
    "AI Engineer El Salvador",
    "AI Engineer Central America",
    "software engineer El Salvador",
    "AI consultant El Salvador",
    "AI consultant Latin America",
    "Cursor Ambassador El Salvador",
    "Codex Ambassador",
    "Mistral Ambassador",
    "Cognition Ambassador",
    "SpaceXAI Ambassadors",
    "Cafe Cursor",
    "Cursor workshops",
    "AI training for teams",
    "AI agents",
  ],
};

/** Canonical, hreflang and Open Graph URL for one page in one language. */
export function pageMetadata(
  lang: Locale,
  key: RouteKey,
  { title, description }: { title: string; description: string },
): Metadata {
  const url = path(lang, key);
  return {
    title,
    description,
    alternates: { canonical: url, languages: languages(key) },
    openGraph: {
      title,
      description,
      url,
      locale: ogLocale[lang],
      alternateLocale: locales
        .filter((l) => l !== lang)
        .map((l) => ogLocale[l]),
    },
    twitter: { title, description },
  };
}

export function baseMetadata(lang: Locale): Metadata {
  const t = dictionaries[lang];
  const page = pageMetadata(lang, "home", t.meta);
  return {
    ...page,
    metadataBase: new URL(SITE_URL),
    title: { default: t.meta.title, template: "%s · Walter Morales" },
    keywords: KEYWORDS[lang],
    applicationName: "Walter Morales",
    authors: [{ name: person.name, url: SITE_URL }],
    creator: person.name,
    publisher: person.name,
    category: "technology",
    openGraph: {
      ...page.openGraph,
      type: "profile",
      siteName: "Walter Morales",
      firstName: person.givenName,
      lastName: person.familyName,
      username: "wmoralesdev",
    },
    twitter: {
      ...page.twitter,
      card: "summary_large_image",
      creator: "@wmoralesdev",
      site: "@wmoralesdev",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: [{ url: "/wm.ico" }, { url: "/wm.svg", type: "image/svg+xml" }],
      apple: "/wm.png",
    },
    formatDetection: { telephone: false, email: false, address: false },
  };
}

// Entity ids are shared by both languages: it's the same person and company.
const ids = {
  person: `${SITE_URL}/#walter-morales`,
  org: `${SITE_URL}/#ai-labs`,
  website: `${SITE_URL}/#website`,
  service: `${SITE_URL}/#consultoria-ia`,
  mediconecto: `${SITE_URL}/#mediconecto`,
};

const abs = (lang: Locale, key: RouteKey) => `${SITE_URL}${path(lang, key)}`;

function regions(lang: Locale) {
  const [latam, us] = dictionaries[lang].schema.regions;
  return [
    { "@type": "Country", name: "El Salvador" },
    { "@type": "Place", name: latam },
    { "@type": "Country", name: us },
  ];
}

function offerCatalog(lang: Locale) {
  return {
    "@type": "OfferCatalog",
    name: dictionaries[lang].schema.catalog,
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.name[lang],
        description: s.description[lang],
      },
    })),
  };
}

function faqPage(id: string, lang: Locale, list: Faq[]) {
  return {
    "@type": "FAQPage",
    "@id": id,
    inLanguage: lang,
    mainEntity: list.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function breadcrumbs(lang: Locale, key: RouteKey, name: string) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: dictionaries[lang].meta.home,
        item: abs(lang, "home"),
      },
      { "@type": "ListItem", position: 2, name, item: abs(lang, key) },
    ],
  };
}

function personNode(lang: Locale) {
  return {
    "@type": "Person",
    "@id": ids.person,
    name: person.name,
    givenName: person.givenName,
    familyName: person.familyName,
    alternateName: ["wmoralesdev", "Walter Morales IA"],
    jobTitle: person.roles[lang],
    description: person.summary[lang],
    url: abs(lang, "home"),
    image: `${SITE_URL}${person.image}`,
    email: `mailto:${person.email}`,
    founder: [{ "@id": ids.org }, { "@id": ids.mediconecto }],
    worksFor: { "@id": ids.org },
    affiliation: { "@id": ids.org },
    memberOf: [
      ["SpaceXAI Ambassadors", "SpaceXAI", "Regional Lead"],
      ["Codex Ambassadors", "OpenAI", "Ambassador"],
      ["Mistral Ambassadors", "Mistral AI", "Ambassador"],
      ["Cognition Ambassadors", "Cognition", "Ambassador"],
      ["Cursor Ambassadors", "Cursor", "Ambassador"],
    ].map(([programName, org, roleName]) => ({
      "@type": "ProgramMembership",
      programName,
      roleName,
      hostingOrganization: { "@type": "Organization", name: org },
    })),
    alumniOf: { "@type": "CollegeOrUniversity", name: person.education },
    homeLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: person.city,
        addressCountry: person.countryCode,
      },
    },
    nationality: { "@type": "Country", name: person.country },
    knowsLanguage: ["es", "en"],
    // Both languages on purpose: each is a query someone types.
    knowsAbout: [
      "Inteligencia artificial",
      "Artificial intelligence",
      "Consultoría de IA",
      "AI consulting",
      "Large language models",
      "AI agents",
      "Estrategia de IA",
      "Ingeniería de software",
      "Software engineering",
      "Coding agents",
      "Cursor",
      "Codex",
      "Mistral AI",
      "Devin",
      "Next.js",
      "TypeScript",
      ".NET",
      "AWS",
      "Azure",
    ],
    hasOccupation: [
      {
        "@type": "Occupation",
        name: "AI Engineer",
        alternateName: [
          "Ingeniero de IA",
          "Ingeniero de inteligencia artificial",
        ],
        occupationLocation: { "@type": "Country", name: person.country },
        skills: services.map((s) => s.name[lang]).join(", "),
      },
      {
        "@type": "Occupation",
        name: "Software Engineer",
        alternateName: "Ingeniero de software",
        occupationLocation: { "@type": "Country", name: person.country },
        skills: "TypeScript, Next.js, React, .NET, PostgreSQL, AWS, Azure",
      },
    ],
    sameAs: Object.values(person.social),
  };
}

function orgNode(lang: Locale) {
  return {
    "@type": "Organization",
    "@id": ids.org,
    name: aiLabs.name,
    alternateName: [
      aiLabs.wordmark,
      "AI Labs",
      "Ai Labs El Salvador",
      "Ai Labs SV",
    ],
    description: aiLabs.description[lang],
    url: aiLabs.url,
    sameAs: Object.values(aiLabs.social),
    logo: `${SITE_URL}${aiLabs.logo}`,
    founder: { "@id": ids.person },
    foundingLocation: { "@type": "Place", name: person.location },
    areaServed: dictionaries[lang].schema.regions,
  };
}

export function homeJsonLd(lang: Locale) {
  const t = dictionaries[lang];
  const url = abs(lang, "home");
  return {
    "@context": "https://schema.org",
    "@graph": [
      personNode(lang),
      orgNode(lang),
      {
        "@type": "Organization",
        "@id": ids.mediconecto,
        name: mediconecto.name,
        url: mediconecto.url,
        description: mediconecto.line[lang],
        founder: { "@id": ids.person },
        parentOrganization: { "@id": ids.org },
        areaServed: { "@type": "Country", name: "El Salvador" },
      },
      {
        "@type": "ProfessionalService",
        "@id": ids.service,
        name: `Ai Labs · ${t.consultant.serviceName}`,
        description: t.meta.description,
        url,
        image: `${SITE_URL}${person.image}`,
        email: person.email,
        provider: { "@id": ids.person },
        parentOrganization: { "@id": ids.org },
        address: {
          "@type": "PostalAddress",
          addressLocality: person.city,
          addressCountry: person.countryCode,
        },
        areaServed: regions(lang),
        availableLanguage: ["es", "en"],
        potentialAction: {
          "@type": "ReserveAction",
          target: abs(lang, "book"),
          name: t.schema.reserve,
        },
        hasOfferCatalog: offerCatalog(lang),
      },
      {
        "@type": "WebSite",
        "@id": ids.website,
        url: SITE_URL,
        name: "Walter Morales",
        description: t.meta.description,
        inLanguage: ["es", "en"],
        publisher: { "@id": ids.person },
      },
      {
        "@type": "ProfilePage",
        "@id": `${url}#profile`,
        url,
        name: t.meta.title,
        inLanguage: lang,
        isPartOf: { "@id": ids.website },
        about: { "@id": ids.person },
        mainEntity: { "@id": ids.person },
        primaryImageOfPage: `${SITE_URL}${person.image}`,
        dateModified: new Date().toISOString().slice(0, 10),
      },
      faqPage(`${url}#faq`, lang, faqs[lang]),
    ],
  };
}

export function bookJsonLd(lang: Locale) {
  const t = dictionaries[lang];
  const url = abs(lang, "book");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#page`,
        url,
        name: t.schema.bookPage,
        inLanguage: lang,
        isPartOf: { "@id": ids.website },
        about: { "@id": ids.service },
        potentialAction: { "@type": "ReserveAction", target: url },
      },
      breadcrumbs(lang, "book", t.schema.bookCrumb),
    ],
  };
}

export function consultantJsonLd(lang: Locale) {
  const t = dictionaries[lang];
  const url = abs(lang, "consultant");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#page`,
        url,
        name: `${t.consultant.title} · Walter Morales`,
        description: t.consultant.description,
        inLanguage: lang,
        isPartOf: { "@id": ids.website },
        about: { "@id": `${url}#service` },
        mainEntity: { "@id": `${url}#service` },
        primaryImageOfPage: `${SITE_URL}${person.image}`,
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: t.consultant.serviceName,
        serviceType: t.consultant.serviceType,
        description: t.consultant.description,
        url,
        provider: { "@id": ids.person },
        brand: { "@id": ids.org },
        areaServed: regions(lang),
        availableLanguage: ["es", "en"],
        hasOfferCatalog: offerCatalog(lang),
        potentialAction: {
          "@type": "ReserveAction",
          target: abs(lang, "book"),
          name: t.schema.reserve,
        },
      },
      // Repeated here so the page stands on its own when crawled in isolation.
      personNode(lang),
      orgNode(lang),
      faqPage(`${url}#faq`, lang, consultantFaqs[lang]),
      breadcrumbs(lang, "consultant", t.consultant.title),
    ],
  };
}
