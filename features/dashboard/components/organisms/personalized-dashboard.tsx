'use client';

import { useEffect, useState } from 'react';
import { LANGUAGES } from '@/features/language/config/language.schema';
import { DashboardServiceClient } from '@/features/progress/domain/client.service';
import { ProgressOverview } from '../molecules/progress-overview';
import { DailyChallenge } from '../molecules/daily-challenge';
import { ModulesInProgress } from '../molecules/modules-in-progress';
import { RecentForumActivity } from '../molecules/recent-forum-activity';
import { RecommendedModules } from '../molecules/recommended-modules';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface PersonalizedDashboardProps {
  userId: string;
  userName: string;
  targetLanguage: string;
}

export function PersonalizedDashboard({ userId, userName, targetLanguage }: PersonalizedDashboardProps) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [recommendedModules, setRecommendedModules] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [dashboardResult, recommendedResult] = await Promise.all([
          DashboardServiceClient.getUserDashboardData(targetLanguage as any),
          DashboardServiceClient.getRecommendedModules(targetLanguage as any),
        ]);

        if (!dashboardResult.success) {
          setError(dashboardResult.error || 'Failed to load dashboard data');
          return;
        }

        setDashboardData(dashboardResult.data);
        setRecommendedModules(recommendedResult.success ? recommendedResult.modules : []);
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('Dashboard error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId && targetLanguage) {
      fetchDashboardData();
    }
  }, [userId, targetLanguage]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-96" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const languageInfo = LANGUAGES[targetLanguage as keyof typeof LANGUAGES];
  const greeting = getTimeBasedGreeting();

  return (
    <div className="space-y-6">
      {/* Personalized Welcome */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting}, {userName}! {languageInfo?.flag}
        </h1>
        <p className="text-muted-foreground">
          Ready to continue your {languageInfo?.name} learning journey?
        </p>
      </div>

      {/* Progress Overview */}
      <ProgressOverview 
        stats={dashboardData.stats}
        completionPercentage={dashboardData.completionPercentage}
        targetLanguage={languageInfo?.name || targetLanguage}
      />

      {/* Main Dashboard Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Daily Challenge */}
        <DailyChallenge challenge={dashboardData.dailyChallenge} />
        
        {/* Modules in Progress */}
        <ModulesInProgress modules={dashboardData.modulesInProgress || []} />
        
        {/* Recommended Modules */}
        <RecommendedModules 
          modules={recommendedModules || []}
          targetLanguage={languageInfo?.name || targetLanguage}
        />
        
        {/* Recent Forum Activity */}
        <RecentForumActivity 
          topics={dashboardData.recentForumTopics || []}
          targetLanguage={languageInfo?.name || targetLanguage}
        />
      </div>
    </div>
  );
}

function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return 'Good morning';
  } else if (hour < 17) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
}