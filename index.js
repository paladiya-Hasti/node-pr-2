const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

const PORT = 8090;
let initialTodo = [
  { title: "HTML", isCompleted: true, id: 1 },
  { title: "JavaScript", isCompleted: true, id: 2 },
  { title: "React", isCompleted: false, id: 3 },
];

app.get("/", (req, res) => {
  res.send("Welcome to the todo API");
});

app.get("/todos", (req, res) => {
  res.json(initialTodo);
});

app.post("/addtodo", (req, res) => {
  const { title, isCompleted } = req.body;

  if (!title || typeof isCompleted !== 'boolean') {
    return res.status(400).send({ error: "Invalid input. Provide 'title' and 'isCompleted' as required fields." });
  }

  const newTodo={
    title,
    isCompleted,
    id:initialTodo.length ? initialTodo[initialTodo.length-1].id+1:1,
  };
  initialTodo.push(newTodo);
  res.status(201).json(newTodo);
});

app.patch('/update/:id', (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const todoIndex = initialTodo.findIndex((todo) => todo.id === parseInt(id));

  if (todoIndex === -1) {
    return res.status(404).send({ error: "Todo not found." });
  }

  initialTodo[todoIndex] = { ...initialTodo[todoIndex], ...updatedData };
  res.json(initialTodo[todoIndex]);
});

app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;

  const todoIndex = initialTodo.findIndex((todo) => todo.id === parseInt(id));

  if (todoIndex === -1) {
    return res.status(404).send({ error: "Todo not found." });
  }

  const deletedTodo = initialTodo.splice(todoIndex, 1)[0];
  res.json({ deletedTodo, todos: initialTodo });
});

app.get('/todo/:id', (req, res) => {
  const { id } = req.params;

  const todo = initialTodo.find((todo) => todo.id === parseInt(id));

  if (!todo) {
    return res.status(404).send({ error: "Todo not found." });
  }

  res.json(todo);
});

app.get('/findbystatus', (req, res) => {
  const { isCompleted } = req.query;

  if (isCompleted !== 'true' && isCompleted !== 'false') {
    return res.status(400).send({ error: "Invalid query parameter. Use 'isCompleted=true' or 'isCompleted=false'." });
  }

  const filteredTodos = initialTodo.filter(
    (todo) => todo.isCompleted === (isCompleted === 'true')
  );

  res.json(filteredTodos);
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
