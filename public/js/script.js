document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const colaboradorForm = document.getElementById('colaboradorForm');
    const formTitle = document.getElementById('formTitle');
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
  
    // Funções
    function loadColaboradores() {
      fetch('/api/colaboradores')
        .then(response => response.json())
        .then(data => {
          renderColaboradoresTable(data);
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
  
      fetch(`/api/colaboradores/search?term=${encodeURIComponent(term)}`)
        .then(response => response.json())
        .then(data => {
          renderColaboradoresTable(data);
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
        row.innerHTML = '<td colspan="9" style="text-align: center;">Nenhum colaborador encontrado</td>';
        colaboradoresTableBody.appendChild(row);
        return;
      }
  
      colaboradores.forEach(colaborador => {
        const row = document.createElement('tr');
        
        // Formatar data de nascimento
        const dataNasc = new Date(colaborador.data_nascimento);
        const dataFormatada = dataNasc.toLocaleDateString('pt-BR');
        
        row.innerHTML = `
          <td>${colaborador.nome}</td>
          <td>${colaborador.cpf}</td>
          <td>${dataFormatada}</td>
          <td>${colaborador.setor}</td>
          <td>${colaborador.cargo}</td>
          <td>${colaborador.lider_direto}</td>
          <td>${colaborador.telefone}</td>
          <td>${colaborador.email}</td>
          <td class="action-buttons">
            <button class="edit-btn" data-id="${colaborador.id}">Editar</button>
            <button class="delete-btn" data-id="${colaborador.id}">Excluir</button>
          </td>
        `;
        
        colaboradoresTableBody.appendChild(row);
        
        // Adicionar event listeners para os botões
        row.querySelector('.edit-btn').addEventListener('click', () => editColaborador(colaborador.id));
        row.querySelector('.delete-btn').addEventListener('click', () => deleteColaborador(colaborador.id));
      });
    }
  
    function saveColaborador(e) {
      e.preventDefault();
  
      const colaborador = {
        nome: nome.value,
        cpf: cpf.value,
        data_nascimento: dataNascimento.value,
        setor: setor.value,
        cargo: cargo.value,
        lider_direto: liderDireto.value,
        telefone: telefone.value,
        email: email.value
      };
  
      const id = colaboradorId.value;
      const method = id ? 'PUT' : 'POST';
      const url = id ? `/api/colaboradores/${id}` : '/api/colaboradores';
  
      fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(colaborador)
      })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        resetForm();
        loadColaboradores();
      })
      .catch(error => {
        console.error('Erro ao salvar colaborador:', error);
        alert('Erro ao salvar colaborador.');
      });
    }
  
    function editColaborador(id) {
      fetch(`/api/colaboradores/${id}`)
        .then(response => response.json())
        .then(colaborador => {
          // Preencher o formulário com os dados do colaborador
          colaboradorId.value = colaborador.id;
          nome.value = colaborador.nome;
          cpf.value = colaborador.cpf;
          dataNascimento.value = formatDateForInput(colaborador.data_nascimento);
          setor.value = colaborador.setor;
          cargo.value = colaborador.cargo;
          liderDireto.value = colaborador.lider_direto;
          telefone.value = colaborador.telefone;
          email.value = colaborador.email;
          
          // Atualizar o título do formulário
          formTitle.textContent = 'Editar Colaborador';
          saveButton.textContent = 'Atualizar';
          
          // Rolar até o formulário
          formTitle.scrollIntoView({ behavior: 'smooth' });
        })
        .catch(error => {
          console.error('Erro ao carregar dados do colaborador:', error);
          alert('Erro ao carregar dados do colaborador.');
        });
    }
  
    function deleteColaborador(id) {
      if (confirm('Tem certeza que deseja excluir este colaborador?')) {
        fetch(`/api/colaboradores/${id}`, {
          method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
          alert(data.message);
          loadColaboradores();
        })
        .catch(error => {
          console.error('Erro ao excluir colaborador:', error);
          alert('Erro ao excluir colaborador.');
        });
      }
    }
  
    function resetForm() {
      colaboradorForm.reset();
      colaboradorId.value = '';
      formTitle.textContent = 'Cadastrar Novo Colaborador';
      saveButton.textContent = 'Salvar';
    }
  
    function formatDateForInput(dateString) {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    }
  
    // Adiciona máscara para o CPF
    cpf.addEventListener('input', function() {
      let value = this.value.replace(/\D/g, '');
      if (value.length > 11) {
        value = value.substring(0, 11);
      }
      
      if (value.length > 9) {
        this.value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      } else if (value.length > 6) {
        this.value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
      } else if (value.length > 3) {
        this.value = value.replace(/(\d{3})(\d{3})/, '$1.$2');
      } else {
        this.value = value;
      }
    });
  
    // Adiciona máscara para o telefone
    telefone.addEventListener('input', function() {
      let value = this.value.replace(/\D/g, '');
      if (value.length > 11) {
        value = value.substring(0, 11);
      }
      
      if (value.length > 10) {
        this.value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else if (value.length > 6) {
        this.value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      } else if (value.length > 2) {
        this.value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      } else {
        this.value = value;
      }
    });
  });