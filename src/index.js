const express = require('express');
const cors = require('cors');

const { v4: uuidV4 } = require('uuid');
const { json } = require('express');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers

  if (!username) {
    return response.status(400).json({ error: "Missing username" })
  }

  const user = users.find(user => user.username === username)

  if (!user) {
    return response.status(400).json({ error: 'User not found' })
  }

  request.user = user

  return next()
}

// create user
app.post('/users', (request, response) => {
  const { name, username } = request.body

  if (!name || !username) {
    return response.status(400).json({
      error: "Missing name or username"
    })
  }

  const userAlreadyExists = users.find(user => user.username === username)

  if (userAlreadyExists) {
    return response.status(400).json({ error: "Username already exists!" })
  }

  const user = {
    id: uuidV4(),
    name,
    username,
    todos: []
  }

  users.push(user)

  return response.status('201').json(user)
});

// get tarefas do user
app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request

  return response.json(user.todos)
});

// create tarefa
app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request
  const { title, deadline } = request.body

  if (!title || !deadline) {
    return response.status(400).json({ error: "Missing information!" })
  }

  // const deadlineFormat = new Date(deadline + ' 00:00')

  const todo = {
    id: uuidV4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }
  user.todos.push(todo)

  return response.status(201).json(todo)

});

// update todo by id
app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params
  const { user } = request
  const { title, deadline } = request.body

  if (!id) {
    return response.status(400).json({
      error: "Missing id!"
    })
  }

  if (!title || !deadline) {
    return response.status(400).json({ error: "Missing information!" })
  }

  let todo = user.todos.find(todo => todo.id === id)

  if (!todo) {
    return response.status(400).json({
      error: "Todo not found!"
    })
  }

  const updateTodo = {
    id: todo.id,
    title,
    done: todo.done,
    deadline: new Date(deadline),
    created_at: todo.created_at
  }

  user.todos.splice(todo, 1)
  user.todos.push(updateTodo)


  return response.status(201).json(updateTodo)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;