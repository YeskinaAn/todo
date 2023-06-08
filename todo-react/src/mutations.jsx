import { useMutation } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { privateTodoApi } from "./lib/todoApi";

export const useCreateTodo = () =>
  useMutation({
    mutationFn: (payload) => {
      return privateTodoApi.post(`/todo`, payload).then(({ data }) => data);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [`/todos`],
      }),
  });

export const useCreateComment = () =>
  useMutation({
    mutationFn: (payload) => {
      return privateTodoApi
        .post(`/todo/${payload.todoId}/comments`, payload)
        .then(({ data }) => data);
    },
    onSuccess: (responce) =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: [`/todos`],
        }),
        queryClient.invalidateQueries({
          queryKey: [`/todo/${responce.todoId}`],
        }),
      ]),
  });

export const useCreateLabel = () =>
  useMutation({
    mutationFn: (payload) => {
      return privateTodoApi
        .post(`/todo/${payload.todoId}/labels`, payload)
        .then(({ data }) => data);
    },
    onSuccess: (responce) =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: [`/todos`],
        }),
        queryClient.invalidateQueries({
          queryKey: [`/todo/${responce.todoId}`],
        }),
      ]),
  });

export const useUpdateComment = () =>
  useMutation({
    mutationFn: (payload) => {
      return privateTodoApi
        .put(`/todo/${payload.todoId}/comments/${payload.id}`, payload)
        .then(({ data }) => data);
    },
    onSuccess: (responce) =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: [`/todos`],
        }),
        queryClient.invalidateQueries({
          queryKey: [`/todo/${responce.todoId}`],
        }),
      ]),
  });

export const useDeleteComment = () =>
  useMutation({
    mutationFn: (payload) => {
      return privateTodoApi
        .delete(`/todo/${payload.todoId}/comments/${payload.id}`, payload)
        .then(({ data }) => data);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [`/todos`],
      }),
  });

export const useUpdateTodo = () =>
  useMutation({
    mutationFn: (payload) => {
      return privateTodoApi
        .put(`/todo/${payload.id}`, payload)
        .then(({ data }) => data);
    },
    onSuccess: (responce) =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: [`/todos`],
        }),
        queryClient.invalidateQueries({
          queryKey: [`/todo/${responce.id}`],
        }),
      ]),
  });

export const useDeleteTodo = () =>
  useMutation({
    mutationFn: (payload) => {
      return privateTodoApi
        .delete(`/todo/${payload}`, payload)
        .then(({ data }) => data);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [`/todos`],
      }),
  });
