import { test, expect } from '@playwright/test';
import { MondayFormPage } from '../Pages/MondayFormPage';

const MONDAY_FORM_URL = process.env.MONDAY_FORM_URL;
const FORM_PASSWORD = process.env.MONDAY_FORM_PASSWORD;

const LABEL_ORIGEM = 'Ferramenta';
const LABEL_STATUS = 'Status';
const LABEL_PRIORIDADE = 'Prioridade';

test.describe('Automação Monday - Validação Completa', () => {
    let mondayPage: MondayFormPage;

    test.skip(!MONDAY_FORM_URL, 'Configure MONDAY_FORM_URL para executar este teste contra um formulário de demonstração.');

    test.beforeEach(async ({ page }) => {
        mondayPage = new MondayFormPage(page);
    });

    test('Preenchimento Completo: Dados + Dropdowns + Cronograma', async ({ page }) => {
        if (!MONDAY_FORM_URL) throw new Error('MONDAY_FORM_URL não configurada.');

        await mondayPage.navigate(MONDAY_FORM_URL);
        if (FORM_PASSWORD) await mondayPage.handlePasswordProtection(FORM_PASSWORD);
        
        console.log('Aguardando formulário...');
        await page.waitForTimeout(3000);

        const inputNome = page.locator('input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"])').filter({ hasText: '' }).first();
        await expect(inputNome).toBeVisible();
        await inputNome.click();
        await inputNome.type('Lead Demo Datas', { delay: 50 });

        await mondayPage.selectOptionBySearch(LABEL_ORIGEM, 'CPC');
        await mondayPage.selectOptionBySearch(LABEL_STATUS, 'Não iniciado');
        await mondayPage.selectOptionBySearch(LABEL_PRIORIDADE, 'Baixo');

        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0'); 
        
        const dataInicio = `${ano}-${mes}-26`;
        const dataFim = `${ano}-${mes}-30`;

        await mondayPage.fillTimeline(dataInicio, dataFim);

        // Descomente apenas em ambiente de teste controlado.
        // await mondayPage.submit();
        // await mondayPage.assertSubmissionSuccess();

        console.log('Teste finalizado. Datas preenchidas.');
    });
});
