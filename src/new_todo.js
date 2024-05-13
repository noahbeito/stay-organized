window.onload = function() {
    populateTodoDropdown();
    populateCategoriesDropdown();
};

let addTodoele = document.getElementById('addTodo');
console.log("addTodoele", addTodoele)

document.getElementById('addTodo').addEventListener('click', function() {
    console.log("addTodo clicked")
    const userid = document.getElementById('addTodoUserDropdown').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const deadline = document.getElementById('deadline').value;
    const priority = document.getElementById('priority').value;


    console.log(userid, category, description, deadline, priority);
    console.log("category", category)

    fetch('http://localhost:8083/api/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userid: userid,
            category: category,
            description: description,
            deadline: deadline,
            priority: priority,
        })
    }).then(response => {
        if (response.status === 201) {
            alert('Todo added successfully');
        } else {
            alert('Failed to add todo');
        }
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

function populateCategoriesDropdown() {
    fetch('http://localhost:8083/api/categories')
        .then(response => response.json())
        .then(data => {
            const categories = document.getElementById('category');
            data.forEach(category => {
                const option = document.createElement('option');
                option.value = category.name;
                option.text = category.name;
                categories.appendChild(option);
            });
        });
}