// Application form data types

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface WorkEligibility {
  workAuth: 'yes' | 'no' | '';
  sponsorshipNeeded?: 'yes' | 'no' | '';
  explanation?: string;
}

export interface Experience {
  yearsExperience: number | '';
  portfolioUrl?: string;
  resumeUrl?: string;
}

export interface ApplicationFormData {
  personalInfo: PersonalInfo;
  workEligibility: WorkEligibility;
  experience: Experience;
}

export type ValidationErrors = Record<string, string>;

export interface ValidationResult {
  valid: boolean;
  errors: ValidationErrors;
}

export interface SubmissionResponse {
  id: string;
}

export interface StoredApplication extends ApplicationFormData {
  id: string;
  submittedAt: string;
}
