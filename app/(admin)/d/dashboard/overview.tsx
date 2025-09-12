'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import { BookOpen, Users, Award, MessageSquare, AlertCircle } from 'lucide-react';
import { ContentGenerator } from '@/features/generators/components/organisms/content-generator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AdminStats {
  totalLessons: number;
  activeUsers: number;
  totalAchievements: number;
  totalForumPosts: number;
  totalUsers: number;
  lessonsCompleted: number;
  recentUsers: number;
  languageDistribution: Array<{ language: string; count: number }>;
  lessonTypeDistribution: Array<{ type: string; count: number }>;
}

export default function Overview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/v1/admin/stats');
        
        if (!response.ok) {
          throw new Error('Failed to fetch admin statistics');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setStats(data.stats);
        } else {
          setError('Failed to load statistics');
        }
      } catch (err) {
        setError('An error occurred while loading statistics');
        console.error('Error fetching admin stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <div className='flex flex-col space-y-2'>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className='gap-4 grid md:grid-cols-2 lg:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className='gap-4 grid md:grid-cols-2 lg:grid-cols-7'>
          <Skeleton className="col-span-4 h-64" />
          <Skeleton className="col-span-3 h-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-4'>
        <div className='flex flex-col space-y-2'>
          <h1 className="font-bold text-3xl tracking-tight scroll-m-20">Admin Dashboard</h1>
          <p className="mb-2 text-muted-foreground text-sm md:text-base">
            Manage your language learning platform and generate dynamic content.
          </p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

    return (
        <div className='space-y-4'>
            <div className='flex flex-col space-y-2'>
                <h1 className="font-bold text-3xl tracking-tight scroll-m-20">Admin Dashboard</h1>
                <p className="mb-2 text-muted-foreground text-sm md:text-base">
                    Manage your language learning platform and generate dynamic content.
                </p>
            </div>

            <div className='gap-4 grid md:grid-cols-2 lg:grid-cols-4'>
                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
                        <CardTitle className='font-medium text-sm'>Total Lessons</CardTitle>
                        <BookOpen className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className='font-bold text-primary text-2xl'>
                            {stats.totalLessons.toLocaleString()}
                        </div>
                        <p className="mt-1 text-muted-foreground text-xs">Lessons across all languages</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
                        <CardTitle className='font-medium text-sm'>Active Users</CardTitle>
                        <Users className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className='font-bold text-primary text-2xl'>
                            {stats.activeUsers.toLocaleString()}
                        </div>
                        <p className="mt-1 text-muted-foreground text-xs">
                          Active in last 30 days ({stats.totalUsers.toLocaleString()} total)
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
                        <CardTitle className='font-medium text-sm'>Achievements</CardTitle>
                        <Award className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className='font-bold text-primary text-2xl'>
                            {stats.totalAchievements.toLocaleString()}
                        </div>
                        <p className="mt-1 text-muted-foreground text-xs">Badges and achievements available</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
                        <CardTitle className='font-medium text-sm'>Forum Posts</CardTitle>
                        <MessageSquare className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className='font-bold text-primary text-2xl'>
                            {stats.totalForumPosts.toLocaleString()}
                        </div>
                        <p className="mt-1 text-muted-foreground text-xs">Community discussions</p>
                    </CardContent>
                </Card>
            </div>

            <div className='gap-4 grid md:grid-cols-2 lg:grid-cols-7'>
                <Card className='col-span-4 shadow-sm hover:shadow-md transition-shadow duration-200'>
                    <CardHeader>
                        <CardTitle>Learning Analytics</CardTitle>
                        <CardDescription>User engagement and learning progress over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Language Distribution</h4>
                              <div className="space-y-2">
                                {stats.languageDistribution.slice(0, 5).map((lang) => (
                                  <div key={lang.language} className="flex justify-between items-center">
                                    <span className="text-sm capitalize">{lang.language}</span>
                                    <span className="text-sm font-medium">{lang.count}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Lesson Types</h4>
                              <div className="space-y-2">
                                {stats.lessonTypeDistribution.slice(0, 5).map((type) => (
                                  <div key={type.type} className="flex justify-between items-center">
                                    <span className="text-sm capitalize">{type.type}</span>
                                    <span className="text-sm font-medium">{type.count}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="pt-2 border-t">
                            <p className="text-xs text-muted-foreground">
                              📈 {stats.lessonsCompleted.toLocaleString()} lessons completed • 
                              ✨ {stats.recentUsers} new users this week
                            </p>
                          </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card className='col-span-3 shadow-sm hover:shadow-md transition-shadow duration-200'>
                    <CardContent className="p-0">
                        <ContentGenerator />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}