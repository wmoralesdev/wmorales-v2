import {
  Calendar,
  Camera,
  Clock,
  Lightbulb,
  MapPin,
  MessageCircle,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { InnerHero } from "@/components/common/inner-hero";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Hackathon01({ params }: Props) {
  const slug: string = "hackathon-sv-01";

  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("sites.hackathon-01");

  return (
    <div className="min-h-screen">
      <InnerHero
        description={t("description")}
        icon={Sparkles}
        title={t("title")}
      />

      <div className="container mx-auto space-y-12 px-4 py-12">
        {/* Event Info Card */}
        <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Calendar className="h-6 w-6 text-purple-400" />
              {t("eventInfo.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-gray-400 text-sm">Date</p>
                  <p className="font-medium text-white">
                    {t("eventInfo.date")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-gray-400 text-sm">Time</p>
                  <p className="font-medium text-white">
                    {t("eventInfo.time")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-gray-400 text-sm">Location</p>
                  <p className="font-medium text-white">
                    {t("eventInfo.location")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-gray-400 text-sm">Format</p>
                  <p className="font-medium text-white">
                    {t("eventInfo.duration")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="flex items-center gap-3 font-bold text-3xl text-white">
              <Lightbulb className="h-8 w-8 text-yellow-400" />
              {t("theme.title")}
            </h2>
            <p className="text-gray-400 text-lg">{t("theme.subtitle")}</p>
          </div>

          <Card>
            <CardContent className="space-y-6 pt-6">
              <p className="text-gray-300 leading-relaxed">
                {t("theme.description")}
              </p>

              <Alert className="border-blue-500/30 bg-blue-500/10">
                <Lightbulb className="h-4 w-4 text-blue-400" />
                <AlertDescription className="text-blue-200">
                  {t("theme.clarification")}
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h3 className="font-semibold text-white text-xl">
                  {t("theme.examplesTitle")}
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-4">
                    <h4 className="mb-2 flex items-center gap-2 font-semibold text-white">
                      <Zap className="h-4 w-4 text-purple-400" />
                      {t("theme.examples.automation.title")}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {t("theme.examples.automation.description")}
                    </p>
                  </div>
                  <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-4">
                    <h4 className="mb-2 flex items-center gap-2 font-semibold text-white">
                      <Clock className="h-4 w-4 text-purple-400" />
                      {t("theme.examples.optimization.title")}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {t("theme.examples.optimization.description")}
                    </p>
                  </div>
                  <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-4">
                    <h4 className="mb-2 flex items-center gap-2 font-semibold text-white">
                      <Sparkles className="h-4 w-4 text-purple-400" />
                      {t("theme.examples.assistant.title")}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {t("theme.examples.assistant.description")}
                    </p>
                  </div>
                </div>
              </div>

              <Alert className="border-green-500/30 bg-green-500/10">
                <Sparkles className="h-4 w-4 text-green-400" />
                <AlertDescription className="font-medium text-green-200">
                  {t("theme.keyPoint")}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Format & Timeline Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="flex items-center gap-3 font-bold text-3xl text-white">
              <Clock className="h-8 w-8 text-blue-400" />
              {t("format.title")}
            </h2>
            <p className="text-gray-400 text-lg">{t("format.subtitle")}</p>
          </div>

          <Card>
            <CardContent className="space-y-8 pt-6">
              {/* Timeline */}
              <div className="space-y-4">
                <h3 className="font-semibold text-white text-xl">
                  {t("format.timelineTitle")}
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-4">
                    <Badge className="mb-3 border-purple-500/30 bg-purple-500/20 text-purple-300">
                      {t("format.timeline.reception.time")}
                    </Badge>
                    <h4 className="mb-2 font-semibold text-white">
                      {t("format.timeline.reception.title")}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {t("format.timeline.reception.description")}
                    </p>
                  </div>
                  <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
                    <Badge className="mb-3 border-blue-500/30 bg-blue-500/20 text-blue-300">
                      {t("format.timeline.keynote.time")}
                    </Badge>
                    <h4 className="mb-2 font-semibold text-white">
                      {t("format.timeline.keynote.title")}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {t("format.timeline.keynote.description")}
                    </p>
                  </div>
                  <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
                    <Badge className="mb-3 border-green-500/30 bg-green-500/20 text-green-300">
                      {t("format.timeline.start.time")}
                    </Badge>
                    <h4 className="mb-2 font-semibold text-white">
                      {t("format.timeline.start.title")}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {t("format.timeline.start.description")}
                    </p>
                  </div>
                  <div className="rounded-lg border border-orange-500/20 bg-orange-500/10 p-4">
                    <Badge className="mb-3 border-orange-500/30 bg-orange-500/20 text-orange-300">
                      {t("format.timeline.end.time")}
                    </Badge>
                    <h4 className="mb-2 font-semibold text-white">
                      {t("format.timeline.end.title")}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {t("format.timeline.end.description")}
                    </p>
                  </div>
                  <div className="rounded-lg border border-pink-500/20 bg-pink-500/10 p-4">
                    <Badge className="mb-3 border-pink-500/30 bg-pink-500/20 text-pink-300">
                      {t("format.timeline.closing.time")}
                    </Badge>
                    <h4 className="mb-2 font-semibold text-white">
                      {t("format.timeline.closing.title")}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {t("format.timeline.closing.description")}
                    </p>
                  </div>
                </div>
              </div>

              {/* What to Bring */}
              <div className="space-y-4">
                <h3 className="font-semibold text-white text-xl">
                  {t("format.toolsTitle")}
                </h3>
                <p className="text-gray-400">{t("format.toolsDescription")}</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-300">
                    <Zap className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-400" />
                    <span>{t("format.tools.laptop")}</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-400" />
                    <span>{t("format.tools.hotspot")}</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <Zap className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-400" />
                    <span>{t("format.tools.cursor")}</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-400" />
                    <span>{t("format.tools.attitude")}</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prizes & Recognition */}
        <Card className="border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-orange-500/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-400" />
              <div>
                <CardTitle className="text-2xl">
                  {t("evaluation.title")}
                </CardTitle>
                <CardDescription className="mt-1 text-base">
                  {t("evaluation.subtitle")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-yellow-500/30 bg-yellow-500/10">
              <Trophy className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-200">
                {t("evaluation.description")}
              </AlertDescription>
            </Alert>
            <Alert className="border-purple-500/30 bg-purple-500/10">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <AlertDescription className="text-purple-200">
                {t("evaluation.prize")}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Voting Guidelines */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="flex items-center gap-3 font-bold text-3xl text-white">
              <Users className="h-8 w-8 text-purple-400" />
              {t("guidelines.title")}
            </h2>
            <p className="text-gray-400 text-lg">{t("guidelines.subtitle")}</p>
          </div>

          <Card>
            <CardContent className="space-y-8 pt-6">
              {/* Voting Process */}
              <div className="space-y-4">
                <h3 className="font-semibold text-white text-xl">
                  {t("guidelines.votingProcess.title")}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {t("guidelines.votingProcess.description")}
                </p>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 font-bold text-purple-300">
                        1
                      </div>
                      <h4 className="font-semibold text-white">
                        {t(
                          "guidelines.votingProcess.steps.presentations.title"
                        )}
                      </h4>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {t(
                        "guidelines.votingProcess.steps.presentations.description"
                      )}
                    </p>
                  </div>

                  <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 font-bold text-blue-300">
                        2
                      </div>
                      <h4 className="font-semibold text-white">
                        {t("guidelines.votingProcess.steps.voting.title")}
                      </h4>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {t("guidelines.votingProcess.steps.voting.description")}
                    </p>
                  </div>

                  <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 font-bold text-green-300">
                        3
                      </div>
                      <h4 className="font-semibold text-white">
                        {t("guidelines.votingProcess.steps.winners.title")}
                      </h4>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {t("guidelines.votingProcess.steps.winners.description")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Judging Criteria */}
              <div className="space-y-4">
                <h3 className="font-semibold text-white text-xl">
                  {t("guidelines.criteriaTitle")}
                </h3>

                <Alert className="border-orange-500/30 bg-orange-500/10">
                  <Lightbulb className="h-4 w-4 text-orange-400" />
                  <AlertDescription className="font-medium text-orange-200">
                    {t("guidelines.criteriaImportant")}
                  </AlertDescription>
                </Alert>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-semibold text-white">
                        {t("guidelines.criteria.creativity.title")}
                      </h4>
                      <Badge className="border-purple-500/30 bg-purple-500/20 text-purple-300">
                        {t("guidelines.criteria.creativity.priority")}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {t("guidelines.criteria.creativity.description")}
                    </p>
                  </div>

                  <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-semibold text-white">
                        {t("guidelines.criteria.cursorUsage.title")}
                      </h4>
                      <Badge className="border-purple-500/30 bg-purple-500/20 text-purple-300">
                        {t("guidelines.criteria.cursorUsage.priority")}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {t("guidelines.criteria.cursorUsage.description")}
                    </p>
                  </div>

                  <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-semibold text-white">
                        {t("guidelines.criteria.impact.title")}
                      </h4>
                      <Badge className="border-blue-500/30 bg-blue-500/20 text-blue-300">
                        {t("guidelines.criteria.impact.priority")}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {t("guidelines.criteria.impact.description")}
                    </p>
                  </div>

                  <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-semibold text-white">
                        {t("guidelines.criteria.presentation.title")}
                      </h4>
                      <Badge className="border-blue-500/30 bg-blue-500/20 text-blue-300">
                        {t("guidelines.criteria.presentation.priority")}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {t("guidelines.criteria.presentation.description")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community CTAs */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* WhatsApp Community */}
          <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <MessageCircle className="h-6 w-6 text-green-400" />
                {t("cta.title")}
              </CardTitle>
              <CardDescription className="text-base">
                {t("cta.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-400" />
                  <p className="text-gray-300 text-sm">{t("cta.updates")}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-400" />
                  <p className="text-gray-300 text-sm">{t("cta.context")}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-400" />
                  <p className="text-gray-300 text-sm">{t("cta.community")}</p>
                </div>
              </div>

              <a
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-medium text-white transition-colors hover:bg-green-600 sm:w-auto"
                href="https://wmorales.dev/r/whatsapp-community"
                rel="noopener noreferrer"
                target="_blank"
              >
                <MessageCircle className="h-5 w-5" />
                {t("cta.button")}
              </a>
            </CardContent>
          </Card>

          {/* Additional Platform - TBD */}
          <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Camera className="h-6 w-6 text-purple-400" />
                {t("camera.title")}
              </CardTitle>
              <CardDescription className="text-base">
                {t("camera.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400" />
                  <p className="text-gray-300 text-sm">
                    {t("camera.updates01")}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400" />
                  <p className="text-gray-300 text-sm">
                    {t("camera.updates02")}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400" />
                  <p className="text-gray-300 text-sm">
                    {t("camera.updates03")}
                  </p>
                </div>
              </div>

              <Link
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-purple-500 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-600 sm:w-auto"
                // biome-ignore lint/suspicious/noExplicitAny: Template literal URL type assertion
                href={`/events/${slug}` as any}
              >
                <Camera className="h-5 w-5" />
                {t("camera.button")}
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
