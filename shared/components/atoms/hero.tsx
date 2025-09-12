

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Award, TrendingUp } from "lucide-react";

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  imageUrl?: string;
  className?: string;
}

const Hero: React.FC<HeroProps> = ({
  title = "Master Any Language with Interactive Learning",
  subtitle = "Join thousands of learners worldwide in an engaging, personalized language learning experience. Track your progress, practice with interactive lessons, and achieve fluency faster.",
  ctaText = "Start Learning Free",
  ctaHref = "/register",
  className = "",
}) => {
  return (
    <section
      className={`w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16 md:py-24 ${className}`}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left side - Content */}
          <div className="flex-1 max-w-2xl">
            <div className="mb-6">
              <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                🚀 Now with AI-powered lessons
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {title}
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              {subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3">
                <Link href={ctaHref}>{ctaText}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-3">
                <Link href="/lessons">Browse Lessons</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full mx-auto mb-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Active Learners</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mx-auto mb-2">
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">1000+</div>
                <div className="text-sm text-gray-600">Lessons</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mx-auto mb-2">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">8</div>
                <div className="text-sm text-gray-600">Languages</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full mx-auto mb-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">95%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right side - Visual */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              {/* Language cards floating effect */}
              <div className="grid grid-cols-2 gap-4 transform rotate-3">
                <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-100">
                  <div className="text-4xl mb-2">🇪🇸</div>
                  <div className="font-semibold text-gray-900">Spanish</div>
                  <div className="text-sm text-gray-600">¡Hola mundo!</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-100 mt-8">
                  <div className="text-4xl mb-2">🇫🇷</div>
                  <div className="font-semibold text-gray-900">French</div>
                  <div className="text-sm text-gray-600">Bonjour le monde!</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-100 -mt-4">
                  <div className="text-4xl mb-2">🇩🇪</div>
                  <div className="font-semibold text-gray-900">German</div>
                  <div className="text-sm text-gray-600">Hallo Welt!</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-100 mt-4">
                  <div className="text-4xl mb-2">🇯🇵</div>
                  <div className="font-semibold text-gray-900">Japanese</div>
                  <div className="text-sm text-gray-600">こんにちは世界!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

};

export default Hero;

