// Função principal que roda quando a página é carregada
document.addEventListener('DOMContentLoaded', function () {
    // 1. Verifica se já tem dados salvos
    const userData = getSavedUserData();

    // 2. Configura os elementos da página
    const accountForm = document.getElementById('account-form');
    const userInfoDisplay = document.getElementById('user-info-display');
    const editButton = document.getElementById('edit-info-btn');

    // 3. Configura o formulário
    if (accountForm) {
        accountForm.addEventListener('submit', function (e) {
            e.preventDefault();
            saveUserData();
        });
    }

    // 4. Configura o botão de edição
    if (editButton) {
        editButton.addEventListener('click', showForm);
    }

    // 5. Mostra os dados ou o formulário
    if (userData) {
        displayUserInfo(userData);
    } else {
        showForm();
    }

    // 6. Atualiza o header imediatamente
    updateHeader();
});

// Função para obter os dados do usuário do localStorage
function getSavedUserData() {
    const savedData = localStorage.getItem('userAccountData');
    return savedData ? JSON.parse(savedData) : null;
}

// Função para salvar os dados do usuário
function saveUserData() {
    // 1. Obtém os valores do formulário
    const name = document.getElementById('user-name').value.trim();
    const email = document.getElementById('user-email').value.trim();

    // 2. Validação básica
    if (!name || !email) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    // 3. Cria o objeto com os dados
    const userData = {
        name: name,
        email: email,
        lastUpdated: new Date().toISOString()
    };

    // 4. Salva no localStorage
    localStorage.setItem('userAccountData', JSON.stringify(userData));

    // 5. Atualiza a exibição na página
    displayUserInfo(userData);

    // 6. Atualiza todas as páginas do site
    broadcastUserUpdate();

    // 7. Feedback para o usuário
    alert('Informações atualizadas com sucesso!');
}

// Função para exibir as informações do usuário
function displayUserInfo(userData) {
    if (!userData) return;

    const infoSection = document.getElementById('user-info-display');
    if (infoSection) {
        document.getElementById('display-name').textContent = userData.name;
        document.getElementById('display-email').textContent = userData.email;
        infoSection.style.display = 'block';
        document.getElementById('account-form').style.display = 'none';
    }

    // Preenche o formulário com os dados existentes
    document.getElementById('user-name').value = userData.name;
    document.getElementById('user-email').value = userData.email;
}

// Função para mostrar o formulário de edição
function showForm() {
    const userData = getSavedUserData();

    if (userData) {
        document.getElementById('user-name').value = userData.name;
        document.getElementById('user-email').value = userData.email;
    }

    document.getElementById('account-form').style.display = 'flex';
    document.getElementById('user-info-display').style.display = 'none';
}

// Função para atualizar o header
function updateHeader() {
    const userData = getSavedUserData();
    const accountText = document.getElementById('account-text');

    if (userData && accountText) {
        accountText.textContent = userData.name;
    }
}

// Função para notificar outras páginas sobre a atualização
function broadcastUserUpdate() {
    // 1. Atualiza o header na página atual
    updateHeader();

    // 2. Dispara um evento para outras abas/páginas
    localStorage.setItem('userAccountUpdate', Date.now().toString());

    // 3. Força sincronização imediata
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = '/sync.html';
    document.body.appendChild(iframe);
    setTimeout(() => iframe.remove(), 100);
}

// Ouvinte para atualizações vindas de outras abas
window.addEventListener('storage', function (event) {
    if (event.key === 'userAccountUpdate') {
        updateHeader();
    }
});