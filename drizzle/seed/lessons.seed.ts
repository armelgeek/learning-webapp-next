import { db } from '../db';
import { lessons, quizzes } from '../schema';

async function seedLessons() {
  console.log('🌱 Seeding lessons...');

  // Sample lessons data
  const sampleLessons = [
    {
      title: 'Basic Greetings',
      language: 'spanish' as const,
      type: 'vocabulary' as const,
      content: {
        text: 'Learn essential Spanish greetings to start conversations',
        vocabulary: [
          { word: 'Hola', translation: 'Hello', pronunciation: 'OH-lah' },
          { word: 'Buenos días', translation: 'Good morning', pronunciation: 'BWAY-nohs DEE-ahs' },
          { word: 'Buenas tardes', translation: 'Good afternoon', pronunciation: 'BWAY-nahs TAR-dehs' },
          { word: 'Buenas noches', translation: 'Good evening/night', pronunciation: 'BWAY-nahs NOH-chehs' },
          { word: 'Adiós', translation: 'Goodbye', pronunciation: 'ah-DYOHS' },
        ],
        examples: [
          'Hola, ¿cómo estás? - Hello, how are you?',
          'Buenos días, señora García - Good morning, Mrs. García',
          'Buenas tardes, ¿cómo le va? - Good afternoon, how are you doing?',
        ]
      },
      difficultyLevel: 'beginner' as const,
      order: 1,
    },
    {
      title: 'Numbers 1-20',
      language: 'spanish' as const,
      type: 'vocabulary' as const,
      content: {
        text: 'Master Spanish numbers from 1 to 20',
        vocabulary: [
          { word: 'uno', translation: 'one', pronunciation: 'OO-noh' },
          { word: 'dos', translation: 'two', pronunciation: 'dohs' },
          { word: 'tres', translation: 'three', pronunciation: 'trehs' },
          { word: 'cuatro', translation: 'four', pronunciation: 'KWAH-troh' },
          { word: 'cinco', translation: 'five', pronunciation: 'SEEN-koh' },
          { word: 'diez', translation: 'ten', pronunciation: 'dyehs' },
          { word: 'veinte', translation: 'twenty', pronunciation: 'VAYN-teh' },
        ],
        examples: [
          'Tengo cinco años - I am five years old',
          'Son las dos - It\'s two o\'clock',
          'Necesito diez libros - I need ten books',
        ]
      },
      difficultyLevel: 'beginner' as const,
      order: 2,
    },
    {
      title: 'Present Tense - Regular Verbs',
      language: 'spanish' as const,
      type: 'grammar' as const,
      content: {
        text: 'Learn how to conjugate regular verbs in Spanish present tense',
        grammarRules: [
          'AR verbs: -o, -as, -a, -amos, -áis, -an',
          'ER verbs: -o, -es, -e, -emos, -éis, -en',
          'IR verbs: -o, -es, -e, -imos, -ís, -en',
        ],
        examples: [
          'Hablar (to speak): Yo hablo, tú hablas, él habla',
          'Comer (to eat): Yo como, tú comes, ella come',
          'Vivir (to live): Yo vivo, tú vives, nosotros vivimos',
        ]
      },
      difficultyLevel: 'beginner' as const,
      order: 3,
    },
    {
      title: 'Family Members',
      language: 'spanish' as const,
      type: 'vocabulary' as const,
      content: {
        text: 'Learn vocabulary related to family members',
        vocabulary: [
          { word: 'familia', translation: 'family', pronunciation: 'fah-MEE-lyah' },
          { word: 'padre', translation: 'father', pronunciation: 'PAH-dreh' },
          { word: 'madre', translation: 'mother', pronunciation: 'MAH-dreh' },
          { word: 'hermano', translation: 'brother', pronunciation: 'ehr-MAH-noh' },
          { word: 'hermana', translation: 'sister', pronunciation: 'ehr-MAH-nah' },
          { word: 'abuelo', translation: 'grandfather', pronunciation: 'ah-BWAY-loh' },
          { word: 'abuela', translation: 'grandmother', pronunciation: 'ah-BWAY-lah' },
        ],
        examples: [
          'Mi familia es grande - My family is big',
          'Tengo dos hermanos - I have two brothers',
          'Mi abuela cocina muy bien - My grandmother cooks very well',
        ]
      },
      difficultyLevel: 'beginner' as const,
      order: 4,
    },
    {
      title: 'Common Expressions',
      language: 'spanish' as const,
      type: 'phrases' as const,
      content: {
        text: 'Essential Spanish phrases for everyday conversations',
        vocabulary: [
          { word: 'Por favor', translation: 'Please', pronunciation: 'por fah-VOR' },
          { word: 'Gracias', translation: 'Thank you', pronunciation: 'GRAH-thyahs' },
          { word: 'De nada', translation: 'You\'re welcome', pronunciation: 'deh NAH-dah' },
          { word: 'Perdón', translation: 'Excuse me/Sorry', pronunciation: 'per-DOHN' },
          { word: 'No entiendo', translation: 'I don\'t understand', pronunciation: 'noh en-TYEN-doh' },
        ],
        examples: [
          '¿Puedes ayudarme, por favor? - Can you help me, please?',
          'Gracias por tu ayuda - Thank you for your help',
          'Perdón, ¿dónde está el baño? - Excuse me, where is the bathroom?',
        ]
      },
      difficultyLevel: 'beginner' as const,
      order: 5,
    },
  ];

  try {
    // Insert lessons
    const insertedLessons = await db.insert(lessons).values(sampleLessons).returning();
    console.log(`✅ Inserted ${insertedLessons.length} lessons`);

    // Create sample quizzes for each lesson
    const sampleQuizzes = [];
    
    for (const lesson of insertedLessons) {
      if (lesson.type === 'vocabulary') {
        // Create vocabulary quizzes
        const vocab = (lesson.content as any).vocabulary || [];
        for (let i = 0; i < Math.min(3, vocab.length); i++) {
          const word = vocab[i];
          sampleQuizzes.push({
            lessonId: lesson.id,
            question: `What does "${word.word}" mean in English?`,
            options: [
              word.translation,
              'Incorrect option 1',
              'Incorrect option 2',
              'Incorrect option 3'
            ],
            correctAnswer: word.translation,
            type: 'multiple_choice' as const,
            explanation: `"${word.word}" means "${word.translation}" in English.`,
          });
        }
      } else if (lesson.type === 'grammar') {
        // Create grammar quizzes
        sampleQuizzes.push({
          lessonId: lesson.id,
          question: 'How do you conjugate "hablar" (to speak) for "yo" (I)?',
          options: ['hablo', 'hablas', 'habla', 'hablamos'],
          correctAnswer: 'hablo',
          type: 'multiple_choice' as const,
          explanation: 'For "yo" with AR verbs, we add "-o" to the stem: habl + o = hablo',
        });
      } else if (lesson.type === 'phrases') {
        // Create phrase quizzes
        sampleQuizzes.push({
          lessonId: lesson.id,
          question: 'How do you say "Thank you" in Spanish?',
          options: ['Gracias', 'Por favor', 'De nada', 'Perdón'],
          correctAnswer: 'Gracias',
          type: 'multiple_choice' as const,
          explanation: '"Gracias" means "Thank you" in Spanish.',
        });
      }
    }

    if (sampleQuizzes.length > 0) {
      const insertedQuizzes = await db.insert(quizzes).values(sampleQuizzes).returning();
      console.log(`✅ Inserted ${insertedQuizzes.length} quizzes`);
    }

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedLessons()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedLessons };