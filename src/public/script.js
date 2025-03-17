const todoList = document.getElementById('todo-list');
const addModal = document.getElementById('add-modal');
const updateModal = document.getElementById('update-modal');
const deleteModal = document.getElementById('delete-modal');
const addForm = document.getElementById('add-form');
const updateForm = document.getElementById('update-form');
const updateId = document.getElementById('update-id');
const updateTitle = document.getElementById('update-title');
const updateDescription = document.getElementById('update-description');
const showAddModalButton = document.getElementById('show-add-modal');
const confirmDeleteButton = document.getElementById('confirm-delete');
const cancelDeleteButton = document.getElementById('cancel-delete');
const deleteMessage = document.getElementById('delete-message');
let todoToDelete = null;

document.addEventListener('DOMContentLoaded', () => {
    const fetchTodos = async () => {
        try {
            const response = await fetch('/api/todos');
            const data = await response.json();
            return data.todos;
        } catch (error) {
            console.error(error);
            showError('Failed to fetch todos.');
        }
    }

    const renderTodosHtml = async (todos) => {
        todoList.innerHTML = '';
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'todo-item';
            if (todo.completed) {
                li.classList.add('completed');
            }
            li.innerHTML = `
            <span>${todo.title}</span>
            <span class="description">${todo.description}</span>
            <button class="complete-button">Complete</button>
            <button class="update-button">Update</button>
            <button class="delete-button">Delete</button>
        `;

            const completeButton = li.querySelector('.complete-button');
            const updateButton = li.querySelector('.update-button');
            const deleteButton = li.querySelector('.delete-button');

            completeButton.addEventListener('click', () => completeTodo(todo.id, li));
            updateButton.addEventListener('click', () => showUpdateModal(todo));
            deleteButton.addEventListener('click', () => showDeleteModal(todo.id, todo.title));

            todoList.appendChild(li);
        });
    }

    const renderTodos = async () => {
        const todos = await fetchTodos();
        await renderTodosHtml(todos);
    }

    const addTodo = async (title, description) => {
        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title, description})
            });
            const data = await response.json();
            return data.todo;
        } catch (error) {
            console.error(error);
            showError('Failed to add todo.');
        }
    }

    const completeTodo = async (id, li) => {
        try {
            const response = await fetch(`/api/todos/${id}/complete`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            li.classList.add('completed');
            return data.todo;
        } catch (error) {
            console.error(error);
            showError('Failed to complete todo.');
        }
    }

    const deleteTodo = async (id) => {
        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            await renderTodos(todoList);
            return;
        } catch (error) {
            console.error(error);
            showError('Failed to delete todo.');
        }
    }

    const showUpdateModal = (todo) => {
        updateId.value = todo.id;
        updateTitle.value = todo.title;
        updateDescription.value = todo.description;
        updateModal.style.display = 'flex';
    }

    const showDeleteModal = (id, title) => {
        todoToDelete = id;
        deleteMessage.textContent = `Are you sure you want to delete the todo: "${title}"?`;
        deleteModal.style.display = 'flex';
    }

    const updateTodo = async (id, title, description) => {
        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title, description, completed: false})
            });
            const data = await response.json();
            return data.todo;
        } catch (error) {
            console.error(error);
            showError('Failed to update todo.');
        }
    }

    const showError = (message) => {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = message;
        setTimeout(() => {
            errorMessage.textContent = '';
        }, 3000);
    }

    renderTodos(todoList);

    showAddModalButton.addEventListener('click', () => {
        addModal.style.display = 'flex';
    });

    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('add-title').value;
        const description = document.getElementById('add-description').value;
        await addTodo(title, description);
        renderTodos(todoList);
        addModal.style.display = 'none';
        addForm.reset();
    });

    updateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = updateId.value;
        const title = updateTitle.value;
        const description = updateDescription.value;
        await updateTodo(id, title, description);
        renderTodos(todoList);
        updateModal.style.display = 'none';
    });

    confirmDeleteButton.addEventListener('click', async () => {
        await deleteTodo(todoToDelete);
        deleteModal.style.display = 'none';
    });

    cancelDeleteButton.addEventListener('click', () => {
        deleteModal.style.display = 'none';
    });

    addModal.addEventListener('click', (e) => {
        if (e.target === addModal) {
            addModal.style.display = 'none';
        }
    });

    updateModal.addEventListener('click', (e) => {
        if (e.target === updateModal) {
            updateModal.style.display = 'none';
        }
    });

    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) {
            deleteModal.style.display = 'none';
        }
    });
});