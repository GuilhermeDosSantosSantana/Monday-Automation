import { type Page, type Locator, expect } from '@playwright/test';

export class MondayFormPage {
    readonly page: Page;
    readonly submitButton: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        // Botão padrão de envio da Monday. Pode variar (Ex: "Enviar", "Submit")
        // Usamos um seletor robusto que procura por botão do tipo submit ou com texto comum
        this.submitButton = page.locator('button[type="submit"], button:has-text("Enviar"), button:has-text("Submit")');
        
        // Mensagem de sucesso padrão da Monday forms
        this.successMessage = page.locator('text=Obrigado|Thank you|Sucesso');
    }

    /**
     * Navega para a URL do formulário
     */
    async navigate(url: string) {
        await this.page.goto(url);
        // Espera o formulário carregar garantindo que pelo menos um input ou o corpo esteja visível
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Preenche um campo de texto (Short Text, Email, Numbers) baseado no rótulo da pergunta.
     * @param label O texto exato que aparece acima do campo (Ex: "Nome do Lead")
     * @param value O valor a ser digitado
     */
    async fillInputByLabel(label: string, value: string) {
        // A Monday costuma usar labels acessíveis. O Playwright encontra o input associado ao texto.
        // Se houver ambiguidade, forçamos o first(), mas o ideal é o label ser único.
        const input = this.page.getByLabel(label, { exact: false }).first();
        
        await input.scrollIntoViewIfNeeded();
        await input.fill(value);
    }

    /**
     * Preenche uma área de texto maior (Long Text)
     */
    async fillTextAreaByLabel(label: string, value: string) {
        const input = this.page.getByLabel(label, { exact: false }).first();
        await input.scrollIntoViewIfNeeded();
        await input.fill(value);
    }

    /**
     * Tenta selecionar uma opção em um Dropdown ou Single Select da Monday.
     * Nota: Dropdowns da Monday podem ser complexos (divs customizadas). 
     * Esta é uma tentativa genérica.
     */
    async selectOptionByLabel(label: string, optionText: string) {
        // Clica no dropdown para abrir
        await this.page.getByLabel(label, { exact: false }).click();
        // Clica na opção que contém o texto desejado
        await this.page.getByRole('option', { name: optionText }).click();
    }

    /**
     * Envia o formulário
     */
    async submit() {
        await this.submitButton.click();
    }

    /**
     * Verifica se a submissão foi bem sucedida
     */
    async assertSubmissionSuccess() {
        await expect(this.successMessage).toBeVisible({ timeout: 10000 });
    }
}