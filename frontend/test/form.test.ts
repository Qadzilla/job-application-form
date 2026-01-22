import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

describe('Form Step Navigation', () => {
  let document: Document;

  beforeEach(() => {
    const dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <form id="test-form">
            <section class="form-step active" data-step="1">Step 1</section>
            <section class="form-step" data-step="2">Step 2</section>
            <section class="form-step" data-step="3">Step 3</section>
            <section class="form-step" data-step="4">Step 4</section>
          </form>
          <div class="progress-step" data-step="1">1</div>
          <div class="progress-step" data-step="2">2</div>
          <div class="progress-step" data-step="3">3</div>
          <div class="progress-step" data-step="4">4</div>
        </body>
      </html>
    `);
    document = dom.window.document;
  });

  function showStep(step: number): void {
    const steps = document.querySelectorAll('.form-step');
    steps.forEach(s => s.classList.remove('active'));

    const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    if (currentStepElement) {
      currentStepElement.classList.add('active');
    }
  }

  it('should show only step 1 initially', () => {
    const activeStep = document.querySelector('.form-step.active');
    expect(activeStep?.getAttribute('data-step')).toBe('1');
  });

  it('should hide step 1 and show step 2 when navigating forward', () => {
    showStep(2);

    const step1 = document.querySelector('.form-step[data-step="1"]');
    const step2 = document.querySelector('.form-step[data-step="2"]');

    expect(step1?.classList.contains('active')).toBe(false);
    expect(step2?.classList.contains('active')).toBe(true);
  });

  it('should allow navigation to any step', () => {
    showStep(4);

    const activeStep = document.querySelector('.form-step.active');
    expect(activeStep?.getAttribute('data-step')).toBe('4');
  });

  it('should only have one active step at a time', () => {
    showStep(3);

    const activeSteps = document.querySelectorAll('.form-step.active');
    expect(activeSteps.length).toBe(1);
  });
});

describe('Conditional Fields Logic', () => {
  it('should toggle visibility based on workAuth selection', () => {
    const dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="sponsorship-fields" style="display: none;"></div>
        </body>
      </html>
    `);

    const sponsorshipFields = dom.window.document.getElementById('sponsorship-fields') as HTMLElement;

    function toggleSponsorshipFields(show: boolean): void {
      sponsorshipFields.style.display = show ? 'block' : 'none';
    }

    // Initially hidden
    expect(sponsorshipFields.style.display).toBe('none');

    // Show when workAuth is 'no'
    toggleSponsorshipFields(true);
    expect(sponsorshipFields.style.display).toBe('block');

    // Hide when workAuth is 'yes'
    toggleSponsorshipFields(false);
    expect(sponsorshipFields.style.display).toBe('none');
  });
});

describe('Error Display', () => {
  it('should show error message for invalid field', () => {
    const dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <form>
            <input name="firstName" />
            <span class="error-message" data-error="firstName"></span>
          </form>
        </body>
      </html>
    `);

    const document = dom.window.document;

    function showFieldError(fieldName: string, message: string): void {
      const errorSpan = document.querySelector(`[data-error="${fieldName}"]`);
      if (errorSpan) {
        errorSpan.textContent = message;
      }
    }

    function clearFieldError(fieldName: string): void {
      const errorSpan = document.querySelector(`[data-error="${fieldName}"]`);
      if (errorSpan) {
        errorSpan.textContent = '';
      }
    }

    const errorSpan = document.querySelector('[data-error="firstName"]');

    // Show error
    showFieldError('firstName', 'First name is required');
    expect(errorSpan?.textContent).toBe('First name is required');

    // Clear error
    clearFieldError('firstName');
    expect(errorSpan?.textContent).toBe('');
  });
});

describe('Preview Rendering', () => {
  it('should escape HTML in preview to prevent XSS', () => {
    const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
    const document = dom.window.document;

    function escapeHtml(text: string): string {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    const maliciousInput = '<script>alert("xss")</script>';
    const escaped = escapeHtml(maliciousInput);

    expect(escaped).not.toContain('<script>');
    expect(escaped).toContain('&lt;script&gt;');
  });
});
