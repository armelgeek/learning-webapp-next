import Hero from '@/shared/components/atoms/hero';
export default function Home() {
  return (
    <>
      <Hero 
        title="Welcome to LinguaLearn!"
        subtitle="Master new languages with interactive lessons, quizzes, and progress tracking."
        ctaText="Start Learning"
        ctaHref="/lessons"
      />
    </>
  );
}
