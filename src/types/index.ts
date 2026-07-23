export interface Project {
  id: number;
  title: string;
  category: 'all' | 'realtime' | 'saas' | 'commerce' | 'mobile';
  tags: string[];
  description: string;
  contributions: string[];
  github: string;
  live: string;
  colSpan: string;
}

export interface SkillCategoryData {
  title: string;
  icon: string;
  skills: string[];
  familiar?: string[];
  delay?: string;
}

export interface EducationItemData {
  role: string;
  company: string;
  date: string;
  details: string[];
}
