'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Marketing Manager',
      image: '/avatars/sarah.jpg',
      language: 'Spanish',
      rating: 5,
      text: 'LinguaLearn has transformed my Spanish learning experience. The interactive lessons and AI feedback make it feel like having a personal tutor available 24/7.',
      flag: '🇪🇸'
    },
    {
      name: 'Marco Rodriguez',
      role: 'Software Developer',
      image: '/avatars/marco.jpg',
      language: 'Japanese',
      rating: 5,
      text: 'As a busy developer, I love how I can learn Japanese during my commute. The mobile app is fantastic and the progress tracking keeps me motivated.',
      flag: '🇯🇵'
    },
    {
      name: 'Emma Thompson',
      role: 'Teacher',
      image: '/avatars/emma.jpg',
      language: 'French',
      rating: 5,
      text: 'The pronunciation practice feature is incredible. I finally feel confident speaking French after just 3 months of using LinguaLearn.',
      flag: '🇫🇷'
    },
    {
      name: 'Ahmed Hassan',
      role: 'Business Owner',
      image: '/avatars/ahmed.jpg',
      language: 'German',
      rating: 5,
      text: 'LinguaLearn helped me learn German for my business expansion. The business-focused lessons were exactly what I needed.',
      flag: '🇩🇪'
    },
    {
      name: 'Lisa Park',
      role: 'Student',
      image: '/avatars/lisa.jpg',
      language: 'Italian',
      rating: 5,
      text: 'I love the gamification aspect! Earning badges and completing challenges makes learning Italian so much fun and engaging.',
      flag: '🇮🇹'
    },
    {
      name: 'James Wilson',
      role: 'Traveler',
      image: '/avatars/james.jpg',
      language: 'Portuguese',
      rating: 5,
      text: 'Perfect for travel preparation! I learned enough Portuguese to confidently navigate my trip to Brazil. Highly recommended!',
      flag: '🇵🇹'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Learners Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of successful language learners who have achieved their goals with LinguaLearn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-gray-200">
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* User info */}
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl">{testimonial.flag}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats section */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">50K+</div>
              <div className="text-gray-600">Active Learners</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">4.9/5</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">2M+</div>
              <div className="text-gray-600">Lessons Completed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}