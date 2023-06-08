import { Box, Button, TextField, Typography, Chip, Stack } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { config } from "../helpers/constants";
import { useCreateLabel } from "../mutations";
import { useQuery } from "@tanstack/react-query";

const Labels = ({ selectedTodo }) => {
  const [labels, setLabels] = useState([]);
  const [label, setLabel] = useState("");
  const [addLabels, setAddLabels] = useState(false);

  const createLabelMutation = useCreateLabel();

  const addLabel = (id) => {
    createLabelMutation.mutate({ todoId: id, title: label });
    setLabel("");
    setAddLabels(false);
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
    // axios
    //   .delete(`http://localhost:3001/todo/${todoId}/labels/${labelId}`, config)
    //   .then(() => {
    //     setTodos(
    //       todos.map((todo) => {
    //         const updatedLabels = todo.labels.filter(
    //           (label) => label.id !== labelId
    //         );
    //         return { ...todo, labels: updatedLabels };
    //       })
    //     );
    //     setEditingTodo((prevTodo) => {
    //       const updatedLabels = prevTodo.labels.filter(
    //         (label) => label.id !== labelId
    //       );
    //       return { ...prevTodo, labels: updatedLabels };
    //     });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
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
        {selectedTodo?.labels?.map((el, index) => (
          <Chip
            label={el.title}
            key={index}
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
              onClick={() => addLabel(selectedTodo.id)}
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
