import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useUpdateData = () =>
  useMutation({
    mutationFn: async (text: string) => {
      const { data } = await axios.post("http://localhost:7000/data", { text });
      return data;
    },
  });
