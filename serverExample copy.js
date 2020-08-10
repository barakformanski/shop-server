const express = require('express')
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send('Hello main page !')
});

app.get('/todos', (req, res) => {
    console.log('query:', req.query);
    const search = req.query.search;
    fs.readFile("todos.json", (err, data) => {
        const todos = JSON.parse(data);
        res.send(todos);
        if (search) {
            const filtererdTodos = todos.filter((todo) => todo.title.includes(search));
            res.send(todos);
        }
        else {
            res.send(todos)
        }

    });
});

app.post('/todos', (req, res) => {
    console.log("req:", req.body);
    console.log("you arrived to todos page");
    fs.readFile("todos.json", (err, data) => {
        const todos = JSON.parse(data);
        const title = req.body.title;
        todos.push([{
            id: todos.length + 1,
            title: "thirs todo",
        },
        {
            id: 4,
            title: "forth todo"
        }]);

        fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
            console.log(err);
            res.send('you secceed');
        });
    });
});
app.put("/todos/:id", (req, res) => {
    fs.readFile("todos.json", (err, data) => {
        const todos = JSON.parse(data);
        const todoId = +req.params.id;
        const todoIndex = todos.findIndex((todo) => todo.id === todoId);
        // todos[todoIndex].title = req.body.title;
        todos[todoIndex].id = req.body.id;
        fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
            res.send("succeed to update item")
        })

    });
});

app.delete("/todos/:id", (req, res) => {
    fs.readFile("todos.json", (err, data) => {
        const todos = JSON.parse(data);
        const todoId = +req.params.id;
        const todoIndex = todos.findIndex((todo) => todo.id === todoId);
        todos.splice(todoIndex, 1);
        fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
            res.send("succeed to remove item")
        })
    });

    res.send(req.params);
});

app.listen(8000, () => {
    console.log('Example app listening on port 8000!')
});
