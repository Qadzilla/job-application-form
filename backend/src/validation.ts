import type { ApplicationFormData, ValidationResult, ValidationErrors } from 'shared';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-+()]{7,20}$/;
const URL_REGEX = /^https?:\/\/.+\..+/;

export function validateApplication(data: ApplicationFormData): ValidationResult {
  const errors: ValidationErrors = {};

  // Personal Info validation
  if (!data.personalInfo.firstName || data.personalInfo.firstName.trim().length < 2) {
    errors['personalInfo.firstName'] = 'First name is required (minimum 2 characters)';
  }

  if (!data.personalInfo.lastName || data.personalInfo.lastName.trim().length < 2) {
    errors['personalInfo.lastName'] = 'Last name is required (minimum 2 characters)';
  }

  if (!data.personalInfo.email) {
    errors['personalInfo.email'] = 'Email is required';
  } else if (!EMAIL_REGEX.test(data.personalInfo.email)) {
    errors['personalInfo.email'] = 'Please enter a valid email address';
  }

  if (!data.personalInfo.phone) {
    errors['personalInfo.phone'] = 'Phone number is required';
  } else if (!PHONE_REGEX.test(data.personalInfo.phone)) {
    errors['personalInfo.phone'] = 'Please enter a valid phone number';
  }

  // Work Eligibility validation
  if (!data.workEligibility.workAuth || (data.workEligibility.workAuth !== 'yes' && data.workEligibility.workAuth !== 'no')) {
    errors['workEligibility.workAuth'] = 'Work authorization status is required';
  }

  if (data.workEligibility.workAuth === 'no') {
    if (!data.workEligibility.sponsorshipNeeded || (data.workEligibility.sponsorshipNeeded !== 'yes' && data.workEligibility.sponsorshipNeeded !== 'no')) {
      errors['workEligibility.sponsorshipNeeded'] = 'Please indicate if you need sponsorship';
    }

    if (!data.workEligibility.explanation || data.workEligibility.explanation.trim().length < 20) {
      errors['workEligibility.explanation'] = 'Please provide an explanation (minimum 20 characters)';
    }
  }

  // Experience validation
  const years = data.experience.yearsExperience;
  if (years === '' || years === undefined || years === null) {
    errors['experience.yearsExperience'] = 'Years of experience is required';
  } else if (typeof years !== 'number' || !Number.isInteger(years) || years < 0) {
    errors['experience.yearsExperience'] = 'Years of experience must be a non-negative integer';
  }

  if (data.experience.portfolioUrl && data.experience.portfolioUrl.trim() !== '') {
    if (!URL_REGEX.test(data.experience.portfolioUrl)) {
      errors['experience.portfolioUrl'] = 'Please enter a valid URL';
    }
  }

  if (data.experience.resumeUrl && data.experience.resumeUrl.trim() !== '') {
    if (!URL_REGEX.test(data.experience.resumeUrl)) {
      errors['experience.resumeUrl'] = 'Please enter a valid URL';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

// Individual field validators for step-by-step validation
export function validatePersonalInfo(data: ApplicationFormData['personalInfo']): ValidationErrors {
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

export function validateWorkEligibility(data: ApplicationFormData['workEligibility']): ValidationErrors {
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

export function validateExperience(data: ApplicationFormData['experience']): ValidationErrors {
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
