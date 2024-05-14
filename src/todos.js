window.onload = function() {
    populateTodoDropdown();
}

document.getElementById('user-select').addEventListener('change', function() {
    displayTodos(this.value);
});

function displayTodos(userId) {

    fetch(`http://localhost:8083/api/todos/byuser/${userId}`)
        .then(response => response.json())
        .then(data => {
          console.log("data", data)
            const todos = document.getElementById('accordion');
            todos.innerHTML = `
            `;

            if (data.length === 0) {
                todos.innerHTML = `
                    <div class="alert alert-info" role="alert">
                        No todos found for this user.
                    </div>
                `;
            }

            data.forEach((todo, index) => {
                const todoItem = document.createElement('div');
                todoItem.classList.add('accordion-item');

                let todoStatus;
                let todoStatusButtonText

                let priorityClass = '';
                let completedClass = '';

                switch(todo.priority) {
                    case 'High':
                        priorityClass = 'priority-high';
                        break;
                    case 'Medium':
                        priorityClass = 'priority-medium';
                        break;
                    case 'Low':
                        priorityClass = 'priority-low';
                        break;
                }

                if (todo.completed === true) {
                  todoStatus = "✅";
                  todoStatusButtonText = "Undo";
                  completedClass = "todo-completed";
                } else  {
                  todoStatus = "🔲";
                  todoStatusButtonText = "Complete";
                  completedClass = "";
                }
                
                todoItem.innerHTML = `
                    <h2 class="accordion-header">
                      <button class="accordion-button collapsed ${priorityClass} ${completedClass}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                        ${todoStatus} ${todo.description}  
                      </button>
                    </h2>
                    <div id="collapse${index}" class="accordion-collapse collapse">
                      <div class="accordion-body ${completedClass}">
                        <div class="d-flex justify-content-between">
                          <div>
                            <p><span class="todo-label">Category:</span> ${todo.category}</p>
                            <p><span class="todo-label">Deadline:</span> ${formatDate(todo.deadline)}</p>
                            <p><span class="todo-label">Priority:</span> ${todo.priority}</p>
                          </div>
                          <div>
                            <button class="btn btn-primary" onclick="toggleComplete(${userId}, ${todo.id})">${todoStatusButtonText}</button>
                            <button class="btn btn-danger" onclick="deleteTodo(${userId}, ${todo.id})">Delete</button>
                          </div>
                        </div>
                      </div>
                    </div>
                `;
                todos.appendChild(todoItem);
            });
        });
}


function populateTodoDropdown() {
    fetch('http://localhost:8083/api/users')
        .then(response => response.json())
        .then(data => {
            const userDropdown = document.getElementById('user-select');
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = 'Select a user';
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

function toggleComplete(userId, todoId) {
    fetch(`http://localhost:8083/api/todos/${todoId}`, {
      method: "PUT",
    })
      .then(response => response.json())
      .then(data => {
        console.log("marked complete: ", data);
        displayTodos(userId)
      })
      .catch(err => console.error(err))
}

function deleteTodo(userId, todoId) {
  fetch(`http://localhost:8083/api/todos/${todoId}`, {
    method: "DELETE",
  })
  .then(response => {
    if (response.status === 200) {
      displayTodos(userId)
    } else {
      alert('Failed to delete todo');
    }
  })
  .catch(err => console.error(err))
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', options).format(date);
}