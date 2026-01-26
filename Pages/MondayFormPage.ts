import { type Page, type Locator, expect } from '@playwright/test';

export class MondayFormPage {
    readonly page: Page;
    readonly submitButton: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        // Botão de envio robusto
        this.submitButton = page.locator('button[type="submit"], [data-testid="submit-form-button"], [data-testid="submit-button"]').first();
        this.successMessage = page.locator('text=Obrigado|Thank you|Sucesso|recebemos');
    }

    async navigate(url: string) {
        await this.page.goto(url);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async handlePasswordProtection(password: string) {
        const passwordInput = this.page.locator('[data-testid="password-input-password"], input[type="password"]').first();
        
        if (await passwordInput.isVisible({ timeout: 5000 }).catch(() => false)) {
            console.log('🔒 Tela de senha detectada. Tentando autenticar...');
            await passwordInput.click();
            await passwordInput.fill(password);
            
            const submitBtn = this.page.locator('[data-testid="submit-button"], button').filter({ hasText: /Next|Próximo|Enter|Entrar/i }).first();
            if (await submitBtn.isVisible()) {
                await submitBtn.click();
            } else {
                await passwordInput.press('Enter');
            }
            await this.page.waitForTimeout(2000);
        }
    }

    async fillInputByLabel(label: string, value: string) {
        if (label.toLowerCase().includes('nome') || label.toLowerCase().includes('name')) {
            const nameInput = this.page.locator('[data-testid="name-input"]');
            if (await nameInput.isVisible()) {
                await nameInput.click();
                await nameInput.fill(value);
                return;
            }
        }

        const input = this.page.locator(`xpath=//*[contains(text(), "${label}")]/ancestor::div[contains(@class, "question")]//input`).first();
        if (await input.isVisible()) {
            await input.fill(value);
        } else {
            await this.page.getByPlaceholder(label, { exact: false }).fill(value);
        }
    }

    /**
     * Preenche campos de data (Timeline/Cronograma).
     * Usa seletores genéricos que terminam com "-start-date" e "-end-date"
     * para funcionar mesmo que o ID da coluna (timeline6) mude.
     * @param startDate Data de início (YYYY-MM-DD)
     * @param endDate Data de fim (YYYY-MM-DD)
     */
    async fillTimeline(startDate: string, endDate: string) {
        console.log(`📅 Preenchendo Cronograma: ${startDate} até ${endDate}...`);
        
        // Seletores CSS que buscam pelo sufixo do atributo data-testid
        // Isso pega 'text-field_timeline6-start-date', 'text-field_timeline1-start-date', etc.
        const startInput = this.page.locator('[data-testid$="-start-date"]').first();
        const endInput = this.page.locator('[data-testid$="-end-date"]').first();

        if (await startInput.isVisible()) {
            await startInput.fill(startDate);
            await endInput.fill(endDate);
        } else {
            throw new Error('❌ Campos de data (Timeline) não encontrados.');
        }
    }

    async selectOptionBySearch(label: string, searchText: string) {
        console.log(`🔍 [COMBOBOX] Selecionando "${searchText}" em "${label}"...`);

        const combobox = this.page.getByRole('combobox', { name: label, exact: false });

        if (!(await combobox.isVisible())) {
            throw new Error(`❌ Combobox com nome "${label}" não encontrado.`);
        }

        await combobox.click();
        
        console.log(`⌨️ Digitando "${searchText}"...`);
        await combobox.fill(searchText);
        await this.page.waitForTimeout(1000);

        console.log('⬇️ Selecionando item...');
        await combobox.press('ArrowDown');
        await this.page.waitForTimeout(300);
        await combobox.press('Enter');

        console.log('🖱️ Limpando foco...');
        await this.page.mouse.click(10, 10);
        await this.page.waitForTimeout(500);
    }

    async selectOption(label: string, optionText: string) {
        await this.selectOptionBySearch(label, optionText);
    }

    async submit() {
        await this.submitButton.click();
    }

    async assertSubmissionSuccess() {
        await expect(this.successMessage).toBeVisible({ timeout: 10000 });
    }
}