import { QueryClient } from "@tanstack/react-query";
import { privateTodoApi } from "./todoApi";

const defaultQueryFunction = ({ queryKey: [url, data] }) => {
  return privateTodoApi.get(url, { params: data }).then(({ data }) => data);
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFunction,
      refetchOnWindowFocus: false,
    },
  },
});
