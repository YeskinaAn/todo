import { Box, Button, TextField, Typography, Chip, Stack } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { config } from "../helpers/constants";

const Labels = ({ setEditingTodo, setTodos, todos, editingTodo }) => {
  const [labels, setLabels] = useState([]);
  const [label, setLabel] = useState("");
  const [addLabels, setAddLabels] = useState(false);

  const addLabel = (id) => {
    axios
      .post(
        `http://localhost:3001/todo/${id}/labels`,
        { todoId: id, title: label },
        config
      )
      .then((response) => {
        console.warn(response.data);
        setTodos(
          todos.map((todo) => {
            if (todo.id === id) {
              return { ...todo, labels: [...todo.labels, response.data] };
            }
            return todo;
          })
        );
        setEditingTodo((prev) => {
          return { ...prev, labels: [...prev.labels, response.data] };
        });
        setLabel("");
        setAddLabels(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleLabelChange = (event) => {
    setLabel(event.target.value);
  };
  useEffect(() => {
    axios
      .get("http://localhost:3001/labels", config)
      .then((response) => {
        setLabels(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  
  const handleLabelDelete = (todoId, labelId) => {
    axios
      .delete(
        `http://localhost:3001/todo/${todoId}/labels/${labelId}`,
        config
      )
      .then(() => {
        setTodos(
          todos.map((todo) => {
            const updatedLabels = todo.labels.filter(
              (label) => label.id !== labelId
            );
            return { ...todo, labels: updatedLabels };
          })
        );
        setEditingTodo((prevTodo) => {
          const updatedLabels = prevTodo.labels.filter(
            (label) => label.id !== labelId
          );
          return { ...prevTodo, labels: updatedLabels };
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Box>
      <Box mt={2} display="flex" justifyContent="space-between">
        <Typography>Labels</Typography>
        <Button onClick={() => setAddLabels(true)}>
          <AddIcon />
        </Button>
      </Box>
      <Stack direction="row" spacing={1}>
        {editingTodo?.labels?.map((el) => (
          <Chip
            label={el.title}
            onDelete={() => handleLabelDelete(el.todoId, el.id)}
          />
        ))}
      </Stack>

      {addLabels && (
        <Box mt={3}>
          <TextField
            label="Write label"
            variant="outlined"
            value={label}
            onChange={handleLabelChange}
          />
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => addLabel(editingTodo.id)}
            >
              Add Label
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Labels;
