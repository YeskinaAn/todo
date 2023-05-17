import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { config } from "../helpers/constants";

const Comments = ({ editingTodo, setEditingTodo, setTodos, todos }) => {
  const [comment, setComment] = useState("");
  const [editingComment, setEditingComment] = useState({});
  const [edit, setEdit] = useState(false);

  const addComment = (id) => {
    axios
      .post(
        `http://localhost:3001/todo/${id}/comments`,
        { todoId: id, text: comment },
        config
      )
      .then((response) => {
        console.warn(response.data);
        setTodos(
          todos.map((todo) => {
            if (todo.id === id) {
              return { ...todo, comments: [...todo.comments, response.data] };
            }
            return todo;
          })
        );
        setEditingTodo((prev) => {
          return { ...prev, comments: [...prev.comments, response.data] };
        });
        setComment("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateComment = (todoId, commentId, text) => {
    axios
      .put(
        `http://localhost:3001/todo/${todoId}/comments/${commentId}`,
        { id: commentId, todoId: todoId, text: text },
        config
      )
      .then((response) => {
        console.warn(response.data);
        setEditingComment((prev) => {
          return { ...prev, text: "" };
        });
        setTodos(
          todos.map((todo) => {
            const updatedComments = todo.comments.map((comment) => {
              if (comment.id === commentId) {
                return { ...comment, text: response.data.text };
              }
              return comment;
            });
            if (todo.id === todoId) {
              return {
                ...todo,
                comments: updatedComments,
              };
            }
            return todo;
          })
        );
        setEditingTodo((prevTodo) => {
          const updatedComments = prevTodo.comments.map((comment) => {
            if (comment.id === commentId) {
              return { ...comment, text: response.data.text };
            }
            return comment;
          });
          return { ...prevTodo, comments: updatedComments };
        });
        setEdit(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteComment = (todoId, commentId) => {
    axios
      .delete(
        `http://localhost:3001/todo/${todoId}/comments/${commentId}`,
        config
      )
      .then(() => {
        setTodos(
          todos.map((todo) => {
            const updatedComments = todo.comments.filter(
              (comment) => comment.id !== commentId
            );
          return { ...todo, comments: updatedComments };
          })
        );
        setEditingTodo((prevTodo) => {
          const updatedComments = prevTodo.comments.filter(
            (comment) => comment.id !== commentId
          );
          return { ...prevTodo, comments: updatedComments };
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleOpen = (comment) => {
    setEditingComment(comment);
    setEdit(true);
  };
  // console.warn(editingTodo);
  return (
    <Accordion defaultExpanded sx={{ width: "100%" }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>Comments</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box mt={2}>
          {editingTodo?.comments?.map((el, index) => (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1,
                borderBottom: "1px solid #C7C8CA",
              }}
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
              onClick={() => addComment(editingTodo.id)}
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
