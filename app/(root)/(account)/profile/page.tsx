import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from '@/features/profile/components/organisms/profile-form';
import { LearningGoalsForm } from '@/features/profile/components/organisms/learning-goals-form';
import { ProgressDashboard } from '@/features/profile/components/organisms/progress-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from '@/auth';
import { db } from '@/drizzle/db';
import { users } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { ProgressService } from '@/features/progress/domain/service';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export const metadata: Metadata = { title: "Profile" };

// Update functions - these would be replaced with actual API calls in a full implementation
const updateProfile = async (data: Record<string, unknown>) => {
  console.log('Profile update:', data);
  // TODO: Implement actual profile update API call
  return Promise.resolve();
};

const updateLearningGoals = async (data: Record<string, unknown>) => {
  console.log('Learning goals update:', data);
  // TODO: Implement actual learning goals update API call
  return Promise.resolve();
};

export default async function ProfilePage() {
  // Get user session
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  // Get user data from database
  const userResult = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      nativeLanguage: users.nativeLanguage,
      targetLanguages: users.targetLanguages,
      currentLevel: users.currentLevel,
      learningGoal: users.learningGoal,
      bio: users.bio,
      country: users.country,
      timezone: users.timezone,
      age: users.age,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!userResult[0]) {
    redirect('/auth/signin');
  }

  const user = userResult[0];

  // Get user stats
  const userStats = await ProgressService.getUserStats(session.user.id);

  // TODO: Progress summary could be used for additional dashboard insights
  // const progressSummary = await ProgressService.getProgressSummary(session.user.id);

  // Prepare stats data with defaults if no stats exist
  const stats = userStats || {
    streakDays: 0,
    longestStreak: 0,
    totalLessonsCompleted: 0,
    totalWordsLearned: 0,
    totalStudyTime: 0,
    currentLevel: 'beginner',
    totalPoints: 0,
    weeklyPoints: 0,
    monthlyPoints: 0,
    level: 1,
    experience: 0,
    experienceToNextLevel: 100,
    dailyGoal: 15,
    weeklyGoal: 105,
    lastPracticeDate: null,
  };

  // Calculate today's study time (placeholder - could be calculated from recent activity)
  const todayStudyTime = Math.min(stats.dailyGoal, 15); // Simulated based on daily goal
  const weekStudyTime = Math.min(stats.weeklyGoal, stats.totalStudyTime); // Simulated

  const learningGoals = {
    dailyGoal: stats.dailyGoal,
    weeklyGoal: stats.weeklyGoal,
    learningGoal: user.learningGoal || '',
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">
          Manage your profile, track your progress, and set your learning goals.
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <ProgressDashboard 
            userStats={stats}
            todayStudyTime={todayStudyTime}
            weekStudyTime={weekStudyTime}
          />
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <ProfileForm 
            user={user}
            onUpdate={updateProfile}
          />
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <LearningGoalsForm 
            goals={learningGoals}
            onUpdate={updateLearningGoals}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-xl text-destructive">Demo Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <h3 className="text-sm font-medium text-blue-900">Profile Demo</h3>
                <p className="text-sm text-blue-700 mt-1">
                  This is a demonstration of the comprehensive profile system for the language learning platform.
                  In the full implementation, this would be connected to a database and authentication system.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}