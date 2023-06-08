import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCreateComment, useDeleteComment, useUpdateComment } from "../mutations";

const Comments = ({ selectedTodo, setSelectedTodo }) => {
  const [comment, setComment] = useState("");
  const [editingComment, setEditingComment] = useState({});
  const [edit, setEdit] = useState(false);
  const createCommentMutation = useCreateComment();
  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();

  const addComment = (id) => {
    createCommentMutation.mutate({ todoId: id, text: comment });
    setComment("");
  };

  const updateComment = (todoId, commentId, text) => {
    updateCommentMutation.mutate({ id: commentId, todoId: todoId, text: text });
    setEdit(false);
    setEditingComment((prev) => {
      return { ...prev, text: "" };
    });
  };

  const deleteComment = (todoId, commentId) => {
    deleteCommentMutation.mutate({ todoId, id: commentId });
    setSelectedTodo((prevTodo) => {
      const updatedComments = prevTodo.comments.filter(
        (comment) => comment.id !== commentId
      );
      return { ...prevTodo, comments: updatedComments };
    });
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleOpen = (comment) => {
    setEditingComment(comment);
    setEdit(true);
  };
  return (
    <Accordion defaultExpanded sx={{ width: "100%" }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>Comments</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ maxHeight: "550px", overflowY: "auto" }}>
        <Box mt={2}>
          {selectedTodo?.comments?.map((el, index) => (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1,
                borderBottom: "1px solid #C7C8CA",
              }}
              key={index}
            >
              {edit && editingComment.id === el.id ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <TextField
                    variant="outlined"
                    value={editingComment.text}
                    onChange={(event) =>
                      setEditingComment((prev) => {
                        return { ...prev, text: event.target.value };
                      })
                    }
                    fullWidth
                  />
                  <Button
                    onClick={() =>
                      updateComment(
                        editingComment.todoId,
                        editingComment.id,
                        editingComment.text
                      )
                    }
                    variant="contained"
                    color="primary"
                  >
                    Ok
                  </Button>
                </Box>
              ) : (
                <>
                  <Typography key={index} variant="body2">
                    {el.text}
                  </Typography>
                  <Box>
                    <Button sx={{ minWidth: 0 }} onClick={() => handleOpen(el)}>
                      <ModeEditIcon />
                    </Button>
                    <Button
                      sx={{ minWidth: 0 }}
                      color="secondary"
                      onClick={() => deleteComment(el.todoId, el.id)}
                    >
                      <DeleteIcon />
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          ))}
        </Box>
        <Box mt={3}>
          <TextField
            label="Write a comment"
            variant="outlined"
            value={comment}
            onChange={handleCommentChange}
            fullWidth
            multiline
            rows={4}
          />
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => addComment(selectedTodo.id)}
            >
              Add Comment
            </Button>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default Comments;
