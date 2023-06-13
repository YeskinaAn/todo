const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = "mysecretkey";

const prisma = new PrismaClient();
const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  // Check if the email is already taken
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    return res.status(400).json({ error: "Email already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  // Generate a JWT token
  const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY);

  res.json({ user, token });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if the email exists
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  // Check if the password is correct
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  // Generate a JWT token
  const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY);

  res.json({ user, token });
});

function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
}

app.post(`/todo`, authenticateUser, async (req, res) => {
  const { title } = req.body;
  const userId = req.userId;

  const todo = await prisma.todo.create({
    data: {
      title,
      user: { connect: { id: userId } },
    },
  });
  res.json(todo);
});

app.put("/todo/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;
  const { completed, priority, dueDate } = req.body;

  try {
    const todo = await prisma.todo.update({
      where: { id: Number(id) },
      data: {
        completed: completed,
        priority: priority,
        dueDate: dueDate,
      },
    });

    res.json(todo);
  } catch (error) {
    res.json({ error: `Todo with ID ${id} does not exist in the database` });
  }
});

app.delete("/todo/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await prisma.todo.delete({
      where: {
        id: Number(id),
      },
    });
    if (!todo) {
      return res.status(404).send("Todo not found");
    }
    res.json(todo);
  } catch (error) {
    // Handle the error
    console.error(error);
    res.status(500).json({ error: "Failed to delete the todo." });
  }
});


app.get("/todos", authenticateUser, async (req, res) => {
  console.log(req, res);
  const userId = req.userId;
  const todos = await prisma.todo.findMany({
    where: {
      userId,
    },
    include: {
      comments: true,
      labels: true,
    },
  });
  res.json(todos);
});

app.get("/todo/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await prisma.todo.findUnique({
      where: { id: Number(id) },
      include: {
        comments: true,
        labels: true,
      },
    });

    if (todo) {
      res.json(todo);
    } else {
      res.status(404).json({ error: `Todo with ID ${id} does not exist in the database` });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/todo/:id/labels", authenticateUser, async (req, res) => {
  const { id } = req.params;

  try {
    const labels = await prisma.labelTodo.findMany({
      where: {
        todoId: Number(id),
      },
    });

    res.json(labels);
  } catch (error) {
    console.error("Error retrieving labels:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/labels", authenticateUser, async (req, res) => {
  try {
    const labels = await prisma.labelTodo.findMany();
    res.json(labels);
  } catch (error) {
    console.error("Error retrieving labels:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/todo/:id/comments", authenticateUser, async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  // Find the todo that the comment will be added to
  const todo = await prisma.todo.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!todo) {
    return res.status(404).send("Todo not found");
  }

  // Add the comment to the todo's comments array
  const comment = await prisma.comment.create({
    data: {
      text,
      todo: { connect: { id: Number(id) } },
    },
  });

  res.json(comment);
});

app.put("/todo/:id/comments/:commentId", authenticateUser, async (req, res) => {
  const { id, commentId } = req.params;
  const { text } = req.body;

  // Find the todo that the comment belongs to
  const todo = await prisma.todo.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!todo) {
    return res.status(404).send("Todo not found");
  }

  // Find the comment to be updated
  const comment = await prisma.comment.findUnique({
    where: {
      id: Number(commentId),
    },
  });

  if (!comment) {
    return res.status(404).send("Comment not found");
  }

  // Update the text of the comment
  const updatedComment = await prisma.comment.update({
    where: {
      id: Number(commentId),
    },
    data: {
      text,
    },
  });

  res.json(updatedComment);
});

app.delete(
  "/todo/:id/comments/:commentId",
  authenticateUser,
  async (req, res) => {
    const { id, commentId } = req.params;

    // Find the todo that the comment belongs to
    const todo = await prisma.todo.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!todo) {
      return res.status(404).send("Todo not found");
    }

    // Find the comment to be deleted
    const comment = await prisma.comment.findUnique({
      where: {
        id: Number(commentId),
      },
    });

    if (!comment) {
      return res.status(404).send("Comment not found");
    }

    // Delete the comment
    await prisma.comment.delete({
      where: {
        id: Number(commentId),
      },
    });

    res.sendStatus(204);
  }
);

app.post("/todo/:id/labels", authenticateUser, async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  // Find the todo that the comment will be added to
  const todo = await prisma.todo.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!todo) {
    return res.status(404).send("Todo not found");
  }

  // Add the comment to the todo's comments array
  const label = await prisma.labelTodo.create({
    data: {
      title,
      todo: { connect: { id: Number(id) } },
    },
  });

  res.json(label);
});

app.put("/todo/:id/labels/:labelId", authenticateUser, async (req, res) => {
   const { id, labelId } = req.params;
  const { title } = req.body;

  // Find the todo that the comment belongs to
  const todo = await prisma.todo.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!todo) {
    return res.status(404).send("Todo not found");
  }

  // Find the comment to be updated
  const label = await prisma.label.findUnique({
    where: {
      id: Number(labelId),
    },
  });

  if (!label) {
    return res.status(404).send("Label not found");
  }

  // Update the text of the comment
  const updatedLabel = await prisma.label.update({
    where: {
      id: Number(labelId),
    },
    data: {
      title,
    },
  });

  res.json(updatedLabel);
});

app.delete("/todo/:id/labels/:labelId", authenticateUser, async (req, res) => {
  const { id, labelId } = req.params;

  const todo = await prisma.todo.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!todo) {
    return res.status(404).send("Todo not found");
  }

  const label = await prisma.labelTodo.findUnique({
    where: {
      id: Number(labelId),
    },
  });

  if (!label) {
    return res.status(404).send("label not found");
  }

  await prisma.labelTodo.delete({
    where: {
      id: Number(labelId),
    },
  });

  res.sendStatus(204);
});

const server = app.listen(3001, () =>
  console.log(`
🚀 Server ready at: http://localhost:3001
⭐️ See sample requests: http://pris.ly/e/js/rest-express#3-using-the-rest-api`)
);
