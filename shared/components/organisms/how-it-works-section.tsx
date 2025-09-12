'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, Settings, BookOpen, Trophy } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      icon: UserPlus,
      title: 'Sign Up & Assessment',
      description: 'Create your account and take a quick assessment to determine your current language level.',
      step: '01'
    },
    {
      icon: Settings,
      title: 'Personalize Your Learning',
      description: 'Choose your native language, target language, and set your learning goals and schedule.',
      step: '02'
    },
    {
      icon: BookOpen,
      title: 'Start Learning',
      description: 'Begin with interactive lessons tailored to your level and progress at your own pace.',
      step: '03'
    },
    {
      icon: Trophy,
      title: 'Track & Achieve',
      description: 'Monitor your progress, earn achievements, and celebrate your language learning milestones.',
      step: '04'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started with your language learning journey in just a few simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-indigo-300 to-transparent transform translate-x-4 z-0" />
              )}
              
              <Card className="relative z-10 group hover:shadow-lg transition-all duration-300 border-gray-200">
                <CardContent className="p-6 text-center">
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 mt-4 group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-8 h-8" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">
            Ready to start your language learning journey?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Get Started Free
            </a>
            <a
              href="/about"
              className="inline-flex items-center justify-center border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}