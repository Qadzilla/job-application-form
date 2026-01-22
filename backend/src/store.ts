import type { StoredApplication } from 'shared';

// In-memory storage for applications
const applications = new Map<string, StoredApplication>();

export function saveApplication(application: StoredApplication): void {
  applications.set(application.id, application);
}

export function getApplication(id: string): StoredApplication | undefined {
  return applications.get(id);
}

export function getAllApplications(): StoredApplication[] {
  return Array.from(applications.values());
}

export function clearApplications(): void {
  applications.clear();
}
