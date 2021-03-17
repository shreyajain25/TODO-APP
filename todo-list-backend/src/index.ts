const express = require('express');
const { PrismaClient } = require('@prisma/client');
var bodyParser = require('body-parser')
const prisma = new PrismaClient()
const jwt = require("jsonwebtoken");
const port = 9000;

const app = express();
var cors = require('cors')

app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.post('/login', async(req, res) => {
  const { email, password } = req.body;
  const userDetails = await prisma.user.findUnique({
    where: { email: email },
  })
  if(!userDetails)
    return res.send({err: true, msg: "Username/Password doesn't match"})
  if(userDetails.password === password){
    const token = jwt.sign({email}, "JWTTOKEN");
    userDetails.token = token;
    return res.send(userDetails);
  }
  else
    return res.send({err: true, msg: "Username/Password doesn't match"})
  
})

app.post('/register', async(req, res) => {
  const { name, email, password } = (req.body);
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password
    },
  })
  res.json({msg: "User created"});
})

app.get('/getTodos', (req, res)=> {
  jwt.verify(req.headers.authorization, 'JWTTOKEN', async(err, decoded) => {
    if (err) return res.json({err: "error"})
    const todos = await prisma.user.findMany({
      where: {email: decoded.email},
      select: {todos: true}
    })
    res.json(todos)
    });
})

app.post('/createTodo', async(req, res) => {
  const { id, taskName, taskDate, taskTime, done } = req.body.tasks;

  jwt.verify(req.headers.authorization, 'JWTTOKEN', async(err, decoded) => {
    if (err) return res.json({err: "error"})
    const newTodo = await prisma.todo.create({
      data: {
        taskName: taskName,
        taskDate: taskDate,
        taskTime: taskTime,
        done: done,
        author: { connect: { id: Number(id) } }
      },
    })
    res.json(newTodo)
  });
  
})

app.put('/updateTodo', async(req, res) => {
  const { id, userId, taskName, taskDate, taskTime, done } = req.body.tasks;
  jwt.verify(req.headers.authorization, 'JWTTOKEN', async(err, decoded) => {
    if (err) return res.json({err: "error"})
    const todo = await prisma.todo.update({
      where: {
        id: Number(id)
      },
      data: {
        taskName: taskName,
        taskDate: taskDate,
        taskTime: taskTime,
        done: done,
      },
    })
    res.json(todo)
  })

})

app.delete('/todo/:id', async(req, res) => {
  const id = req.params.id;
  await prisma.todo.delete({
    where: {
      id: Number(id),
    },
  })
  .then(() => res.send({msg: "Deleted"}))
  .catch(() => res.send({err: "Id not found"}))
})

app.get("/getAllTags", async(req, res) => {
  // All tags will be fetched
  const id = req.params.id;

  jwt.verify(req.headers.authorization, 'JWTTOKEN', async(err, decoded) => {
    if (err) return res.json({err: "error"})
    const tags = await prisma.tags.findMany()
    res.json(tags)
    });
})

// app.get("/getTags/:id", async(req, res) => {
//   // Specific Tags to be Fetched
//   const id = req.params.id;
//   jwt.verify(req.headers.authorization, 'JWTTOKEN', async(err, decoded) => {
//     if (err) return res.json({err: "error"})
//     const tags = await prisma.todo.findMany({
//       where: {id: Number(id)},
//       select: {TaskTags: true}
//     })
//     res.json(tags)
//     });
// })

app.post('/createTag', async(req, res) => {
  const { id, title, userId } = req.body;
  console.log(req.body)
  jwt.verify(req.headers.authorization, 'JWTTOKEN', async(err, decoded) => {
    if (err) return res.json({err: "error"})
    const newTag = await prisma.tags.create({
      data: {
        title: title,
        task: {connect: {id: Number(id)}},
        // author: {connect: {id: Number(userId)}},
      },
    })
    .catch(e => console.log(e))
    res.json(newTag)
  });
})

app.put('/updateTag', async(req, res) => {
  const { id,title, visible} = req.body;
  jwt.verify(req.headers.authorization, 'JWTTOKEN', async(err, decoded) => {
    if (err) return res.json({err: "error"})
    const tag = await prisma.tags.update({
      where: {
        title: title
      },
      data: {
        visible: visible,
        task: {connect: {id: Number(id)}}
      },
    })
    console.log(tag)
    res.json(tag)
  })
})

app.put('/deleteTag', async(req, res) => {
  const { id, visible} = req.body;
  jwt.verify(req.headers.authorization, 'JWTTOKEN', async(err, decoded) => {
  if (err) return res.json({err: "error"})
  
  const tag = await prisma.tags.update({
    where: {
      id: Number(id)
    },
    data: {
      visible: visible
    },
  })
  console.log(tag)
  res.json(tag)
    
  })
})
app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})
