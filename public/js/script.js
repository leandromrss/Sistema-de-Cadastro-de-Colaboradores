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
  const formContainer = document.getElementById('formContainer');
  const formHeader = document.querySelector('.form-header');
  const formContent = document.querySelector('.form-content');
  const formToggleIcon = document.querySelector('.form-header .toggle-icon');
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
  if (collapseFormButton) {
    collapseFormButton.removeEventListener('click', toggleFormCollapse);
  }
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
  
  // Função para formatar CPF
  function formatarCPF(cpf) {
    if (!cpf) return '';
    
    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return cpf;
    
    // Formata o CPF: XXX.XXX.XXX-XX
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
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
        <td>${formatarCPF(colaborador.cpf)}</td>
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
                <p>${formatarCPF(data.cpf) || 'N/A'}</p>
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
    if (!formContainer || !formContent || !formToggleIcon) return;

    formContainer.classList.toggle('collapsed');
    
    if (formContainer.classList.contains('collapsed')) {
      formContent.style.maxHeight = '0';
      formContent.style.opacity = '0';
      formContent.style.overflow = 'hidden';
      formToggleIcon.style.transform = 'rotate(180deg)';
    } else {
      formContent.style.maxHeight = formContent.scrollHeight + 'px';
      formContent.style.opacity = '1';
      formContent.style.overflow = 'visible';
      formToggleIcon.style.transform = 'rotate(0)';
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

  // Adicionar event listener ao header do formulário
  if (formHeader) {
    formHeader.addEventListener('click', toggleFormCollapse);
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
document.addEventListener('DOMContentLoaded', () => {
  // Verificar autenticação ao carregar a página
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  // Carregar nome do usuário
  const userName = localStorage.getItem('userName');
  if (userName) {
    document.getElementById('userNameDisplay').textContent = `Olá, ${userName}`;
  }

  // Toggle Sidebar
  const toggleSidebarBtn = document.querySelector('.toggle-sidebar');
  if (toggleSidebarBtn) {
    toggleSidebarBtn.addEventListener('click', toggleSidebar);
  }

  // Toggle Table
  const tableHeader = document.querySelector('.table-header');
  if (tableHeader) {
    tableHeader.addEventListener('click', () => {
      const tableContainer = document.querySelector('.table-container');
      tableContainer.classList.toggle('collapsed');
    });
  }

  // Navegação da Sidebar
  document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = e.currentTarget.getAttribute('data-section');
      switchSection(section);
    });
  });

  // Botão de exportar CSV
  const exportarCSVBtn = document.getElementById('exportarCSV');
  if (exportarCSVBtn) {
    exportarCSVBtn.addEventListener('click', exportarRelatorio);
  }

  // Botão de limpar filtros
  const btnLimparFiltros = document.getElementById('btnLimparFiltros');
  if (btnLimparFiltros) {
    btnLimparFiltros.addEventListener('click', () => {
      // Limpar todos os campos de filtro
      const filtros = [
        'filtroNomeExport',
        'filtroCPFExport',
        'filtroSetorExport',
        'filtroCargoExport',
        'filtroLiderExport'
      ];
      
      filtros.forEach(filtroId => {
        const elemento = document.getElementById(filtroId);
        if (elemento) {
          elemento.value = '';
        }
      });
    });
  }

  // Logout
  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      window.location.href = '/login.html';
    });
  }

  // Carregar colaboradores ao iniciar
  carregarColaboradores();
});

// Função para exportar relatório
async function exportarRelatorio() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login.html';
      return;
    }

    // Obter valores dos filtros
    const filtros = {
      nome: document.getElementById('filtroNomeExport')?.value || '',
      cpf: document.getElementById('filtroCPFExport')?.value || '',
      setor: document.getElementById('filtroSetorExport')?.value || '',
      cargo: document.getElementById('filtroCargoExport')?.value || '',
      lider_direto: document.getElementById('filtroLiderExport')?.value || ''
    };

    // Construir query string com os filtros não vazios
    const queryParams = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value.trim()) {
        queryParams.append(key, value.trim());
      }
    });

    const url = `/api/colaboradores/export${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    console.log("Tentando exportar relatório. URL:", url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      window.location.href = '/login.html';
      return;
    }

    if (!response.ok) {
      throw new Error(`Erro ao exportar: ${response.status}`);
    }

    const blob = await response.blob();
    const url_download = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    // Gerar nome do arquivo com data atual
    const dataAtual = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    const nomeArquivo = `relatorio-colaboradores-${dataAtual}.csv`;
    
    a.href = url_download;
    a.download = nomeArquivo;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url_download);
    document.body.removeChild(a);

    alert('Relatório exportado com sucesso!');
  } catch (error) {
    console.error('Erro ao exportar relatório:', error);
    alert('Erro ao exportar relatório. Por favor, tente novamente.');
  }
}

// Função para alternar a barra lateral
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  
  sidebar.classList.toggle('collapsed');
  mainContent.classList.toggle('expanded');
}

// Função para trocar entre seções
function switchSection(sectionId) {
  // Remover classe active de todas as seções
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Adicionar classe active na seção selecionada
  const targetSection = document.getElementById(sectionId + 'Section');
  if (targetSection) {
    targetSection.classList.add('active');
  }
  
  // Atualizar links ativos na sidebar
  document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.classList.remove('active');
  });
  
  const activeLink = document.querySelector(`.sidebar-nav a[data-section="${sectionId}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
  
  // Se for a seção de relatórios, garantir que os filtros estejam visíveis
  if (sectionId === 'relatorios') {
    const filtersContainer = document.querySelector('.filters-container');
    if (filtersContainer) {
      filtersContainer.style.display = 'block';
    }
  }
}
