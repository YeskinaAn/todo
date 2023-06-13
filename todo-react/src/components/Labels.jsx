import { Box, Button, Typography, Chip, Stack, TextField, InputAdornment } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCreateLabel, useDeleteLabel, useUpdateLabel } from "../mutations";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Labels = ({ selectedTodo, setSelectedTodo }) => {
  const [label, setLabel] = useState("");
  const [addLabels, setAddLabels] = useState(false);

  const createLabelMutation = useCreateLabel();
  const updateLabelMutation = useUpdateLabel();

  const deleteLabelMutation = useDeleteLabel();

  const addLabel = (id) => {
    createLabelMutation.mutate({ todoId: id, title: label });
    setLabel("");
    setAddLabels(false);
  };
  const handleLabelChange = (event) => {
    setLabel(event.target.value);
  };

  const handleLabelDelete = (todoId, labelId) => {
    deleteLabelMutation.mutate({ todoId, id: labelId });
    setSelectedTodo((prevTodo) => {
      const updatedLabels = prevTodo.labels.filter(
        (label) => label.id !== labelId
      );
      return { ...prevTodo, labels: updatedLabels };
    });
  };

  const { data: labels } = useQuery({
    queryKey: ["/labels"],
  });

  const { data: labelsForTodo } = useQuery({
    queryKey: [`/todo/${selectedTodo?.id}/labels`],
    enabled: !!selectedTodo?.id,
  });

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
            inputProps={{
              style: { paddingRight: 0 },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment sx={{ pr: 0 }} position="end">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => addLabel(selectedTodo.id)}
                  >
                    Add
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default Labels;
