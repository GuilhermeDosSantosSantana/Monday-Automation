import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  
  fullyParallel: false,
  
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  
  timeout: 60000, 
  
  use: {
    baseURL: process.env.MONDAY_FORM_URL || 'https://forms.monday.com/forms/your-demo-form-id',
    trace: 'on',
    screenshot: 'on',
    headless: true,
    viewport: { width: 1280, height: 720 },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
