window.onload = function() {
    populateTodoDropdown();
};

document.getElementById('addTodo').addEventListener('click', function() {
    const userId = document.getElementById('addTodoUserDropdown').value;
    const category = document.getElementById('addTodoCategory').value;
    const description = document.getElementById('addTodoDescription').value;
    const deadline = document.getElementById('addTodoDeadline').value;
    const priority = document.getElementById('addTodoPriority').value;

    console.log(userId, category, description, deadline, priority);

    fetch('http://localhost:8083/api/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: userId,
            category: category,
            description: description,
            deadline: deadline,
            priority: priority,
        })
    }).then(response => {
        console.log("response", response)
        // if (response.status === 201) {
        //     alert('Todo added successfully');
        // } else {
        //     alert('Failed to add todo');
        // }
    });
});

function populateTodoDropdown() {
    fetch('http://localhost:8083/api/users')
        .then(response => response.json())
        .then(data => {
            const userDropdown = document.getElementById('addTodoUserDropdown');
            data.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.text = user.name;
                userDropdown.appendChild(option);
            });
        });
}