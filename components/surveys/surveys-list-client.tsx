"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, BarChart3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

type SurveysListClientProps = {
  surveys: any[];
  error?: string | null;
};

export function SurveysListClient({ surveys, error }: SurveysListClientProps) {
  if (error || !surveys) {
    return (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="py-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-xl">
          <CardContent className="py-8">
            <p className="text-gray-400">
              Failed to load surveys. Please try again later.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (surveys.length === 0) {
    return (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="py-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-xl">
          <CardContent className="py-8">
            <p className="text-gray-400">No active surveys at the moment.</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      animate="visible"
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      initial="hidden"
      variants={containerVariants}
    >
      {surveys.map((survey: any) => (
        <motion.div key={survey.id} variants={cardVariants} whileHover="hover">
          <Card className="h-full border-gray-800 bg-gray-900/80 backdrop-blur-xl transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10">
            <CardHeader>
              <CardTitle className="text-white">{survey.title}</CardTitle>
              <CardDescription className="text-gray-400">
                {survey.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-gray-500 text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <div
                    className={`h-2 w-2 rounded-full ${survey.status === "active" ? "animate-pulse bg-green-500" : "bg-gray-500"}`}
                  />
                  Status: {survey.status}
                </span>
                <span>{new Date(survey.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  asChild
                  className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-700 hover:shadow-purple-500/25"
                >
                  <Link href={`/surveys/${survey.id}/fill`}>
                    Take Survey
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  className="border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
                  size="icon"
                  variant="outline"
                >
                  <Link href={`/surveys/${survey.id}`}>
                    <BarChart3 className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
