import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from '@/features/profile/components/organisms/profile-form';
import { LearningGoalsForm } from '@/features/profile/components/organisms/learning-goals-form';
import { ProgressDashboard } from '@/features/profile/components/organisms/progress-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Profile" };

// Mock static actions for demo purposes
const updateProfile = async (data: any) => {
  console.log('Profile update:', data);
  // Simulate success
  return Promise.resolve();
};

const updateLearningGoals = async (data: any) => {
  console.log('Learning goals update:', data);
  // Simulate success
  return Promise.resolve();
};

// Mock user stats - in real app, fetch from database
const mockUserStats = {
  streakDays: 7,
  longestStreak: 15,
  totalLessonsCompleted: 23,
  totalWordsLearned: 156,
  totalStudyTime: 480, // 8 hours
  currentLevel: 'intermediate',
  totalPoints: 2450,
  weeklyPoints: 180,
  monthlyPoints: 720,
  level: 3,
  experience: 75,
  experienceToNextLevel: 100,
  dailyGoal: 20,
  weeklyGoal: 140,
  lastPracticeDate: new Date().toISOString(),
};

// Mock today's and week's study time
const todayStudyTime = 15; // minutes
const weekStudyTime = 85; // minutes

export default async function ProfilePage() {
  // Mock static user data for demo
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    age: 25,
    nativeLanguage: 'english',
    targetLanguages: ['spanish', 'french'],
    currentLevel: 'intermediate',
    learningGoal: 'I want to become conversational in Spanish for my upcoming trip to Mexico.',
    bio: 'Language enthusiast from California. Love traveling and meeting new people.',
    country: 'United States',
    timezone: 'PST',
  };

  const learningGoals = {
    dailyGoal: mockUserStats.dailyGoal,
    weeklyGoal: mockUserStats.weeklyGoal,
    learningGoal: user.learningGoal,
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
            userStats={mockUserStats}
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