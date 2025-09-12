'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { LANGUAGES, type LanguageKey, type LanguageSelection } from '../../config/language.schema';

interface LanguageSelectionFormProps {
  onComplete: (selection: LanguageSelection) => void;
  initialSelection?: Partial<LanguageSelection>;
}

export function LanguageSelectionForm({ onComplete, initialSelection }: LanguageSelectionFormProps) {
  const [nativeLanguage, setNativeLanguage] = useState<LanguageKey | ''>
    (initialSelection?.nativeLanguage || '');
  const [targetLanguage, setTargetLanguage] = useState<LanguageKey | ''>
    (initialSelection?.targetLanguage || '');

  const handleSubmit = () => {
    if (nativeLanguage && targetLanguage) {
      onComplete({
        nativeLanguage: nativeLanguage as LanguageKey,
        targetLanguage: targetLanguage as LanguageKey,
      });
    }
  };

  const canSubmit = nativeLanguage && targetLanguage && nativeLanguage !== targetLanguage;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>What language do you speak fluently?</CardTitle>
          <CardDescription>
            This will be your native language and help us provide better translations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={nativeLanguage} onValueChange={(value) => setNativeLanguage(value as LanguageKey | '')}>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(LANGUAGES).map(([key, lang]) => (
                <div key={key} className="flex items-center space-x-2">
                  <RadioGroupItem value={key} id={`native-${key}`} />
                  <Label htmlFor={`native-${key}`} className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xl">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What language do you want to learn?</CardTitle>
          <CardDescription>
            Choose the language you&apos;d like to focus on learning.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={targetLanguage} onValueChange={(value) => setTargetLanguage(value as LanguageKey | '')}>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(LANGUAGES).map(([key, lang]) => (
                <div key={key} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={key} 
                    id={`target-${key}`}
                    disabled={key === nativeLanguage}
                  />
                  <Label 
                    htmlFor={`target-${key}`} 
                    className={`flex items-center gap-2 cursor-pointer ${
                      key === nativeLanguage ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {nativeLanguage && targetLanguage && nativeLanguage === targetLanguage && (
        <div className="text-sm text-destructive text-center">
          Your native language and target language cannot be the same.
        </div>
      )}

      <div className="flex justify-center">
        <Button 
          onClick={handleSubmit}
          disabled={!canSubmit}
          size="lg"
        >
          Continue with {targetLanguage && LANGUAGES[targetLanguage as LanguageKey]?.name}
        </Button>
      </div>
    </div>
  );
}