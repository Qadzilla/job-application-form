import type { ApplicationFormData, ValidationResult, SubmissionResponse, StoredApplication } from 'shared';

const API_BASE = '/api';

export async function validateApplication(data: ApplicationFormData): Promise<ValidationResult> {
  const response = await fetch(`${API_BASE}/applications/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function submitApplication(data: ApplicationFormData): Promise<SubmissionResponse> {
  const response = await fetch(`${API_BASE}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Submission failed');
  }

  return response.json();
}

export async function getApplication(id: string): Promise<StoredApplication> {
  const response = await fetch(`${API_BASE}/applications/${id}`);

  if (!response.ok) {
    throw new Error('Application not found');
  }

  return response.json();
}
