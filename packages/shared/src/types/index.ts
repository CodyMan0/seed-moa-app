/** 운전면허 취득 로드맵 단계 */
export type RoadmapStepId =
  | 'theory-study'
  | 'theory-exam'
  | 'skill-study'
  | 'skill-exam'
  | 'road-study'
  | 'road-exam'
  | 'license-issue';

export type RoadmapStepStatus = 'pending' | 'in-progress' | 'completed' | 'skipped';

export interface RoadmapStep {
  id: RoadmapStepId;
  order: number;
  title: string;
  description: string;
  estimatedDays: number;
}

/** 비용 항목 */
export interface CostItem {
  id: string;
  label: string;
  amount: number;
  category: 'exam' | 'education' | 'document' | 'other';
  required: boolean;
}

/** 일정 */
export interface Schedule {
  stepId: RoadmapStepId;
  startDate: string; // ISO date
  endDate: string;   // ISO date
  status: RoadmapStepStatus;
}
