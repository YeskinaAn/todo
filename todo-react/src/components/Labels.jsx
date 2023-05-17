import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { config } from "../helpers/constants";

const Labels = ({setEditingTodo, setTodos, todos, editingTodo}) => {
  const [labels, setLabels] = useState([]);
  const [label, setLabel] = useState("");

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

  return (
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
  );
};

export default Labels;
