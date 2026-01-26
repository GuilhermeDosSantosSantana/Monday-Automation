import { test, expect } from '@playwright/test';
import { MondayFormPage } from '../Pages/MondayFormPage';

const MONDAY_FORM_URL = 'https://forms.monday.com/forms/8d6e8cfff35e79c54898387c3c4cf4d9?r=use1';
const FORM_PASSWORD = 'FABRICASTIGMA17';

// Rótulos exatos do formulário
const LABEL_ORIGEM = 'Ferramenta';
const LABEL_STATUS = 'Status';
const LABEL_PRIORIDADE = 'Prioridade';

test.describe('Automação Monday - Validação Completa', () => {
    let mondayPage: MondayFormPage;

    test.beforeEach(async ({ page }) => {
        mondayPage = new MondayFormPage(page);
    });

    test('Preenchimento Completo: Dados + Dropdowns + Cronograma', async ({ page }) => {
        // 1. Navegar e Autenticar
        await mondayPage.navigate(MONDAY_FORM_URL);
        await mondayPage.handlePasswordProtection(FORM_PASSWORD);
        
        console.log('⏳ Aguardando formulário...');
        await page.waitForTimeout(3000);

        // 2. Preencher Nome
        const inputNome = page.locator('input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"])').filter({ hasText: '' }).first();
        await expect(inputNome).toBeVisible();
        await inputNome.click();
        await inputNome.type('Lead Com Datas', { delay: 50 });

        // 3. Dropdowns
        await mondayPage.selectOptionBySearch(LABEL_ORIGEM, 'CPC');
        await mondayPage.selectOptionBySearch(LABEL_STATUS, 'Não iniciado');
        await mondayPage.selectOptionBySearch(LABEL_PRIORIDADE, 'Baixo');

        // 4. Preencher Datas (Timeline)
        // Gera datas dinâmicas para o mês atual (ano-mês-26 e ano-mês-30)
        const hoje = new Date();
        const ano = hoje.getFullYear();
        // Adiciona +1 ao mês porque janeiro é 0 no JS, e padStart garante formato "05" em vez de "5"
        const mes = String(hoje.getMonth() + 1).padStart(2, '0'); 
        
        const dataInicio = `${ano}-${mes}-26`;
        const dataFim = `${ano}-${mes}-30`;

        await mondayPage.fillTimeline(dataInicio, dataFim);

        // 5. Enviar (Descomente para enviar de verdade)
        // await mondayPage.submit();
        // await mondayPage.assertSubmissionSuccess();

        console.log('✅ Teste finalizado. Datas preenchidas.');
        
        await page.pause(); 
    });
});