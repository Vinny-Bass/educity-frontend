export const ARCHETYPE_TAGS = ['focused-achiever','curious-explorer','kind-innovator','resilient-collaborator','insightful-navigator'] as const;
export type ArchetypeId = (typeof ARCHETYPE_TAGS)[number];

export interface RadarAttribute {
  label: string;
  value: number;
  description: string;
}

export interface ArchetypeDefinition {
  id: ArchetypeId;
  name: string;
  description: string;
  shortDescription: string;
  longDescription1: string;
  longDescription2: string;
  logo: string;
  radarChart: string;
  radarAttributes: RadarAttribute[];
}

export interface ArchetypeQuizAnswer {
  id: string;
  text: string;
  tag: ArchetypeId;
}

export interface ArchetypeQuizQuestion {
  id: string;
  question: string;
  answers: ArchetypeQuizAnswer[];
}

export const ARCHETYPE_LIBRARY: Record<ArchetypeId, ArchetypeDefinition> = {
  'focused-achiever': {
    id: 'focused-achiever',
    name: 'Focused Achiever',
    description:
      'You are organized and determined, always planning your next steps and sticking to your goals.',
    shortDescription:
      'You support teams well and help keep everyone on track. You prefer clear instructions over wild brainstorming.',
    longDescription1:
      'Based on your responses, you prioritize structure and acting after a plan is laid out rather than jumping in blindly.',
    longDescription2:
      'With EDEN, you’ll learn how to use your focus to lead projects, track progress, and push yourself even further.',
    logo: '/archetype-logo-placeholder.svg',
    radarChart: '/archetype-logo-placeholder.svg',
    radarAttributes: [
      { label: 'Judgment', value: 4, description: 'Strong at organizing, evaluating evidence, and planning' },
      { label: 'Creativity', value: 2, description: 'Prefers structure, less focused on generating novel ideas' },
      { label: 'Collaboration', value: 3, description: 'Competent teammate; gets groups organized and on-task' },
      { label: 'Persistence', value: 4, description: 'Highly resilient, keeps going through challenges' },
      { label: 'Bias-to-Action', value: 2, description: 'Prefers to act after a plan is laid out rather than jump in' },
    ],
  },
  'curious-explorer': {
    id: 'curious-explorer',
    name: 'Curious Explorer',
    description:
      'You are most likely naturally imaginative, creative, and always up for exploring new ideas.',
    shortDescription:
      'You like working with others and learning by asking questions. You prefer moving on if things get repetitive.',
    longDescription1:
      'You thrive on originality and “what ifs?”, using your judgment to assess new ideas rather than relying solely on methodical logic.',
    longDescription2:
      'At EDEN, you’ll get to turn this curiosity into real skills, trying new challenges and sharing your unique ideas.',
    logo: '/archetype-logo-placeholder.svg',
    radarChart: '/archetype-logo-placeholder.svg',
    radarAttributes: [
      { label: 'Judgment', value: 3, description: 'Uses judgment to assess new ideas, but less focused on methodical logic' },
      { label: 'Creativity', value: 4, description: 'Most notable trait; thrives on originality, “what ifs?”, and experimentation' },
      { label: 'Collaboration', value: 3, description: 'Enjoys sharing ideas, can be great in team brainstorms' },
      { label: 'Persistence', value: 2, description: 'Motivation dips if curiosity isn’t engaged, less driven by grit' },
      { label: 'Bias-to-Action', value: 4, description: 'Acts quickly on interests and experiments frequently' },
    ],
  },
  'resilient-collaborator': {
    id: 'resilient-collaborator',
    name: 'Resilient Collaborator',
    description:
      'You’re a team player who listens, encourages, and helps your group through challenges.',
    shortDescription:
      'You make thoughtful decisions even if the ideas seem traditional, prioritizing consensus and connection.',
    longDescription1:
      'You are an excellent listener and team advocate who keeps the group moving through obstacles.',
    longDescription2:
      'At EDEN, you’ll build your leadership and teamwork skills and make every group stronger and more connected.',
    logo: '/archetype-logo-placeholder.svg',
    radarChart: '/archetype-logo-placeholder.svg',
    radarAttributes: [
      { label: 'Judgment', value: 3, description: 'Thoughtful decision-maker, values group input' },
      { label: 'Creativity', value: 2, description: 'Supports others’ ideas, doesn’t seek novelty as much' },
      { label: 'Collaboration', value: 4, description: 'Excellent listener, communicator, team advocate' },
      { label: 'Persistence', value: 4, description: 'Keeps group moving, supports through obstacles' },
      { label: 'Bias-to-Action', value: 2, description: 'Waits for consensus or encouragement before initiating' },
    ],
  },
  'kind-innovator': {
    id: 'kind-innovator',
    name: 'Kind Innovator',
    description:
      'You want your ideas to help people, showing compassion and creative thinking when it matters.',
    shortDescription:
      'You’re motivated by making a difference and lifting up others, taking initiative when it benefits people.',
    longDescription1:
      'Your decisions are guided by empathy and impact, and you are driven to continue by the chance to make a difference.',
    longDescription2:
      'EDEN gives you the space to grow your impact, connect with others, and make your kindness count.',
    logo: '/archetype-logo-placeholder.svg',
    radarChart: '/archetype-logo-placeholder.svg',
    radarAttributes: [
      { label: 'Judgment', value: 3, description: 'Decisions guided by empathy and impact' },
      { label: 'Creativity', value: 3, description: 'Enjoys creative solutions, especially for helping others' },
      { label: 'Collaboration', value: 4, description: 'Motivated to connect, support, and lift others' },
      { label: 'Persistence', value: 3, description: 'Driven to continue by the chance to make a difference' },
      { label: 'Bias-to-Action', value: 2, description: 'Takes initiative when it will benefit people, sometimes more reactive' },
    ],
  },
  'insightful-navigator': {
    id: 'insightful-navigator',
    name: 'Insightful Navigator',
    description:
      'You’re tech-savvy, great at figuring things out, and quick to try new digital tools.',
    shortDescription:
      'You enjoy learning from evidence or experimenting with new solutions, often preferring to work independently or with technology.',
    longDescription1:
      'You make well-reasoned decisions and innovate through tools, persevering through complex challenges.',
    longDescription2:
      'With EDEN, you’ll solve challenges with tech, develop deeper skills, and become a bold explorer of the digital world.',
    logo: '/archetype-logo-placeholder.svg',
    radarChart: '/archetype-logo-placeholder.svg',
    radarAttributes: [
      { label: 'Judgment', value: 4, description: 'Makes well-reasoned, evidence-based decisions' },
      { label: 'Creativity', value: 3, description: 'Innovates through tech/tools, enjoys complex problem-solving' },
      { label: 'Collaboration', value: 2, description: 'Can work with others, but prefers independent analysis' },
      { label: 'Persistence', value: 3, description: 'Perseveres when solving complex challenges' },
      { label: 'Bias-to-Action', value: 4, description: 'Quick to try out new tech and solutions, not afraid to take the lead if data supports' },
    ],
  },
};

export const ARCHETYPE_PRIORITY: ArchetypeId[] = [
  'focused-achiever',
  'curious-explorer',
  'kind-innovator',
  'resilient-collaborator',
  'insightful-navigator'
];

export const DEFAULT_ARCHETYPE_ID: ArchetypeId = ARCHETYPE_PRIORITY[0];

export const ARCHETYPE_QUIZ_QUESTIONS: ArchetypeQuizQuestion[] = [
  {
    id: 'q1',
    question: 'When you imagine success, what does it look like?',
    answers: [
      { id: 'q1-a1', text: 'Completing tasks on time and well.', tag: 'focused-achiever' },
      { id: 'q1-a2', text: 'Finding new paths and answers.', tag: 'curious-explorer' },
      { id: 'q1-a3', text: 'Helping others succeed.', tag: 'kind-innovator' },
      { id: 'q1-a4', text: 'Being a trusted team member or leader.', tag: 'resilient-collaborator' },
      { id: 'q1-a5', text: 'Discovering and using advanced tools.', tag: 'insightful-navigator' },
    ],
  },
  {
    id: 'q2',
    question: 'When learning something new, you prefer…',
    answers: [
      { id: 'q2-a1', text: 'Learning together with friends.', tag: 'resilient-collaborator' },
      { id: 'q2-a2', text: 'Step-by-step instructions.', tag: 'focused-achiever' },
      { id: 'q2-a3', text: 'Understanding the impact on others.', tag: 'kind-innovator' },
      { id: 'q2-a4', text: 'Using technology or apps for help.', tag: 'insightful-navigator' },
      { id: 'q2-a5', text: 'Exploring creatively and experimenting.', tag: 'curious-explorer' },
    ],
  },
  {
    id: 'q3',
    question: 'What type of feedback helps you improve most?',
    answers: [
      { id: 'q3-a1', text: 'Tips on using tools better.', tag: 'insightful-navigator' },
      { id: 'q3-a2', text: 'Suggestions for more creativity.', tag: 'curious-explorer' },
      { id: 'q3-a3', text: 'Clear, actionable steps.', tag: 'focused-achiever' },
      { id: 'q3-a4', text: 'Positive reinforcement of values.', tag: 'kind-innovator' },
      { id: 'q3-a5', text: 'Encouragement and group feedback.', tag: 'resilient-collaborator' },
    ],
  },
  {
    id: 'q4',
    question: 'How do you feel about teamwork?',
    answers: [
      { id: 'q4-a1', text: 'I like clear roles and responsibilities.', tag: 'focused-achiever' },
      { id: 'q4-a2', text: 'I want the team’s work to help others.', tag: 'kind-innovator' },
      { id: 'q4-a3', text: 'I prefer to contribute by researching and finding resources.', tag: 'insightful-navigator' },
      { id: 'q4-a4', text: 'I value supporting and listening to others.', tag: 'resilient-collaborator' },
      { id: 'q4-a5', text: 'I enjoy brainstorming with others.', tag: 'curious-explorer' },
    ],
  },
  {
    id: 'q5',
    question: 'How do you prefer to spend your free time?',
    answers: [
      { id: 'q5-a1', text: 'Exploring technology or games.', tag: 'insightful-navigator' },
      { id: 'q5-a2', text: 'Hanging out with friends.', tag: 'resilient-collaborator' },
      { id: 'q5-a3', text: 'Trying new hobbies or ideas.', tag: 'curious-explorer' },
      { id: 'q5-a4', text: 'Planning or organizing tasks.', tag: 'focused-achiever' },
      { id: 'q5-a5', text: 'Volunteering or helping others.', tag: 'kind-innovator' },
    ],
  },
];

