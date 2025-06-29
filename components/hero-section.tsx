"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, Sparkle } from "lucide-react";

export function HeroSection() {
  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-16">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/5 to-transparent"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 50% 10%, rgba(196, 181, 253, 0.1) 0%, transparent 50%)`
          }}
        ></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 opacity-60">
        {/* Large floating particles */}
        <div className="absolute top-20 left-10 w-3 h-3 bg-gradient-to-r from-white to-purple-400 rounded-full animate-float"></div>
        <div className="absolute top-32 right-20 w-2 h-2 bg-gradient-to-r from-purple-300 to-white rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-40 left-20 w-4 h-4 bg-gradient-to-r from-white to-purple-500 rounded-full animate-float-slow"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-gradient-to-r from-purple-400 to-white rounded-full animate-float"></div>
        <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-gradient-to-r from-white to-purple-300 rounded-full animate-float-delayed"></div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gradient-to-r from-purple-500 to-white rounded-full animate-float-slow"></div>

        {/* Additional scattered particles */}
        <div className="absolute top-40 right-40 w-1 h-1 bg-purple-400 rounded-full animate-twinkle"></div>
        <div className="absolute bottom-32 right-32 w-1 h-1 bg-white rounded-full animate-twinkle-delayed"></div>
        <div className="absolute top-60 left-40 w-1 h-1 bg-purple-300 rounded-full animate-twinkle"></div>
        <div className="absolute bottom-60 left-60 w-1 h-1 bg-white rounded-full animate-twinkle-delayed"></div>

        {/* Geometric shapes */}
        <div className="absolute top-28 right-60 w-6 h-6 border border-purple-400/30 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-48 left-32 w-8 h-8 border border-white/20 rotate-12 animate-pulse"></div>
      </div>

      {/* Large Gradient Orbs */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-white/5 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 -right-20 w-80 h-80 bg-gradient-to-l from-white/10 to-purple-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-400/5 to-white/5 rounded-full blur-3xl animate-pulse-slow delay-500"></div>

      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        <div className="">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in-up">
            Hi, I'm{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent animate-gradient-x bg-300% font-bold">
                Walter Morales
              </span>
            </span>
          </h1>
          <div className="flex items-center justify-center gap-2 animate-fade-in-up animate-delay-200">
            <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground">
              Let&apos;s{" "}
              <span className="font-semibold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">build</span>{" "}
              something{" "}
              <span className="font-semibold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">amazing</span>
            </p>
          </div>
        </div>

        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-400">
          <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent font-medium">
            Software Engineer crafting impactful digital solutions.
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-fade-in-up animate-delay-600">
          <Button
            size="lg"
            onClick={scrollToAbout}
            className="text-base px-8 py-6 rounded-full bg-gradient-to-r from-white to-purple-500 text-black hover:from-purple-100 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
          >
            Get to know me
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce animate-fade-in animate-delay-800">
        <ChevronDown className="h-6 w-6 text-purple-400" />
      </div>
    </section>
  );
} 