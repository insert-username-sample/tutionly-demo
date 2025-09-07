// Tutor personality configurations for different subjects
export interface TutorPersonality {
  name: string;
  subject: string;
  description: string;
  defaultTopic: string;
  personality: string;
  teachingStyle: string;
  voice: 'male' | 'female';
}

export const TUTOR_PERSONALITIES: Record<string, TutorPersonality> = {
  math: {
    name: "Math Tutorly",
    subject: "Mathematics", 
    description: "Your enthusiastic math companion who makes numbers come alive",
    defaultTopic: "Quadratic Equations and Problem Solving",
    personality: "Patient, encouraging, and loves breaking down complex problems step-by-step",
    teachingStyle: "Uses real-world examples and visual analogies to make math concepts clear",
    voice: "male"
  },
  science: {
    name: "Science Tutorly", 
    subject: "Science",
    description: "Your curious science guide exploring the wonders of the natural world",
    defaultTopic: "Chemical Reactions and the Periodic Table",
    personality: "Curious, experimental, and passionate about discovery",
    teachingStyle: "Connects scientific concepts to everyday phenomena and encourages hands-on thinking",
    voice: "female"
  },
  english: {
    name: "English Tutorly",
    subject: "English Literature",
    description: "Your literary companion who brings stories and writing to life", 
    defaultTopic: "Creative Writing and Literary Analysis",
    personality: "Creative, insightful, and loves exploring the power of words",
    teachingStyle: "Uses storytelling and practical examples to improve reading and writing skills",
    voice: "female"
  },
  history: {
    name: "History Tutorly",
    subject: "History",
    description: "Your time-traveling guide through the fascinating stories of the past",
    defaultTopic: "World War II and Its Global Impact", 
    personality: "Storytelling, engaging, and connects past events to modern times",
    teachingStyle: "Makes history come alive through narratives and connections to current events",
    voice: "male"
  },
  coding: {
    name: "Code Tutorly",
    subject: "Computer Science", 
    description: "Your coding mentor who makes programming fun and accessible",
    defaultTopic: "JavaScript Fundamentals and Web Development",
    personality: "Logical, patient, and loves problem-solving",
    teachingStyle: "Teaches through practical examples and real-world coding projects",
    voice: "male"
  },
  "social science": {
    name: "Social Science Tutorly",
    subject: "Social Science",
    description: "Your guide to understanding society and its structures",
    defaultTopic: "Introduction to Sociology",
    personality: "Analytical, empathetic, and loves discussing social issues",
    teachingStyle: "Uses real-world case studies and encourages critical thinking",
    voice: "female"
  },
  economics: {
    name: "Economics Tutorly",
    subject: "Economics",
    description: "Your expert on the economy, markets, and financial literacy",
    defaultTopic: "Supply and Demand",
    personality: "Pragmatic, insightful, and loves explaining complex economic concepts",
    teachingStyle: "Uses current events and practical examples to teach economics",
    voice: "male"
  }
};

export function getTutorBySubject(subject: string): TutorPersonality {
  const normalizedSubject = subject.toLowerCase();
  return TUTOR_PERSONALITIES[normalizedSubject] || TUTOR_PERSONALITIES.math;
}

// Sample learning topics for each subject
export const LEARNING_TOPICS: Record<string, string[]> = {
  math: [
    "Quadratic Equations and Problem Solving",
    "Calculus: Derivatives and Integrals", 
    "Geometry: Angles and Triangles",
    "Statistics and Probability",
    "Algebra: Linear Equations",
    "Trigonometry: Sine, Cosine, and Tangent"
  ],
  science: [
    "Chemical Reactions and the Periodic Table",
    "Physics: Forces and Motion",
    "Biology: Cell Structure and Function", 
    "Chemistry: Atomic Structure",
    "Earth Science: Weather and Climate",
    "Astronomy: Solar System and Stars"
  ],
  english: [
    "Creative Writing and Literary Analysis",
    "Grammar: Sentence Structure and Punctuation",
    "Poetry: Forms and Literary Devices",
    "Essay Writing: Persuasive and Analytical",
    "Reading Comprehension Strategies",
    "Vocabulary Building and Word Usage"
  ],
  history: [
    "World War II and Its Global Impact",
    "American Revolution: Causes and Effects",
    "Ancient Civilizations: Egypt and Rome", 
    "Civil Rights Movement in America",
    "Renaissance: Art, Science, and Culture",
    "Cold War: Tensions and Consequences"
  ],
  coding: [
    "JavaScript Fundamentals and Web Development",
    "Python Programming: Basics to Advanced",
    "HTML and CSS: Building Web Pages",
    "React: Creating Interactive Applications",
    "Data Structures and Algorithms",
    "Database Design and SQL Queries"
  ],
  "social science": [
    "Introduction to Sociology",
    "Cultural Anthropology",
    "Political Science Basics",
    "Introduction to Psychology",
    "Civics and Government"
  ],
  economics: [
    "Supply and Demand",
    "Microeconomics vs. Macroeconomics",
    "GDP and Economic Growth",
    "Inflation and Unemployment",
    "International Trade"
  ]
};

export function getTopicsForSubject(subject: string): string[] {
  const normalizedSubject = subject.toLowerCase();
  return LEARNING_TOPICS[normalizedSubject] || LEARNING_TOPICS.math;
}
