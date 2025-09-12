'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LANGUAGES } from '@/features/language/config/language.schema';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function LanguagesSection() {
  const languageEntries = Object.entries(LANGUAGES);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Language
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive language courses designed for learners of all levels
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {languageEntries.map(([key, language]) => (
            <Card 
              key={key}
              className="group hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-indigo-300 cursor-pointer transform hover:-translate-y-1"
            >
              <CardContent className="p-6 text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {language.flag}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {language.name}
                </h3>
                <div className="text-sm text-gray-600 mb-4">
                  Learn {language.name} from scratch or improve your skills
                </div>
                <div className="flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full" />
                  ))}
                  <span className="text-xs text-gray-500 ml-2">4.9</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Language features */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Each Language Includes:
              </h3>
              <ul className="space-y-3">
                {[
                  'Interactive lessons with native speaker audio',
                  'Grammar explanations and practice exercises',
                  'Vocabulary building with spaced repetition',
                  'Cultural context and real-world scenarios',
                  'Speaking practice with AI pronunciation feedback',
                  'Progress tracking and achievement system'
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="text-center lg:text-right">
              <div className="inline-block p-8 bg-white rounded-2xl shadow-lg">
                <div className="text-4xl mb-4">🎯</div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  Start Your Journey
                </div>
                <div className="text-gray-600 mb-6">
                  Choose your target language and begin learning today
                </div>
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Link href="/register">
                    Start Learning Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}