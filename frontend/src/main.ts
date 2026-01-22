import type { ApplicationFormData } from 'shared';
import { validatePersonalInfo, validateWorkEligibility, validateExperience, validateField } from './validation';
import { submitApplication } from './api';

// Form state
let currentStep = 1;
const totalSteps = 4;

const formData: ApplicationFormData = {
  personalInfo: { firstName: '', lastName: '', email: '', phone: '' },
  workEligibility: { workAuth: '' },
  experience: { yearsExperience: '', portfolioUrl: '', resumeUrl: '' }
};

// DOM Elements
const form = document.getElementById('application-form') as HTMLFormElement;
const prevBtn = document.getElementById('prev-btn') as HTMLButtonElement;
const nextBtn = document.getElementById('next-btn') as HTMLButtonElement;
const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
const newApplicationBtn = document.getElementById('new-application-btn') as HTMLButtonElement;
const sponsorshipFields = document.getElementById('sponsorship-fields') as HTMLDivElement;
const previewContent = document.getElementById('preview-content') as HTMLDivElement;
const applicationIdDisplay = document.getElementById('application-id') as HTMLElement;

// Initialize
function init(): void {
  setupEventListeners();
  showStep(1);
  updateNavigationButtons();
}

function setupEventListeners(): void {
  // Input change handlers
  form.addEventListener('input', handleInput);
  form.addEventListener('change', handleChange);

  // Navigation
  prevBtn.addEventListener('click', goToPrevStep);
  nextBtn.addEventListener('click', goToNextStep);
  form.addEventListener('submit', handleSubmit);
  newApplicationBtn.addEventListener('click', resetForm);

  // Blur validation
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', handleBlur);
  });
}

function handleInput(e: Event): void {
  const target = e.target as HTMLInputElement | HTMLTextAreaElement;
  const name = target.name;

  updateFormData(name, target.value);
  updateNavigationButtons();
}

function handleChange(e: Event): void {
  const target = e.target as HTMLInputElement;
  if (target.type === 'radio') {
    updateFormData(target.name, target.value);

    if (target.name === 'workAuth') {
      toggleSponsorshipFields(target.value === 'no');
    }

    // Clear error on selection
    clearFieldError(target.name);
    updateNavigationButtons();
  }
}

function handleBlur(e: Event): void {
  const target = e.target as HTMLInputElement | HTMLTextAreaElement;
  validateSingleField(target.name, target.value);
}

function updateFormData(name: string, value: string): void {
  switch (name) {
    case 'firstName':
    case 'lastName':
    case 'email':
    case 'phone':
      formData.personalInfo[name] = value;
      break;
    case 'workAuth':
      formData.workEligibility.workAuth = value as 'yes' | 'no' | '';
      if (value === 'yes') {
        // Clear conditional fields when switching to yes
        formData.workEligibility.sponsorshipNeeded = undefined;
        formData.workEligibility.explanation = undefined;
      }
      break;
    case 'sponsorshipNeeded':
      formData.workEligibility.sponsorshipNeeded = value as 'yes' | 'no' | '';
      break;
    case 'explanation':
      formData.workEligibility.explanation = value;
      break;
    case 'yearsExperience':
      formData.experience.yearsExperience = value === '' ? '' : parseInt(value, 10);
      break;
    case 'portfolioUrl':
      formData.experience.portfolioUrl = value;
      break;
    case 'resumeUrl':
      formData.experience.resumeUrl = value;
      break;
  }
}

function validateSingleField(name: string, value: string): void {
  // Skip validation for conditional fields if workAuth is yes
  if ((name === 'sponsorshipNeeded' || name === 'explanation') && formData.workEligibility.workAuth !== 'no') {
    return;
  }

  const error = validateField(name, value);
  const input = form.querySelector(`[name="${name}"]`) as HTMLElement;

  if (error) {
    showFieldError(name, error);
    input?.classList.add('error');
    input?.classList.remove('valid');
  } else {
    clearFieldError(name);
    if (value) {
      input?.classList.add('valid');
      input?.classList.remove('error');
    }
  }
}

function showFieldError(fieldName: string, message: string): void {
  const errorSpan = form.querySelector(`[data-error="${fieldName}"]`);
  if (errorSpan) {
    errorSpan.textContent = message;
  }
}

function clearFieldError(fieldName: string): void {
  const errorSpan = form.querySelector(`[data-error="${fieldName}"]`);
  if (errorSpan) {
    errorSpan.textContent = '';
  }
  const input = form.querySelector(`[name="${fieldName}"]`) as HTMLElement;
  input?.classList.remove('error');
}

function clearAllErrors(): void {
  const errorSpans = form.querySelectorAll('.error-message');
  errorSpans.forEach(span => span.textContent = '');

  const inputs = form.querySelectorAll('.error');
  inputs.forEach(input => input.classList.remove('error'));
}

function toggleSponsorshipFields(show: boolean): void {
  sponsorshipFields.style.display = show ? 'block' : 'none';

  if (!show) {
    // Clear sponsorship fields
    const sponsorshipRadios = form.querySelectorAll('input[name="sponsorshipNeeded"]') as NodeListOf<HTMLInputElement>;
    sponsorshipRadios.forEach(radio => radio.checked = false);
    const explanationTextarea = form.querySelector('#explanation') as HTMLTextAreaElement;
    if (explanationTextarea) {
      explanationTextarea.value = '';
    }
    clearFieldError('sponsorshipNeeded');
    clearFieldError('explanation');
  }
}

function validateCurrentStep(): boolean {
  let errors: Record<string, string> = {};

  switch (currentStep) {
    case 1:
      errors = validatePersonalInfo(formData.personalInfo);
      break;
    case 2:
      errors = validateWorkEligibility(formData.workEligibility);
      break;
    case 3:
      errors = validateExperience(formData.experience);
      break;
    case 4:
      return true; // Preview step is always valid
  }

  // Show errors
  Object.entries(errors).forEach(([field, message]) => {
    showFieldError(field, message);
    const input = form.querySelector(`[name="${field}"]`) as HTMLElement;
    input?.classList.add('error');
  });

  return Object.keys(errors).length === 0;
}

function isCurrentStepValid(): boolean {
  switch (currentStep) {
    case 1:
      return Object.keys(validatePersonalInfo(formData.personalInfo)).length === 0;
    case 2:
      return Object.keys(validateWorkEligibility(formData.workEligibility)).length === 0;
    case 3:
      return Object.keys(validateExperience(formData.experience)).length === 0;
    case 4:
      return true;
    default:
      return false;
  }
}

function updateNavigationButtons(): void {
  prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
  nextBtn.style.display = currentStep < totalSteps ? 'block' : 'none';
  submitBtn.style.display = currentStep === totalSteps ? 'block' : 'none';

  nextBtn.disabled = !isCurrentStepValid();
  submitBtn.disabled = !isCurrentStepValid();
}

function showStep(step: number): void {
  // Hide all steps
  const steps = form.querySelectorAll('.form-step');
  steps.forEach(s => s.classList.remove('active'));

  // Show current step
  const currentStepElement = form.querySelector(`.form-step[data-step="${step}"]`);
  if (currentStepElement) {
    currentStepElement.classList.add('active');
  }

  // Update progress indicators
  updateProgressIndicators(step);

  // If preview step, render preview
  if (step === 4) {
    renderPreview();
  }
}

function updateProgressIndicators(step: number): void {
  const progressSteps = document.querySelectorAll('.progress-step');
  progressSteps.forEach((el, index) => {
    el.classList.remove('active', 'completed');
    if (index + 1 === step) {
      el.classList.add('active');
    } else if (index + 1 < step) {
      el.classList.add('completed');
    }
  });
}

function goToNextStep(): void {
  if (validateCurrentStep() && currentStep < totalSteps) {
    currentStep++;
    showStep(currentStep);
    updateNavigationButtons();
  }
}

function goToPrevStep(): void {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
    updateNavigationButtons();
  }
}

function renderPreview(): void {
  const { personalInfo, workEligibility, experience } = formData;

  previewContent.innerHTML = `
    <div class="preview-section">
      <h3>Personal Information</h3>
      <div class="preview-item">
        <span class="preview-label">Name:</span>
        <span class="preview-value">${escapeHtml(personalInfo.firstName)} ${escapeHtml(personalInfo.lastName)}</span>
      </div>
      <div class="preview-item">
        <span class="preview-label">Email:</span>
        <span class="preview-value">${escapeHtml(personalInfo.email)}</span>
      </div>
      <div class="preview-item">
        <span class="preview-label">Phone:</span>
        <span class="preview-value">${escapeHtml(personalInfo.phone)}</span>
      </div>
    </div>

    <div class="preview-section">
      <h3>Work Eligibility</h3>
      <div class="preview-item">
        <span class="preview-label">Work Authorization:</span>
        <span class="preview-value">${workEligibility.workAuth === 'yes' ? 'Yes' : 'No'}</span>
      </div>
      ${workEligibility.workAuth === 'no' ? `
        <div class="preview-item">
          <span class="preview-label">Needs Sponsorship:</span>
          <span class="preview-value">${workEligibility.sponsorshipNeeded === 'yes' ? 'Yes' : 'No'}</span>
        </div>
        <div class="preview-item">
          <span class="preview-label">Explanation:</span>
          <span class="preview-value">${escapeHtml(workEligibility.explanation || '')}</span>
        </div>
      ` : ''}
    </div>

    <div class="preview-section">
      <h3>Experience</h3>
      <div class="preview-item">
        <span class="preview-label">Years of Experience:</span>
        <span class="preview-value">${experience.yearsExperience}</span>
      </div>
      ${experience.portfolioUrl ? `
        <div class="preview-item">
          <span class="preview-label">Portfolio:</span>
          <span class="preview-value">${escapeHtml(experience.portfolioUrl)}</span>
        </div>
      ` : ''}
      ${experience.resumeUrl ? `
        <div class="preview-item">
          <span class="preview-label">Resume:</span>
          <span class="preview-value">${escapeHtml(experience.resumeUrl)}</span>
        </div>
      ` : ''}
    </div>
  `;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function handleSubmit(e: Event): Promise<void> {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.classList.add('loading');

  try {
    const result = await submitApplication(formData);
    showSuccessState(result.id);
  } catch (error) {
    alert(error instanceof Error ? error.message : 'Failed to submit application');
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
  }
}

function showSuccessState(id: string): void {
  // Hide all form steps
  const steps = form.querySelectorAll('.form-step');
  steps.forEach(s => s.classList.remove('active'));

  // Show success state
  const successState = form.querySelector('.form-step[data-step="success"]') as HTMLElement;
  if (successState) {
    successState.style.display = 'block';
    successState.classList.add('active');
  }

  // Display application ID
  applicationIdDisplay.textContent = id;

  // Hide navigation
  prevBtn.style.display = 'none';
  nextBtn.style.display = 'none';
  submitBtn.style.display = 'none';

  // Update progress to show all completed
  const progressSteps = document.querySelectorAll('.progress-step');
  progressSteps.forEach(el => {
    el.classList.remove('active');
    el.classList.add('completed');
  });
}

function resetForm(): void {
  // Reset form data
  formData.personalInfo = { firstName: '', lastName: '', email: '', phone: '' };
  formData.workEligibility = { workAuth: '' };
  formData.experience = { yearsExperience: '', portfolioUrl: '', resumeUrl: '' };

  // Reset HTML form
  form.reset();

  // Hide success state
  const successState = form.querySelector('.form-step[data-step="success"]') as HTMLElement;
  if (successState) {
    successState.style.display = 'none';
    successState.classList.remove('active');
  }

  // Hide sponsorship fields
  toggleSponsorshipFields(false);

  // Clear all errors and validation states
  clearAllErrors();
  const validInputs = form.querySelectorAll('.valid');
  validInputs.forEach(input => input.classList.remove('valid'));

  // Go back to step 1
  currentStep = 1;
  showStep(1);
  updateNavigationButtons();
}

// Export for testing
export { formData, validateCurrentStep, goToNextStep, goToPrevStep, currentStep, updateFormData, isCurrentStepValid };

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', init);
