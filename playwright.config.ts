import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração atualizada para usar a URL base geral da Monday.com
 * Mantém as proteções contra deteção de bots.
 */
export default defineConfig({
  testDir: './tests',
  
  // Evita rodar testes em paralelo para não sobrecarregar
  fullyParallel: false,
  
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  
  // Timeout de 60s
  timeout: 60000, 
  
  use: {
    // 🟢 URL GERAL ALTERADA AQUI
    baseURL: 'https://forms.monday.com/forms/8d6e8cfff35e79c54898387c3c4cf4d9?r=use1',

    trace: 'on',
    screenshot: 'on',
    headless: false,
    viewport: { width: 1280, height: 720 },

    // --- MASCARAR AUTOMAÇÃO (Anti-Bot) ---
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',

    launchOptions: {
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
      ],
      ignoreDefaultArgs: ['--enable-automation'],
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});