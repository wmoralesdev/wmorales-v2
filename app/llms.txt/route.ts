import {
  aiLabs,
  events,
  experience,
  faqs,
  person,
  SITE_URL,
  services,
  stats,
} from "@/lib/site";

export const dynamic = "force-static";

// Plain-text profile for LLMs and answer engines (https://llmstxt.org).
export function GET() {
  const body = `# ${person.name}

> ${person.summary}

- Rol: ${person.role} (${person.roleEn})
- Fundador de: ${aiLabs.name} (${aiLabs.wordmark})
- Ubicación: ${person.location}. Trabaja de forma remota con Latinoamérica y Estados Unidos.
- Idiomas: ${person.languages.join(", ")}
- Contacto: ${person.email}
- Agendar una llamada: ${SITE_URL}/book

## Ai Labs

${aiLabs.description}

## Servicios

${services.map((s) => `- ${s.name}: ${s.description}`).join("\n")}

## Datos

${stats.map((s) => `- ${s.value}${s.suffix} ${s.label}`).join("\n")}

## Trayectoria

${experience.map((e) => `- ${e.name} (${e.year}): ${e.detail}`).join("\n")}

## Eventos organizados con la comunidad de Cursor en El Salvador

${events.map((e) => `- ${e.name}, ${e.detail} (${e.year})`).join("\n")}

## Preguntas frecuentes

${faqs.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}

## Enlaces

- Sitio: ${SITE_URL}
- LinkedIn: ${person.social.linkedin}
- GitHub: ${person.social.github}
- X: ${person.social.x}
- Instagram: ${person.social.instagram}
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
