const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const path = require('path');
//middleware
const _dirname = path.dirname("")
const buildPath = path.join(_dirname, "../client/build")

app.use(express.static(buildPath))
app.use(cors());
app.use(express.json())


//routes
//create to do
app.post("/todos", async (req, res) => {
    try{
        const {description} = req.body;
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *", [description]);
        //value $1 such as a placeholder
        res.json(newTodo.rows[0]);
    }
    catch(err) {
        console.error(err.message);
    }
});

//get all to do
app.get("/todos", async(req, res) => {
    try{
        const allTodos = await pool.query("SELECT * FROM todo")
        //response to resapi
        res.json(allTodos.rows);
    }
    catch (err) {
        console.error(err.message);
    }
})
//get a todo
app.get("/todos/:id", async(req,res) => {
    try{
        const { id } = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1",[id])
        res.json(todo.rows[0]);
    }
    catch(err) {
        console.error(err.message)
    }
})

app.put("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2",[description, id]);
        res.json("Todo got updated")
    }
    catch(err) {
        console.error(err.message)
    }
})

//delete a todo

app.delete("/todos/:id", async (req, res) => {
    try{
        const {id} = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id])
        res.json("Todo was deleted");
    }
    catch(err)
    {
        console.error(err.message)
    }
})
app.get("/*", function(req,res){
    res.sendFile(
        path.join(__dirname, "../client/build/index.html"),
        function (err) {
                if (err) {
                    res.status(500).send(err);
                }
        }
    );
})
app.listen(5000, () => {
    console.log("Hello it works")
});// port 5000