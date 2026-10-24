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
    instagram: "https://instagram.com/wmorales.dev",
  },
} as const;

export const aiLabs = {
  name: "Ai Labs",
  wordmark: "Ai /abs",
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
  { value: 550, suffix: "+", label: "builders en la comunidad" },
  { value: 7, suffix: "", label: "eventos organizados" },
  { value: 450, suffix: "+", label: "asistentes presenciales en 2025" },
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
    name: "Adopción de Cursor",
    icon: "cursor",
    description:
      "Talleres y acompañamiento para que tu equipo de ingeniería trabaje con agentes de código sin perder calidad.",
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

export const ambassadorships = [
  { name: "SpaceXAI Ambassadors", role: "Regional Lead" },
  { name: "Codex", role: "Ambassador" },
  { name: "Mistral", role: "Ambassador" },
  { name: "Cognition", role: "Ambassador" },
] as const;

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
    detail: "Comunidad de más de 550 builders y siete eventos.",
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
    a: "Walter Morales es AI Engineer y Co-Founder de Ai Labs, con más de seis años construyendo software. Es Regional Lead de SpaceXAI Ambassadors, Ambassador de Codex, Mistral y Cognition, y organiza una comunidad de más de 550 builders en El Salvador.",
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
