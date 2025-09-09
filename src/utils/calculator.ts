export interface UserResponses {
  [key: string]: string | string[] | number;
}

export interface LearnerProfile {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  detailedDescription: string;
}

export interface TimeAllocation {
  immersionTime: number;
  studyTime: number;
  outputTime: number;
  totalTime: number;
}

export interface PassiveTimeEstimate {
  time: string;
  description: string;
  activities: string[];
}

export interface RealityCheck {
  type: 'warning' | 'reality' | 'optimization' | 'habit' | 'system';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
}

export interface CalculatorResults {
  learnerProfile: LearnerProfile;
  timeAllocation: TimeAllocation;
  passiveTimeEstimate: PassiveTimeEstimate;
  realityChecks: RealityCheck[];
  recommendations: string[];
  nextSteps: string[];
}

export function assignLearnerProfile(responses: UserResponses): LearnerProfile {
  const motivation = responses.motivation as string[];
  const speaking = responses['speaking-priority'] as string;
  const level = responses['capability-level'] as string;
  const time = responses['time-commitment'] as number;
  const accent = responses['accent-priority'] as string;

  // High commitment + Input focus = Immersion Devotee
  if (time >= 240 && speaking === 'input_king') {
    return {
      id: 'immersion-devotee',
      title: 'The Immersion Devotee',
      description: 'You\'re all-in on building a massive comprehension base.',
      detailedDescription: 'Your journey is about depth and patience, leading to an exceptionally strong intuitive grasp of the language. You understand that true fluency comes from thousands of hours of input, and you\'re willing to put in the time.',
      icon: '🧘‍♂️',
      color: '#4F46E5'
    };
  }

  // Urgent speaking needs = Survivalist  
  if (speaking === 'survival' || (motivation && (motivation.includes('travel') || motivation.includes('career')))) {
    return {
      id: 'survivalist',
      title: 'The Survivalist',
      description: 'You need to function in the real world, now.',
      detailedDescription: 'Your plan balances building deep understanding with practical skills to speak and survive. You have deadlines and real-world pressure, which can actually be a powerful motivator when channeled correctly.',
      icon: '⚡',
      color: '#DC2626'
    };
  }

  // Media focus + Input priority = Media Purist
  if (motivation && motivation.includes('enjoyment') && speaking === 'input_king') {
    return {
      id: 'media-purist',
      title: 'The Media Purist',
      description: 'You\'re focused on pure comprehension to enjoy content.',
      detailedDescription: 'This is a powerful path to building massive vocabulary and native-like intuition. Your love for the culture and media will sustain you through the challenging periods.',
      icon: '🎬',
      color: '#7C3AED'
    };
  }

  // Heritage/family connection
  if (motivation && motivation.includes('heritage')) {
    return {
      id: 'heritage-reconnector',
      title: 'The Heritage Reconnector',
      description: 'You\'re reconnecting with your roots.',
      detailedDescription: 'This emotional connection is a powerful motivator that will sustain you through challenges. Your family history gives you context and meaning that most learners lack.',
      icon: '🌳',
      color: '#059669'
    };
  }

  // Academic focus
  if (motivation && motivation.includes('education')) {
    return {
      id: 'academic-achiever',
      title: 'The Academic Achiever',
      description: 'You need language skills for educational success.',
      detailedDescription: 'Your structured approach and clear deadlines are advantages. You understand the value of systematic learning and have the discipline to follow through.',
      icon: '🎓',
      color: '#0891B2'
    };
  }

  // Challenge seeker
  if (motivation && motivation.includes('challenge') && time >= 120) {
    return {
      id: 'challenge-conqueror',
      title: 'The Challenge Conqueror',
      description: 'You\'re here to prove something to yourself.',
      detailedDescription: 'Your competitive nature and desire for personal growth will drive you to achieve things most people think are impossible. Use this drive wisely.',
      icon: '🏔️',
      color: '#B45309'
    };
  }

  // Default fallback
  return {
    id: 'balanced-learner',
    title: 'The Balanced Learner',
    description: 'You\'re building a well-rounded skill set.',
    detailedDescription: 'You\'re developing strong listening skills while preparing to speak. This balanced approach will serve you well in the long run, even if progress feels slower initially.',
    icon: '⚖️',
    color: '#6B7280'
  };
}

export function calculateTimeAllocation(responses: UserResponses): TimeAllocation {
  const time = responses['time-commitment'] as number;
  const speaking = responses['speaking-priority'] as string;
  const level = responses['capability-level'] as string;

  let ratios = {
    immersion: 0.7,
    study: 0.2,
    output: 0.1
  };

  // Adjust based on speaking priority
  if (speaking === 'input_king') {
    ratios = { immersion: 0.9, study: 0.1, output: 0.0 };
  } else if (speaking === 'survival') {
    ratios = { immersion: 0.6, study: 0.2, output: 0.2 };
  } else if (speaking === 'speak_eventually') {
    ratios = { immersion: 0.7, study: 0.2, output: 0.1 };
  } else if (speaking === 'anxiety') {
    ratios = { immersion: 0.8, study: 0.15, output: 0.05 };
  } else if (speaking === 'already_speaking') {
    ratios = { immersion: 0.6, study: 0.1, output: 0.3 };
  }

  // Adjust for beginner level
  if (level === 'sounds_foreign') {
    ratios.study += 0.1;
    ratios.immersion -= 0.1;
  }

  // Calculate actual minutes
  const immersionTime = Math.round((time * ratios.immersion) / 5) * 5;
  const studyTime = Math.round((time * ratios.study) / 5) * 5;
  const outputTime = Math.max(0, time - immersionTime - studyTime);

  return { 
    immersionTime, 
    studyTime, 
    outputTime,
    totalTime: time
  };
}

export function estimatePassiveTime(lifestyle: string): PassiveTimeEstimate {
  const passiveTimeMap: Record<string, PassiveTimeEstimate> = {
    'commuter_transport': {
      time: "60-90+ minutes",
      description: "Your commute is a golden opportunity. Download podcasts or audiobooks. Turn travel time into learning time.",
      activities: ["Podcasts during commute", "Audio lessons on train", "Music playlists"]
    },
    'commuter_driving': {
      time: "60-90+ minutes", 
      description: "Perfect for audio immersion. Target language music, podcasts, and audiobooks can transform your drive.",
      activities: ["Podcasts while driving", "Audio courses", "Target language music"]
    },
    'work_from_home': {
      time: "30-60+ minutes",
      description: "Incorporate language into your chores. Listen while cooking, cleaning, or during breaks.",
      activities: ["Background audio while working", "Podcasts during chores", "Music during breaks"]
    },
    'student': {
      time: "45-75+ minutes",
      description: "Walking between classes, working out, or doing laundry are perfect for passive listening.",
      activities: ["Audio while walking to class", "Podcasts during exercise", "Background study music"]
    },
    'service_industry': {
      time: "20-40+ minutes",
      description: "Use prep time, commutes, and breaks for passive immersion when possible.",
      activities: ["Audio during prep work", "Podcasts on breaks", "Music during closing"]
    },
    'physical_job': {
      time: "120-180+ minutes",
      description: "Your job is perfect for passive immersion - hands busy, ears free for continuous input.",
      activities: ["Podcasts during work", "Audio courses all day", "Immersive background audio"]
    },
    'parent': {
      time: "45-75+ minutes", 
      description: "Waiting during kids' activities, driving to lessons, household tasks become learning opportunities.",
      activities: ["Audio while driving kids", "Podcasts during wait times", "Background audio during chores"]
    },
    'flexible': {
      time: "90-120+ minutes",
      description: "You have the most potential for passive immersion. Make it the soundtrack to your daily activities.",
      activities: ["All-day background immersion", "Varied audio content", "Maximum flexibility"]
    }
  };

  return passiveTimeMap[lifestyle] || passiveTimeMap['flexible'];
}

export function generateRealityChecks(responses: UserResponses): RealityCheck[] {
  const time = responses['time-commitment'] as number;
  const speaking = responses['speaking-priority'] as string;
  const level = responses['capability-level'] as string;
  const timeline = responses['timeline-expectations'] as string;
  const accent = responses['accent-priority'] as string;
  const contentConsumption = responses['content-consumption'] as string;
  const vocabularySystem = responses['vocabulary-system'] as string;
  
  const warnings: RealityCheck[] = [];

  // Unrealistic timeline checks
  if (time <= 45 && speaking === 'survival') {
    warnings.push({
      type: 'warning',
      title: 'Ambitious Goal Alert',
      message: 'Needing to speak with limited active time is a major challenge. Your focus must be laser-sharp on survival phrases. Every minute counts.',
      priority: 'high'
    });
  }

  // Beginner + complex goals
  if (level === 'sounds_foreign' && timeline === '3_6_months' && accent !== 'dont_care') {
    warnings.push({
      type: 'reality',
      title: 'Timeline Reality Check', 
      message: 'Perfect accent + conversational ability in 6 months as a beginner requires 3-4+ hours daily of focused practice. Be prepared to adjust expectations or time commitment.',
      priority: 'high'
    });
  }

  // High time + No output balance
  if (time >= 240 && speaking !== 'input_king') {
    warnings.push({
      type: 'optimization',
      title: 'Don\'t Neglect Output',
      message: 'With this much immersion time, your understanding will skyrocket. Make sure to dedicate some time to speaking practice so your active skills don\'t lag behind.',
      priority: 'medium'
    });
  }

  // Subtitle addiction warning
  if (contentConsumption === 'english_subs' && level !== 'sounds_foreign') {
    warnings.push({
      type: 'habit',
      title: 'Subtitle Dependency Risk',
      message: 'You\'re training your reading skills more than listening. Consider gradually reducing English subtitles to develop true comprehension.',
      priority: 'medium'
    });
  }

  // Inconsistent vocabulary system
  if (vocabularySystem === 'inconsistent') {
    warnings.push({
      type: 'system',
      title: 'Vocabulary System Gap',
      message: 'Your inconsistent review habits are holding you back. Even 10 minutes of daily SRS would accelerate your progress significantly.',
      priority: 'medium'
    });
  }

  return warnings;
}

export function generateRecommendations(responses: UserResponses, profile: LearnerProfile): string[] {
  const recommendations: string[] = [];
  const level = responses['capability-level'] as string;
  const speaking = responses['speaking-priority'] as string;
  const motivation = responses.motivation as string[];

  // Level-based recommendations
  if (level === 'sounds_foreign') {
    recommendations.push('Start with comprehensible input at your level - children\'s content isn\'t beneath you, it\'s strategic');
    recommendations.push('Focus on high-frequency vocabulary first - the top 1000 words will unlock 80% of daily conversation');
  } else if (level === 'comprehension_strong') {
    recommendations.push('Challenge yourself with native content in your areas of interest');
    recommendations.push('Start intensive reading to build vocabulary depth');
  }

  // Speaking priority recommendations
  if (speaking === 'survival') {
    recommendations.push('Prioritize survival phrases and situational dialogues');
    recommendations.push('Practice shadowing technique for pronunciation and rhythm');
  } else if (speaking === 'input_king') {
    recommendations.push('Maximize your listening hours - this is your superpower phase');
    recommendations.push('Build massive passive vocabulary before worrying about output');
  }

  // Motivation-based recommendations
  if (motivation && motivation.includes('enjoyment')) {
    recommendations.push('Use your media interests as your primary immersion source');
    recommendations.push('Create playlists and content libraries around your favorite genres');
  }

  if (motivation && motivation.includes('career')) {
    recommendations.push('Focus on professional vocabulary in your field');
    recommendations.push('Practice formal register and business communication');
  }

  return recommendations;
}

export function generateNextSteps(responses: UserResponses, profile: LearnerProfile): string[] {
  const steps: string[] = [];
  const obstacle = responses['learning-obstacles'] as string;
  const vocabularySystem = responses['vocabulary-system'] as string;
  const time = responses['time-commitment'] as number;

  // Address main obstacle
  if (obstacle === 'dont_know_start') {
    steps.push('Download one podcast app and subscribe to 3 beginner-friendly shows in your target language');
    steps.push('Set up a simple Anki deck or vocabulary app for daily review');
  } else if (obstacle === 'cant_find_content') {
    steps.push('Try the "ladder method" - start with content slightly below your level and gradually increase difficulty');
    steps.push('Explore different genres - documentaries, reality TV, cooking shows, sports commentary');
  } else if (obstacle === 'no_consistent_routine') {
    steps.push('Start with just 15 minutes daily at the same time - consistency beats intensity');
    steps.push('Link your language practice to an existing habit (coffee, commute, workout)');
  }

  // Vocabulary system setup
  if (vocabularySystem === 'look_up_hope' || vocabularySystem === 'inconsistent') {
    steps.push('Set up Anki with a pre-made deck for your target language');
    steps.push('Commit to 10 minutes of daily review - no exceptions, no excuses');
  }

  // Time-based steps
  if (time >= 120) {
    steps.push('Create immersion blocks - 45-60 minute focused sessions without distractions');
    steps.push('Track your hours weekly to maintain accountability');
  } else {
    steps.push('Maximize efficiency with spaced repetition and high-frequency content');
    steps.push('Use every transition moment - walking, waiting, commuting');
  }

  return steps;
}

export function calculateResults(responses: UserResponses): CalculatorResults {
  const learnerProfile = assignLearnerProfile(responses);
  const timeAllocation = calculateTimeAllocation(responses);
  const passiveTimeEstimate = estimatePassiveTime(responses.lifestyle as string);
  const realityChecks = generateRealityChecks(responses);
  const recommendations = generateRecommendations(responses, learnerProfile);
  const nextSteps = generateNextSteps(responses, learnerProfile);

  return {
    learnerProfile,
    timeAllocation,
    passiveTimeEstimate,
    realityChecks,
    recommendations,
    nextSteps
  };
}
