'use client';

import { useSession } from '@/auth-client';
import { useUserLanguagePreferences } from '@/features/language/hooks/use-language-preferences';
import { LanguageSelectionForm } from '@/features/language/components/organisms/language-selection-form';
import { PersonalizedDashboard } from '@/features/dashboard/components/organisms/personalized-dashboard';
import Hero from '@/shared/components/atoms/hero';
import { HomeFeaturesSection } from '@/shared/components/organisms/home-features-section';
import { HowItWorksSection } from '@/shared/components/organisms/how-it-works-section';
import { LanguagesSection } from '@/shared/components/organisms/languages-section';
import { TestimonialsSection } from '@/shared/components/organisms/testimonials-section';
import NewsLetter from '@/shared/components/atoms/newsletter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import type { LanguageSelection } from '@/features/language/config/language.schema';

export default function Home() {
  const { data: session, isPending: sessionLoading } = useSession();
  const user = session?.user;
  
  const { 
    preferences, 
    isLoading: preferencesLoading, 
    hasPreferences,
    updatePreferences 
  } = useUserLanguagePreferences(user?.id);

  const handleLanguageSelection = async (selection: LanguageSelection) => {
    if (!user?.id) return;
    
    try {
      const result = await updatePreferences(selection);
      if (result.success) {
        toast.success('Language preferences saved! Welcome to your personalized learning experience.');
      } else {
        toast.error(result.error || 'Failed to save preferences');
      }
    } catch {
      toast.error('An error occurred while saving your preferences');
    }
  };

  // Show enhanced homepage for non-authenticated users
  if (!sessionLoading && !user) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-blue-50 to-purple-50">
        <main className="flex-1">
          <div className="space-y-24">
            <div className="animate-fade-in-up">
              <Hero />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <HomeFeaturesSection />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <HowItWorksSection />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <LanguagesSection />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <NewsLetter />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <TestimonialsSection />
            </div>
          </div>
        </main>
        <footer className="w-full py-8 bg-white/80 border-t border-gray-200 mt-12 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} LinguaLearn. Made with <span className="text-pink-500">♥</span> for language lovers.
        </footer>
      </div>
    );
  }

  // Show loading state
  if (sessionLoading || preferencesLoading) {
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
      </div>
    );
  }

  // Show language selection if user hasn't set preferences
  if (user && !hasPreferences) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to LinguaLearn, {user.name}!</h1>
            <p className="text-muted-foreground">
              Let&apos;s personalize your language learning experience
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Language Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <LanguageSelectionForm 
                onComplete={handleLanguageSelection}
                initialSelection={preferences ? {
                  nativeLanguage: preferences.nativeLanguage!,
                  targetLanguage: preferences.targetLanguage!,
                } : undefined}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show personalized dashboard for users with language preferences
  if (user && hasPreferences && preferences?.targetLanguage) {
    return (
      <PersonalizedDashboard
        userId={user.id}
        userName={user.name || 'Learner'}
        targetLanguage={preferences.targetLanguage}
      />
    );
  }

  // Fallback - show enhanced homepage
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-blue-50 to-purple-50">
      <main className="flex-1">
        <div className="space-y-24">
          <div className="animate-fade-in-up">
            <Hero />
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <HomeFeaturesSection />
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <HowItWorksSection />
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <LanguagesSection />
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <NewsLetter />
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <TestimonialsSection />
          </div>
        </div>
      </main>
      <footer className="w-full py-8 bg-white/80 border-t border-gray-200 mt-12 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} LinguaLearn. Made with <span className="text-pink-500">♥</span> for language lovers.
      </footer>
    </div>
  );
}
