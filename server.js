const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();


///////////////////////////////////////////////////////////////////////
//   MIDDLEWARE (CONFIGURATIONS) //////////////////////////////////////
///////////////////////////////////////////////////////////////////////


// Permit cross-origin requests
app.use(cors());

// Support application/x-www-form-urlencoded data
app.use(express.urlencoded({ extended: false }));

// Support application/json data
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the "src" directory
app.use('/src', express.static(path.join(__dirname, 'src')));

///////////////////////////////////////////////////////////////////////
//   API ENDPOINTS ////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////


// Get all categories 
app.get("/api/categories", function (request, response) {
    console.info("LOG: Got a GET request for all categories");

    const json = fs.readFileSync(__dirname + "/data/categories.json", "utf8");
    const categories = JSON.parse(json);

    // LOG data for tracing
    console.info("LOG: Returned categories are ->", categories);

    response
        .status(200)
        .json(categories);
});


// Get all TODOs
app.get("/api/todos", function (request, response) {
    console.info("LOG: Got a GET request for all todos");

    // Read todos.json  
    const json = fs.readFileSync(__dirname + "/data/todos.json", "utf8");
    const todos = JSON.parse(json);

    // LOG data for tracing
    console.info("LOG: Returned todos are ->", todos);

    response
        .status(200)
        .json(todos);
});


// Get one TODO by id
app.get("/api/todos/:id", function (request, response) {
    const requestedId = request.params.id;
    console.info("LOG: Got a GET request for todo", requestedId);

    const json = fs.readFileSync(__dirname + "/data/todos.json", "utf8");
    const todos = JSON.parse(json);

    // Find the requested todo
    const matchingTodo = todos.find((todo) => String(todo.id) === String(requestedId));

    // If todo not found
    if (!matchingTodo) {
        console.warn(`LOG: **NOT FOUND**: todo ${requestedId} does not exist!`);

        response
            .status(404)
            .end();

        return;
    }

    // LOG data for tracing
    console.info("LOG: Returned todo is ->", matchingTodo);

    response
        .status(200)
        .json(matchingTodo);
});


// Get all TODOs for a given user id
app.get("/api/todos/byuser/:id", function (request, response) {
    const requestedId = request.params.id;
    console.info("LOG: Got a GET request for todos for userid", requestedId);

    const json = fs.readFileSync(__dirname + "/data/todos.json", "utf8");
    const todos = JSON.parse(json);

    // Find the requested todos
    const matchingTodos = todos.filter((todo) => String(todo.userid) === String(requestedId));

    // LOG data for tracing
    console.info("LOG: Returned todos are ->", matchingTodos);

    response
        .status(200)
        .json(matchingTodos);
});


// Get all users (without passwords)
app.get("/api/users", function (request, response) {
    console.info("LOG: Got a GET request for all users");

    const json = fs.readFileSync(__dirname + "/data/users.json", "utf8");
    const users = JSON.parse(json);

    // Copy users to an new array -- omitting the passwords
    const usersWithoutPasswords = [];
    for (const user of users) {
        usersWithoutPasswords.push({
            id: user.id,
            name: user.name,
            username: user.username,
        });
    }

    // LOG data for tracing
    console.info("LOG: Returned users (without passwords) are ->", usersWithoutPasswords);

    response
        .status(200)
        .json(usersWithoutPasswords);
});


// Find out if a specific username is available
app.get("/api/username_available/:username", function (request, response) {
    const requestedUsername = request.params.username;
    console.info(`LOG: Checking to see if username ${requestedUsername} is available`);

    const json = fs.readFileSync(__dirname + "/data/users.json", "utf8");
    const users = JSON.parse(json);

    // See if username already exists
    const matchingByUsername = (user) => user.username.toLowerCase() === requestedUsername.toLowerCase()
    const availability = { available: !users.some(matchingByUsername) };

    // LOG response for tracing
    console.info("LOG: Returned message ->", availability);

    response
        .status(200)
        .json(availability);
});


// GET a specific user  
// NOTE: this endpoint returns the user without the password
app.get("/api/users/:username", function (request, response) {
    const username = request.params.username;
    console.info("LOG: Got a GET request for user with username " + username);

    const json = fs.readFileSync(__dirname + "/data/users.json", "utf8");
    const user = JSON.parse(json);

    // Find the user
    const byUsername = (user) => user.username.toLowerCase() === username.toLowerCase()
    const matchingUser = user.find(byUsername);

    // If no matching user
    if (!matchingUser) {
        console.warn(`LOG: **NOT FOUND**: user ${username} does not exist!`);
        
        response
            .status(404)
            .end();
    
        return;
    }

    // Create a copy without the password
    const userWithoutPassword = { 
        id: matchingUser.id, 
        name: matchingUser.name, 
        username: matchingUser.username,
    };

    // LOG data for tracing
    console.info("LOG: Returned user is ->", userWithoutPassword);

    response
        .status(200)
        .json(userWithoutPassword);
});

// GET a specific user by id
// NOTE: this endpoint returns the user without the password
app.get("/api/usersbyid/:id", function (request, response) {
    const id = request.params.id;
    console.info("LOG: Got a GET request for user with id " + id);

    const json = fs.readFileSync(__dirname + "/data/users.json", "utf8");
    const user = JSON.parse(json);

    // Find the user
    const byId = (user) => {
        return String(user.id) === String(id);
    }
    const matchingUser = user.find(byId);

    // If no matching user
    if (!matchingUser) {
        console.warn(`LOG: **NOT FOUND**: user ${id} does not exist!`);
        
        response
            .status(404)
            .end();
    
        return;
    }

    // Create a copy without the password
    const userWithoutPassword = { 
        id: matchingUser.id, 
        name: matchingUser.name, 
        username: matchingUser.username,
    };

    // LOG data for tracing
    console.info("LOG: Returned user is ->", userWithoutPassword);

    response
        .status(200)
        .json(userWithoutPassword);
});



// POST a new todo
app.post("/api/todos", function (request, response) {
    console.info("LOG: Got a POST request to add a todo");
    console.info("LOG: Message body ->", JSON.stringify(request.body));

    // If not all TODO data passed, reject the request
    const { userid, category, description, deadline, priority } = request.body
    if (!userid || !category || !description || !deadline || !priority) {
        console.warn("LOG: **MISSING DATA**: one or more todo properties missing");
        
        response
            .status(400)
            .json({ error: "Missing data, can't process: one or more Todo properties missing." });

        return;
    }

    const todoJson = fs.readFileSync(__dirname + "/data/todos.json", "utf8");
    const todos = JSON.parse(todoJson);

    // Get the id of this new todo
    const nextIdJson = fs.readFileSync(__dirname + "/data/next-ids.json", "utf8");
    const nextIdData = JSON.parse(nextIdJson);
    
    // Create the todo w/ new id and completed marked as false
    const todo = {
        id: nextIdData.nextTodoId,
        userid: userid,
        category: category,
        description: description,
        deadline: deadline,
        priority: priority,
        completed: false,
    };
    
    nextIdData.nextTodoId += 1;
    fs.writeFileSync(__dirname + "/data/next-ids.json", JSON.stringify(nextIdData));

    todos.push(todo);
    fs.writeFileSync(__dirname + "/data/todos.json", JSON.stringify(todos));

    // LOG data for tracing
    console.info("LOG: New todo added is ->", todo);

    response
        .status(201)
        .json(todo);
});


// PUT a todo in order to toggle the "completed" field (false->true initially)
app.put("/api/todos/:id", function (request, response) {
    const requestedId = request.params.id;
    console.info(`LOG: Got a PUT request to toggle todo ${requestedId} as complete`);

    const json = fs.readFileSync(__dirname + "/data/todos.json", "utf8");
    const todos = JSON.parse(json);

    // Find the requested todo
    const matchingTodo = todos.find((todo) => String(todo.id) === String(requestedId));

    // If todo not found, we have nothing left to do: respond
    if (!matchingTodo) {
        console.warn("LOG: **ERROR: todo does not exist!");
        response
            .status(404)
            .end();

        return;
    }

    // Mark the todo complete if is incomplete, and vice versa
    // This will correctly mutate the "todos" array, before rewriting file 
    matchingTodo.completed = !matchingTodo.completed;
    fs.writeFileSync(__dirname + "/data/todos.json", JSON.stringify(todos));

    // LOG data for tracing
    console.info("LOG: This todo is complete ->", matchingTodo);

    response
        .status(200)
        .json({
            id: matchingTodo.id,
            completed: matchingTodo.completed
        });
});



// DELETE a todo
app.delete('/api/todos/:id', function (request, response) {
    // --------------
    const requestedId = request.params.id;


    const json = fs.readFileSync(__dirname + "/data/todos.json", "utf8");
    const todos = JSON.parse(json);

    // Find the requested todo
    const matchingTodo = todos.find((todo) => String(todo.id) === String(requestedId));
    
    // If todo not found, we have nothing left to do: respond
    if (!matchingTodo) {
        console.warn("LOG: **ERROR: todo does not exist!");
        response
            .status(404)
            .end();

        return;
    }

    const index = todos.indexOf(matchingTodo);

    if (index > -1) {
        todos.splice(index, 1);
    }

    fs.writeFileSync(__dirname + "/data/todos.json", JSON.stringify(todos));


    // LOG data for tracing
    console.info("LOG: This todo is deleted ->", matchingTodo);

// -----------------

    response
        .status(200)
        .end();
})


// POST a new user
app.post("/api/users", function (request, response) {
    console.info("LOG: Got a POST request to add a user");
    console.info("LOG: Message body -------->", JSON.stringify(request.body));

    // If not all user data passed, reject the request
    if (!request.body.name || !request.body.username || !request.body.password) {
        console.warn("LOG: **MISSING DATA**: one or more user properties missing");
        response
            .status(400)
            .json({ error: "Missing data, can't process: one or more User properties missing." });

        return;
    }

    const json = fs.readFileSync(__dirname + "/data/users.json", "utf8");
    const users = JSON.parse(json);

    // Check for duplicate username
    const byUsername = (user) => user.username.toLowerCase() === request.body.username.toLowerCase()
    const matchingUser = users.find(byUsername);

    // If username already exists, return 403
    if (matchingUser !== undefined) {
        console.warn("LOG: **ERROR: username already exists!");
        response
            .status(403)
            .json({ error: "Forbidden: Username already exists!" });

        return;
    }

    console.log("this tha: ", users[users.length - 1].id + 1)

    const user = {
        id: users[users.length - 1].id + 1,
        name: request.body.name,
        username: request.body.username,
        password: request.body.password,
    };

    users.push(user);
    fs.writeFileSync(__dirname + "/data/users.json", JSON.stringify(users));

    // LOG data for tracing
    console.info("LOG: New user added is ->", user);

    response
        .status(201)
        .json(user);
});

app.delete('/api/users/:id', function (request, response) {
    const requestedId = request.params.id;

    const usersJson = fs.readFileSync(__dirname + "/data/users.json", "utf8");
    const users = JSON.parse(usersJson);

    // Find the requested user
    const matchingUser = users.find((user) => String(user.id) === String(requestedId));
    
    // If user not found, we have nothing left to do: respond
    if (!matchingUser) {
        console.warn("LOG: **ERROR: user does not exist!");
        response
            .status(404)
            .end();

        return;
    }

    const userIndex = users.indexOf(matchingUser);

    if (userIndex > -1) {
        users.splice(userIndex, 1);
    }

    fs.writeFileSync(__dirname + "/data/users.json", JSON.stringify(users));

    // Delete all todos associated with the user
    const todosJson = fs.readFileSync(__dirname + "/data/todos.json", "utf8");
    const todos = JSON.parse(todosJson);

    const updatedTodos = todos.filter((todo) => String(todo.userid) !== String(requestedId));

    fs.writeFileSync(__dirname + "/data/todos.json", JSON.stringify(updatedTodos));

    // LOG data for tracing
    console.info("LOG: This user and their todos are deleted ->", matchingUser);

    response
        .status(200)
        .end();
})


///////////////////////////////////////////////////////////////////////
// Start the server ///////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////


const server = app.listen(8083, () => {
    const port = server.address().port;
    console.info("App listening at http://localhost:" + port);
});
