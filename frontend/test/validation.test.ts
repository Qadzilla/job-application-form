import { describe, it, expect } from 'vitest';
import { validatePersonalInfo, validateWorkEligibility, validateExperience, validateField } from '../src/validation';

describe('validatePersonalInfo', () => {
  it('should pass with valid data', () => {
    const errors = validatePersonalInfo({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '555-123-4567'
    });
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('should require first name with minimum 2 characters', () => {
    const errors = validatePersonalInfo({
      firstName: 'J',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '555-123-4567'
    });
    expect(errors.firstName).toBeDefined();
  });

  it('should require valid email format', () => {
    const errors = validatePersonalInfo({
      firstName: 'John',
      lastName: 'Doe',
      email: 'not-an-email',
      phone: '555-123-4567'
    });
    expect(errors.email).toBeDefined();
  });

  it('should require valid phone format', () => {
    const errors = validatePersonalInfo({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '12'
    });
    expect(errors.phone).toBeDefined();
  });

  it('should return multiple errors for multiple invalid fields', () => {
    const errors = validatePersonalInfo({
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    });
    expect(Object.keys(errors)).toHaveLength(4);
  });
});

describe('validateWorkEligibility', () => {
  it('should pass when workAuth is yes', () => {
    const errors = validateWorkEligibility({ workAuth: 'yes' });
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('should require sponsorship and explanation when workAuth is no', () => {
    const errors = validateWorkEligibility({ workAuth: 'no' });
    expect(errors.sponsorshipNeeded).toBeDefined();
    expect(errors.explanation).toBeDefined();
  });

  it('should pass when workAuth is no with required fields filled', () => {
    const errors = validateWorkEligibility({
      workAuth: 'no',
      sponsorshipNeeded: 'yes',
      explanation: 'I am on a student visa and need sponsorship for work authorization.'
    });
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('should require explanation of at least 20 characters', () => {
    const errors = validateWorkEligibility({
      workAuth: 'no',
      sponsorshipNeeded: 'yes',
      explanation: 'Short'
    });
    expect(errors.explanation).toBeDefined();
  });

  it('should require workAuth to be selected', () => {
    const errors = validateWorkEligibility({ workAuth: '' });
    expect(errors.workAuth).toBeDefined();
  });
});

describe('validateExperience', () => {
  it('should pass with valid experience', () => {
    const errors = validateExperience({
      yearsExperience: 5,
      portfolioUrl: 'https://example.com',
      resumeUrl: 'https://example.com/resume.pdf'
    });
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('should allow zero years of experience', () => {
    const errors = validateExperience({ yearsExperience: 0 });
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('should require years of experience', () => {
    const errors = validateExperience({ yearsExperience: '' });
    expect(errors.yearsExperience).toBeDefined();
  });

  it('should reject negative years', () => {
    const errors = validateExperience({ yearsExperience: -1 });
    expect(errors.yearsExperience).toBeDefined();
  });

  it('should reject non-integer years', () => {
    const errors = validateExperience({ yearsExperience: 2.5 });
    expect(errors.yearsExperience).toBeDefined();
  });

  it('should allow empty optional URLs', () => {
    const errors = validateExperience({
      yearsExperience: 3,
      portfolioUrl: '',
      resumeUrl: ''
    });
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('should validate URL format when provided', () => {
    const errors = validateExperience({
      yearsExperience: 3,
      portfolioUrl: 'not-a-url'
    });
    expect(errors.portfolioUrl).toBeDefined();
  });
});

describe('validateField', () => {
  it('should return null for valid firstName', () => {
    expect(validateField('firstName', 'John')).toBeNull();
  });

  it('should return error for invalid firstName', () => {
    expect(validateField('firstName', 'J')).not.toBeNull();
  });

  it('should return null for valid email', () => {
    expect(validateField('email', 'test@example.com')).toBeNull();
  });

  it('should return error for invalid email', () => {
    expect(validateField('email', 'invalid')).not.toBeNull();
  });

  it('should return null for empty optional URL', () => {
    expect(validateField('portfolioUrl', '')).toBeNull();
  });

  it('should return error for invalid URL', () => {
    expect(validateField('portfolioUrl', 'not-valid')).not.toBeNull();
  });

  it('should return null for valid URL', () => {
    expect(validateField('portfolioUrl', 'https://example.com')).toBeNull();
  });

  it('should validate yearsExperience as integer', () => {
    expect(validateField('yearsExperience', '5')).toBeNull();
    expect(validateField('yearsExperience', '-1')).not.toBeNull();
    expect(validateField('yearsExperience', '2.5')).not.toBeNull();
  });
});
