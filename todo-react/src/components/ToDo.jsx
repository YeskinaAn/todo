import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useHistory } from "react-router-dom";
import { config } from "../helpers/constants";
import Comments from "./Comments";
import FlagIcon from "@mui/icons-material/Flag";
import CloseIcon from "@mui/icons-material/Close";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import Labels from "./Labels";
import { useCreateTodo, useDeleteTodo, useUpdateTodo } from "../mutations";

const ToDo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [open, setOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState({});
  const [selectedPriority, setSelectedPriority] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const createTodoMutation = useCreateTodo();
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

  const priorities = [1, 2, 3, 4]; // Array of available priority options
  const { data: todosData } = useQuery({
    queryKey: [`/todos`],
  });

  const history = useHistory();

  const handleOpen = (todo) => {
    setEditingTodo(todo);
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
          `http://localhost:3001/todo/${editingTodo.id}`,
          { id: editingTodo.id, dueDate: formattedDate },
          config
        )
        .then((response) => {
          console.warn(response);
          setTodos(
            todos.map((todo) => {
              if (todo.id === editingTodo.id) {
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

  const handlePriorityChange = (id, e) => {
    const priority = e.target.value;

    updateTodoMutation.mutate({ id: id, priority: priority });
    setSelectedPriority(priority);
  };

  const handleNewTodoChange = (event) => {
    setNewTodo(event.target.value);
  };

  const logout = () => {
    localStorage.clear();
    history.push("/");
  };

  useEffect(() => {
    if (editingTodo.priority > 0) {
      setSelectedPriority(editingTodo.priority);
    } else {
      setSelectedPriority(0);
    }
  }, [editingTodo, editingTodo.priority]);

  const color = (priority) => {
    switch (priority) {
      case 1:
        return "common.red";
      case 2:
        return "#eb8909";
      case 3:
        return "primary.main";
      default:
        return "text.secondary";
    }
  };

  if (!todosData) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
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
                    {editingTodo.title}
                  </Typography>
                </Box>
                <Comments
                  editingTodo={editingTodo}
                  setEditingTodo={setEditingTodo}
                  setTodos={setTodos}
                  todos={todos}
                />
              </Box>
              <Box sx={{ backgroundColor: "#fafafa" }} px={2} width="30%">
                <FormControl sx={{ mt: 6, mb: 2 }} fullWidth>
                  <InputLabel id="priority-label">Priority</InputLabel>
                  <Select
                    labelId="priority-label"
                    id="priority-select"
                    value={selectedPriority}
                    label="Priority"
                    onChange={(e) => handlePriorityChange(editingTodo.id, e)}
                  >
                    {priorities.map((priority) => (
                      <MenuItem key={priority} value={priority}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <FlagIcon sx={{ color: color(priority) }} /> P
                          {priority}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                  setTodos={setTodos}
                  editingTodo={editingTodo}
                  setEditingTodo={setEditingTodo}
                  todos={todos}
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
