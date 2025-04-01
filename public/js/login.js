document.addEventListener('DOMContentLoaded', function() {
  // Elementos do DOM
  const tabs = document.querySelectorAll('.tab');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginMessage = document.getElementById('login-message');
  const registerMessage = document.getElementById('register-message');
  
  // Alternar entre as abas
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remover classe active de todas as abas e painéis
      tabs.forEach(t => t.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      
      // Adicionar classe active à aba clicada
      this.classList.add('active');
      
      // Mostrar o painel correspondente
      const tabId = this.getAttribute('data-tab');
      document.getElementById(`${tabId}-form`).classList.add('active');
      
      // Limpar mensagens de erro/sucesso
      loginMessage.textContent = '';
      loginMessage.classList.remove('error', 'success');
      registerMessage.textContent = '';
      registerMessage.classList.remove('error', 'success');
    });
  });
  
  // Manipular o envio do formulário de login
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;
    
    // Validação básica
    if (!email || !senha) {
      showMessage(loginMessage, 'Preencha todos os campos', 'error');
      return;
    }
    
    // Exibir mensagem de carregamento
    showMessage(loginMessage, 'Conectando ao servidor...', 'info');
    
    // Verificar a URL da API - Ajuste para seu backend real
    const loginUrl = '/api/auth/login';
    console.log('Tentando conectar em: ' + loginUrl);
    
    // Enviar requisição para a API
    fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    })
    .then(response => {
      console.log('Status da resposta:', response.status);
      return response.json().catch(error => {
        console.error('Erro ao processar JSON:', error);
        throw new Error('Formato de resposta inválido');
      });
    })
    .then(data => {
      if (data.message && data.token) {
        // Login bem-sucedido
        showMessage(loginMessage, 'Login realizado com sucesso!', 'success');
        
        // Salvar token no localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.usuario.nome);
        
        // Redirecionar para a página principal
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        // Erro no login
        showMessage(loginMessage, data.message || 'Erro ao fazer login', 'error');
      }
    })
    .catch(error => {
      showMessage(loginMessage, 'Erro ao conectar com o servidor: ' + error.message, 'error');
      console.error('Erro detalhado:', error);
    });
  });
  
  // Manipular o envio do formulário de registro
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nome = document.getElementById('register-nome').value;
    const email = document.getElementById('register-email').value;
    const senha = document.getElementById('register-senha').value;
    const confirmarSenha = document.getElementById('register-confirmar-senha').value;
    
    // Validação básica
    if (!nome || !email || !senha || !confirmarSenha) {
      showMessage(registerMessage, 'Preencha todos os campos', 'error');
      return;
    }
    
    if (senha !== confirmarSenha) {
      showMessage(registerMessage, 'As senhas não coincidem', 'error');
      return;
    }
    
    if (senha.length < 6) {
      showMessage(registerMessage, 'A senha deve ter pelo menos 6 caracteres', 'error');
      return;
    }
    
    // Exibir mensagem de carregamento
    showMessage(registerMessage, 'Enviando dados para o servidor...', 'info');
    
    // Verificar a URL da API - Ajuste para seu backend real
    const registerUrl = '/api/auth/register';
    console.log('Tentando conectar em: ' + registerUrl);
    
    // Enviar requisição para a API
    fetch(registerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nome, email, senha })
    })
    .then(response => {
      console.log('Status da resposta:', response.status);
      return response.json().catch(error => {
        console.error('Erro ao processar JSON:', error);
        throw new Error('Formato de resposta inválido');
      });
    })
    .then(data => {
      if (data.message && data.id) {
        // Registro bem-sucedido
        showMessage(registerMessage, 'Cadastro realizado com sucesso! Você já pode fazer login.', 'success');
        registerForm.reset();
        
        // Mudar para a aba de login após alguns segundos
        setTimeout(() => {
          tabs[0].click();
        }, 2000);
      } else {
        // Erro no registro
        showMessage(registerMessage, data.message || 'Erro ao fazer cadastro', 'error');
      }
    })
    .catch(error => {
      showMessage(registerMessage, 'Erro ao conectar com o servidor: ' + error.message, 'error');
      console.error('Erro detalhado:', error);
    });
  });
  
  // Função auxiliar para exibir mensagens
  function showMessage(element, message, type) {
    element.textContent = message;
    element.className = 'form-message ' + type;
  }
});