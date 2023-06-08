import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useHistory } from "react-router-dom";
import { color, config } from "../helpers/constants";
import Comments from "./Comments";
import FlagIcon from "@mui/icons-material/Flag";
import CloseIcon from "@mui/icons-material/Close";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import Labels from "./Labels";
import { useCreateTodo, useDeleteTodo, useUpdateTodo } from "../mutations";
import Priorities from "./Priorities";
import { useEffect } from "react";
import Loader from "./Loader";

const ToDo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [todoId, setTodoId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const createTodoMutation = useCreateTodo();
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

  const { data: todosData } = useQuery({
    queryKey: [`/todos`],
  });

  const history = useHistory();

  const handleOpen = (todo) => {
    setTodoId(todo.id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDateChange = (date) => {
    const formattedDate = date;
    setSelectedDate(formattedDate);
    if (date) {
      // Format the selected date as required before sending it to the backend
      axios
        .put(
          `http://localhost:3001/todo/${todoId.id}`,
          { id: todoId.id, dueDate: formattedDate },
          config
        )
        .then((response) => {
          console.warn(response);
          setTodos(
            todos.map((todo) => {
              if (todo.id === todoId.id) {
                return { ...todo, dueDate: formattedDate };
              }
              return todo;
            })
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const deleteTodo = (id) => {
    deleteTodoMutation.mutate(id);
  };

  const addTodo = () => {
    createTodoMutation.mutate({ title: newTodo, completed: false });
    setNewTodo("");
  };

  const updateTodo = (id, completed) => {
    updateTodoMutation.mutate({ id: id, completed: completed });
  };

  const handleNewTodoChange = (event) => {
    setNewTodo(event.target.value);
  };

  const logout = () => {
    localStorage.clear();
    history.push("/");
  };

  const { data: todo } = useQuery({
    queryKey: [`/todo/${todoId}`],
    enabled: !!todoId,
  });

  useEffect(() => {
    setSelectedTodo(todo);
  }, [todo]);

  if (!todosData) {
    return (
     <Loader />
    );
  }

  return (
    <>
      <Button onClick={logout}>Log out</Button>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          m: 5,
        }}
      >
        <Typography
          variant="h4"
          style={{ textAlign: "center", marginBottom: 15 }}
        >
          ToDo List
        </Typography>
        <Box display="flex" alignItems="end" mb={2}>
          <TextField
            label="New Todo"
            variant="outlined"
            value={newTodo}
            onChange={handleNewTodoChange}
            fullWidth
          />
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={addTodo}
            sx={{ height: "40px" }}
          >
            Add
          </Button>
        </Box>
        {todosData?.map((el) => (
          <Box
            display="flex"
            justifyContent="space-between"
            p={1}
            key={el.id}
            width="500px"
            alignItems="center"
          >
            <Box display="flex">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={el.completed}
                    onChange={(event) =>
                      updateTodo(el.id, event.target.checked)
                    }
                    color="primary"
                  />
                }
                label={el.title}
                style={{
                  textDecoration: el.completed ? "line-through" : "none",
                }}
              />
              {el.priority && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FlagIcon sx={{ color: color(el.priority) }} />P{el.priority}
                </Box>
              )}
            </Box>

            <Box>
              <Button sx={{ minWidth: 0 }} onClick={() => handleOpen(el)}>
                <ModeEditIcon />
              </Button>
              <Button
                sx={{ minWidth: 0 }}
                color="secondary"
                onClick={() => deleteTodo(el.id)}
              >
                <DeleteIcon />
              </Button>
            </Box>
          </Box>
        ))}
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              p: 2,
              m: 2,
              width: "70%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
                pb: 1,
                borderBottom: "1px solid #C7C8CA",
              }}
            >
              <Button onClick={handleClose}>
                <CloseIcon />
              </Button>
            </Box>
            <Box width="100%" display="flex">
              <Box pr={2} width="70%">
                <Box>
                  <Typography variant="h3" sx={{ m: 3 }}>
                    {selectedTodo?.title}
                  </Typography>
                </Box>
                <Comments selectedTodo={selectedTodo} setSelectedTodo={setSelectedTodo} />
              </Box>
              <Box sx={{ backgroundColor: "#fafafa" }} px={2} width="30%">
                <Priorities selectedTodo={selectedTodo} />
                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Due Date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    inputFormat="YYYY-MM-DD"
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider> */}
                <Labels
                  selectedTodo={selectedTodo}
                />
              </Box>
            </Box>
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default ToDo;
