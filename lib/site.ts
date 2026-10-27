import type { ShapeName } from "@/lib/halftone-shapes";
import type { Locale, Localized } from "@/lib/i18n/config";
import type { LogoName } from "@/lib/logo-dots";

// Single source of truth for every fact on the site. Pages, JSON-LD, llms.txt and
// the intro card all read from here so search engines and answer engines see one
// consistent story. Anything people read comes as { es, en }, side by side, so a
// change to one language is hard to miss in the other.

const l = <T>(es: T, en: T): Localized<T> => ({ es, en });

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://wmorales.dev"
).replace(/\/$/, "");

// Google Calendar appointment schedule. The short link is for sharing; it sends
// X-Frame-Options: SAMEORIGIN, so the iframe needs the schedule URL with ?gv=true.
export const BOOKING_URL = "https://calendar.app.google/5icmEYqum5EJpQLj6";
export const BOOKING_EMBED_URL =
  process.env.NEXT_PUBLIC_BOOKING_EMBED_URL ??
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3le7owokGKyKwsSTL9NavJ_kVj19-XBgqzGbwLcx5Q8qmSQNOK-C0rYCpJqDumc8mHycf9P-lg?gv=true";

export const person = {
  name: "Walter Morales",
  givenName: "Walter",
  familyName: "Morales",
  role: "AI Engineer",
  headline: l(
    "AI Engineer y Co-Founder de Ai Labs",
    "AI Engineer and Co-Founder of Ai Labs",
  ),
  // Everything he is publicly, in the order he introduces himself. Rendered in
  // JSON-LD; the visible site only shows the headline.
  roles: l(
    [
      "Co-Founder de Ai Labs",
      "AI Engineer",
      "SpaceXAI Ambassadors Regional Lead",
      "Codex Ambassador",
      "Mistral Ambassador",
      "Cognition Ambassador",
    ],
    [
      "Co-Founder of Ai Labs",
      "AI Engineer",
      "SpaceXAI Ambassadors Regional Lead",
      "Codex Ambassador",
      "Mistral Ambassador",
      "Cognition Ambassador",
    ],
  ),
  location: "San Salvador, El Salvador",
  city: "San Salvador",
  country: "El Salvador",
  countryCode: "SV",
  email: "hello@wmorales.dev",
  image: "/photos/walter-morales.jpg",
  summary: l(
    "Walter Morales es ingeniero de IA (AI Engineer) y Co-Founder de Ai Labs, en El Salvador. Antes de la IA pasó más de seis años como ingeniero de software. Es Regional Lead de SpaceXAI Ambassadors y Ambassador de Codex, Mistral y Cognition, y trabaja con empresas de Latinoamérica y Estados Unidos que quieren IA funcionando en producción, no en una demo.",
    "Walter Morales is an AI Engineer and Co-Founder of Ai Labs, based in El Salvador. He spent more than six years as a software engineer before moving into AI. He's the Regional Lead of SpaceXAI Ambassadors and an Ambassador for Codex, Mistral and Cognition, and he works with companies in Latin America and the US that want AI running in production, not in a demo.",
  ),
  education: "Universidad Centroamericana José Simeón Cañas (UCA)",
  languages: ["Español", "English"],
  social: {
    linkedin: "https://linkedin.com/in/wmoralesdev",
    github: "https://github.com/wmoralesdev",
    x: "https://x.com/wmoralesdev",
    instagram: "https://instagram.com/wmoralesdev",
  },
} as const;

export const aiLabs = {
  name: "Ai Labs",
  wordmark: "Ai /abs",
  url: "https://www.ailabs.sv",
  social: {
    linkedin: "https://linkedin.com/company/ai-labs-sv",
    instagram: "https://instagram.com/ailabs_sv",
    tiktok: "https://tiktok.com/@ailabs_sv",
    x: "https://x.com/ailabs_sv",
  },
  logo: "/ailabs-lockup-horizontal.svg",
  description: l(
    "Ai Labs es el estudio que Walter Morales cofundó en El Salvador para diseñar y construir productos con inteligencia artificial: estrategia, prototipos y software en producción para empresas de Latinoamérica.",
    "Ai Labs is the studio Walter Morales co-founded in El Salvador to design and build AI products: strategy, prototypes and production software for companies across Latin America.",
  ),
  line: l(
    "Estudio de IA que cofundé en El Salvador. Llevamos productos con IA de la estrategia a producción y somos la casa de Cafe Cursor.",
    "The AI studio I co-founded in El Salvador. We take AI products from strategy to production, and we're the home of Cafe Cursor.",
  ),
} as const;

export const facts = [
  {
    label: l("Con base en", "Based in"),
    value: l("San Salvador, El Salvador", "San Salvador, El Salvador"),
  },
  {
    label: l("Co-Founder de", "Co-Founder of"),
    value: l("Ai Labs", "Ai Labs"),
  },
  {
    label: l("Ambassador", "Ambassador"),
    value: l(
      "SpaceXAI, Codex, Mistral, Cognition",
      "SpaceXAI, Codex, Mistral, Cognition",
    ),
  },
] as const;

export const stats = [
  {
    value: 6,
    suffix: "+",
    label: l("años construyendo software", "years building software"),
  },
  {
    value: 1,
    suffix: "K+",
    label: l("builders en la comunidad", "builders in the community"),
  },
  { value: 75, suffix: "+", label: l("eventos realizados", "events run") },
  {
    value: 3,
    suffix: "K+",
    label: l("asistentes diferentes", "unique attendees"),
  },
] as const;

export const services: {
  name: Localized<string>;
  icon: ShapeName;
  description: Localized<string>;
}[] = [
  {
    name: l("Estrategia de IA", "AI strategy"),
    icon: "target",
    description: l(
      "Dónde la IA te ahorra horas o dinero, y un plan priorizado para llegar ahí. Si un caso no da, te lo digo.",
      "Where AI saves you hours or money, and a ranked plan to get there. If a use case doesn't pay off, I'll tell you.",
    ),
  },
  {
    name: l("Agentes y automatización", "Agents and automation"),
    icon: "sparkle",
    description: l(
      "Agentes conectados a tus datos y herramientas, con evaluaciones y límites claros desde el primer día.",
      "Agents wired into your data and tools, with evals and clear guardrails from day one.",
    ),
  },
  {
    name: l("Producto con IA", "AI product"),
    icon: "tiles",
    description: l(
      "Funciones con IA dentro de productos web que ya tienen usuarios, del prototipo a producción.",
      "AI features inside web products that already have users, from prototype to production.",
    ),
  },
  {
    name: l("Adopción de IA", "AI adoption"),
    icon: "cursor",
    description: l(
      "Acompaño a tu equipo a trabajar con Cursor, Codex y otros agentes de código sin que baje la calidad del código.",
      "I help your team work with Cursor, Codex and other coding agents without letting code quality slip.",
    ),
  },
  {
    name: l("Arquitectura cloud", "Cloud architecture"),
    icon: "cloud",
    description: l(
      "Modelos integrados en AWS y Azure, migraciones y sistemas que aguantan tráfico real.",
      "Models integrated on AWS and Azure, migrations, and systems that hold up under real traffic.",
    ),
  },
  {
    name: l("Charlas y talleres", "Talks and workshops"),
    icon: "chat",
    description: l(
      "Workshops para equipos, universidades y comunidades, en español o en inglés.",
      "Workshops for teams, universities and communities, in English or Spanish.",
    ),
  },
];

// Career and community are separate stories: the Experience section reads the
// jobs, the Community bento reads the events.

export const mediconecto = {
  name: "MediConecto",
  role: "Founder",
  url: "https://mediconecto.com",
  line: l(
    "Directorio de médicos en El Salvador para agendar sin llamar, con agenda y expediente para clínicas. Un producto de Ai Labs.",
    "A directory of doctors in El Salvador where patients book without calling, with scheduling and records for clinics. An Ai Labs product.",
  ),
} as const;

// Logos live in /public/logos and print as halftone (see HalftoneLogo). SpaceXAI
// Ambassadors uses the xAI mark.
export const ambassadorships: {
  name: string;
  role: string;
  logo: LogoName;
  host: string;
  line: Localized<string>;
}[] = [
  {
    name: "SpaceXAI Ambassadors",
    role: "Regional Lead",
    logo: "xai",
    host: "SpaceXAI",
    line: l(
      "Lidero el programa de embajadores en la región: comunidad, eventos y adopción de sus modelos.",
      "I lead the ambassador program in the region: community, events and getting teams onto its models.",
    ),
  },
  {
    name: "Codex",
    role: "Ambassador",
    logo: "codex",
    host: "OpenAI",
    line: l(
      "El agente de código de OpenAI. Doy talleres y ayudo a equipos de ingeniería a usarlo a diario.",
      "OpenAI's coding agent. I run workshops and help engineering teams use it every day.",
    ),
  },
  {
    name: "Mistral",
    role: "Ambassador",
    logo: "mistral",
    host: "Mistral AI",
    line: l(
      "Modelos abiertos de Mistral AI, la opción que recomiendo cuando los datos no pueden salir de casa.",
      "Mistral AI's open models, my pick when the data can't leave the building.",
    ),
  },
  {
    name: "Cognition",
    role: "Ambassador",
    logo: "cognition",
    host: "Cognition",
    line: l(
      "El equipo detrás de Devin y Windsurf, agentes que escriben software casi solos.",
      "The team behind Devin and Windsurf, agents that write software almost on their own.",
    ),
  },
];

export type Job = {
  name: string;
  role: string;
  year: string;
  detail: Localized<string>;
};

export const experience: Job[] = [
  {
    name: "Cursor",
    role: "Ambassador, El Salvador",
    year: "2025",
    detail: l(
      "Comunidad de más de 1K builders en El Salvador.",
      "A community of 1K+ builders in El Salvador.",
    ),
  },
  {
    name: "SOUTHWORKS",
    role: "Senior Software Engineer",
    year: "2023",
    detail: l(
      "Integración de IA y migraciones cloud en AWS y Azure.",
      "AI integration and cloud migrations on AWS and Azure.",
    ),
  },
  {
    name: "Freelance",
    role: "Product Engineer",
    year: "2023",
    detail: l(
      "Arquitectura y entrega para clientes internacionales.",
      "Architecture and delivery for international clients.",
    ),
  },
  {
    name: "Ravn",
    role: "Senior Software Developer",
    year: "2023",
    detail: l(
      "Migración de servicios de Rust a .NET.",
      "Migrated services from Rust to .NET.",
    ),
  },
  {
    name: "Resultier",
    role: "Full Stack Engineer",
    year: "2022",
    detail: l(
      "Analítica de salud con modelos de ML.",
      "Health analytics with ML models.",
    ),
  },
  {
    name: "innRoad",
    role: "Full Stack Developer",
    year: "2021",
    detail: l(
      "Sistemas de reservas en .NET y React.",
      "Booking systems in .NET and React.",
    ),
  },
  {
    name: "Elaniin",
    role: "Developer",
    year: "2020",
    detail: l("Aplicaciones ASP.NET y Blazor.", "ASP.NET and Blazor apps."),
  },
  {
    name: "Vincu Hub",
    role: "Backend Developer",
    year: "2019",
    detail: l(
      "APIs con Clean Architecture y CQRS.",
      "APIs built with Clean Architecture and CQRS.",
    ),
  },
];

export type CommunityEvent = {
  name: string;
  year: string;
  photo: PhotoKey;
  href: string;
};

export const events: CommunityEvent[] = [
  {
    name: "Cursor Hackathon II",
    year: "2026",
    photo: "hackathon2",
    href: "https://photos.app.goo.gl/qNSHWVYZwThjrUuY9",
  },
  {
    name: "Cafe Cursor III",
    year: "2025",
    photo: "cafe3",
    href: "https://photos.app.goo.gl/X4gF3SAVKAG665gb9",
  },
  {
    name: "Cafe Cursor II",
    year: "2025",
    photo: "cafe2",
    href: "https://photos.app.goo.gl/AFHgh6CAZzCq6jm79",
  },
  {
    name: "Cursor Workshop",
    year: "2025",
    photo: "workshop",
    href: "https://photos.app.goo.gl/DYiKX3hxjghCak349",
  },
  {
    name: "Cafe Cursor I",
    year: "2025",
    photo: "cafe1",
    href: "https://photos.app.goo.gl/WHd8v7hVQ9vBGTvFA",
  },
  {
    name: "Cursor Hackathon",
    year: "2025",
    photo: "hackathon",
    href: "https://photos.app.goo.gl/do6sTx3BsPEaNcLQ7",
  },
  {
    name: "Cursor Meetup",
    year: "2025",
    photo: "meetup",
    href: "https://photos.app.goo.gl/hVpWW3GdN2wsqdhN7",
  },
];

const photoSources = {
  portrait: {
    src: "walter-morales",
    alt: l(
      "Retrato de Walter Morales, AI Engineer y Co-Founder de Ai Labs",
      "Portrait of Walter Morales, AI Engineer and Co-Founder of Ai Labs",
    ),
    width: 864,
    height: 1184,
  },
  hackathon2: {
    src: "cursor-hackathon-2",
    alt: l(
      "Asistentes del segundo Cursor Hackathon en San Salvador junto a Walter Morales",
      "Attendees of the second Cursor Hackathon in San Salvador with Walter Morales",
    ),
    width: 1600,
    height: 1067,
  },
  meetup: {
    src: "cursor-meetup",
    alt: l(
      "Desarrolladores conversando en el Cursor Meetup de San Salvador",
      "Developers talking at the Cursor Meetup in San Salvador",
    ),
    width: 1280,
    height: 960,
  },
  hackathon: {
    src: "cursor-hackathon",
    alt: l(
      "Laptop con la agenda del Cursor Hackathon y tarjeta con código QR",
      "Laptop showing the Cursor Hackathon agenda next to a QR code card",
    ),
    width: 768,
    height: 1024,
  },
  cafe1: {
    src: "cafe-cursor-1",
    alt: l(
      "Agenda impresa y créditos de Cafe Cursor",
      "Printed agenda and credits at Cafe Cursor",
    ),
    width: 768,
    height: 1024,
  },
  workshop: {
    src: "cursor-workshop",
    alt: l(
      "Participantes del Cursor Workshop escaneando un código QR en pantalla",
      "Cursor Workshop participants scanning a QR code on screen",
    ),
    width: 768,
    height: 1024,
  },
  cafe2: {
    src: "cafe-cursor-2",
    alt: l(
      "Bolsa de café de especialidad edición Cafe Cursor",
      "A bag of Cafe Cursor edition specialty coffee",
    ),
    width: 768,
    height: 1024,
  },
  cafe3: {
    src: "cafe-cursor-3",
    alt: l(
      "Walter Morales presentando en Cafe Cursor entre libreros",
      "Walter Morales presenting at Cafe Cursor between bookshelves",
    ),
    width: 1086,
    height: 724,
  },
} as const;

export type PhotoKey = keyof typeof photoSources;
export type Photo = { src: string; alt: string; width: number; height: number };

/** A photo with its alt text in the page's language. */
export function photo(key: PhotoKey, lang: Locale): Photo {
  const p = photoSources[key];
  return { src: p.src, alt: p.alt[lang], width: p.width, height: p.height };
}

export type Faq = { q: string; a: string };

export const faqs: Localized<Faq[]> = {
  es: [
    {
      q: "¿Quién es Walter Morales?",
      a: "Walter Morales es ingeniero de IA (AI Engineer) y Co-Founder de Ai Labs, en San Salvador. Trabajó más de seis años como ingeniero de software en equipos como SOUTHWORKS y Ravn antes de dedicarse a la IA. Hoy también organiza una comunidad de más de mil builders en El Salvador: más de 75 eventos y más de tres mil asistentes.",
    },
    {
      q: "¿De qué programas de IA es embajador?",
      a: "Walter es Regional Lead de SpaceXAI Ambassadors y embajador de Codex (OpenAI), Mistral AI y Cognition. Desde 2025 es Cursor Ambassador en El Salvador, donde organiza Cafe Cursor, hackathons y talleres de Cursor.",
    },
    {
      q: "¿Qué es Ai Labs?",
      a: "Ai Labs es el estudio de inteligencia artificial que Walter Morales cofundó en El Salvador. Diseña y construye productos con IA para empresas de Latinoamérica, desde el primer prototipo hasta el software en producción. MediConecto es uno de sus productos.",
    },
    {
      q: "¿Trabajás con empresas fuera de El Salvador?",
      a: "Sí. Trabajo de forma remota con equipos de Latinoamérica y Estados Unidos, en español o en inglés. Las sesiones presenciales son en San Salvador o según el proyecto.",
    },
    {
      q: "¿Cómo empieza un proyecto?",
      a: "Con una llamada. Agendás un horario en wmorales.dev/book, me contás tu contexto y salimos con un diagnóstico inicial y próximos pasos claros. Si hay fit, preparo una propuesta con alcance, tiempos y entregables.",
    },
    {
      q: "¿Das talleres de Cursor para equipos o universidades?",
      a: "Sí. Como Cursor Ambassador doy talleres prácticos de desarrollo con agentes de código para equipos de ingeniería, universidades y comunidades, con un proyecto funcionando al final de cada sesión.",
    },
  ],
  en: [
    {
      q: "Who is Walter Morales?",
      a: "Walter Morales is an AI Engineer and Co-Founder of Ai Labs, based in San Salvador. He worked for more than six years as a software engineer, on teams like SOUTHWORKS and Ravn, before going all in on AI. He also runs a community of more than a thousand builders in El Salvador: 75+ events and over three thousand attendees.",
    },
    {
      q: "Which AI programs is he an ambassador for?",
      a: "Walter is the Regional Lead of SpaceXAI Ambassadors and an ambassador for Codex (OpenAI), Mistral AI and Cognition. Since 2025 he's also been the Cursor Ambassador in El Salvador, where he runs Cafe Cursor, hackathons and Cursor workshops.",
    },
    {
      q: "What is Ai Labs?",
      a: "Ai Labs is the AI studio Walter Morales co-founded in El Salvador. It designs and builds AI products for companies across Latin America, from the first prototype to production software. MediConecto is one of its products.",
    },
    {
      q: "Do you work with companies outside El Salvador?",
      a: "Yes. I work remotely with teams in Latin America and the US, in English or Spanish. In-person sessions happen in San Salvador or wherever the project needs.",
    },
    {
      q: "How does a project start?",
      a: "With a call. Pick a time at wmorales.dev/en/book, tell me about your situation, and we'll leave with a first diagnosis and clear next steps. If it's a fit, I'll send a proposal with scope, timeline and deliverables.",
    },
    {
      q: "Do you run Cursor workshops for teams or universities?",
      a: "Yes. As a Cursor Ambassador I run hands-on workshops on building with coding agents for engineering teams, universities and communities. Every session ends with a working project.",
    },
  ],
};

// The consultant landing only. It's reachable from search, not from the site's
// navigation, so its questions answer the "AI consultant" query head on.
export const consultantFaqs: Localized<Faq[]> = {
  es: [
    {
      q: "¿Qué hace un consultor de IA?",
      a: "Encuentra los procesos donde la inteligencia artificial ahorra horas o genera ingresos, elige con vos los modelos y herramientas, y acompaña la implementación hasta que funciona en producción. Y si un caso no conviene, te lo dice antes de que gastés en él.",
    },
    {
      q: "¿Por qué trabajar con un consultor de IA que es embajador de laboratorios de IA?",
      a: "Porque usa esas herramientas todas las semanas con equipos reales. Walter Morales es Regional Lead de SpaceXAI Ambassadors y Ambassador de Codex (OpenAI), Mistral y Cognition, así que sabe dónde falla cada modelo, no solo lo que promete el anuncio.",
    },
    {
      q: "¿Qué tipo de proyectos hace un consultor de IA en El Salvador?",
      a: "Estrategia de IA para la dirección, agentes conectados a datos y sistemas internos, funciones con IA dentro de productos web, adopción de agentes de código en equipos de ingeniería y talleres para empresas, universidades y gobierno.",
    },
    {
      q: "¿Cuánto cuesta una consultoría de IA?",
      a: "Depende del alcance. La primera llamada no tiene costo: salís con un diagnóstico inicial y, si hay fit, una propuesta con alcance, tiempos y entregables cerrados antes de empezar.",
    },
    {
      q: "¿Trabajás solo o con un equipo?",
      a: "Las dos cosas. Para estrategia, talleres y acompañamiento trabajo directo con tu equipo. Cuando el proyecto pide construir producto, lo ejecutamos con Ai Labs, el estudio de IA que cofundé en El Salvador.",
    },
    {
      q: "¿Atendés empresas fuera de San Salvador o en Estados Unidos?",
      a: "Sí. Trabajo con todo El Salvador, Latinoamérica y Estados Unidos, de forma remota y en español o inglés. Las sesiones presenciales son en San Salvador o según el proyecto.",
    },
    {
      q: "¿Das capacitación en IA para equipos?",
      a: "Sí. Los talleres usan proyectos reales de tu empresa y terminan con algo funcionando. El formato viene de la comunidad que organizo: más de 75 eventos y más de 3 mil asistentes diferentes.",
    },
    {
      q: "¿Cómo empezamos?",
      a: "Agendá una llamada en wmorales.dev/book y contame qué querés resolver, qué intentaron antes y con qué datos y herramientas cuentan.",
    },
  ],
  en: [
    {
      q: "What does an AI consultant do?",
      a: "Finds the processes where AI saves hours or brings in revenue, picks the models and tools with you, and stays through the build until it works in production. And if a use case isn't worth it, says so before you spend money on it.",
    },
    {
      q: "Why work with an AI consultant who's an ambassador for AI labs?",
      a: "Because he uses those tools every week with real teams. Walter Morales is the Regional Lead of SpaceXAI Ambassadors and an Ambassador for Codex (OpenAI), Mistral and Cognition, so he knows where each model breaks, not just what the launch post promises.",
    },
    {
      q: "What kind of projects does an AI consultant in El Salvador take on?",
      a: "AI strategy for leadership, agents connected to internal data and systems, AI features inside web products, rolling out coding agents to engineering teams, and workshops for companies, universities and government.",
    },
    {
      q: "How much does AI consulting cost?",
      a: "It depends on scope. The first call is free: you leave with an initial diagnosis and, if it's a fit, a proposal with scope, timeline and deliverables locked before any work starts.",
    },
    {
      q: "Do you work alone or with a team?",
      a: "Both. For strategy, workshops and coaching I work directly with your team. When the project calls for building product, we deliver it with Ai Labs, the AI studio I co-founded in El Salvador.",
    },
    {
      q: "Do you work with companies in the US?",
      a: "Yes. I work with companies across El Salvador, Latin America and the US, remotely and in English or Spanish. In-person sessions happen in San Salvador or wherever the project needs.",
    },
    {
      q: "Do you offer AI training for teams?",
      a: "Yes. Workshops use real projects from your company and end with something working. The format comes from the community I run: 75+ events and more than 3,000 unique attendees.",
    },
    {
      q: "How do we get started?",
      a: "Book a call at wmorales.dev/en/book and tell me what you want to solve, what you've tried, and what data and tools you have.",
    },
  ],
};
