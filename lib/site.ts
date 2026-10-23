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
  role: "Consultor de IA",
  roleEn: "AI Consultant",
  headline: "Consultor de IA y fundador de Ai Labs",
  location: "San Salvador, El Salvador",
  city: "San Salvador",
  country: "El Salvador",
  countryCode: "SV",
  email: "hello@wmorales.dev",
  image: "/photos/walter-morales.jpg",
  summary:
    "Walter Morales es consultor de inteligencia artificial e ingeniero de software en El Salvador, fundador de Ai Labs y Cursor Ambassador para El Salvador. Ayuda a empresas de Latinoamérica y Estados Unidos a llevar la IA a producción: estrategia, agentes, producto y adopción de herramientas como Cursor.",
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
    "Ai Labs es el estudio que Walter Morales fundó en El Salvador para diseñar y construir productos con inteligencia artificial: estrategia, prototipos y software en producción para empresas de Latinoamérica.",
} as const;

export const facts = [
  { label: "Con base en", value: "San Salvador, El Salvador" },
  { label: "Fundador de", value: "Ai Labs" },
  { label: "Comunidad", value: "550+ builders en Cursor SV" },
] as const;

export const stats = [
  { value: 6, suffix: "+", label: "años construyendo software" },
  { value: 550, suffix: "+", label: "builders en la comunidad" },
  { value: 7, suffix: "", label: "eventos organizados" },
  { value: 450, suffix: "+", label: "asistentes presenciales en 2025" },
] as const;

export const services = [
  {
    name: "Estrategia de IA",
    description:
      "Diagnóstico de dónde la IA mueve números en tu operación y un plan priorizado para llegar ahí, sin humo.",
  },
  {
    name: "Agentes y automatización",
    description:
      "Agentes con LLMs conectados a tus datos y herramientas, con evaluación y límites claros desde el primer día.",
  },
  {
    name: "Producto con IA",
    description:
      "Funcionalidades con IA dentro de productos web reales, del prototipo a producción con Next.js y la nube.",
  },
  {
    name: "Adopción de Cursor",
    description:
      "Talleres y acompañamiento para que tu equipo de ingeniería trabaje con agentes de código sin perder calidad.",
  },
  {
    name: "Arquitectura cloud",
    description:
      "Modelos integrados en AWS y Azure, migraciones y sistemas que aguantan carga de verdad.",
  },
  {
    name: "Charlas y talleres",
    description:
      "Workshops para equipos, universidades y comunidades, en español o en inglés.",
  },
] as const;

export type IndexEntry = {
  name: string;
  kind: "Consultoría" | "Ingeniería" | "Comunidad" | "Evento";
  year: string;
  detail: string;
  href?: string;
};

export const experience: IndexEntry[] = [
  {
    name: "Ai Labs",
    kind: "Consultoría",
    year: "Hoy",
    detail: "Fundador. Estrategia y producto con IA.",
  },
  {
    name: "Cursor Ambassador",
    kind: "Comunidad",
    year: "2025",
    detail: "Embajador de Cursor para El Salvador.",
    href: "https://cursor.com",
  },
  {
    name: "SOUTHWORKS",
    kind: "Ingeniería",
    year: "2023",
    detail:
      "Senior Software Engineer. Integración de IA y migraciones cloud en AWS y Azure.",
  },
  {
    name: "Freelance",
    kind: "Consultoría",
    year: "2023",
    detail:
      "Product engineer para clientes internacionales. Arquitectura y entrega.",
  },
  {
    name: "Ravn",
    kind: "Ingeniería",
    year: "2023",
    detail: "Senior Software Developer. Migración de servicios de Rust a .NET.",
  },
  {
    name: "Resultier",
    kind: "Ingeniería",
    year: "2022",
    detail: "Full Stack Engineer. Analítica de salud con modelos de ML.",
  },
  {
    name: "innRoad",
    kind: "Ingeniería",
    year: "2021",
    detail: "Full Stack Developer. Sistemas de reservas en .NET y React.",
  },
  {
    name: "Elaniin",
    kind: "Ingeniería",
    year: "2020",
    detail: "Developer. Aplicaciones ASP.NET y Blazor.",
  },
  {
    name: "Vincu Hub",
    kind: "Ingeniería",
    year: "2019",
    detail: "Backend Developer. APIs con Clean Architecture y CQRS.",
  },
];

export const events: IndexEntry[] = [
  {
    name: "Cursor Hackathon II",
    kind: "Evento",
    year: "2026",
    detail: "San Salvador",
    href: "https://photos.app.goo.gl/qNSHWVYZwThjrUuY9",
  },
  {
    name: "Cafe Cursor III",
    kind: "Evento",
    year: "2025",
    detail: "San Salvador",
    href: "https://photos.app.goo.gl/X4gF3SAVKAG665gb9",
  },
  {
    name: "Cafe Cursor II",
    kind: "Evento",
    year: "2025",
    detail: "San Salvador",
    href: "https://photos.app.goo.gl/AFHgh6CAZzCq6jm79",
  },
  {
    name: "Cursor Workshop",
    kind: "Evento",
    year: "2025",
    detail: "San Salvador",
    href: "https://photos.app.goo.gl/DYiKX3hxjghCak349",
  },
  {
    name: "Cafe Cursor I",
    kind: "Evento",
    year: "2025",
    detail: "San Salvador",
    href: "https://photos.app.goo.gl/WHd8v7hVQ9vBGTvFA",
  },
  {
    name: "Cursor Hackathon",
    kind: "Evento",
    year: "2025",
    detail: "San Salvador",
    href: "https://photos.app.goo.gl/do6sTx3BsPEaNcLQ7",
  },
  {
    name: "Cursor Meetup",
    kind: "Evento",
    year: "2025",
    detail: "San Salvador",
    href: "https://photos.app.goo.gl/hVpWW3GdN2wsqdhN7",
  },
];

export const photos = {
  portrait: {
    src: "walter-morales",
    alt: "Retrato de Walter Morales, consultor de IA y fundador de Ai Labs",
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
    q: "¿Qué hace un consultor de IA?",
    a: "Un consultor de IA identifica dónde la inteligencia artificial genera valor medible en una empresa, define la estrategia y acompaña la implementación: elegir casos de uso, construir agentes o funcionalidades con modelos de lenguaje, integrarlos con los sistemas existentes y entrenar al equipo para usarlos bien.",
  },
  {
    q: "¿Quién es Walter Morales?",
    a: "Walter Morales es un consultor de IA e ingeniero de software de El Salvador con más de seis años de experiencia. Es fundador de Ai Labs, Cursor Ambassador para El Salvador y organizador de una comunidad de más de 550 builders que se reúne en hackathons, talleres y Cafe Cursor.",
  },
  {
    q: "¿Qué es Ai Labs?",
    a: "Ai Labs es el estudio de inteligencia artificial fundado por Walter Morales en El Salvador. Diseña y construye productos con IA para empresas de Latinoamérica: desde la estrategia y los prototipos hasta el software en producción.",
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
