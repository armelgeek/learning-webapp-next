import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, X } from 'lucide-react';

interface PrerequisiteLesson {
  id: string;
  title: string;
  language: string;
  type: string;
  difficultyLevel: string;
  order: number;
}

interface PrerequisiteSelectorProps {
  availableLessons: PrerequisiteLesson[];
  selectedPrerequisites: string[];
  onPrerequisitesChange: (prerequisites: string[]) => void;
  className?: string;
}

export function PrerequisiteSelector({
  availableLessons,
  selectedPrerequisites,
  onPrerequisitesChange,
  className,
}: PrerequisiteSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLessons, setFilteredLessons] = useState<PrerequisiteLesson[]>(availableLessons);

  useEffect(() => {
    const filtered = availableLessons.filter(lesson =>
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLessons(filtered);
  }, [searchTerm, availableLessons]);

  const handleTogglePrerequisite = (lessonId: string) => {
    const updated = selectedPrerequisites.includes(lessonId)
      ? selectedPrerequisites.filter(id => id !== lessonId)
      : [...selectedPrerequisites, lessonId];
    
    onPrerequisitesChange(updated);
  };

  const handleRemovePrerequisite = (lessonId: string) => {
    onPrerequisitesChange(selectedPrerequisites.filter(id => id !== lessonId));
  };

  const getSelectedLessons = () => {
    return availableLessons.filter(lesson => selectedPrerequisites.includes(lesson.id));
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Prerequisites</CardTitle>
          <CardDescription>
            Select lessons that students must complete before accessing this lesson.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selected Prerequisites */}
          {selectedPrerequisites.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Selected Prerequisites ({selectedPrerequisites.length})</Label>
              <div className="flex flex-wrap gap-2">
                {getSelectedLessons().map(lesson => (
                  <Badge
                    key={lesson.id}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    <span className="truncate max-w-32">{lesson.title}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleRemovePrerequisite(lesson.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="prerequisite-search">Search Lessons</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="prerequisite-search"
                placeholder="Search by title, language, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Available Lessons */}
          <div className="space-y-2">
            <Label>Available Lessons ({filteredLessons.length})</Label>
            <ScrollArea className="h-64 border rounded-md p-3">
              <div className="space-y-2">
                {filteredLessons.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No lessons found matching your search.
                  </p>
                ) : (
                  filteredLessons.map(lesson => (
                    <div
                      key={lesson.id}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleTogglePrerequisite(lesson.id)}
                    >
                      <Checkbox
                        checked={selectedPrerequisites.includes(lesson.id)}
                        onChange={() => handleTogglePrerequisite(lesson.id)}
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-none">
                            {lesson.title}
                          </p>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getDifficultyColor(lesson.difficultyLevel)}`}
                          >
                            {lesson.difficultyLevel}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {lesson.language} • {lesson.type} • Order: {lesson.order}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Clear All */}
          {selectedPrerequisites.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPrerequisitesChange([])}
              className="w-full"
            >
              Clear All Prerequisites
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}