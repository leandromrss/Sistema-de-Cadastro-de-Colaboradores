document.addEventListener('DOMContentLoaded', function() {
  // Verificar autenticação
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }
  const tableContainer = document.querySelector('.table-container');
  const collapseTableButton = document.getElementById('collapseTableButton');
  
  if (collapseTableButton) {
    collapseTableButton.addEventListener('click', toggleTableCollapse);
  }
  
  function toggleTableCollapse() {
    tableContainer.classList.toggle('collapsed');
    
    // Atualizar o ícone do botão
    const icon = collapseTableButton.querySelector('i');
    if (icon) {
      if (tableContainer.classList.contains('collapsed')) {
        icon.className = 'fas fa-plus';
      } else {
        icon.className = 'fas fa-minus';
      }
    }
  }
  // Exibir nome do usuário
  const userName = localStorage.getItem('userName');
  const userNameDisplay = document.getElementById('userNameDisplay');
  if (userName) {
    userNameDisplay.textContent = `Olá, ${userName}`;
  }
  // Elementos do DOM
  const colaboradorForm = document.getElementById('colaboradorForm');
  const formTitle = document.getElementById('formTitle');
  const formContainer = document.getElementById('formContainer'); // Usando o ID correto
  const collapseFormButton = document.getElementById('collapseFormButton'); // Usando o ID correto
  const newColaboradorButton = document.getElementById('newColaboradorButton');
  const colaboradorId = document.getElementById('colaboradorId');
  const nome = document.getElementById('nome');
  const cpf = document.getElementById('cpf');
  const dataNascimento = document.getElementById('data_nascimento');
  const setor = document.getElementById('setor');
  const cargo = document.getElementById('cargo');
  const liderDireto = document.getElementById('lider_direto');
  const telefone = document.getElementById('telefone');
  const email = document.getElementById('email');
  const saveButton = document.getElementById('saveButton');
  const cancelButton = document.getElementById('cancelButton');
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const colaboradoresTableBody = document.getElementById('colaboradoresTableBody');
  const logoutButton = document.getElementById('logoutButton');
  
  
  // Formulário já começa collapsed no HTML, não precisa adicionar a classe
  
  // Carregar todos os colaboradores ao iniciar
  loadColaboradores();
  
  // Event Listeners
  colaboradorForm.addEventListener('submit', saveColaborador);
  cancelButton.addEventListener('click', resetForm);
  searchButton.addEventListener('click', searchColaboradores);
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      searchColaboradores();
    }
  });
  
  // Controle de exibição do formulário
  collapseFormButton.addEventListener('click', toggleFormCollapse);
  newColaboradorButton.addEventListener('click', showForm);
  
  // Logout
  logoutButton.addEventListener('click', logout);
  
  // Funções

  //Carregar Colaboradores Cadastrados
  function loadColaboradores() {
    fetch('/api/colaboradores', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.status === 401) {
          logout();
          return null;
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          renderColaboradoresTable(data);
        }
      })
      .catch(error => {
        console.error('Erro ao carregar colaboradores:', error);
        alert('Erro ao carregar a lista de colaboradores.');
      });
  }
  
  function searchColaboradores() {
    const term = searchInput.value.trim();
    if (!term) {
      loadColaboradores();
      return;
    }
    fetch(`/api/colaboradores/search?term=${encodeURIComponent(term)}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.status === 401) {
          logout();
          return null;
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          renderColaboradoresTable(data);
        }
      })
      .catch(error => {
        console.error('Erro ao pesquisar colaboradores:', error);
        alert('Erro ao pesquisar colaboradores.');
      });
  }
  
  function renderColaboradoresTable(colaboradores) {
    colaboradoresTableBody.innerHTML = '';
    
    if (colaboradores.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = '<td colspan="8" style="text-align: center;">Nenhum colaborador encontrado</td>';
      colaboradoresTableBody.appendChild(row);
      return;
    }
    
    colaboradores.forEach(colaborador => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${colaborador.nome}</td>
        <td>${colaborador.cpf}</td>
        <td>${formatDate(colaborador.data_nascimento)}</td>
        <td>${colaborador.cargo}</td>
        <td>${colaborador.telefone}</td>
        <td>${colaborador.email}</td>
        <td class="action-buttons">
          <button class="view-btn" data-id="${colaborador.id}" title="Visualizar">
            <i class="fas fa-eye"></i>
          </button>
          <button class="edit-btn" data-id="${colaborador.id}" title="Editar">
            <i class="fas fa-edit"></i>
          </button>
          <button class="delete-btn" data-id="${colaborador.id}" title="Excluir">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      
      // Adicionar event listeners para os botões
      row.querySelector('.view-btn').addEventListener('click', () => viewColaborador(colaborador.id));
      row.querySelector('.edit-btn').addEventListener('click', () => editColaborador(colaborador.id));
      row.querySelector('.delete-btn').addEventListener('click', () => deleteColaborador(colaborador.id));
      
      colaboradoresTableBody.appendChild(row);
    });
  }

  function viewColaborador(id) {
    fetch(`/api/colaboradores/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.status === 401) {
          logout();
          return null;
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          // Preencher modal com todos os dados
          const modalBody = document.getElementById('viewModalBody');
          modalBody.innerHTML = `
            <div class="form-row">
              <div class="form-group">
                <label>Nome Completo:</label>
                <p>${data.nome || 'N/A'}</p>
              </div>
              <div class="form-group">
                <label>CPF:</label>
                <p>${data.cpf || 'N/A'}</p>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Data de Nascimento:</label>
                <p>${formatDate(data.data_nascimento) || 'N/A'}</p>
              </div>
              <div class="form-group">
                <label>Telefone:</label>
                <p>${data.telefone || 'N/A'}</p>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>E-mail:</label>
                <p>${data.email || 'N/A'}</p>
              </div>
              <div class="form-group">
                <label>Setor:</label>
                <p>${data.setor || 'N/A'}</p>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Cargo:</label>
                <p>${data.cargo || 'N/A'}</p>
              </div>
              <div class="form-group">
                <label>Líder Direto:</label>
                <p>${data.lider_direto || 'N/A'}</p>
              </div>
            </div>
          `;
          
          // Mostrar modal
          document.getElementById('viewModal').classList.remove('hidden');
        }
      })
      .catch(error => {
        console.error('Erro ao carregar dados do colaborador:', error);
        alert('Erro ao carregar dados do colaborador.');
      });
  }
  // Função auxiliar para formatar data
  function formatDate(dateString) {
    if (!dateString) return '';
  
    const date = new Date(dateString);
    if (isNaN(date)) return dateString; // Retorna a string original se a conversão falhar
  
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Mês é baseado em zero
    const year = date.getUTCFullYear();
  
    return `${day}/${month}/${year}`;
  }
  
  function toggleFormCollapse() {
    formContainer.classList.toggle('collapsed');
    
    // Atualizar o ícone do botão
    const icon = collapseFormButton.querySelector('i');
    if (icon) {
      if (formContainer.classList.contains('collapsed')) {
        icon.className = 'fas fa-plus';
      } else {
        icon.className = 'fas fa-minus';
      }
    }
  }
  
  function showForm() {
    resetForm();
    formTitle.textContent = 'Cadastrar Novo Colaborador';
    // Garantir que o formulário está visível
    if (formContainer.classList.contains('collapsed')) {
      toggleFormCollapse();
    }
    nome.focus();
  }

  //SalvarColaborador
  function saveColaborador(event) {
    event.preventDefault();
    
    const colaboradorData = {
      nome: nome.value,
      cpf: cpf.value,
      data_nascimento: dataNascimento.value,
      setor: setor.value,
      cargo: cargo.value,
      lider_direto: liderDireto.value,
      telefone: telefone.value,
      email: email.value
    };
    
    const url = colaboradorId.value 
      ? `/api/colaboradores/${colaboradorId.value}` 
      : '/api/colaboradores';
    
    const method = colaboradorId.value ? 'PUT' : 'POST';
    
    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(colaboradorData)
    })
      .then(response => {
        if (response.status === 401) {
          logout();
          return null;
        }
        if (!response.ok) {
          throw new Error('Erro ao salvar colaborador');
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          alert(colaboradorId.value ? 'Colaborador atualizado com sucesso!' : 'Colaborador cadastrado com sucesso!');
          resetForm();
          loadColaboradores();
          // Minimizar o formulário após salvar
          if (!formContainer.classList.contains('collapsed')) {
            toggleFormCollapse();
          }
        }
      })
      .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao salvar colaborador. Verifique os dados e tente novamente.');
      });
  }
  
  function editColaborador(id) {
    fetch(`/api/colaboradores/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.status === 401) {
          logout();
          return null;
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          // Preencher formulário com dados do colaborador
          colaboradorId.value = data.id;
          nome.value = data.nome;
          cpf.value = data.cpf;
          dataNascimento.value = data.data_nascimento;
          setor.value = data.setor;
          cargo.value = data.cargo;
          liderDireto.value = data.lider_direto;
          telefone.value = data.telefone;
          email.value = data.email;
          
          // Atualizar título e garantir que o formulário está visível
          formTitle.textContent = 'Editar Colaborador';
          if (formContainer.classList.contains('collapsed')) {
            toggleFormCollapse();
          }
          
          nome.focus();
        }
      })
      .catch(error => {
        console.error('Erro ao carregar dados do colaborador:', error);
        alert('Erro ao carregar dados do colaborador.');
      });
  }
  
  function deleteColaborador(id) {
    if (confirm('Tem certeza que deseja excluir este colaborador?')) {
      fetch(`/api/colaboradores/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          if (response.status === 401) {
            logout();
            return null;
          }
          if (!response.ok) {
            throw new Error('Erro ao excluir colaborador');
          }
          return response.json();
        })
        .then(data => {
          if (data) {
            alert('Colaborador excluído com sucesso!');
            loadColaboradores();
          }
        })
        .catch(error => {
          console.error('Erro:', error);
          alert('Erro ao excluir colaborador.');
        });
    }
  }
  
  function resetForm() {
    colaboradorForm.reset();
    colaboradorId.value = '';
    formTitle.textContent = 'Cadastrar Novo Colaborador';
  }
  
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.href = '/login.html';
  }
  const btnFecharViewModal = document.getElementById('btnFecharViewModal');
if (btnFecharViewModal) {
  btnFecharViewModal.addEventListener('click', function() {
    document.getElementById('viewModal').classList.add('hidden');
  });
}
});

// Funções de filtro e exportação
function toggleFiltrosExportacao() {
  const painelFiltros = document.getElementById('painelFiltrosExportacao');
  if (painelFiltros) {
    painelFiltros.classList.toggle('hidden');
  }
}

function limparFiltrosExportacao() {
  const filtros = document.querySelectorAll('#painelFiltrosExportacao input, #painelFiltrosExportacao select');
  filtros.forEach(filtro => {
    filtro.value = '';
  });
}

async function exportarColaboradoresFiltrados() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login.html';
      return;
    }

    // Obter valores dos filtros
    const nome = document.getElementById('filtroNomeExport')?.value.trim() || '';
    const setor = document.getElementById('filtroSetorExport')?.value.trim() || '';
    const cargo = document.getElementById('filtroCargoExport')?.value.trim() || '';
    const lider_direto = document.getElementById('filtroLiderExport')?.value.trim() || '';

    // Construir os parâmetros de consulta
    const queryParams = new URLSearchParams();
    if (nome) queryParams.append('nome', nome);
    if (setor) queryParams.append('setor', setor);
    if (cargo) queryParams.append('cargo', cargo);
    if (lider_direto) queryParams.append('lider_direto', lider_direto);
    
    // Construir URL com parâmetros apenas se houver algum
    const queryString = queryParams.toString();
    const url = `/api/colaboradores/export${queryString ? '?' + queryString : ''}`;
    
    console.log("Exportando colaboradores filtrados:", url);
    
    // Fazer a requisição
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ${response.status}`);
      } catch (jsonError) {
        throw new Error(`Erro ${response.status}: Não foi possível obter o relatório`);
      }
    }

    // Verificar o tipo de conteúdo da resposta
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (data.message) {
        alert(data.message);
        return;
      }
    }

    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'relatorio_colaboradores.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Opcional: fechar o painel de filtros após a exportação
    document.getElementById('painelFiltrosExportacao').classList.add('hidden');

  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    alert('Erro ao exportar o relatório: ' + error.message);
  }
}

// Evento principal de carregamento do documento
document.addEventListener('DOMContentLoaded', function() {
  // Verificar autenticação
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }
  
  // Exibir nome do usuário
  const userName = localStorage.getItem('userName');
  const userNameDisplay = document.getElementById('userNameDisplay');
  if (userName) {
    userNameDisplay.textContent = `Olá, ${userName}`;
  }
  
  // Elementos do DOM
  const colaboradorForm = document.getElementById('colaboradorForm');
  const formTitle = document.getElementById('formTitle');
  const formContainer = document.getElementById('formContainer');
  const collapseFormButton = document.getElementById('collapseFormButton');
  const newColaboradorButton = document.getElementById('newColaboradorButton');
  const colaboradorId = document.getElementById('colaboradorId');
  const nome = document.getElementById('nome');
  const cpf = document.getElementById('cpf');
  const dataNascimento = document.getElementById('data_nascimento');
  const setor = document.getElementById('setor');
  const cargo = document.getElementById('cargo');
  const liderDireto = document.getElementById('lider_direto');
  const telefone = document.getElementById('telefone');
  const email = document.getElementById('email');
  const saveButton = document.getElementById('saveButton');
  const cancelButton = document.getElementById('cancelButton');
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const colaboradoresTableBody = document.getElementById('colaboradoresTableBody');
  const logoutButton = document.getElementById('logoutButton');
  const exportarCSV = document.getElementById('exportarCSV');
  
  // Event Listeners
  colaboradorForm.addEventListener('submit', saveColaborador);
  cancelButton.addEventListener('click', resetForm);
  searchButton.addEventListener('click', searchColaboradores);
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      searchColaboradores();
    }
  });
  
  // Controle de exibição do formulário
  collapseFormButton.addEventListener('click', toggleFormCollapse);
  newColaboradorButton.addEventListener('click', showForm);
  
  // Logout
  logoutButton.addEventListener('click', logout);
  
  // Botão de exportar CSV - IMPORTANTE: Esta é a correção principal
  exportarCSV.addEventListener('click', toggleFiltrosExportacao);
  
  // Botões do painel de filtro
  const btnExportar = document.getElementById('btnExportar');
  if (btnExportar) {
    btnExportar.addEventListener('click', exportarColaboradoresFiltrados);
  }
  
  const btnLimparFiltros = document.getElementById('btnLimparFiltros');
  if (btnLimparFiltros) {
    btnLimparFiltros.addEventListener('click', limparFiltrosExportacao);
  }
  
  const btnFecharFiltros = document.getElementById('btnFecharFiltros');
  if (btnFecharFiltros) {
    btnFecharFiltros.addEventListener('click', function() {
      document.getElementById('painelFiltrosExportacao').classList.add('hidden');
    });
  }
  
  // Carregar todos os colaboradores ao iniciar
  loadColaboradores();
  
  // Funções existentes que permanecem dentro do escopo do document.addEventListener
  function loadColaboradores() {
    // Código existente...
  }
  
  function searchColaboradores() {
    // Código existente...
  }
  
  function renderColaboradoresTable(colaboradores) {
    // Código existente...
  }
  
  function formatDate(dateString) {
    // Código existente...
  }
  
  function toggleFormCollapse() {
    // Código existente...
  }
  
  function showForm() {
    // Código existente...
  }
  
  function saveColaborador(event) {
    // Código existente...
  }
  
  function editColaborador(id) {
    // Código existente...
  }
  
  function deleteColaborador(id) {
    // Código existente...
  }
  
  function resetForm() {
    // Código existente...
  }
  
  function logout() {
    // Código existente...
  }
});

