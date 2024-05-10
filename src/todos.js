window.onload = function() {
    populateTodoDropdown();
}

document.getElementById('todosUserDropdown').addEventListener('change', function() {
    const userId = this.value;
    fetch(`http://localhost:8083/api/todos/byuser/${userId}`)
        .then(response => response.json())
        .then(data => {
            const todos = document.getElementById('todos');
            todos.innerHTML = `
                <tr>
                    <th>Id</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Deadline</th>
                    <th>Priority</th>
                    <th>Completed</th>
                </tr>
            `;
            data.forEach(todo => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${todo.id}</td>
                    <td>${todo.category}</td>
                    <td>${todo.description}</td>
                    <td>${todo.deadline}</td>
                    <td>${todo.priority}</td>
                    <td>${todo.completed}</td>
                `;
                todos.appendChild(tr);
            });
        });
});

function populateTodoDropdown() {
    fetch('http://localhost:8083/api/users')
        .then(response => response.json())
        .then(data => {
            const userDropdown = document.getElementById('todosUserDropdown');
            data.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.text = user.name;
                userDropdown.appendChild(option);
            });
        });
}