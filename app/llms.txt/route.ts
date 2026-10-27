import {
  aiLabs,
  ambassadorships,
  events,
  experience,
  faqs,
  mediconecto,
  person,
  SITE_URL,
  services,
  stats,
} from "@/lib/site";

export const dynamic = "force-static";

// Plain-text profile for LLMs and answer engines (https://llmstxt.org). Spanish
// first, like the site, with an English summary at the end.
export function GET() {
  const body = `# ${person.name}

> ${person.summary.es}

- Roles: ${person.roles.es.join(", ")}
- Co-Founder de: ${aiLabs.name} (${aiLabs.wordmark})
- Ubicación: ${person.location}. Trabaja de forma remota con Latinoamérica y Estados Unidos.
- Idiomas: ${person.languages.join(", ")}
- Contacto: ${person.email}
- Agendar una llamada: ${SITE_URL}/book

## Ai Labs

${aiLabs.description.es}

## Servicios

${services.map((s) => `- ${s.name.es}: ${s.description.es}`).join("\n")}

## Datos

${stats.map((s) => `- ${s.value}${s.suffix} ${s.label.es}`).join("\n")}

## Trayectoria

- ${aiLabs.name}, Co-Founder (hoy): ${aiLabs.line.es}
- ${mediconecto.name}, ${mediconecto.role} (hoy): ${mediconecto.line.es} ${mediconecto.url}
${ambassadorships.map((a) => `- ${a.name}, ${a.role} (hoy)`).join("\n")}
${experience.map((e) => `- ${e.name}, ${e.role} (${e.year}): ${e.detail.es}`).join("\n")}

## Eventos destacados de la comunidad de Cursor en El Salvador

${events.map((e) => `- ${e.name}, San Salvador (${e.year}): ${e.href}`).join("\n")}

## Preguntas frecuentes

${faqs.es.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}

## Enlaces

- Sitio: ${SITE_URL}
- English: ${SITE_URL}/en
- LinkedIn: ${person.social.linkedin}
- GitHub: ${person.social.github}
- X: ${person.social.x}
- Instagram: ${person.social.instagram}

## English

${person.summary.en}

${services.map((s) => `- ${s.name.en}: ${s.description.en}`).join("\n")}

- Book a call: ${SITE_URL}/en/book
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
