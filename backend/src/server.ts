import express from 'express';
import cors from 'cors';
import type { ApplicationFormData, StoredApplication } from 'shared';
import { validateApplication } from './validation.js';
import { saveApplication, getApplication } from './store.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// Validate application data
app.post('/api/applications/validate', (req, res) => {
  const data = req.body as ApplicationFormData;
  const result = validateApplication(data);
  res.json(result);
});

// Submit application
app.post('/api/applications', (req, res) => {
  const data = req.body as ApplicationFormData;
  const validation = validateApplication(data);

  if (!validation.valid) {
    res.status(400).json({ error: 'Validation failed', errors: validation.errors });
    return;
  }

  const id = crypto.randomUUID();
  const application: StoredApplication = {
    ...data,
    id,
    submittedAt: new Date().toISOString()
  };

  saveApplication(application);
  res.status(201).json({ id });
});

// Get application by ID
app.get('/api/applications/:id', (req, res) => {
  const application = getApplication(req.params.id);

  if (!application) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }

  res.json(application);
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});

export { app };
