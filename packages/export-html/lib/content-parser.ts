export interface Stage {
  number: number;
  title: string;
  objective: string;
  keyPoints: string[];
  duration: string;
  content?: StageContent;
}

export interface StageContent {
  introduction: string;
  sections: Array<{
    heading: string;
    content: string;
    interactiveType?: 'fillBlanks' | 'matchColumns' | 'dragDrop' | 'imageHotspots' | 'expandable' | 'timeline' | 'diagram' | 'exercise' | null;
    interactiveData?: any; // Data for interactive components
    interactiveContent?: string; // For expandable sections
  }>;
  summary: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
  explanation: string;
}

export interface VideoScene {
  id: number;
  duration: number;
  text: string;
  subtext?: string;
  animation: 'fadeIn' | 'slideIn' | 'typewriter';
  narration: string;
}

export interface PodcastSegment {
  speaker: 'host' | 'expert';
  text: string;
  duration: number;
}

export interface CourseData {
  title: string;
  description: string;
  topic: string;
  stages: Stage[];
  quiz: QuizQuestion[];
  videoScript: VideoScene[];
  podcastScript: PodcastSegment[];
}

export class ContentParser {
  static parseCourseOutline(response: string): { stages: Stage[]; overview: string } {
    try {
      const parsed = typeof response === 'string' ? JSON.parse(response) : response;
      return {
        stages: parsed.stages || [],
        overview: parsed.overview || '',
      };
    } catch (error) {
      console.error('Failed to parse course outline:', error);
      throw new Error('Invalid course outline format');
    }
  }

  static parseStageContent(response: string): StageContent {
    try {
      const parsed = typeof response === 'string' ? JSON.parse(response) : response;
      return {
        introduction: parsed.introduction || '',
        sections: (parsed.sections || []).map((section: any) => ({
          heading: section.heading || '',
          content: section.content || '',
          interactiveType: section.interactiveType || null,
          interactiveData: section.interactiveData || null,
          interactiveContent: section.interactiveContent || null,
        })),
        summary: parsed.summary || '',
      };
    } catch (error) {
      console.error('Failed to parse stage content:', error);
      throw new Error('Invalid stage content format');
    }
  }

  static parseQuizQuestions(response: string): QuizQuestion[] {
    try {
      const parsed = typeof response === 'string' ? JSON.parse(response) : response;
      return parsed.questions || [];
    } catch (error) {
      console.error('Failed to parse quiz questions:', error);
      throw new Error('Invalid quiz format');
    }
  }

  static parseVideoScript(response: string): VideoScene[] {
    try {
      const parsed = typeof response === 'string' ? JSON.parse(response) : response;
      return parsed.scenes || [];
    } catch (error) {
      console.error('Failed to parse video script:', error);
      throw new Error('Invalid video script format');
    }
  }

  static parsePodcastScript(response: string): PodcastSegment[] {
    try {
      const parsed = typeof response === 'string' ? JSON.parse(response) : response;
      return parsed.segments || [];
    } catch (error) {
      console.error('Failed to parse podcast script:', error);
      throw new Error('Invalid podcast script format');
    }
  }
}
