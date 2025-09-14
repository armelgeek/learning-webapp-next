import { LessonCard } from '../molecules/lesson-card';
import { LessonWithProgress } from '../../config/lesson.types';

interface LessonListProps {
  lessons: LessonWithProgress[];
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

  // Sort lessons by unlock status and order
  const sortedLessons = [...lessons].sort((a, b) => {
    // Completed lessons first
    if (a.progress?.completed && !b.progress?.completed) return -1;
    if (!a.progress?.completed && b.progress?.completed) return 1;
    
    // Then unlocked lessons
    if (a.isUnlocked && !b.isUnlocked) return -1;
    if (!a.isUnlocked && b.isUnlocked) return 1;
    
    // Then by order
    return a.order - b.order;
  });

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm font-medium text-green-800">Completed</div>
          <div className="text-2xl font-bold text-green-900">
            {lessons.filter(l => l.progress?.completed).length}
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm font-medium text-blue-800">Available</div>
          <div className="text-2xl font-bold text-blue-900">
            {lessons.filter(l => l.isUnlocked && !l.progress?.completed).length}
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-sm font-medium text-orange-800">Locked</div>
          <div className="text-2xl font-bold text-orange-900">
            {lessons.filter(l => !l.isUnlocked).length}
          </div>
        </div>
      </div>

      {/* Lesson Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedLessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={{
              id: lesson.id,
              title: lesson.title,
              type: lesson.type,
              difficultyLevel: lesson.difficultyLevel,
              language: lesson.language,
              estimatedDuration: lesson.estimatedDuration,
            }}
            progress={lesson.progress}
            isUnlocked={lesson.isUnlocked}
            unmetPrerequisites={lesson.unmetPrerequisites}
            onClick={() => onLessonClick?.(lesson.id)}
          />
        ))}
      </div>
    </div>
  );
}