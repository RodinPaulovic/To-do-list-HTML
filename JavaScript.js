// Definir as cores que serão usadas
const colorSchemes = [
    {
        body: "#0D1117",
        box: "#3D444D",
        h2Bg: "#24292e",
        p: "#3d4046"
    },
    {
        body: "#90B8E0",
        box: "#93A9CF",
        h2Bg: "#7d8eaa",
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

const boxAreas = [document.getElementById('boxArea1'), document.getElementById('boxArea2'), document.getElementById('boxArea3')];

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
    
        // Verifica se o label está vazio
        if (label.textContent.trim() === '') {
            const task = label.parentElement; // O elemento pai do label, que é a task
            task.remove(); // Remove a task inteira
        }
    });

    // Remover a borda de destaque
    title.style.border = '';
    labels.forEach(label => {
        label.style.border = '';
    });
}

let currentArea = 1; // Define a área inicial
let taskCounter = 1;  // Inicializando o contador global

function addBox() {

    // Criação da box
    const box = document.createElement('div');
    box.classList.add('box');

    // Título da box
    const boxTitle = document.createElement('h2');
    boxTitle.textContent = "Título"; // Título inicial da box

    // Criando a área de tarefas
    const item = document.createElement('div');
    item.classList.add('item');

    // Criando os elementos de tarefas
    const task1 = document.createElement('div');
    task1.classList.add('task');

    const task2 = document.createElement('div');
    task2.classList.add('task');

    const taskId1 = `task${taskCounter++}`;
    const taskId2 = `task${taskCounter++}`;

    const checkbox1 = document.createElement('input');
    checkbox1.type = 'checkbox';
    checkbox1.id = taskId1;

    const label1 = document.createElement('label');
    label1.setAttribute('for', taskId1);
    label1.textContent = 'Nova tarefa'; // Texto da tarefa

    const checkbox2 = document.createElement('input');
    checkbox2.type = 'checkbox';
    checkbox2.id = taskId2;

    const label2 = document.createElement('label');
    label2.setAttribute('for', taskId2);
    label2.textContent = 'Nova tarefa'; // Texto da tarefa

    // Adicionando eventos aos checkboxes
    checkbox1.addEventListener('change', function () {
        moveBox(box);
    });

    checkbox2.addEventListener('change', function () {
        moveBox(box);
    });

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
    editButton.addEventListener('click', function () {
        enableEditMode(box);
    });

    // Botão de fechar com confirmação
    const closeButton = document.createElement('img');
    closeButton.src = 'icones/fechar.svg';
    closeButton.alt = 'Botão fechar';
    closeButton.classList.add('button_close');
    closeButton.addEventListener('click', function () {
        confirmAndRemoveBox(box);
    });

    // Ícone de adicionar tarefa
    const addTaskButton = document.createElement('img');
    addTaskButton.src = 'icones/add_task.svg'; // Substitua pelo caminho do ícone
    addTaskButton.alt = 'Adicionar tarefa';
    addTaskButton.classList.add('button_add_task');
    addTaskButton.addEventListener('click', function () {
        addTask(item);
    });

    // Adiciona os elementos na box
    box.appendChild(boxTitle);
    box.appendChild(item);
    box.appendChild(editButton);
    box.appendChild(closeButton);
    box.appendChild(addTaskButton);

    // Mapeia as alturas das áreas
    const heights = boxAreas.map(area => area.getBoundingClientRect().height);

    // Encontra o índice da menor altura
    const smallestIndex = heights.indexOf(Math.min(...heights));

    // Adiciona a box à área selecionada
    boxAreas[smallestIndex].appendChild(box);

}


// Função para mover a box para "concluídos" ou "não concluídos"
function moveBox(box) {
    const checkboxes = box.querySelectorAll('input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);

    checkboxes.forEach(checkbox => {
        checkbox.disabled = true;
    });

    const concluidoArea = document.querySelector('.concluidos');

    // Movendo para "concluídos"
    if (allChecked) {
        concluidoArea.appendChild(box);

        // Exibe o estado atual das áreas em uma linha
        displayAreaStatus(boxAreas);

        testLargestBoxAreaAndMove()
    } 
    // Movendo para "não concluídos" e ajustando a posição na próxima área disponível
    else if (box.parentElement === concluidoArea) {        
        // Mapeia as alturas das áreas
        const heights = boxAreas.map(area => area.getBoundingClientRect().height);

        // Encontra o índice da menor altura
        const smallestIndex = heights.indexOf(Math.min(...heights));

        // Adiciona a box à área selecionada
        boxAreas[smallestIndex].appendChild(box);

        testLargestBoxAreaAndMove()
    }
}

// Função para exibir o status das áreas no console em uma única linha
function displayAreaStatus(boxAreas) {
    let status = '';
    boxAreas.forEach((area, areaIndex) => {
        const boxes = area.querySelectorAll('.box');
        if (boxes.length === 0) {
            status += `|A${areaIndex + 1} BX| `; // Caso não haja box na área
        } else {
            boxes.forEach((box, boxIndex) => {
                status += `|A${areaIndex + 1} B${boxIndex}| `; // Formato A1 B0, A2 B1, etc.
            });
        }
    });
    (status.trim()); // Remove espaço extra no final
}




// Função para adicionar uma nova tarefa
function addTask(item) {
    const task = document.createElement('div');
    task.classList.add('task');

    const taskId = `task${Date.now()}`; // ID único baseado no timestamp

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = taskId;

    const label = document.createElement('label');
    label.setAttribute('for', taskId);
    label.textContent = 'Nova tarefa';

    // Adicionando evento ao checkbox
    checkbox.addEventListener('change', function () {
        moveBox(item.closest('.box')); // Passa a referência da box ao evento
    });

    task.appendChild(checkbox);
    task.appendChild(label);

    item.appendChild(task);
}

// Função para confirmar antes de remover a box
function confirmAndRemoveBox(box) {
    if (confirm('Tem certeza que deseja excluir esta box?')) {
        box.remove();
        
    }
}


document.getElementById('trash-button').addEventListener('click', clear);

function clear() {
    const userConfirmed = confirm("Tem certeza de que deseja excluir TODAS?");
    if (userConfirmed) {
        currentArea = 1;
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

function testLargestBoxAreaAndMove() {
    // Obtém as alturas das áreas
    const heights = boxAreas.map(area => area.getBoundingClientRect().height);
    const largestIndex = heights.indexOf(Math.max(...heights));

    // Verifica se há elementos na área com maior altura
    const largestArea = boxAreas[largestIndex];
    const lastBox = largestArea.lastElementChild;

    if (lastBox) {
        // Calcula a altura sem o último elemento
        const lastBoxHeight = lastBox.getBoundingClientRect().height;
        const newHeight = heights[largestIndex] - lastBoxHeight;


        // Verifica se ainda seria a maior
        const otherHeights = heights.map((height, index) => index === largestIndex ? newHeight : height);
        const wouldStillBeLargest = newHeight === Math.max(...otherHeights);

        if (wouldStillBeLargest) {

            // Encontra a área com menor altura
            const smallestIndex = heights.indexOf(Math.min(...heights));

            // Move a última box para a área com menor altura
            boxAreas[smallestIndex].appendChild(lastBox);
        } else {

        }
        
    } else {

    }
}
