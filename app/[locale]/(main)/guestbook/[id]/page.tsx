import { Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getTicketById } from "@/app/actions/guestbook.actions";
import { UserTicket } from "@/components/guestbook/user-ticket";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createMetadata, siteConfig } from "@/lib/metadata";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const ticket = await getTicketById(id);
  const t = await getTranslations({ locale, namespace: "guestbook" });

  if (!ticket) {
    return createMetadata({
      title: t("ticketNotFound"),
      description: t("ticketNotFoundDescription"),
    });
  }

  const ogImageUrl = `${siteConfig.url}/api/og/ticket/${ticket.id}?locale=${locale}`;
  const title = t("metaTitle", { userName: ticket.userName });
  const description = t("metaDescription", { userName: ticket.userName });

  return createMetadata({
    title,
    description,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: `${siteConfig.url}/guestbook/${ticket.id}`,
      type: "article",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `${siteConfig.url}/guestbook/${ticket.id}`,
    },
  });
}

export default async function TicketPage({ params }: Props) {
  const { locale, id } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  // Get translations
  const t = await getTranslations("guestbook");

  const ticket = await getTicketById(id);

  if (!ticket) {
    notFound();
  }

  return (
    <div className="min-h-[80vh] py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="mb-4 font-bold text-4xl">{t("title")}</h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {t("userTicket", { userName: ticket.userName })}
            </p>
          </div>

          {/* Ticket Display */}
          <div className="animate-fade-in-up">
            <UserTicket
              colors={{
                primary: ticket.primaryColor,
                secondary: ticket.secondaryColor,
                accent: ticket.accentColor,
                background: ticket.backgroundColor,
              }}
              ticketNumber={ticket.ticketNumber}
              user={{
                id: ticket.id,
                name: ticket.userName,
                email: ticket.userEmail,
                avatar_url: ticket.userAvatar || undefined,
                provider: ticket.userProvider,
              }}
            />
          </div>

          {/* Mood Display */}
          {ticket.entry.mood && (
            <Card className="mx-auto max-w-md animate-delay-200 animate-fade-in-up">
              <CardContent className="py-6">
                <p className="text-center text-muted-foreground">
                  {t("mood")}:{" "}
                  <span className="font-medium text-foreground">
                    &quot;{ticket.entry.mood}&quot;
                  </span>
                </p>
              </CardContent>
            </Card>
          )}

          {/* CTA */}
          <div className="animate-delay-400 animate-fade-in-up text-center">
            <Card className="mx-auto max-w-md">
              <CardContent className="py-8">
                <h2 className="mb-4 font-semibold text-xl">
                  {t("createTicket")}
                </h2>
                <p className="mb-6 text-muted-foreground">
                  {t("joinDescription")}
                </p>
                <Link href="/guestbook">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t("generateTicket")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
