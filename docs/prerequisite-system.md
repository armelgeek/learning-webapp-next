# Lesson Management with Prerequisites System

This implementation provides a complete lesson management system with prerequisite support for the learning webapp.

## Overview

The prerequisite system ensures that students must complete certain lessons before accessing more advanced content, creating a structured learning path.

## Key Features

### 1. **Prerequisite Validation**
- Lessons can have multiple prerequisites
- Prerequisites are validated before lesson access
- Real-time checking of prerequisite completion status
- Automatic unlocking when prerequisites are met

### 2. **Enhanced UI Components**
- **LessonCard**: Shows prerequisite status with lock icons and tooltips
- **LessonList**: Displays lessons sorted by unlock status and completion
- **PrerequisiteSelector**: Admin component for managing lesson dependencies

### 3. **API Endpoints**
- `GET /api/lessons/progress/[userId]` - Lessons with progress and prerequisite status
- `GET /api/lessons/[id]/prerequisites?userId=...` - Check specific lesson prerequisites
- `GET /api/lessons/available-for-prerequisites` - Get lessons available as prerequisites

## Database Schema

The `lessons` table includes:
```sql
prerequisites TEXT -- JSON array of lesson IDs that must be completed first
```

## Usage Examples

### Creating a Lesson with Prerequisites

```typescript
const lesson: CreateLessonPayload = {
  title: 'Advanced Spanish Grammar',
  language: 'spanish',
  type: 'grammar',
  content: { text: 'Advanced grammar concepts' },
  prerequisites: ['basic-vocab-lesson-id', 'basic-grammar-lesson-id'],
  difficultyLevel: 'advanced',
  // ... other fields
};
```

### Checking Prerequisites

```typescript
const result = await LessonService.checkPrerequisites(lessonId, userId);
if (result.isUnlocked) {
  // User can access the lesson
} else {
  // Show prerequisite requirements
  console.log('Complete these first:', result.unmetPrerequisites);
}
```

### Using the Hook in Components

```typescript
const { lessons, isLoading } = useLessonsWithPrerequisites(userId, {
  language: 'spanish',
  difficultyLevel: 'beginner'
});

// lessons includes prerequisite status
lessons.forEach(lesson => {
  console.log(`${lesson.title}: ${lesson.isUnlocked ? 'Unlocked' : 'Locked'}`);
});
```

## Components

### LessonCard
Enhanced to show:
- Lock icon for locked lessons
- Prerequisite count badge
- Tooltip with prerequisite details
- Visual indicators for completion status

### LessonList
Features:
- Statistics dashboard (completed, available, locked)
- Smart sorting (completed → unlocked → locked)
- Progress tracking integration

### PrerequisiteSelector
Admin component for:
- Searching available lessons
- Selecting multiple prerequisites
- Visual prerequisite management
- Validation of circular dependencies

## API Integration

### Client-Side Usage
```typescript
// Get lessons with prerequisites
const response = await fetch(`/api/lessons/progress/${userId}?language=spanish`);
const lessons: LessonWithProgress[] = await response.json();

// Check specific lesson prerequisites
const response = await fetch(`/api/lessons/${lessonId}/prerequisites?userId=${userId}`);
const check: PrerequisiteCheck = await response.json();
```

### Server-Side Service
```typescript
// Service methods available
LessonService.checkPrerequisites(lessonId, userId)
LessonService.getLessonsWithUserProgress(userId, filter)
LessonService.getAvailableLessonsForPrerequisites(excludeId)
```

## Types

### LessonWithProgress
```typescript
interface LessonWithProgress extends Lesson {
  progress?: {
    completed: boolean;
    score?: number;
    attempts: number;
  };
  isUnlocked: boolean;
  unmetPrerequisites: string[];
}
```

### PrerequisiteCheck
```typescript
interface PrerequisiteCheck {
  lessonId: string;
  isUnlocked: boolean;
  unmetPrerequisites: string[];
  prerequisiteDetails: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}
```

## Benefits

1. **Structured Learning**: Ensures logical progression through content
2. **Better UX**: Clear visual indicators of what's available vs locked
3. **Motivation**: Shows clear path to unlock new content
4. **Flexibility**: Easy to configure different learning paths
5. **Admin Friendly**: Simple interface for managing dependencies

## Future Enhancements

- Circular dependency detection
- Prerequisite suggestions based on difficulty
- Alternative prerequisite paths (OR conditions)
- Prerequisite expiration/refresh requirements
- Analytics on prerequisite effectiveness