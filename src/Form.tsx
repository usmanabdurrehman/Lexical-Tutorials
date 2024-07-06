import { Box, Button } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useData, useUpdateData } from "./api";
import { RichTextEditor } from "./RichTextEditor";

export default function Form() {
  const [value, setValue] = useState("");
  const { mutateAsync: saveText, isPending } = useUpdateData();
  const { data } = useData();

  useEffect(() => {
    setValue(data);
  }, [data]);

  const onSave = () => {
    saveText(value);
  };

  return (
    <Box p={2}>
      <RichTextEditor
        placeholder="Select Post"
        name="post"
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
      <Button colorScheme="whatsapp" size="xs" mt={2} onClick={onSave}>
        {isPending ? "Saving..." : "Save"}
      </Button>
    </Box>
  );
}
