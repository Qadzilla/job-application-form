import type { PersonalInfo, WorkEligibility, Experience } from 'shared';

export type ValidationErrors = Record<string, string>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-+()]{7,20}$/;
const URL_REGEX = /^https?:\/\/.+\..+/;

export function validatePersonalInfo(data: PersonalInfo): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.firstName || data.firstName.trim().length < 2) {
    errors.firstName = 'First name is required (minimum 2 characters)';
  }

  if (!data.lastName || data.lastName.trim().length < 2) {
    errors.lastName = 'Last name is required (minimum 2 characters)';
  }

  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.phone) {
    errors.phone = 'Phone number is required';
  } else if (!PHONE_REGEX.test(data.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  return errors;
}

export function validateWorkEligibility(data: WorkEligibility): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.workAuth || (data.workAuth !== 'yes' && data.workAuth !== 'no')) {
    errors.workAuth = 'Work authorization status is required';
  }

  if (data.workAuth === 'no') {
    if (!data.sponsorshipNeeded || (data.sponsorshipNeeded !== 'yes' && data.sponsorshipNeeded !== 'no')) {
      errors.sponsorshipNeeded = 'Please indicate if you need sponsorship';
    }

    if (!data.explanation || data.explanation.trim().length < 20) {
      errors.explanation = 'Please provide an explanation (minimum 20 characters)';
    }
  }

  return errors;
}

export function validateExperience(data: Experience): ValidationErrors {
  const errors: ValidationErrors = {};

  const years = data.yearsExperience;
  if (years === '' || years === undefined || years === null) {
    errors.yearsExperience = 'Years of experience is required';
  } else if (typeof years !== 'number' || !Number.isInteger(years) || years < 0) {
    errors.yearsExperience = 'Years of experience must be a non-negative integer';
  }

  if (data.portfolioUrl && data.portfolioUrl.trim() !== '') {
    if (!URL_REGEX.test(data.portfolioUrl)) {
      errors.portfolioUrl = 'Please enter a valid URL';
    }
  }

  if (data.resumeUrl && data.resumeUrl.trim() !== '') {
    if (!URL_REGEX.test(data.resumeUrl)) {
      errors.resumeUrl = 'Please enter a valid URL';
    }
  }

  return errors;
}

export function validateField(fieldName: string, value: string): string | null {
  switch (fieldName) {
    case 'firstName':
    case 'lastName':
      if (!value || value.trim().length < 2) {
        return `${fieldName === 'firstName' ? 'First' : 'Last'} name is required (minimum 2 characters)`;
      }
      break;
    case 'email':
      if (!value) {
        return 'Email is required';
      }
      if (!EMAIL_REGEX.test(value)) {
        return 'Please enter a valid email address';
      }
      break;
    case 'phone':
      if (!value) {
        return 'Phone number is required';
      }
      if (!PHONE_REGEX.test(value)) {
        return 'Please enter a valid phone number';
      }
      break;
    case 'yearsExperience':
      if (value === '') {
        return 'Years of experience is required';
      }
      const num = parseInt(value, 10);
      if (isNaN(num) || num < 0 || !Number.isInteger(parseFloat(value))) {
        return 'Years of experience must be a non-negative integer';
      }
      break;
    case 'portfolioUrl':
    case 'resumeUrl':
      if (value && value.trim() !== '' && !URL_REGEX.test(value)) {
        return 'Please enter a valid URL';
      }
      break;
    case 'explanation':
      if (value && value.trim().length < 20) {
        return 'Please provide an explanation (minimum 20 characters)';
      }
      break;
  }
  return null;
}
