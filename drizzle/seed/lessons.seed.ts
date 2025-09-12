import { db } from '../db';
import { lessons, quizzes } from '../schema';

async function seedLessons() {
  console.log('🌱 Seeding lessons...');

  // Sample lessons data
  const sampleLessons = [
    // Spanish lessons
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
      title: 'Spanish Pronunciation Basics',
      language: 'spanish' as const,
      type: 'pronunciation' as const,
      content: {
        text: 'Master the fundamentals of Spanish pronunciation',
        examples: [
          'RR - Rolled R: perro, carro',
          'J/G - Harsh H sound: jefe, gente',
          'LL - Y sound: llamar, calle',
          'Ñ - NY sound: español, año',
        ]
      },
      audioUrl: 'https://example.com/spanish-pronunciation.mp3',
      difficultyLevel: 'beginner' as const,
      order: 4,
    },
    {
      title: 'Listening: Spanish Market',
      language: 'spanish' as const,
      type: 'listening' as const,
      content: {
        text: 'Listen to a conversation at a Spanish market',
        examples: [
          'Practice understanding spoken Spanish in real contexts',
          'Learn market vocabulary and phrases',
        ]
      },
      audioUrl: 'https://example.com/spanish-market.mp3',
      difficultyLevel: 'intermediate' as const,
      order: 5,
    },
    
    // French lessons
    {
      title: 'French Greetings',
      language: 'french' as const,
      type: 'vocabulary' as const,
      content: {
        text: 'Essential French greetings for daily conversations',
        vocabulary: [
          { word: 'Bonjour', translation: 'Hello/Good morning', pronunciation: 'bon-ZHOOR' },
          { word: 'Bonsoir', translation: 'Good evening', pronunciation: 'bon-SWAHR' },
          { word: 'Salut', translation: 'Hi/Bye (informal)', pronunciation: 'sah-LUU' },
          { word: 'Au revoir', translation: 'Goodbye', pronunciation: 'oh ruh-VWAHR' },
          { word: 'Merci', translation: 'Thank you', pronunciation: 'mer-SEE' },
        ],
        examples: [
          'Bonjour, comment allez-vous? - Hello, how are you?',
          'Bonsoir madame - Good evening madam',
          'Merci beaucoup - Thank you very much',
        ]
      },
      difficultyLevel: 'beginner' as const,
      order: 1,
    },
    {
      title: 'French Articles and Gender',
      language: 'french' as const,
      type: 'grammar' as const,
      content: {
        text: 'Understanding French articles and noun gender',
        grammarRules: [
          'Definite articles: le (masculine), la (feminine), les (plural)',
          'Indefinite articles: un (masculine), une (feminine), des (plural)',
          'Most nouns ending in -e are feminine',
          'Most other nouns are masculine',
        ],
        examples: [
          'le livre (the book - masculine)',
          'la table (the table - feminine)',
          'un chat (a cat - masculine)',
          'une maison (a house - feminine)',
        ]
      },
      difficultyLevel: 'beginner' as const,
      order: 2,
    },
    
    // German lessons
    {
      title: 'German Basic Greetings',
      language: 'german' as const,
      type: 'vocabulary' as const,
      content: {
        text: 'Learn essential German greetings',
        vocabulary: [
          { word: 'Hallo', translation: 'Hello', pronunciation: 'HAH-loh' },
          { word: 'Guten Morgen', translation: 'Good morning', pronunciation: 'GOO-ten MOR-gen' },
          { word: 'Guten Tag', translation: 'Good day', pronunciation: 'GOO-ten TAHK' },
          { word: 'Auf Wiedersehen', translation: 'Goodbye', pronunciation: 'owf VEE-der-zayn' },
          { word: 'Danke', translation: 'Thank you', pronunciation: 'DAHN-keh' },
        ],
        examples: [
          'Hallo, wie geht es Ihnen? - Hello, how are you?',
          'Guten Morgen, Herr Schmidt - Good morning, Mr. Schmidt',
          'Danke schön - Thank you very much',
        ]
      },
      difficultyLevel: 'beginner' as const,
      order: 1,
    },
    
    // Italian lessons
    {
      title: 'Italian Greetings',
      language: 'italian' as const,
      type: 'vocabulary' as const,
      content: {
        text: 'Master Italian greetings and basic courtesy',
        vocabulary: [
          { word: 'Ciao', translation: 'Hello/Goodbye (informal)', pronunciation: 'chow' },
          { word: 'Buongiorno', translation: 'Good morning', pronunciation: 'bwohn-JOR-noh' },
          { word: 'Buonasera', translation: 'Good evening', pronunciation: 'bwoh-nah-SEH-rah' },
          { word: 'Arrivederci', translation: 'Goodbye', pronunciation: 'ah-ree-veh-DER-chee' },
          { word: 'Grazie', translation: 'Thank you', pronunciation: 'GRAH-tsee-eh' },
        ],
        examples: [
          'Ciao! Come stai? - Hi! How are you?',
          'Buongiorno, signora - Good morning, madam',
          'Grazie mille - Thank you very much',
        ]
      },
      difficultyLevel: 'beginner' as const,
      order: 1,
    },
    
    // English lessons (for non-English speakers)
    {
      title: 'English Greetings',
      language: 'english' as const,
      type: 'vocabulary' as const,
      content: {
        text: 'Essential English greetings and introductions',
        vocabulary: [
          { word: 'Hello', translation: 'Salutation', pronunciation: 'heh-LOH' },
          { word: 'Good morning', translation: 'Morning greeting', pronunciation: 'good MOR-ning' },
          { word: 'How are you?', translation: 'Asking about wellbeing', pronunciation: 'how are you' },
          { word: 'Nice to meet you', translation: 'First meeting phrase', pronunciation: 'nice to meet you' },
          { word: 'Thank you', translation: 'Expression of gratitude', pronunciation: 'thank you' },
        ],
        examples: [
          'Hello, my name is John',
          'Good morning, how are you today?',
          'Nice to meet you, Sarah',
        ]
      },
      difficultyLevel: 'beginner' as const,
      order: 1,
    },
    
    // Advanced lessons
    {
      title: 'Business Spanish',
      language: 'spanish' as const,
      type: 'phrases' as const,
      content: {
        text: 'Professional Spanish phrases for business contexts',
        vocabulary: [
          { word: 'Reunión', translation: 'Meeting', pronunciation: 'ray-oo-NYOHN' },
          { word: 'Proyecto', translation: 'Project', pronunciation: 'pro-YEK-toh' },
          { word: 'Presupuesto', translation: 'Budget', pronunciation: 'pray-soo-PWEH-stoh' },
        ],
        examples: [
          'Tenemos una reunión importante - We have an important meeting',
          'El proyecto está en desarrollo - The project is in development',
        ]
      },
      difficultyLevel: 'advanced' as const,
      order: 10,
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