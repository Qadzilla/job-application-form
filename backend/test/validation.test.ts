import { describe, it, expect } from 'vitest';
import { validateApplication, validatePersonalInfo, validateWorkEligibility, validateExperience } from '../src/validation.js';
import type { ApplicationFormData } from 'shared';

const validFormData: ApplicationFormData = {
  personalInfo: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567'
  },
  workEligibility: {
    workAuth: 'yes'
  },
  experience: {
    yearsExperience: 5,
    portfolioUrl: 'https://johndoe.dev',
    resumeUrl: 'https://example.com/resume.pdf'
  }
};

describe('validateApplication', () => {
  it('should pass with valid complete data', () => {
    const result = validateApplication(validFormData);
    expect(result.valid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('should fail when first name is too short', () => {
    const data = {
      ...validFormData,
      personalInfo: { ...validFormData.personalInfo, firstName: 'J' }
    };
    const result = validateApplication(data);
    expect(result.valid).toBe(false);
    expect(result.errors['personalInfo.firstName']).toBeDefined();
  });

  it('should fail when email is invalid', () => {
    const data = {
      ...validFormData,
      personalInfo: { ...validFormData.personalInfo, email: 'invalid-email' }
    };
    const result = validateApplication(data);
    expect(result.valid).toBe(false);
    expect(result.errors['personalInfo.email']).toBeDefined();
  });

  it('should fail when workAuth is no but sponsorship/explanation missing', () => {
    const data: ApplicationFormData = {
      ...validFormData,
      workEligibility: {
        workAuth: 'no'
      }
    };
    const result = validateApplication(data);
    expect(result.valid).toBe(false);
    expect(result.errors['workEligibility.sponsorshipNeeded']).toBeDefined();
    expect(result.errors['workEligibility.explanation']).toBeDefined();
  });

  it('should pass when workAuth is no with proper sponsorship and explanation', () => {
    const data: ApplicationFormData = {
      ...validFormData,
      workEligibility: {
        workAuth: 'no',
        sponsorshipNeeded: 'yes',
        explanation: 'I am on a student visa and will need H1B sponsorship after graduation.'
      }
    };
    const result = validateApplication(data);
    expect(result.valid).toBe(true);
  });

  it('should fail when yearsExperience is negative', () => {
    const data = {
      ...validFormData,
      experience: { ...validFormData.experience, yearsExperience: -1 }
    };
    const result = validateApplication(data);
    expect(result.valid).toBe(false);
    expect(result.errors['experience.yearsExperience']).toBeDefined();
  });

  it('should fail when portfolioUrl is invalid', () => {
    const data = {
      ...validFormData,
      experience: { ...validFormData.experience, portfolioUrl: 'not-a-url' }
    };
    const result = validateApplication(data);
    expect(result.valid).toBe(false);
    expect(result.errors['experience.portfolioUrl']).toBeDefined();
  });

  it('should pass when optional URLs are empty', () => {
    const data = {
      ...validFormData,
      experience: { yearsExperience: 3, portfolioUrl: '', resumeUrl: '' }
    };
    const result = validateApplication(data);
    expect(result.valid).toBe(true);
  });
});

describe('validatePersonalInfo', () => {
  it('should return empty errors for valid data', () => {
    const errors = validatePersonalInfo(validFormData.personalInfo);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('should return error for empty first name', () => {
    const errors = validatePersonalInfo({ ...validFormData.personalInfo, firstName: '' });
    expect(errors.firstName).toBeDefined();
  });

  it('should return error for invalid phone', () => {
    const errors = validatePersonalInfo({ ...validFormData.personalInfo, phone: '123' });
    expect(errors.phone).toBeDefined();
  });
});

describe('validateWorkEligibility', () => {
  it('should pass when workAuth is yes', () => {
    const errors = validateWorkEligibility({ workAuth: 'yes' });
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('should require explanation when workAuth is no', () => {
    const errors = validateWorkEligibility({ workAuth: 'no' });
    expect(errors.sponsorshipNeeded).toBeDefined();
    expect(errors.explanation).toBeDefined();
  });

  it('should require explanation of at least 20 chars', () => {
    const errors = validateWorkEligibility({
      workAuth: 'no',
      sponsorshipNeeded: 'yes',
      explanation: 'Too short'
    });
    expect(errors.explanation).toBeDefined();
  });
});

describe('validateExperience', () => {
  it('should pass with valid experience', () => {
    const errors = validateExperience({ yearsExperience: 0 });
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('should fail when yearsExperience is empty', () => {
    const errors = validateExperience({ yearsExperience: '' });
    expect(errors.yearsExperience).toBeDefined();
  });

  it('should fail for non-integer yearsExperience', () => {
    const errors = validateExperience({ yearsExperience: 2.5 });
    expect(errors.yearsExperience).toBeDefined();
  });

  it('should validate URL format when provided', () => {
    const errors = validateExperience({
      yearsExperience: 5,
      portfolioUrl: 'invalid',
      resumeUrl: 'https://valid.com/resume'
    });
    expect(errors.portfolioUrl).toBeDefined();
    expect(errors.resumeUrl).toBeUndefined();
  });
});
