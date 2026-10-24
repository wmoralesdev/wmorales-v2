import type { Metadata } from "next";
import { aiLabs, faqs, person, SITE_URL, services } from "@/lib/site";

export const TITLE = "Walter Morales";
// Search snippet only. "Consultoría de IA" is the query we want to rank for; it
// lives here and in the JSON-LD service nodes, never as Walter's visible title.
export const DESCRIPTION =
  "AI Engineer y Co-Founder de Ai Labs. Consultoría de IA para empresas de Latinoamérica y EE. UU.: estrategia, agentes y producto en producción.";

export const KEYWORDS = [
  "consultor de IA",
  "consultor de inteligencia artificial",
  "consultoría de IA",
  "consultor de IA El Salvador",
  "consultor de IA Latinoamérica",
  "AI consultant",
  "AI consultant El Salvador",
  "Walter Morales",
  "Ai Labs",
  "Co-Founder de Ai Labs",
  "AI Engineer El Salvador",
  "agentes de IA",
  "automatización con IA",
  "estrategia de IA",
  "talleres de Cursor",
];

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s · Walter Morales" },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: "Walter Morales",
  authors: [{ name: person.name, url: SITE_URL }],
  creator: person.name,
  publisher: person.name,
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    locale: "es_SV",
    alternateLocale: ["es_419", "en_US"],
    url: SITE_URL,
    siteName: "Walter Morales",
    title: TITLE,
    description: DESCRIPTION,
    firstName: person.givenName,
    lastName: person.familyName,
    username: "wmoralesdev",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
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

const ids = {
  person: `${SITE_URL}/#walter-morales`,
  org: `${SITE_URL}/#ai-labs`,
  website: `${SITE_URL}/#website`,
  service: `${SITE_URL}/#consultoria-ia`,
};

const personNode = {
  "@type": "Person",
  "@id": ids.person,
  name: person.name,
  givenName: person.givenName,
  familyName: person.familyName,
  alternateName: ["wmoralesdev"],
  jobTitle: person.roles,
  description: person.summary,
  url: SITE_URL,
  image: `${SITE_URL}${person.image}`,
  email: `mailto:${person.email}`,
  founder: { "@id": ids.org },
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
  knowsAbout: [
    "Inteligencia artificial",
    "Consultoría de IA",
    "Artificial intelligence consulting",
    "Large language models",
    "AI agents",
    "Estrategia de IA",
    "Cursor",
    "Next.js",
    "TypeScript",
    ".NET",
    "AWS",
    "Azure",
  ],
  hasOccupation: {
    "@type": "Occupation",
    name: "AI Engineer",
    occupationLocation: { "@type": "Country", name: person.country },
    skills: services.map((s) => s.name).join(", "),
  },
  sameAs: Object.values(person.social),
};

const orgNode = {
  "@type": "Organization",
  "@id": ids.org,
  name: aiLabs.name,
  alternateName: [aiLabs.wordmark, "AI Labs", "Ai Labs El Salvador"],
  description: aiLabs.description,
  url: SITE_URL,
  logo: `${SITE_URL}${aiLabs.logo}`,
  founder: { "@id": ids.person },
  foundingLocation: { "@type": "Place", name: person.location },
  areaServed: ["Latinoamérica", "Estados Unidos"],
};

const serviceNode = {
  "@type": "ProfessionalService",
  "@id": ids.service,
  name: "Ai Labs · Consultoría de IA",
  description: DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}${person.image}`,
  email: person.email,
  provider: { "@id": ids.person },
  parentOrganization: { "@id": ids.org },
  address: {
    "@type": "PostalAddress",
    addressLocality: person.city,
    addressCountry: person.countryCode,
  },
  areaServed: [
    { "@type": "Country", name: "El Salvador" },
    { "@type": "Place", name: "Latinoamérica" },
    { "@type": "Country", name: "Estados Unidos" },
  ],
  availableLanguage: ["es", "en"],
  potentialAction: {
    "@type": "ReserveAction",
    target: `${SITE_URL}/book`,
    name: "Agendar una llamada",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios de consultoría de IA",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.name,
        description: s.description,
      },
    })),
  },
};

const websiteNode = {
  "@type": "WebSite",
  "@id": ids.website,
  url: SITE_URL,
  name: "Walter Morales",
  description: DESCRIPTION,
  inLanguage: "es",
  publisher: { "@id": ids.person },
};

export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      personNode,
      orgNode,
      serviceNode,
      websiteNode,
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profile`,
        url: SITE_URL,
        name: TITLE,
        inLanguage: "es",
        isPartOf: { "@id": ids.website },
        about: { "@id": ids.person },
        mainEntity: { "@id": ids.person },
        primaryImageOfPage: `${SITE_URL}${person.image}`,
        dateModified: new Date().toISOString().slice(0, 10),
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        inLanguage: "es",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

export function bookJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/book#page`,
        url: `${SITE_URL}/book`,
        name: "Agendá una llamada con Walter Morales",
        inLanguage: "es",
        isPartOf: { "@id": ids.website },
        about: { "@id": ids.service },
        potentialAction: {
          "@type": "ReserveAction",
          target: `${SITE_URL}/book`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Agendar",
            item: `${SITE_URL}/book`,
          },
        ],
      },
    ],
  };
}
