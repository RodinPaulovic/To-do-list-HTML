// Definir as cores que serão usadas
const colorSchemes = [
    {
        body: "#0D1117",
        box: "#3D444D",
        h2Bg: "#24292e",
        p: "#3153a"
    },
    {
        body: "#90B8E0",
        box: "#93A9CF",
        h2Bg: "#6D7D99",
        p: "#607487"
    },
    {
        body: "#E8C1BF",
        box: "#FFCDD2",
        h2Bg: "#EF9A9A",
        p: "#B83732"
    }
];

let currentColorIndex = 0;

// Função para mudar as cores
function changeColors() {
    currentColorIndex = (currentColorIndex + 1) % colorSchemes.length;

    const scheme = colorSchemes[currentColorIndex];

    // Atualiza as variáveis CSS
    document.documentElement.style.setProperty('--color-body', scheme.body);
    document.documentElement.style.setProperty('--color-box', scheme.box);
    document.documentElement.style.setProperty('--color-h2-bg', scheme.h2Bg);
    document.documentElement.style.setProperty('--color-p', scheme.p);
}

// Adicionar evento ao botão de troca de cor
document.getElementById('color-toggle').addEventListener('click', changeColors);

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
        
        // Verifica se o label está vazio e substitui por "Nova tarefa"
        if (label.textContent.trim() === '') {
            label.textContent = 'Nova tarefa';
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

    // Botão de fechar com confirmação
    const closeButton = document.createElement('img');
    closeButton.src = 'icones/fechar.svg';
    closeButton.alt = 'Botão fechar';
    closeButton.classList.add('button_close');
    closeButton.addEventListener('click', function() {
        confirmAndRemoveBox(box);
    });

    // Ícone de adicionar tarefa
    const addTaskButton = document.createElement('img');
    addTaskButton.src = 'icones/add_task.svg';  // Substitua pelo caminho do ícone
    addTaskButton.alt = 'Adicionar tarefa';
    addTaskButton.classList.add('button_add_task');
    addTaskButton.addEventListener('click', function() {
        addTask(item);  // Chama a função para adicionar uma nova tarefa
    });

    // Adiciona os elementos na box
    box.appendChild(boxTitle);
    box.appendChild(item);
    box.appendChild(editButton);
    box.appendChild(closeButton);
    box.appendChild(addTaskButton);

    // Adiciona a nova box na área
    boxArea.appendChild(box);
}

// Função de confirmação antes de remover
function confirmAndRemoveBox(box) {
    const userConfirmed = confirm("Tem certeza de que deseja excluir esta box?");
    if (userConfirmed) {
        box.remove(); // Remove a box caso o usuário confirme
    }
}

document.getElementById('trash-button').addEventListener('click', clear);

function clear() {
    const userConfirmed = confirm("Tem certeza de que deseja excluir TODAS?");
    if (userConfirmed) {
        const boxes = document.querySelectorAll('.box');
        boxes.forEach((box, index) => {
            // Adiciona uma classe que ativa a transição de opacidade
            box.style.opacity = 0;

            // Aguarda a transição antes de remover a caixa
            setTimeout(() => {
                box.remove();
            }, 300); // O tempo deve coincidir com a duração da transição no CSS
        });
    }
    
}

function addTask(itemContainer) {
    // Cria o contêiner da nova tarefa
    const task = document.createElement('div');
    task.classList.add('task');

    // Gera um ID único baseado no número atual de tarefas
    const taskId = `task${document.querySelectorAll('.task').length + 1}`;

    // Cria o checkbox da tarefa
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = taskId;

    // Cria o rótulo (label) da tarefa
    const label = document.createElement('label');
    label.setAttribute('for', taskId);
    label.textContent = 'Nova tarefa'; // Texto padrão para a tarefa

    // Adiciona o checkbox e o label ao contêiner da tarefa
    task.appendChild(checkbox);
    task.appendChild(label);

    // Adiciona a tarefa ao contêiner fornecido (itemContainer)
    itemContainer.appendChild(task);
}
