window.onload = function() {
    populateTodoDropdown();
    populateCategoriesDropdown();
};

document.getElementById('addTodo').addEventListener('click', function(event) {
    event.preventDefault();
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
            showSuccessAlert('Todo added successfully');
            document.getElementById('category').value = '';
            document.getElementById('description').value = '';
            document.getElementById('deadline').value = '';
            document.getElementById('priority').value = 'Medium';
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
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = '';
            defaultOption.disabled = true;
            defaultOption.selected = true;
            userDropdown.appendChild(defaultOption);
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
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = '';
            defaultOption.disabled = true;
            defaultOption.selected = true;
            categories.appendChild(defaultOption);

            data.forEach(category => {
                const option = document.createElement('option');
                option.value = category.name;
                option.text = category.name;
                categories.appendChild(option);
            });
        });
}

function showSuccessAlert(message) {
    const alert = document.getElementById('success-alert');
    alert.textContent = message;
    alert.style.display = 'block';

    setTimeout(() => {
        alert.style.display = 'none';
    }, 2000); 
}