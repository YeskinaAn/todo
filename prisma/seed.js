const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const todoData = [
  {
    title: "Buy groceries",
    completed: false,
    comments: undefined
  },
  {
    title: "Walk the dog",
    completed: false,
    comments: undefined
  },
  {
    title: "Pay bills",
    completed: false,
    comments: undefined
  },
  {
    title: "Read a book",
    completed: true,
    comments: undefined
  },
  {
    title: "Take a showe",
    completed: true,
    comments: undefined
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const t of todoData) {
    const todo = await prisma.todo.create({
      data: t,
    });
    console.log(`Created todo item with id: ${todo.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
