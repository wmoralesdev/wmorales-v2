import { notFound } from "next/navigation";
import { Deck } from "@/components/slides";
import { listDeckSlugs, loadDeck } from "@/lib/slides";

export const dynamicParams = false;

interface PageProps {
  params: Promise<{ deck: string }>;
}

export async function generateStaticParams() {
  const slugs = listDeckSlugs();
  return slugs.map((deck) => ({ deck }));
}

/**
 * Print page renders all slides stacked with page breaks.
 * This page is used as the source for PDF generation.
 *
 * The page has no navigation or chrome - just slides.
 * CSS handles page breaks between slides.
 */
export default async function DeckPrintPage({ params }: PageProps) {
  const { deck: deckSlug } = await params;
  const result = loadDeck(deckSlug);

  if (!result.success) {
    notFound();
  }

  const { presentation } = result;

  return (
    <>
      {/* Print-specific styles */}
      <style
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Print CSS must be inline
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page {
                size: 13.333in 7.5in;
                margin: 0;
              }
              
              html, body {
                margin: 0;
                padding: 0;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
            
            /* Print mode container */
            .print-slides {
              width: 13.333in;
              margin: 0 auto;
            }
            
            @media screen {
              .print-slides {
                max-width: 100%;
              }
            }
          `,
        }}
      />

      <div className="print-slides">
        <Deck presentation={presentation} printMode />
      </div>
    </>
  );
}
