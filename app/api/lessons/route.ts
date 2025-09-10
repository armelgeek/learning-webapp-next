import { NextRequest, NextResponse } from 'next/server';

// Mock lessons data for demonstration
const mockLessons = [
  {
    id: '1',
    title: 'Basic Greetings',
    language: 'spanish',
    type: 'vocabulary',
    difficultyLevel: 'beginner',
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
    isActive: true,
    order: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    title: 'Numbers 1-20',
    language: 'spanish',
    type: 'vocabulary',
    difficultyLevel: 'beginner',
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
    isActive: true,
    order: 2,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    title: 'Present Tense - Regular Verbs',
    language: 'spanish',
    type: 'grammar',
    difficultyLevel: 'beginner',
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
    isActive: true,
    order: 3,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
  {
    id: '4',
    title: 'Family Members',
    language: 'spanish',
    type: 'vocabulary',
    difficultyLevel: 'beginner',
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
    isActive: true,
    order: 4,
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04'),
  },
  {
    id: '5',
    title: 'Common Expressions',
    language: 'spanish',
    type: 'phrases',
    difficultyLevel: 'beginner',
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
    isActive: true,
    order: 5,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const type = searchParams.get('type');
    const difficultyLevel = searchParams.get('difficultyLevel');

    let filteredLessons = mockLessons;

    if (language && language !== 'all') {
      filteredLessons = filteredLessons.filter(lesson => lesson.language === language);
    }

    if (type && type !== 'all') {
      filteredLessons = filteredLessons.filter(lesson => lesson.type === type);
    }

    if (difficultyLevel && difficultyLevel !== 'all') {
      filteredLessons = filteredLessons.filter(lesson => lesson.difficultyLevel === difficultyLevel);
    }

    return NextResponse.json(filteredLessons);
  } catch (error) {
    console.error('GET /api/lessons error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // For demo purposes, just return a success response
    const newLesson = {
      id: Date.now().toString(),
      ...body,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json(newLesson, { status: 201 });
  } catch (error) {
    console.error('POST /api/lessons error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}