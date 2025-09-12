import { faker } from '@faker-js/faker';
import type { LanguageKey } from '@/features/language/config/language.schema';

export class DataGeneratorService {
  static generateLesson(language: LanguageKey, type: 'vocabulary' | 'grammar' | 'phrases' | 'pronunciation' | 'listening' | 'reading') {
    const vocabularyData = {
      vocabulary: this.generateVocabulary(language, 8),
      examples: this.generateExamples(language, 4),
    };

    const grammarData = {
      grammarRules: this.generateGrammarRules(language, 3),
      examples: this.generateGrammarExamples(language, 4),
    };

    const phrasesData = {
      phrases: this.generatePhrases(language, 6),
      examples: this.generateExamples(language, 4),
    };

    return {
      title: this.generateLessonTitle(type, language),
      description: this.generateLessonDescription(type, language),
      language,
      type,
      content: type === 'vocabulary' ? vocabularyData :
               type === 'grammar' ? grammarData :
               type === 'phrases' ? phrasesData :
               vocabularyData, // Default to vocabulary for other types
      difficultyLevel: faker.helpers.arrayElement(['beginner', 'intermediate', 'advanced'] as const),
      estimatedDuration: faker.number.int({ min: 5, max: 30 }),
      pointsReward: faker.number.int({ min: 10, max: 50 }),
      isActive: true,
      order: faker.number.int({ min: 1, max: 100 }),
      prerequisites: null,
      tags: JSON.stringify(this.generateTags(type, language)),
    };
  }

  static generateModule(language: LanguageKey) {
    return {
      title: this.generateModuleTitle(language),
      description: this.generateModuleDescription(language),
      language,
      difficultyLevel: faker.helpers.arrayElement(['beginner', 'intermediate', 'advanced'] as const),
      imageUrl: faker.image.urlLoremFlickr({ category: 'education' }),
      isActive: true,
      order: faker.number.int({ min: 1, max: 20 }),
      estimatedDuration: faker.number.int({ min: 60, max: 300 }),
    };
  }

  static generateQuiz(lessonId: string, type: 'multiple_choice' | 'flashcard' | 'fill_blanks' | 'translation' | 'dictation' | 'pronunciation') {
    return {
      lessonId,
      question: this.generateQuizQuestion(type),
      options: this.generateQuizOptions(type),
      correctAnswer: this.generateCorrectAnswer(type),
      type,
      explanation: this.generateExplanation(type),
    };
  }

  static generateDailyChallenge(language: LanguageKey) {
    const challenges = [
      'Complete 3 vocabulary lessons',
      'Achieve 90% accuracy in quizzes',
      'Study for 15 minutes',
      'Learn 10 new words',
      'Complete a grammar lesson',
    ];

    return {
      date: new Date(),
      title: faker.helpers.arrayElement(challenges),
      description: this.generateChallengeDescription(),
      targetValue: faker.number.int({ min: 1, max: 10 }),
      pointsReward: faker.number.int({ min: 15, max: 50 }),
      language,
      difficultyLevel: faker.helpers.arrayElement(['beginner', 'intermediate', 'advanced'] as const),
      isActive: true,
    };
  }

  private static generateVocabulary(language: LanguageKey, count: number) {
    return Array.from({ length: count }, () => ({
      word: this.generateWordInLanguage(language),
      translation: faker.word.noun(),
      pronunciation: this.generatePronunciation(language),
    }));
  }

  private static generateExamples(language: LanguageKey, count: number) {
    return Array.from({ length: count }, () => 
      `${this.generateSentenceInLanguage(language)} - ${faker.lorem.sentence()}`
    );
  }

  private static generateGrammarRules(language: LanguageKey, count: number) {
    const rules = [
      'Regular verbs follow standard conjugation patterns',
      'Adjectives must agree with noun gender and number',
      'Question formation uses inversion or question words',
      'Past tense formation varies by verb type',
    ];
    return faker.helpers.arrayElements(rules, count);
  }

  private static generateGrammarExamples(language: LanguageKey, count: number) {
    return Array.from({ length: count }, () => 
      `${this.generateGrammarExample(language)} - ${faker.lorem.sentence()}`
    );
  }

  private static generatePhrases(language: LanguageKey, count: number) {
    return Array.from({ length: count }, () => ({
      phrase: this.generatePhraseInLanguage(language),
      translation: faker.lorem.sentence(),
      pronunciation: this.generatePronunciation(language),
    }));
  }

  private static generateLessonTitle(type: string, language: LanguageKey) {
    const titleTemplates: { [key: string]: string[] } = {
      vocabulary: ['Basic', 'Essential', 'Common', 'Everyday', 'Useful'],
      grammar: ['Present Tense', 'Past Tense', 'Future Tense', 'Conditional', 'Subjunctive'],
      phrases: ['Greetings', 'Shopping', 'Dining', 'Travel', 'Business'],
    };

    const prefix = faker.helpers.arrayElement(titleTemplates[type] || titleTemplates.vocabulary);
    const suffix = type === 'vocabulary' ? 'Vocabulary' : 
                   type === 'grammar' ? 'Grammar' : 'Phrases';
    
    return `${prefix} ${suffix}`;
  }

  private static generateLessonDescription(type: string, language: LanguageKey) {
    return faker.lorem.sentence(10);
  }

  private static generateModuleTitle(language: LanguageKey) {
    const themes = ['Beginner Basics', 'Travel Essentials', 'Business Communication', 
                   'Daily Conversations', 'Cultural Insights', 'Advanced Grammar'];
    return faker.helpers.arrayElement(themes);
  }

  private static generateModuleDescription(language: LanguageKey) {
    return faker.lorem.paragraph();
  }

  private static generateQuizQuestion(type: string) {
    const questionTemplates: { [key: string]: string } = {
      multiple_choice: 'What does "{word}" mean?',
      translation: 'How do you say "{phrase}" in English?',
      fill_blanks: 'Complete the sentence: "I _____ to the store."',
    };
    return questionTemplates[type] || faker.lorem.sentence();
  }

  private static generateQuizOptions(type: string) {
    return [
      faker.word.noun(),
      faker.word.verb(),
      faker.word.adjective(),
      faker.word.adverb(),
    ];
  }

  private static generateCorrectAnswer(type: string) {
    return faker.word.noun();
  }

  private static generateExplanation(type: string) {
    return faker.lorem.sentence();
  }

  private static generateChallengeDescription() {
    return faker.lorem.sentence();
  }

  private static generateTags(type: string, language: LanguageKey) {
    const baseTags = [type, language];
    const additionalTags = faker.helpers.arrayElements(
      ['beginner', 'intermediate', 'advanced', 'daily', 'essential', 'common'], 
      faker.number.int({ min: 1, max: 3 })
    );
    return [...baseTags, ...additionalTags];
  }

  private static generateWordInLanguage(language: LanguageKey) {
    // Simplified: In a real implementation, you'd have language-specific word lists
    const samples: { [key in LanguageKey]: string[] } = {
      spanish: ['hola', 'gracias', 'buenos días', 'adiós', 'por favor'],
      french: ['bonjour', 'merci', 'au revoir', 's\'il vous plaît', 'excusez-moi'],
      german: ['hallo', 'danke', 'auf Wiedersehen', 'bitte', 'entschuldigung'],
      italian: ['ciao', 'grazie', 'arrivederci', 'prego', 'scusi'],
      portuguese: ['olá', 'obrigado', 'tchau', 'por favor', 'desculpe'],
      japanese: ['こんにちは', 'ありがとう', 'さようなら', 'お願いします', 'すみません'],
      chinese: ['你好', '谢谢', '再见', '请', '对不起'],
      english: ['hello', 'thank you', 'goodbye', 'please', 'excuse me'],
    };
    return faker.helpers.arrayElement(samples[language] || samples.english);
  }

  private static generateSentenceInLanguage(language: LanguageKey) {
    // Simplified: return a basic sentence structure
    return `${this.generateWordInLanguage(language)} ${faker.word.verb()} ${faker.word.noun()}`;
  }

  private static generatePhraseInLanguage(language: LanguageKey) {
    return this.generateSentenceInLanguage(language);
  }

  private static generateGrammarExample(language: LanguageKey) {
    return `${this.generateWordInLanguage(language)} (${faker.word.verb()})`;
  }

  private static generatePronunciation(language: LanguageKey) {
    // Simplified pronunciation guide
    return faker.helpers.arrayElement(['OH-lah', 'GRAH-see-ahs', 'bway-NOHS', 'ah-DYOHS']);
  }
}