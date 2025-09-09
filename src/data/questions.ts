export interface QuestionOption {
  id: string;
  text: string;
  description: string;
  value: string;
}

export interface Question {
  id: string;
  type: 'single' | 'multiple' | 'slider' | 'dropdown-single';
  title: string;
  explanation: string;
  options?: QuestionOption[];
  sliderConfig?: {
    min: number;
    max: number;
    step: number;
    unit: string;
    defaultValue: number;
  };
  dropdownOptions?: QuestionOption[];
}

export const questions: Question[] = [
  {
    id: 'language-selection',
    type: 'dropdown-single',
    title: 'Which language are you learning, and how long have you been at this?',
    explanation: 'No judgment here. Whether you just discovered Korean exists or you\'ve been studying longer than some people stay married, we need to know where you\'re starting from. Time spent doesn\'t equal progress made - that\'s why you\'re here.',
    dropdownOptions: [
      { id: 'korean', text: 'Korean', description: '', value: 'korean' },
      { id: 'japanese', text: 'Japanese', description: '', value: 'japanese' },
      { id: 'spanish', text: 'Spanish', description: '', value: 'spanish' },
      { id: 'french', text: 'French', description: '', value: 'french' },
      { id: 'german', text: 'German', description: '', value: 'german' },
      { id: 'italian', text: 'Italian', description: '', value: 'italian' },
      { id: 'portuguese', text: 'Portuguese', description: '', value: 'portuguese' },
      { id: 'chinese', text: 'Chinese (Mandarin)', description: '', value: 'chinese' },
      { id: 'arabic', text: 'Arabic', description: '', value: 'arabic' },
      { id: 'other', text: 'Other', description: '', value: 'other' }
    ],
    options: [
      {
        id: 'just-starting',
        text: 'Just getting started (less than 3 months)',
        description: '',
        value: 'just_starting'
      },
      {
        id: 'grinding-months',
        text: 'I\'ve been grinding for 3-12 months',
        description: '',
        value: 'grinding_months'
      },
      {
        id: 'journey-years',
        text: 'It\'s been 1-2 years of this journey',
        description: '',
        value: 'journey_years'
      },
      {
        id: 'still-here',
        text: '2+ years and still here',
        description: '',
        value: 'still_here'
      }
    ]
  },
  {
    id: 'current-method',
    type: 'single',
    title: 'What does your current language learning actually look like?',
    explanation: 'No judgment here. I\'ve tried everything from Pimsleur to grammar marathons to watching K-dramas with English subtitles. What matters isn\'t what method you\'re using - it\'s understanding where you are so we can build from there.',
    options: [
      {
        id: 'daily-apps',
        text: 'Daily apps (Duolingo, Babbel, etc.)',
        description: 'I\'m consistent with apps but not much else',
        value: 'daily_apps'
      },
      {
        id: 'weekly-classes',
        text: 'Weekly classes or tutoring sessions',
        description: 'I have structured lessons with a teacher',
        value: 'weekly_classes'
      },
      {
        id: 'self-study',
        text: 'Self-study with books and courses',
        description: 'I work through textbooks and online courses on my own',
        value: 'self_study'
      },
      {
        id: 'consuming-media',
        text: 'Consuming media in my target language',
        description: 'I watch shows, read content, listen to podcasts',
        value: 'consuming_media'
      },
      {
        id: 'mix-approaches',
        text: 'Mix of different approaches',
        description: 'I\'m doing a bit of everything',
        value: 'mix_approaches'
      },
      {
        id: 'just-getting-started',
        text: 'Just getting started with everything',
        description: 'I\'m still figuring out what works for me',
        value: 'just_getting_started'
      }
    ]
  },
  {
    id: 'motivation',
    type: 'multiple',
    title: 'What\'s driving you to learn [Target Language]? Check all that apply.',
    explanation: 'Your \'why\' determines everything - how intense you need to be, what content you should focus on, and how fast you need to progress. Be honest about what\'s really driving you.',
    options: [
      {
        id: 'education',
        text: 'Support my education/studies',
        description: 'I need this for school, research, or academic goals',
        value: 'education'
      },
      {
        id: 'culture',
        text: 'Connect with people and culture',
        description: 'I want to build real relationships and understand perspectives',
        value: 'culture'
      },
      {
        id: 'productivity',
        text: 'Spend time productively',
        description: 'I\'m tired of scrolling - want to invest in something meaningful',
        value: 'productivity'
      },
      {
        id: 'travel',
        text: 'Prepare for travel or living abroad',
        description: 'I\'ll be visiting/moving and need to communicate',
        value: 'travel'
      },
      {
        id: 'career',
        text: 'Boost my career prospects',
        description: 'This language opens professional doors for me',
        value: 'career'
      },
      {
        id: 'enjoyment',
        text: 'Pure enjoyment and fun',
        description: 'I love the media, culture, and challenge of learning',
        value: 'enjoyment'
      },
      {
        id: 'heritage',
        text: 'Family/heritage connection',
        description: 'This connects me to my roots or loved ones',
        value: 'heritage'
      },
      {
        id: 'challenge',
        text: 'Personal challenge and growth',
        description: 'I want to prove to myself I can master something difficult',
        value: 'challenge'
      }
    ]
  },
  {
    id: 'time-commitment',
    type: 'slider',
    title: 'How much focused time can you realistically commit daily?',
    explanation: 'This is time you can actually protect from distractions - phone off, world out, brain fully engaged. Not time you hope to have someday, not time you had during your most motivated week. Time you can realistically defend every single day.',
    sliderConfig: {
      min: 30,
      max: 480,
      step: 15,
      unit: 'minutes',
      defaultValue: 60
    }
  },
  {
    id: 'lifestyle',
    type: 'single',
    title: 'What does your typical day actually look like?',
    explanation: 'This isn\'t just about your job - it\'s about uncovering the hidden immersion goldmine in your daily routine. Most people have 2-4 hours of \'dead time\' where their ears are free but they\'re listening to nothing productive.',
    options: [
      {
        id: 'commuter-transport',
        text: 'Office commuter with public transport',
        description: 'I travel to work via train, bus, or carpool daily',
        value: 'commuter_transport'
      },
      {
        id: 'commuter-driving',
        text: 'Office commuter driving solo',
        description: 'I drive to work alone, 30+ minutes each way',
        value: 'commuter_driving'
      },
      {
        id: 'work-from-home',
        text: 'Work/study from home',
        description: 'My day is flexible but structured around home-based tasks',
        value: 'work_from_home'
      },
      {
        id: 'student',
        text: 'Student with campus life',
        description: 'I\'m in school with classes, walking between buildings',
        value: 'student'
      },
      {
        id: 'service-industry',
        text: 'Service industry with irregular hours',
        description: 'Restaurant, retail, healthcare - schedule varies',
        value: 'service_industry'
      },
      {
        id: 'physical-job',
        text: 'Physical job on my feet',
        description: 'Construction, warehouse, manual labor - hands busy, ears free',
        value: 'physical_job'
      },
      {
        id: 'parent',
        text: 'Parent juggling kids and work',
        description: 'Driving to activities, waiting during lessons',
        value: 'parent'
      },
      {
        id: 'flexible',
        text: 'Flexible schedule with varied routine',
        description: 'My daily routine changes frequently, lots of free time',
        value: 'flexible'
      }
    ]
  },
  {
    id: 'capability-level',
    type: 'single',
    title: 'Where are you actually at with understanding your target language?',
    explanation: 'This isn\'t about impressing anyone. Your honest assessment here determines whether we recommend kids\' shows or K-drama deep dives. There\'s no wrong answer, only wrong matches between your level and your content.',
    options: [
      {
        id: 'sounds-foreign',
        text: 'Everything sounds like a foreign language (because it is)',
        description: 'I\'m just starting and most content is incomprehensible',
        value: 'sounds_foreign'
      },
      {
        id: 'recognize-words',
        text: 'I recognize familiar words but miss the connections',
        description: 'Individual words make sense, but sentences are still challenging',
        value: 'recognize_words'
      },
      {
        id: 'basic-stories',
        text: 'I follow basic stories but natural speech is tough',
        description: 'Simple content works, but real conversations still challenge me',
        value: 'basic_stories'
      },
      {
        id: 'comprehend-well',
        text: 'I comprehend well but want to go deeper',
        description: 'I understand most content I watch but some subjects are still tough',
        value: 'comprehend_well'
      },
      {
        id: 'comprehension-strong',
        text: 'I\'m comprehension-strong and ready for optimization',
        description: 'My understanding is solid, I want to refine my approach',
        value: 'comprehension_strong'
      }
    ]
  },
  {
    id: 'content-consumption',
    type: 'single',
    title: 'How do you currently consume content in your target language?',
    explanation: 'Your subtitle relationship tells us whether you\'re training your ear or just reading translated content with foreign background noise. Both have their place, but they develop different skills.',
    options: [
      {
        id: 'what-content',
        text: 'What target language content?',
        description: 'I\'m mostly consuming English content right now',
        value: 'what_content'
      },
      {
        id: 'english-subs',
        text: 'Always with English subtitles',
        description: 'I need the translation to follow what\'s happening',
        value: 'english_subs'
      },
      {
        id: 'alternate-subs',
        text: 'I alternate between English and target language subs',
        description: 'Depends on my mood and confidence level',
        value: 'alternate_subs'
      },
      {
        id: 'working-toward',
        text: 'I\'m working toward subtitle-free viewing',
        description: 'Getting more comfortable without text support',
        value: 'working_toward'
      },
      {
        id: 'no-subs',
        text: 'No subtitles, no problem',
        description: 'I prefer raw listening practice',
        value: 'no_subs'
      }
    ]
  },
  {
    id: 'vocabulary-system',
    type: 'single',
    title: 'How do you handle new vocabulary when you encounter it?',
    explanation: 'This reveals everything about your vocabulary acquisition. Looking things up without a system is like filling a bucket with holes. Having Anki but not using it daily is like owning a Ferrari and walking to work.',
    options: [
      {
        id: 'look-up-hope',
        text: 'I look it up and hope I remember',
        description: 'No system, just hoping words stick through exposure',
        value: 'look_up_hope'
      },
      {
        id: 'notebooks',
        text: 'I write words down in notebooks',
        description: 'Traditional vocabulary lists and physical notes',
        value: 'notebooks'
      },
      {
        id: 'anki-srs',
        text: 'I use Anki or similar flashcard apps',
        description: 'I have a spaced repetition system running',
        value: 'anki_srs'
      },
      {
        id: 'save-no-review',
        text: 'I save words but don\'t review them',
        description: 'I collect vocabulary but lack a review system',
        value: 'save_no_review'
      },
      {
        id: 'avoid-lookup',
        text: 'I avoid looking things up',
        description: 'I try to understand from context without interrupting',
        value: 'avoid_lookup'
      },
      {
        id: 'inconsistent',
        text: 'I have a system but it\'s inconsistent',
        description: 'I know what works but struggle with daily habits',
        value: 'inconsistent'
      }
    ]
  },
  {
    id: 'grammar-approach',
    type: 'single',
    title: 'What\'s your current relationship with grammar study and textbooks?',
    explanation: 'Your grammar approach reveals whether you\'re using it as a tool for comprehension or as a roadblock to immersion. There\'s no wrong relationship with grammar study, but there are approaches that serve your goals better than others.',
    options: [
      {
        id: 'obsessed-rules',
        text: 'I\'m obsessed with understanding every rule',
        description: 'I won\'t move forward until I master each grammar point perfectly',
        value: 'obsessed_rules'
      },
      {
        id: 'regular-disconnected',
        text: 'I study grammar regularly but it feels disconnected',
        description: 'I know rules but struggle to recognize them in real content',
        value: 'regular_disconnected'
      },
      {
        id: 'reference-confused',
        text: 'I use grammar as a reference when confused',
        description: 'I look things up when I encounter patterns I don\'t understand',
        value: 'reference_confused'
      },
      {
        id: 'avoid-entirely',
        text: 'I avoid grammar study entirely',
        description: 'I believe immersion alone will teach me everything I need',
        value: 'avoid_entirely'
      },
      {
        id: 'tried-nothing-sticks',
        text: 'I\'ve tried everything but nothing sticks',
        description: 'Grammar feels like information that disappears when I need it',
        value: 'tried_nothing_sticks'
      },
      {
        id: 'sprint-big-picture',
        text: 'I sprint through grammar for the big picture',
        description: 'I learn patterns quickly then focus on finding them in real content',
        value: 'sprint_big_picture'
      }
    ]
  },
  {
    id: 'timeline-expectations',
    type: 'single',
    title: 'When would you like to reach conversational ability in your target language?',
    explanation: 'Your timeline expectations determine whether you\'ll celebrate progress or constantly feel behind. Most people either drastically underestimate the time commitment (wanting fluency in 90 days) or drastically overestimate it (thinking they need decades).',
    options: [
      {
        id: '3-6-months',
        text: 'Within 3-6 months',
        description: 'I\'d like to be having conversations by the end of this year',
        value: '3_6_months'
      },
      {
        id: '6-12-months',
        text: '6-12 months',
        description: 'I\'m planning for significant progress over the next year',
        value: '6_12_months'
      },
      {
        id: '1-2-years',
        text: '1-2 years',
        description: 'I want real fluency but understand it takes time',
        value: '1_2_years'
      },
      {
        id: '2-plus-years',
        text: '2+ years for mastery',
        description: 'I\'m committed to the full journey toward advanced ability',
        value: '2_plus_years'
      },
      {
        id: 'process-timeline',
        text: 'Process over timeline',
        description: 'I care more about consistent progress than hitting specific dates',
        value: 'process_timeline'
      }
    ]
  },
  {
    id: 'accent-priority',
    type: 'single',
    title: 'How important is accent development to you?',
    explanation: 'Your accent goals completely change your timeline and method. Someone who just wants to communicate needs different advice than someone aiming for the level where natives ask what part of Korea you\'re from.',
    options: [
      {
        id: 'dont-care',
        text: 'I don\'t care about accent at all',
        description: 'Just want to be understood - accent doesn\'t matter to me',
        value: 'dont_care'
      },
      {
        id: 'decent-not-obsessed',
        text: 'Decent accent, but not obsessed',
        description: 'I want to sound respectable but won\'t stress about perfection',
        value: 'decent_not_obsessed'
      },
      {
        id: 'pretty-important',
        text: 'Accent is pretty important to me',
        description: 'I want people to take me seriously and be impressed when I speak',
        value: 'pretty_important'
      },
      {
        id: 'near-native',
        text: 'I want to sound near-native',
        description: 'I want Korean friends to be genuinely impressed with my pronunciation',
        value: 'near_native'
      },
      {
        id: 'perfect-accent',
        text: 'Perfect accent is the goal',
        description: 'I want people to question where I\'m actually from',
        value: 'perfect_accent'
      }
    ]
  },
  {
    id: 'speaking-priority',
    type: 'single',
    title: 'How important is speaking *right now* for your situation?',
    explanation: 'This isn\'t about whether speaking is \'important\' - of course it is. This is about whether you need speaking skills immediately or if you can build a massive comprehension foundation first.',
    options: [
      {
        id: 'input-king',
        text: 'Input is King',
        description: 'I only care about understanding for now. I\'ll speak when I\'m ready',
        value: 'input_king'
      },
      {
        id: 'speak-eventually',
        text: 'I want to speak eventually',
        description: 'I\'m not in a rush, but I\'d like to start practicing speaking soon',
        value: 'speak_eventually'
      },
      {
        id: 'survival',
        text: 'I need to speak for survival',
        description: 'It\'s a necessity for my life, work, or upcoming travel',
        value: 'survival'
      },
      {
        id: 'anxiety',
        text: 'Speaking gives me anxiety',
        description: 'I understand a lot but freeze when I try to talk',
        value: 'anxiety'
      },
      {
        id: 'already-speaking',
        text: 'I\'m already speaking but want improvement',
        description: 'I can have conversations but want to sound more natural',
        value: 'already_speaking'
      }
    ]
  },
  {
    id: 'learning-obstacles',
    type: 'single',
    title: 'What\'s your biggest obstacle to consistent daily immersion right now?',
    explanation: 'Be brutally honest here. I\'ve been exactly where you are, and I know the real obstacles aren\'t what we think they are. Your biggest barrier isn\'t lack of time or talent - it\'s usually something much more specific and solvable.',
    options: [
      {
        id: 'dont-know-start',
        text: 'I don\'t know where to start',
        description: 'The amount of content options feels overwhelming',
        value: 'dont_know_start'
      },
      {
        id: 'cant-find-content',
        text: 'I can\'t find content I actually enjoy',
        description: 'Everything feels too boring or too difficult',
        value: 'cant_find_content'
      },
      {
        id: 'frustrated-quit',
        text: 'I get frustrated and give up easily',
        description: 'When I don\'t understand, I want to quit immediately',
        value: 'frustrated_quit'
      },
      {
        id: 'fall-back-english',
        text: 'I keep falling back to English content',
        description: 'Target language content requires too much effort',
        value: 'fall_back_english'
      },
      {
        id: 'no-consistent-routine',
        text: 'I don\'t have a consistent routine',
        description: 'I do it when I feel motivated, which isn\'t often',
        value: 'no_consistent_routine'
      },
      {
        id: 'doing-well',
        text: 'I\'m already doing pretty well',
        description: 'I have most things figured out, just want to optimize',
        value: 'doing_well'
      }
    ]
  },
  {
    id: 'communication-preference',
    type: 'single',
    title: 'How do you prefer to receive honest feedback about your language learning approach?',
    explanation: 'This determines how I\'ll deliver your results. Some people need tough love to break through denial. Others need encouragement to overcome perfectionist paralysis. I want to give you exactly the kind of guidance that will actually help you take action.',
    options: [
      {
        id: 'give-straight',
        text: 'Give it to me straight',
        description: 'I want the honest truth, even if it\'s uncomfortable to hear',
        value: 'give_straight'
      },
      {
        id: 'encouraging-realistic',
        text: 'Be encouraging but realistic',
        description: 'I need motivation mixed with practical reality checks',
        value: 'encouraging_realistic'
      },
      {
        id: 'focus-doing-right',
        text: 'Focus on what I\'m doing right',
        description: 'I respond better to positive reinforcement than criticism',
        value: 'focus_doing_right'
      },
      {
        id: 'challenge-better',
        text: 'Challenge me to do better',
        description: 'I need someone to push me outside my comfort zone',
        value: 'challenge_better'
      },
      {
        id: 'just-plan',
        text: 'Just give me the plan',
        description: 'Skip the psychology, I just want to know what to do next',
        value: 'just_plan'
      }
    ]
  }
];

export default questions;
