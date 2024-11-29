// Fetch tasks from the server and display them
document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
});

// Add a task to a board
function addTask(boardId) {
    const taskName = prompt("Enter the task name:");
    if (!taskName) return;

    fetch('/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ typeofChange: 'add', name: taskName, value: boardId })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            fetchTasks();
        })
        .catch(error => console.error(error));
}

// Fetch tasks from the backend and render them
function fetchTasks() {
    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            ['todo', 'in-progress', 'done'].forEach(boardId => {
                const list = document.getElementById(`${boardId}-list`);
                list.innerHTML = '';
                Object.entries(tasks).forEach(([name, value]) => {
                    if (value === boardId) {
                        const task = document.createElement('div');
                        task.className = 'task';
                        task.draggable = true;
                        task.textContent = name;

                        // Drag and Drop Events
                        task.addEventListener('dragstart', (e) => {
                            e.dataTransfer.setData('text/plain', name);
                        });

                        task.addEventListener('dblclick', () => deleteTask(name));

                        list.appendChild(task);
                    }
                });
            });
        });
}

// Delete a task
function deleteTask(taskName) {
    if (!confirm("Delete this task?")) return;

    fetch('/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ typeofChange: 'delete', name: taskName })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            fetchTasks();
        })
        .catch(error => console.error(error));
}

// Enable Drag and Drop
['todo-list', 'in-progress-list', 'done-list'].forEach(listId => {
    const list = document.getElementById(listId);

    list.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    list.addEventListener('drop', (e) => {
        e.preventDefault();
        const taskName = e.dataTransfer.getData('text/plain');
        const boardId = listId.split('-list')[0];

        fetch('/edit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ typeofChange: 'edit', name: taskName, value: boardId })
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                fetchTasks();
            })
            .catch(error => console.error(error));
    });
});
