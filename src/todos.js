let todoNumberMap = new Map();
todoNumberMap.set(1, 'One');
todoNumberMap.set(2, 'Two');
todoNumberMap.set(3, 'Three');
todoNumberMap.set(4, 'Four');
todoNumberMap.set(5, 'Five');
todoNumberMap.set(6, 'Six');
todoNumberMap.set(7, 'Seven');
todoNumberMap.set(8, 'Eight');
todoNumberMap.set(9, 'Nine');
todoNumberMap.set(10, 'Ten');

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
            data.forEach((todo, index) => {
                const todoItem = document.createElement('div');
                todoItem.classList.add('accordion-item');

                // Get the string representation of the current index from todoNumberMap
                const numberString = todoNumberMap.get(index + 1);
                console.log("numberString", numberString)
                let todoStatus;
                if (todo.completed === true) {
                  todoStatus = "✅"
                } else  {
                  todoStatus = "🔲"
                }
                if (numberString) {
                    todoItem.innerHTML = `
                        <h2 class="accordion-header">
                          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${numberString}" aria-expanded="false" aria-controls="collapse${numberString}">
                            ${todoStatus} ${todo.description}  
                          </button>
                        </h2>
                        <div id="collapse${numberString}" class="accordion-collapse collapse">
                          <div class="accordion-body">
                            <div class="d-flex justify-content-between">
                              <div>
                                <p>Category: ${todo.category}</p>
                                <p>Deadline: ${todo.deadline}</p>
                                <p>Priority: ${todo.priority}</p>
                              </div>
                              <div>
                                <button class="btn btn-primary" onclick="toggleComplete(${userId}, ${todo.id})">Toggle Complete</button>
                                <button class="btn btn-danger" onclick="deleteTodo(${userId}, ${todo.id})">Delete</button>
                              </div>
                            </div>
                          </div>
                        </div>
                    `;
                }
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