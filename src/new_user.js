document.getElementById('addUser').addEventListener('click', async function(event){
    event.preventDefault();
    let name = document.getElementById('name').value;
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirm-password').value;

    if(password !== confirmPassword){
        alert('Passwords do not match');
        return;
    }

    let isAvailable = await isUsernameAvailable(username);

    if (isAvailable) {
        await createUser(name, username, password);
        redirectToTodoList();
    } else {
        alert('Username is not available');
    }
  });

  async function isUsernameAvailable(username){
    try {
        const response = await fetch(`http://localhost:8083/api/username_available/${username}`);
        const data = await response.json();
        console.log("hello", data.available);
        return data.available;
    } catch (error) {
        console.error('Error:', error);
    }
  }

  async function createUser(name, username, password) {
    console.log("Creating user");
    
    try {
      const response = await fetch('http://localhost:8083/api/users', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  name: name,
                  username: username,
                  password: password
              })
          });
          const data = await response.json();
          console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function redirectToTodoList(){
    window.location.href = './todos.html';
  }