import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import { color, priorities } from "../helpers/constants";
import { useUpdateTodo } from "../mutations";
import { useQuery } from "@tanstack/react-query";
import Loader from "./Loader";

const Priorities = ({ selectedTodo }) => {
  const updateTodoMutation = useUpdateTodo();

  const handlePriorityChange = (id, e) => {
    const priority = e.target.value;
    updateTodoMutation.mutate({ id: id, priority: priority });
  };

  const { data: todo } = useQuery({
    queryKey: [`/todo/${selectedTodo?.id}`],
    enabled: !!selectedTodo?.id,
  });

  if (!selectedTodo) {
    return <Loader />;
  }
  
  return (
    <FormControl sx={{ mt: 6, mb: 2 }} fullWidth>
      <InputLabel id="priority-label">Priority</InputLabel>
      <Select
        labelId="priority-label"
        id="priority-select"
        value={todo?.priority}
        label="Priority"
        onChange={(e) => handlePriorityChange(selectedTodo?.id, e)}
      >
        {priorities.map((priority) => (
          <MenuItem key={priority} value={priority}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <FlagIcon sx={{ color: color(priority) }} /> P{priority}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
export default Priorities;
