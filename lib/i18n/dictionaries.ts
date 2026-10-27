import type { Locale } from "@/lib/i18n/config";

// Interface copy: headings, buttons, labels and page metadata. Facts about Walter
// (jobs, services, FAQs) live next to each other in lib/site.ts.

const es = {
  lang: "es" as Locale,
  skip: "Saltar al contenido",
  bookCall: "Agendar llamada",
  backHome: "Volver al inicio",
  logo: (name: string) => `Logotipo de ${name}`,

  meta: {
    // The Spanish role goes in the title because that's what people type ("ingeniero
    // de IA"); the English one stays in the description and on the page.
    title: "Walter Morales · Ingeniero de IA y cofundador de Ai Labs",
    // "Consultoría de IA" is a query we want to rank for; it lives here and in the
    // JSON-LD service nodes, never as Walter's visible title. Kept under ~155
    // characters so Google doesn't cut it.
    description:
      "Walter Morales, AI Engineer y cofundador de Ai Labs en El Salvador. Consultoría de IA, agentes y producto para empresas de Latinoamérica y EE. UU.",
    ogNote: "Co-Founder de Ai Labs",
    home: "Inicio",
  },

  hero: {
    tagline:
      "AI Engineer y Co-Founder de Ai Labs. Llevo la inteligencia artificial a producción en empresas de Latinoamérica.",
    portrait: "Retrato de Walter Morales impreso en puntos de semitono",
  },

  about: {
    title: "Quién soy",
    // Short on purpose: the facts column already lists the ambassador programs.
    intro:
      "Cofundé Ai Labs para que las empresas pasen de probar la IA a operarla. Llevo más de seis años construyendo software.",
    tools: "Con IA",
    notes: {
      code: "Agentes de código",
      autonomous: "Agentes autónomos",
      models: "Modelos",
      open: "Modelos abiertos",
      bots: "Modelos y bots",
      voice: "Voz",
    },
    more: "Y más",
    stackLabel: "Stack:",
    stack:
      "TypeScript con Next.js y React, y .NET, sobre PostgreSQL en AWS y Azure.",
  },

  services: { title: "Qué hago" },

  experience: { title: "Experiencia", now: "Ahora", before: "Antes" },

  community: {
    title: "Comunidad",
    album: (name: string, year: string) =>
      `${name}, ${year}: ver álbum de fotos`,
  },

  faq: { title: "Preguntas frecuentes" },

  cta: {
    lead: "Agendá una llamada. Salís con un diagnóstico inicial y próximos pasos claros para tu equipo.",
    title: "Hablemos",
  },

  footer: {
    contact: "Contacto",
    site: "Sitio",
    social: "Redes",
    from: "Desde",
    experience: "Experiencia",
    intro: "Tarjeta de presentación",
    remote: "Remoto para Latinoamérica y EE. UU.",
    role: "Co-Founder de Ai Labs",
    language: "English",
  },

  tools: {
    title: "Tools",
    close: "Cerrar",
    theme: "Tema",
    themes: { light: "Claro", dark: "Oscuro", system: "Sistema" },
    language: "Idioma",
    shortcuts: "Accesos rápidos",
    home: "Inicio",
    book: "Agendar llamada",
    intro: "Tarjeta de presentación",
  },

  book: {
    title: "Agendar una llamada",
    description:
      "Reservá una llamada con Walter Morales, AI Engineer y Co-Founder de Ai Labs. Contame tu caso y salí con un diagnóstico inicial y próximos pasos claros.",
    heading: ["Agendá una", "llamada"],
    lead: "Hablemos de dónde la IA te puede ahorrar tiempo o dinero. Sin compromiso y en español o inglés.",
    steps: [
      {
        title: "Elegí un horario",
        body: "El calendario muestra mi disponibilidad en tu zona horaria. Recibís la invitación por correo.",
      },
      {
        title: "Contame tu contexto",
        body: "Qué querés resolver con IA, qué intentaron antes y qué datos o herramientas ya tienen.",
      },
      {
        title: "Salí con un plan",
        body: "Un diagnóstico inicial y próximos pasos. Si hay fit, te preparo una propuesta.",
      },
    ],
    write: "¿Preferís escribir?",
    ogNote: "wmorales.dev/book",
    frame: {
      available: "Horarios disponibles",
      localTime: "Hora local automática",
      iframe: "Calendario para agendar una llamada con Walter Morales",
      loading: "Cargando horarios…",
      fallback: "¿No carga? Abrí el calendario en una pestaña nueva",
    },
  },

  consultant: {
    title: "Consultor de IA en El Salvador",
    description:
      "Consultoría de IA en El Salvador con Walter Morales, embajador de SpaceXAI, Codex, Mistral y Cognition. Estrategia, agentes y capacitación para empresas.",
    heading: ["Consultor de IA", "en El Salvador"],
    lead: "Trabajo con empresas de El Salvador, Latinoamérica y Estados Unidos que ya probaron la inteligencia artificial y ahora necesitan que funcione en serio. Estrategia, agentes y capacitación, de alguien que es embajador de SpaceXAI, Codex, Mistral y Cognition.",
    ambassadorTitle: "Embajador de los laboratorios que construyen la IA",
    ambassadorBody:
      "Un consultor de IA que solo lee anuncios llega tarde. Yo uso estos modelos y agentes cada semana con equipos reales, así que sé dónde fallan antes de recomendarlos.",
    communityNote:
      "Todo empezó en 2025, cuando me nombraron Cursor Ambassador en El Salvador. Esa comunidad hoy reúne a más de mil builders en talleres, hackathons y meetups.",
    figures: "Comunidad en números",
    servicesTitle: "Qué incluye la consultoría de IA",
    processTitle: "Cómo es trabajar conmigo",
    steps: [
      {
        title: "Llamada inicial",
        body: "Me contás qué querés resolver, qué intentaron antes y con qué datos cuentan. Sin costo.",
      },
      {
        title: "Diagnóstico",
        body: "Qué procesos ganan más con IA, ordenados por valor y esfuerzo.",
      },
      {
        title: "Propuesta",
        body: "Alcance, tiempos y entregables cerrados antes de empezar.",
      },
      {
        title: "Implementación",
        body: "Agentes, producto o adopción en tu equipo, medidos contra el objetivo del diagnóstico.",
      },
    ],
    buildTitle: "Cuando hay que construir",
    buildBody: (studio: string) =>
      `Si el proyecto pide producto y no solo estrategia, lo ejecutamos con ${studio}, el estudio de IA que cofundé en El Salvador: del prototipo al software en producción, con el mismo equipo que hizo el diagnóstico.`,
    buildLink: (studio: string) => `Conocé ${studio}`,
    faqTitle: "Preguntas sobre consultoría de IA",
    serviceName: "Consultoría de IA",
    serviceType: "Consultor de inteligencia artificial",
  },

  intro: {
    description:
      "Walter Morales: Ai Labs, MediConecto, programas de embajador y todas las formas de contacto. Guardá su contacto o agendá una llamada.",
    ogNote: "Ai Labs · MediConecto · Embajador",
    qr: {
      site: "Sitio",
      book: "Agendar",
      contact: "Contacto",
      contactCaption: "Guarda mi contacto en tu teléfono",
    },
    headline: "AI Engineer y Co-Founder de Ai Labs.",
    portrait: "Retrato de Walter Morales impreso en puntos de semitono",
    blurb:
      "Llevo la inteligencia artificial a producción en empresas de Latinoamérica, y organizo una comunidad de builders en El Salvador.",
    bookCall: "Agendar una llamada",
    save: "Guardar contacto",
    share: "Compartir",
    copied: "Link copiado",
    now: "Ahora",
    ambassador: "Embajador",
    developer: "Como developer",
    devStats: ["años en software", "builders", "eventos"],
    github: "Ver código en GitHub",
    scan: "Escaneá",
    qrTabs: "Qué abre el código",
    qrCode: "Código QR",
    links: "Links",
    site: "Sitio",
    email: "Correo",
  },

  notFound: {
    body: "Esta página no existe. Lo que buscás probablemente está en el inicio.",
    cta: "Ir al inicio",
  },

  schema: {
    bookPage: "Agendá una llamada con Walter Morales",
    bookCrumb: "Agendar",
    reserve: "Agendar una llamada",
    catalog: "Servicios de consultoría de IA",
    regions: ["Latinoamérica", "Estados Unidos"],
  },
};

export type Dictionary = typeof es;

const en: Dictionary = {
  lang: "en",
  skip: "Skip to content",
  bookCall: "Book a call",
  backHome: "Back to home",
  logo: (name) => `${name} logo`,

  meta: {
    title: "Walter Morales · AI Engineer and Co-Founder of Ai Labs",
    description:
      "Walter Morales, AI Engineer and Co-Founder of Ai Labs in El Salvador. AI consulting, agents and product for companies in Latin America and the US.",
    ogNote: "Co-Founder of Ai Labs",
    home: "Home",
  },

  hero: {
    tagline:
      "AI Engineer and Co-Founder of Ai Labs. I take AI into production for companies across Latin America.",
    portrait: "Portrait of Walter Morales printed in halftone dots",
  },

  about: {
    title: "About me",
    intro:
      "I co-founded Ai Labs so companies can stop experimenting with AI and start running it. I've been building software for more than six years.",
    tools: "With AI",
    notes: {
      code: "Coding agents",
      autonomous: "Autonomous agents",
      models: "Models",
      open: "Open models",
      bots: "Models and bots",
      voice: "Voice",
    },
    more: "And more",
    stackLabel: "Stack:",
    stack:
      "TypeScript with Next.js and React, plus .NET, on PostgreSQL in AWS and Azure.",
  },

  services: { title: "What I do" },

  experience: { title: "Experience", now: "Now", before: "Before" },

  community: {
    title: "Community",
    album: (name, year) => `${name}, ${year}: view photo album`,
  },

  faq: { title: "FAQ" },

  cta: {
    lead: "Book a call. You'll leave with a first diagnosis and clear next steps for your team.",
    title: "Let's talk",
  },

  footer: {
    contact: "Contact",
    site: "Site",
    social: "Social",
    from: "From",
    experience: "Experience",
    intro: "Business card",
    remote: "Remote for Latin America and the US",
    role: "Co-Founder of Ai Labs",
    language: "Español",
  },

  tools: {
    title: "Tools",
    close: "Close",
    theme: "Theme",
    themes: { light: "Light", dark: "Dark", system: "System" },
    language: "Language",
    shortcuts: "Shortcuts",
    home: "Home",
    book: "Book a call",
    intro: "Business card",
  },

  book: {
    title: "Book a call",
    description:
      "Book a call with Walter Morales, AI Engineer and Co-Founder of Ai Labs. Tell me about your case and leave with a first diagnosis and clear next steps.",
    heading: ["Book a", "call"],
    lead: "Let's talk about where AI can save you time or money. No commitment, in English or Spanish.",
    steps: [
      {
        title: "Pick a time",
        body: "The calendar shows my availability in your time zone. The invite lands in your inbox.",
      },
      {
        title: "Tell me the context",
        body: "What you want to solve with AI, what you've tried, and what data or tools you already have.",
      },
      {
        title: "Leave with a plan",
        body: "A first diagnosis and next steps. If it's a fit, I'll put together a proposal.",
      },
    ],
    write: "Rather write?",
    ogNote: "wmorales.dev/en/book",
    frame: {
      available: "Available times",
      localTime: "Shown in your local time",
      iframe: "Calendar to book a call with Walter Morales",
      loading: "Loading times…",
      fallback: "Not loading? Open the calendar in a new tab",
    },
  },

  consultant: {
    title: "AI Consultant in El Salvador",
    description:
      "AI consulting in El Salvador with Walter Morales, ambassador for SpaceXAI, Codex, Mistral and Cognition. Strategy, agents and team training.",
    heading: ["AI consultant", "in El Salvador"],
    lead: "I work with companies in El Salvador, Latin America and the US that have already tried AI and now need it to actually work. Strategy, agents and training, from someone who's an ambassador for SpaceXAI, Codex, Mistral and Cognition.",
    ambassadorTitle: "Ambassador for the labs building AI",
    ambassadorBody:
      "An AI consultant who only reads launch posts is always late. I use these models and agents every week with real teams, so I know where they break before I recommend them.",
    communityNote:
      "It started in 2025, when I was named Cursor Ambassador for El Salvador. That community now brings together more than a thousand builders at workshops, hackathons and meetups.",
    figures: "Community in numbers",
    servicesTitle: "What AI consulting includes",
    processTitle: "How working with me goes",
    steps: [
      {
        title: "First call",
        body: "You tell me what you want to solve, what you've tried and what data you have. Free.",
      },
      {
        title: "Diagnosis",
        body: "Which processes gain the most from AI, ranked by value and effort.",
      },
      {
        title: "Proposal",
        body: "Scope, timeline and deliverables locked before work starts.",
      },
      {
        title: "Delivery",
        body: "Agents, product or team adoption, measured against the goal set in the diagnosis.",
      },
    ],
    buildTitle: "When it needs building",
    buildBody: (studio) =>
      `If the project needs product and not just strategy, we build it with ${studio}, the AI studio I co-founded in El Salvador: from prototype to production software, with the same team that ran the diagnosis.`,
    buildLink: (studio) => `Visit ${studio}`,
    faqTitle: "Questions about AI consulting",
    serviceName: "AI consulting",
    serviceType: "Artificial intelligence consultant",
  },

  intro: {
    description:
      "Walter Morales: Ai Labs, MediConecto, ambassador programs and every way to get in touch. Save his contact or book a call.",
    ogNote: "Ai Labs · MediConecto · Ambassador",
    qr: {
      site: "Site",
      book: "Book",
      contact: "Contact",
      contactCaption: "Save my contact to your phone",
    },
    headline: "AI Engineer and Co-Founder of Ai Labs.",
    portrait: "Portrait of Walter Morales printed in halftone dots",
    blurb:
      "I take AI into production for companies across Latin America, and I run a builder community in El Salvador.",
    bookCall: "Book a call",
    save: "Save contact",
    share: "Share",
    copied: "Link copied",
    now: "Now",
    ambassador: "Ambassador",
    developer: "As a developer",
    devStats: ["years in software", "builders", "events"],
    github: "See code on GitHub",
    scan: "Scan",
    qrTabs: "What the code opens",
    qrCode: "QR code",
    links: "Links",
    site: "Site",
    email: "Email",
  },

  notFound: {
    body: "This page doesn't exist. Whatever you're looking for is probably on the home page.",
    cta: "Go home",
  },

  schema: {
    bookPage: "Book a call with Walter Morales",
    bookCrumb: "Book",
    reserve: "Book a call",
    catalog: "AI consulting services",
    regions: ["Latin America", "United States"],
  },
};

export const dictionaries: Record<Locale, Dictionary> = { es, en };
