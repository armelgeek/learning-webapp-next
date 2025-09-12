'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LANGUAGES, type LanguageKey } from '@/features/language/config/language.schema';
import { DataGeneratorService } from '@/features/generators/domain/service';
import { toast } from 'sonner';
import { Loader2, Plus, Shuffle } from 'lucide-react';

interface ContentGeneratorProps {
  onContentGenerated?: () => void;
}

export function ContentGenerator({ onContentGenerated }: ContentGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageKey>('spanish');
  const [contentType, setContentType] = useState<'lessons' | 'modules' | 'quizzes' | 'challenges'>('lessons');
  const [quantity, setQuantity] = useState(5);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      let generatedContent = [];
      
      switch (contentType) {
        case 'lessons':
          const lessonTypes = ['vocabulary', 'grammar', 'phrases'] as const;
          for (let i = 0; i < quantity; i++) {
            const randomType = lessonTypes[Math.floor(Math.random() * lessonTypes.length)];
            const lesson = DataGeneratorService.generateLesson(selectedLanguage, randomType);
            generatedContent.push(lesson);
          }
          break;
          
        case 'modules':
          for (let i = 0; i < quantity; i++) {
            const module = DataGeneratorService.generateModule(selectedLanguage);
            generatedContent.push(module);
          }
          break;
          
        case 'challenges':
          for (let i = 0; i < quantity; i++) {
            const challenge = DataGeneratorService.generateDailyChallenge(selectedLanguage);
            generatedContent.push(challenge);
          }
          break;
          
        default:
          throw new Error('Invalid content type');
      }

      // Here you would typically save to database
      console.log('Generated content:', generatedContent);
      
      toast.success(`Generated ${quantity} ${contentType} for ${LANGUAGES[selectedLanguage].name}!`);
      onContentGenerated?.();
      
    } catch (error) {
      toast.error('Failed to generate content');
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shuffle className="h-5 w-5" />
          Content Generator
        </CardTitle>
        <CardDescription>
          Generate dynamic mock data for lessons, modules, quizzes, and challenges
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as LanguageKey)}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LANGUAGES).map(([key, lang]) => (
                  <SelectItem key={key} value={key}>
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content-type">Content Type</Label>
            <Select value={contentType} onValueChange={(value) => setContentType(value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lessons">Lessons</SelectItem>
                <SelectItem value="modules">Modules</SelectItem>
                <SelectItem value="quizzes">Quizzes</SelectItem>
                <SelectItem value="challenges">Daily Challenges</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            max="50"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            placeholder="Number of items to generate"
          />
        </div>

        <Button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Generate {quantity} {contentType}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}