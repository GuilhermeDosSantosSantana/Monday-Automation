import { test, expect } from '@playwright/test';
import { MondayFormPage } from '../Pages/MondayFormPage';

// Link atualizado
const MONDAY_FORM_URL = 'https://forms.monday.com/forms/8d6e8cfff35e79c54898387c3c4cf4d9?r=use1';
// Senha fornecida
const FORM_PASSWORD = 'FABRICASTIGMA17';

test.describe('Automação de Formulário Monday.com', () => {
    let mondayPage: MondayFormPage;

    test.beforeEach(async ({ page }) => {
        mondayPage = new MondayFormPage(page);
    });

    test('Deve autenticar, preencher e enviar o formulário', async () => {
        // 1. Navegar
        console.log(`Navegando para: ${MONDAY_FORM_URL}`);
        await mondayPage.navigate(MONDAY_FORM_URL);

        // 2. Autenticação (Lógica de Password)
        // O Playwright verifica se existe um input de senha visível.
        // Se o formulário pedir senha, preenchemos e avançamos.
        const passwordInput = mondayPage.page.locator('input[type="password"]');
        
        // Timeout curto de 5s para verificar a senha, para não travar o teste se não tiver senha
        if (await passwordInput.isVisible({ timeout: 5000 }).catch(() => false)) {
            console.log('🔒 Tela de senha detectada. Autenticando...');
            await passwordInput.fill(FORM_PASSWORD);
            
            // Clica no botão de avançar/entrar (geralmente "Next" ou "Próximo")
            // Usamos um seletor genérico para pegar o botão visível nesta etapa
            await mondayPage.page.locator('button').filter({ hasText: /Next|Próximo|Enter|Entrar|Check/i }).first().click();
            
            // Aguarda a transição da tela de senha para o formulário real
            await mondayPage.page.waitForLoadState('networkidle');
        } else {
            console.log('🔓 Nenhuma tela de senha detectada, prosseguindo...');
        }

        // 3. Preencher Campos
        // ⚠️ PONTO DE ATENÇÃO:
        // Como você mudou o link, é possível que os NOMES das perguntas (Labels) também tenham mudado.
        // Se o teste falhar dizendo que não encontrou "Nome", verifique como está escrito no formulário real.
        
        await mondayPage.fillInputByLabel('Nome', 'Teste Automatizado Playwright');
        
        await mondayPage.fillInputByLabel('E-mail', 'teste@exemplo.com.br');
        
        await mondayPage.fillInputByLabel('Telefone', '11999999999');
        
        // Verifique se este campo ainda existe no novo formulário
        await mondayPage.fillInputByLabel('Empresa', 'Empresa Fictícia LTDA');

        // 4. Enviar
        await mondayPage.submit();

        // 5. Validar
        await mondayPage.assertSubmissionSuccess();
    });
});