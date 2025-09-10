import { LessonCard } from '../molecules/lesson-card';

interface LessonListProps {
  lessons: Array<{
    lesson: {
      id: string;
      title: string;
      type: string;
      difficultyLevel: string;
      language: string;
    };
    progress?: {
      completed: boolean;
      score: number;
    } | null;
  }>;
  onLessonClick?: (lessonId: string) => void;
}

export function LessonList({ lessons, onLessonClick }: LessonListProps) {
  if (lessons.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No lessons available</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {lessons.map(({ lesson, progress }) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          progress={progress}
          onClick={() => onLessonClick?.(lesson.id)}
        />
      ))}
    </div>
  );
}