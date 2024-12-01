// Função para habilitar edição do título e dos itens
function enableEditMode(box) {
    const title = box.querySelector('h2');
    const labels = box.querySelectorAll('.item label');
    const checkboxes = box.querySelectorAll('.item input[type="checkbox"]');
    const closeButton = box.querySelector('.button_close');
    const editButton = box.querySelector('.button_edit');

    // Desabilitar as checkboxes enquanto edita
    checkboxes.forEach(checkbox => {
        checkbox.disabled = true;
    });

    // Tornar o título editável
    title.setAttribute('contenteditable', 'true');
    
    // Tornar os labels editáveis
    labels.forEach(label => {
        label.setAttribute('contenteditable', 'true');
    });

    // Adicionar borda para destacar que estão editáveis
    title.style.border = '1px solid #ff9900';
    labels.forEach(label => {
        label.style.border = '1px solid #ff9900';
    });

    // Posicionar o botão de excluir à esquerda do botão de editar
    closeButton.style.right = `${editButton.offsetWidth + 10}px`; // Desloca o botão de excluir para a esquerda

    // Captura da tecla "Esc" para sair do modo de edição
    function handleEsc(event) {
        if (event.key === 'Escape') {
            finishEditMode(box);
            document.removeEventListener('keydown', handleEsc); // Remover o evento após usar
        }
    }

    // Captura da tecla "Enter" para finalizar a edição
    function handleEnter(event) {
        if (event.key === 'Enter') {
            finishEditMode(box);
            document.removeEventListener('keydown', handleEnter); // Remover o evento após usar
        }
    }

    // Adiciona o evento para sair do modo de edição com "Esc"
    document.addEventListener('keydown', handleEsc);

    // Adiciona o evento para sair do modo de edição com "Enter"
    document.addEventListener('keydown', handleEnter);

    // Captura de clique fora da box para finalizar a edição
    function handleClickOutside(event) {
        if (!box.contains(event.target)) {
            finishEditMode(box);
            document.removeEventListener('click', handleClickOutside); // Remover o evento após usar
        }
    }

    // Adiciona o evento para sair do modo de edição clicando fora da box
    document.addEventListener('click', handleClickOutside);
}

// Função para finalizar a edição
function finishEditMode(box) {
    // Selecionar o título da box (h2)
    const title = box.querySelector('h2');
    const labels = box.querySelectorAll('.item label');
    const checkboxes = box.querySelectorAll('.item input[type="checkbox"]');
    const closeButton = box.querySelector('.button_close');

    // Habilitar as checkboxes após a edição
    checkboxes.forEach(checkbox => {
        checkbox.disabled = false;
    });

    // Remover o atributo contenteditable do título e labels
    title.removeAttribute('contenteditable');
    if (title.textContent.trim() === '') {
        title.textContent = 'Título';
    }
    labels.forEach(label => {
        label.removeAttribute('contenteditable');
        
        // Verifica se o label está vazio e substitui por "Nome da tarefa"
        if (label.textContent.trim() === '') {
            label.textContent = 'Nome da tarefa';
        }
    });

    // Remover a borda de destaque
    title.style.border = '';
    labels.forEach(label => {
        label.style.border = '';
    });
}

// Função para adicionar uma nova box
function addBox() {
    const boxArea = document.getElementById('boxArea');

    // Criação da box
    const box = document.createElement('div');
    box.classList.add('box');
    
    // Título da box
    const boxTitle = document.createElement('h2');
    boxTitle.textContent = "Título";  // Título inicial da box
    
    // Criando a área de tarefas
    const item = document.createElement('div');
    item.classList.add('item');
    
    // Criando os elementos de tarefas
    const task1 = document.createElement('div');
    task1.classList.add('task');
    
    const task2 = document.createElement('div');
    task2.classList.add('task');

    // Gerar IDs exclusivos para as tarefas
    const taskId1 = `task${boxArea.children.length * 2 + 1}`;
    const taskId2 = `task${boxArea.children.length * 2 + 2}`;

    const checkbox1 = document.createElement('input');
    checkbox1.type = 'checkbox';
    checkbox1.id = taskId1;

    const label1 = document.createElement('label');
    label1.setAttribute('for', taskId1);
    label1.textContent = 'Nome da tarefa';  // Texto da tarefa

    const checkbox2 = document.createElement('input');
    checkbox2.type = 'checkbox';
    checkbox2.id = taskId2;

    const label2 = document.createElement('label');
    label2.setAttribute('for', taskId2);
    label2.textContent = 'Nome da tarefa';  // Texto da tarefa

    // Adicionando os elementos de checkbox e label dentro das tasks
    task1.appendChild(checkbox1);
    task1.appendChild(label1);
    
    task2.appendChild(checkbox2);
    task2.appendChild(label2);

    // Adicionando as tasks dentro da área de itens
    item.appendChild(task1);
    item.appendChild(task2);
    
    // Botão de editar
    const editButton = document.createElement('img');
    editButton.src = 'icones/editar.svg';
    editButton.alt = 'Botão editar';
    editButton.classList.add('button_edit');
    editButton.addEventListener('click', function() {
        enableEditMode(box);
    });

    // Botão de fechar
    const closeButton = document.createElement('img');
    closeButton.src = 'icones/fechar.svg';
    closeButton.alt = 'Botão fechar';
    closeButton.classList.add('button_close');
    closeButton.addEventListener('click', function() {
        removeBox(box);
    });


    // Adiciona os elementos na box
    box.appendChild(boxTitle);
    box.appendChild(item);
    box.appendChild(editButton);
    box.appendChild(closeButton);

    // Adiciona a nova box na área
    boxArea.appendChild(box);
}

// Função para remover a box
function removeBox(box) {
    box.remove(); // Remove a box do DOM
}
