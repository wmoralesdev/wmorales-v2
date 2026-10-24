import type { ShapeName } from "@/lib/halftone-shapes";

// Single source of truth for every fact on the site. Pages, JSON-LD, llms.txt and
// the intro card all read from here so search engines and answer engines see one
// consistent story.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://wmorales.dev"
).replace(/\/$/, "");

// Google Calendar appointment schedule. For the cleanest embed, replace with the
// "Website embed" URL from Google Calendar (…/appointments/schedules/<id>?gv=true).
export const BOOKING_URL = "https://calendar.app.google/5icmEYqum5EJpQLj6";
export const BOOKING_EMBED_URL =
  process.env.NEXT_PUBLIC_BOOKING_EMBED_URL ?? BOOKING_URL;

export const person = {
  name: "Walter Morales",
  givenName: "Walter",
  familyName: "Morales",
  role: "AI Engineer",
  headline: "AI Engineer y Co-Founder de Ai Labs",
  // Everything he is publicly, in the order he introduces himself. Rendered in
  // JSON-LD; the visible site only shows the headline.
  roles: [
    "Co-Founder de Ai Labs",
    "AI Engineer",
    "SpaceXAI Ambassadors Regional Lead",
    "Codex Ambassador",
    "Mistral Ambassador",
    "Cognition Ambassador",
  ],
  location: "San Salvador, El Salvador",
  city: "San Salvador",
  country: "El Salvador",
  countryCode: "SV",
  email: "hello@wmorales.dev",
  image: "/photos/walter-morales.jpg",
  summary:
    "Walter Morales es AI Engineer y Co-Founder de Ai Labs, en El Salvador. Es Regional Lead de SpaceXAI Ambassadors y Ambassador de Codex, Mistral y Cognition. Ayuda a empresas de Latinoamérica y Estados Unidos a llevar la IA a producción: estrategia, agentes y producto.",
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
  description:
    "Ai Labs es el estudio que Walter Morales cofundó en El Salvador para diseñar y construir productos con inteligencia artificial: estrategia, prototipos y software en producción para empresas de Latinoamérica.",
} as const;

export const facts = [
  { label: "Con base en", value: "San Salvador, El Salvador" },
  { label: "Co-Founder de", value: "Ai Labs" },
  { label: "Ambassador", value: "SpaceXAI, Codex, Mistral, Cognition" },
] as const;

export const stats = [
  { value: 6, suffix: "+", label: "años construyendo software" },
  { value: 1, suffix: "K+", label: "builders en la comunidad" },
  { value: 75, suffix: "+", label: "eventos realizados" },
  { value: 3, suffix: "K+", label: "asistentes diferentes" },
] as const;

export const services: {
  name: string;
  icon: ShapeName;
  description: string;
}[] = [
  {
    name: "Estrategia de IA",
    icon: "target",
    description:
      "Diagnóstico de dónde la IA mueve números en tu operación y un plan priorizado para llegar ahí, sin humo.",
  },
  {
    name: "Agentes y automatización",
    icon: "sparkle",
    description:
      "Agentes con LLMs conectados a tus datos y herramientas, con evaluación y límites claros desde el primer día.",
  },
  {
    name: "Producto con IA",
    icon: "tiles",
    description:
      "Funcionalidades con IA dentro de productos web reales, del prototipo a producción con Next.js y la nube.",
  },
  {
    name: "Adopción de IA",
    icon: "cursor",
    description:
      "Talleres y acompañamiento para que tu equipo adopte herramientas de IA, de asistentes a agentes de código, sin perder calidad.",
  },
  {
    name: "Arquitectura cloud",
    icon: "cloud",
    description:
      "Modelos integrados en AWS y Azure, migraciones y sistemas que aguantan carga de verdad.",
  },
  {
    name: "Charlas y talleres",
    icon: "chat",
    description:
      "Workshops para equipos, universidades y comunidades, en español o en inglés.",
  },
];

// Career and community are separate stories: the Experience section reads the
// first three, the Community bento reads the events.

export const aiLabsLine =
  "Estudio de IA que cofundé en El Salvador. Llevamos productos con IA de la estrategia a producción y somos la casa de Cafe Cursor.";

export const mediconecto = {
  name: "MediConecto",
  role: "Founder",
  url: "https://mediconecto.com",
  line: "Directorio de médicos en El Salvador para agendar sin llamar, con agenda y expediente para clínicas. Un producto de Ai Labs.",
} as const;

// Logos live in /public/logos and print as halftone (see HalftoneLogo). SpaceXAI
// Ambassadors uses the xAI mark.
export const ambassadorships: {
  name: string;
  role: string;
  logo: string;
  host: string;
  line: string;
  /** Optical size correction for thin marks; see HalftoneLogo. */
  scale?: number;
}[] = [
  {
    name: "SpaceXAI Ambassadors",
    role: "Regional Lead",
    logo: "/logos/xai.svg",
    host: "SpaceXAI",
    line: "Lidera el programa de embajadores en la región: comunidad, eventos y adopción de sus modelos.",
  },
  {
    name: "Codex",
    role: "Ambassador",
    logo: "/logos/codex.svg",
    host: "OpenAI",
    line: "Embajador del agente de código de OpenAI: talleres y adopción en equipos de ingeniería.",
  },
  {
    name: "Mistral",
    role: "Ambassador",
    logo: "/logos/mistral.svg",
    host: "Mistral AI",
    line: "Embajador de Mistral AI y sus modelos abiertos, una opción fuerte cuando los datos no pueden salir de casa.",
  },
  {
    name: "Cognition",
    role: "Ambassador",
    logo: "/logos/cognition.svg",
    scale: 1.3,
    host: "Cognition",
    line: "Embajador de Cognition, el equipo detrás de Devin y Windsurf, agentes que escriben software.",
  },
];

export type Job = {
  name: string;
  role: string;
  year: string;
  detail: string;
};

export const experience: Job[] = [
  {
    name: "Cursor",
    role: "Ambassador, El Salvador",
    year: "2025",
    detail: "Comunidad de más de 1K builders en El Salvador.",
  },
  {
    name: "SOUTHWORKS",
    role: "Senior Software Engineer",
    year: "2023",
    detail: "Integración de IA y migraciones cloud en AWS y Azure.",
  },
  {
    name: "Freelance",
    role: "Product Engineer",
    year: "2023",
    detail: "Arquitectura y entrega para clientes internacionales.",
  },
  {
    name: "Ravn",
    role: "Senior Software Developer",
    year: "2023",
    detail: "Migración de servicios de Rust a .NET.",
  },
  {
    name: "Resultier",
    role: "Full Stack Engineer",
    year: "2022",
    detail: "Analítica de salud con modelos de ML.",
  },
  {
    name: "innRoad",
    role: "Full Stack Developer",
    year: "2021",
    detail: "Sistemas de reservas en .NET y React.",
  },
  {
    name: "Elaniin",
    role: "Developer",
    year: "2020",
    detail: "Aplicaciones ASP.NET y Blazor.",
  },
  {
    name: "Vincu Hub",
    role: "Backend Developer",
    year: "2019",
    detail: "APIs con Clean Architecture y CQRS.",
  },
];

export type CommunityEvent = {
  name: string;
  year: string;
  photo: keyof typeof photos;
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

export const photos = {
  portrait: {
    src: "walter-morales",
    alt: "Retrato de Walter Morales, AI Engineer y Co-Founder de Ai Labs",
    width: 864,
    height: 1184,
  },
  hackathon2: {
    src: "cursor-hackathon-2",
    alt: "Asistentes del segundo Cursor Hackathon en San Salvador junto a Walter Morales",
    width: 1600,
    height: 1067,
  },
  meetup: {
    src: "cursor-meetup",
    alt: "Desarrolladores conversando en el Cursor Meetup de San Salvador",
    width: 1280,
    height: 960,
  },
  hackathon: {
    src: "cursor-hackathon",
    alt: "Laptop con la agenda del Cursor Hackathon y tarjeta con código QR",
    width: 768,
    height: 1024,
  },
  cafe1: {
    src: "cafe-cursor-1",
    alt: "Agenda impresa y créditos de Cafe Cursor",
    width: 768,
    height: 1024,
  },
  workshop: {
    src: "cursor-workshop",
    alt: "Participantes del Cursor Workshop escaneando un código QR en pantalla",
    width: 768,
    height: 1024,
  },
  cafe2: {
    src: "cafe-cursor-2",
    alt: "Bolsa de café de especialidad edición Cafe Cursor",
    width: 768,
    height: 1024,
  },
  cafe3: {
    src: "cafe-cursor-3",
    alt: "Walter Morales presentando en Cafe Cursor entre libreros",
    width: 1086,
    height: 724,
  },
} as const;

export type Photo = (typeof photos)[keyof typeof photos];

export const faqs = [
  {
    q: "¿Quién es Walter Morales?",
    a: "Walter Morales es AI Engineer y Co-Founder de Ai Labs, con más de seis años construyendo software. Es Regional Lead de SpaceXAI Ambassadors, Ambassador de Codex, Mistral y Cognition, y lidera una comunidad de más de mil builders en El Salvador con más de 75 eventos y más de tres mil asistentes.",
  },
  {
    q: "¿Qué es Ai Labs?",
    a: "Ai Labs es el estudio de inteligencia artificial cofundado por Walter Morales en El Salvador. Diseña y construye productos con IA para empresas de Latinoamérica: desde la estrategia y los prototipos hasta el software en producción.",
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
] as const;

// /consultor-de-ia only. That page is reachable from search, not from the site's
// navigation, so its questions answer the "consultor de IA" query head on.
export const consultantFaqs = [
  {
    q: "¿Qué hace un consultor de IA?",
    a: "Un consultor de IA encuentra dónde la inteligencia artificial mueve números en tu operación, decide con vos qué herramientas y modelos usar, y acompaña la implementación hasta que funciona en producción. No vende humo: si un caso no conviene, te lo dice.",
  },
  {
    q: "¿Por qué trabajar con un consultor de IA que es embajador de laboratorios de IA?",
    a: "Porque trabaja con las herramientas desde adentro. Walter Morales es Regional Lead de SpaceXAI Ambassadors y Ambassador de Codex (OpenAI), Mistral y Cognition. Prueba los modelos y agentes antes y a fondo, y conoce sus límites reales, no solo los del anuncio.",
  },
  {
    q: "¿Qué tipo de proyectos hace un consultor de IA en El Salvador?",
    a: "Estrategia de IA para dirección, agentes conectados a datos y herramientas internas, funcionalidades con IA dentro de productos web, adopción de agentes de código en equipos de ingeniería y talleres para equipos, universidades y gobierno.",
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
    a: "Sí. Talleres prácticos con proyectos reales de tu empresa, de asistentes a agentes de código. La comunidad que organizo suma más de 75 eventos y más de 3 mil asistentes diferentes, así que el formato está probado.",
  },
  {
    q: "¿Cómo empezamos?",
    a: "Agendá una llamada en wmorales.dev/book y contame qué querés resolver, qué intentaron antes y con qué datos y herramientas cuentan.",
  },
] as const;
