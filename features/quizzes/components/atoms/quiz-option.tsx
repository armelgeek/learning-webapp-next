'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/shared/lib/utils';

interface QuizOptionProps {
  option: string;
  isSelected: boolean;
  isCorrect?: boolean;
  isRevealed?: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export function QuizOption({
  option,
  isSelected,
  isCorrect,
  isRevealed,
  onSelect,
  disabled,
}: QuizOptionProps) {
  const getButtonVariant = () => {
    if (!isRevealed) {
      return isSelected ? 'default' : 'outline';
    }
    
    if (isCorrect) {
      return 'default';
    }
    
    if (isSelected && !isCorrect) {
      return 'destructive';
    }
    
    return 'outline';
  };

  const getButtonClassName = () => {
    if (!isRevealed) {
      return '';
    }
    
    if (isCorrect) {
      return 'bg-green-500 hover:bg-green-600 border-green-500';
    }
    
    if (isSelected && !isCorrect) {
      return 'bg-red-500 hover:bg-red-600 border-red-500';
    }
    
    return '';
  };

  return (
    <Button
      variant={getButtonVariant()}
      className={cn(
        'w-full justify-start text-left h-auto p-4 whitespace-normal',
        getButtonClassName()
      )}
      onClick={onSelect}
      disabled={disabled || isRevealed}
    >
      {option}
    </Button>
  );
}