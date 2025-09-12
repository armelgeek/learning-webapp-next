'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BookOpen, 
  Brain, 
  Target, 
  BarChart3, 
  MessageCircle, 
  Clock,
  Award,
  Smartphone
} from 'lucide-react';

export function HomeFeaturesSection() {
  const features = [
    {
      icon: BookOpen,
      title: 'Interactive Lessons',
      description: 'Engaging lessons with real-world scenarios and practical exercises that adapt to your learning style.',
      color: 'indigo'
    },
    {
      icon: Brain,
      title: 'AI-Powered Learning',
      description: 'Smart algorithms personalize your learning path and identify areas for improvement.',
      color: 'purple'
    },
    {
      icon: Target,
      title: 'Goal-Oriented',
      description: 'Set your learning goals and track your progress with detailed analytics and milestones.',
      color: 'green'
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Visual progress reports and detailed analytics to keep you motivated and on track.',
      color: 'blue'
    },
    {
      icon: MessageCircle,
      title: 'Speaking Practice',
      description: 'Practice pronunciation and conversation skills with AI-powered speech recognition.',
      color: 'orange'
    },
    {
      icon: Clock,
      title: 'Flexible Schedule',
      description: 'Learn at your own pace with lessons that fit your busy lifestyle and schedule.',
      color: 'teal'
    },
    {
      icon: Award,
      title: 'Achievements',
      description: 'Earn badges and certificates as you complete lessons and reach learning milestones.',
      color: 'yellow'
    },
    {
      icon: Smartphone,
      title: 'Mobile Learning',
      description: 'Learn anywhere, anytime with our mobile-optimized platform and offline capability.',
      color: 'pink'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      indigo: 'bg-indigo-100 text-indigo-600',
      purple: 'bg-purple-100 text-purple-600',
      green: 'bg-green-100 text-green-600',
      blue: 'bg-blue-100 text-blue-600',
      orange: 'bg-orange-100 text-orange-600',
      teal: 'bg-teal-100 text-teal-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      pink: 'bg-pink-100 text-pink-600',
    };
    return colorMap[color] || 'bg-gray-100 text-gray-600';
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose LinguaLearn?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform combines cutting-edge technology with proven teaching methods 
            to deliver an exceptional language learning experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-gray-300">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl ${getColorClasses(feature.color)} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}