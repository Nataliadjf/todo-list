const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const descInput = document.getElementById('todo-desc');
const statusInput = document.getElementById('todo-status');
const complexityInput = document.getElementById('todo-complexity');
const list = document.getElementById('todo-list');
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('close-modal');
const modalTitle = document.getElementById('modal-title');
const modalStatus = document.getElementById('modal-status');
const modalComplexity = document.getElementById('modal-complexity');
const modalDesc = document.getElementById('modal-desc');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let editingIdx = null;

function renderTodos() {
    list.innerHTML = '';
    todos.forEach((todo, idx) => {
        const li = document.createElement('li');
        li.className = todo.completed ? 'completed' : '';
        if (editingIdx === idx) {
            li.innerHTML = `
                <form class="edit-form" onsubmit="return saveEdit(${idx})">
                    <input type="text" id="edit-input-${idx}" value="${todo.text}" autofocus />
                    <textarea id="edit-desc-${idx}" rows="2">${todo.desc || ''}</textarea>
                    <select id="edit-status-${idx}">
                        <option value="A fazer" ${todo.status === 'A fazer' ? 'selected' : ''}>A fazer</option>
                        <option value="Em andamento" ${todo.status === 'Em andamento' ? 'selected' : ''}>Em andamento</option>
                        <option value="Concluído" ${todo.status === 'Concluído' ? 'selected' : ''}>Concluído</option>
                    </select>
                    <select id="edit-complexity-${idx}">
                        <option value="Baixa" ${todo.complexity === 'Baixa' ? 'selected' : ''}>Baixa</option>
                        <option value="Média" ${todo.complexity === 'Média' ? 'selected' : ''}>Média</option>
                        <option value="Alta" ${todo.complexity === 'Alta' ? 'selected' : ''}>Alta</option>
                    </select>
                    <div class="todo-actions">
                        <button type="submit" title="Salvar">💾</button>
                        <button type="button" title="Cancelar" onclick="cancelEdit()">✖️</button>
                    </div>
                </form>
            `;
        } else {
            li.innerHTML = `
                <span onclick="startEdit(${idx})" title="Clique para editar">${todo.text}</span>
                <div class="todo-actions">
                    <button title="Visualizar" onclick="showModal(${idx})">🔍</button>
                    <button title="Editar" onclick="startEdit(${idx})">✏️</button>
                    <button title="Concluir" onclick="toggleTodo(${idx})">✔️</button>
                    <button title="Remover" onclick="removeTodo(${idx})">🗑️</button>
                </div>
                <div style="font-size:0.92em;color:#764ba2;margin-top:0.2em;">
                    <span><strong>Status:</strong> ${todo.status || 'A fazer'}</span> |
                    <span><strong>Complexidade:</strong> ${todo.complexity || 'Baixa'}</span>
                </div>
            `;
        }
        list.appendChild(li);
    });
}

function addTodo(text) {
    const desc = descInput.value.trim();
    const status = statusInput.value;
    const complexity = complexityInput.value;
    todos.push({ text, desc, status, complexity, completed: false });
    saveTodos();
    renderTodos();
}

function removeTodo(idx) {
    if (editingIdx === idx) editingIdx = null;
    todos.splice(idx, 1);
    saveTodos();
    renderTodos();
}

function toggleTodo(idx) {
    todos[idx].completed = !todos[idx].completed;
    saveTodos();
    renderTodos();
}

function startEdit(idx) {
    editingIdx = idx;
    renderTodos();
    setTimeout(() => {
        const input = document.getElementById(`edit-input-${idx}`);
        if (input) input.focus();
    }, 0);
}

function saveEdit(idx) {
    const input = document.getElementById(`edit-input-${idx}`);
    const desc = document.getElementById(`edit-desc-${idx}`).value.trim();
    const status = document.getElementById(`edit-status-${idx}`).value;
    const complexity = document.getElementById(`edit-complexity-${idx}`).value;
    const value = input.value.trim();
    if (value) {
        todos[idx].text = value;
        todos[idx].desc = desc;
        todos[idx].status = status;
        todos[idx].complexity = complexity;
        editingIdx = null;
        saveTodos();
        renderTodos();
    }
    return false; // previne submit padrão
}

function cancelEdit() {
    editingIdx = null;
    renderTodos();
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

form.onsubmit = function(e) {
    e.preventDefault();
    const value = input.value.trim();
    if (value) {
        addTodo(value);
        input.value = '';
        descInput.value = '';
        input.focus();
    }
};

function showModal(idx) {
    const todo = todos[idx];
    modalTitle.textContent = todo.text;
    modalStatus.textContent = todo.status || 'A fazer';
    modalComplexity.textContent = todo.complexity || 'Baixa';
    modalDesc.textContent = todo.desc || '';
    modal.style.display = 'flex';
}

closeModalBtn.onclick = function() {
    modal.style.display = 'none';
};

window.showModal = showModal;
window.removeTodo = removeTodo;
window.toggleTodo = toggleTodo;
window.startEdit = startEdit;
window.saveEdit = saveEdit;
window.cancelEdit = cancelEdit;

// Fecha modal ao clicar fora do conteúdo
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

renderTodos(); 