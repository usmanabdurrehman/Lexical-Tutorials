import { Box, Button, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useData } from "./api/useData";
import { useUpdateData } from "./api/useUpdateData";
import { RichTextEditor } from "./RichTextEditor";

export default function Form() {
  const { data: initialValue } = useData();
  const { mutateAsync: updateData, isPending } = useUpdateData();

  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onSubmit = () => {
    updateData(value);
  };

  const onChange = (newValue: string) => {
    setValue(newValue);
  };

  return (
    <Flex direction={"column"} gap={2} p={4}>
      <RichTextEditor
        name="post"
        value={value}
        onChange={onChange}
        placeholder="Enter text"
      />
      <Box>
        <Button colorScheme={"whatsapp"} onClick={onSubmit} size="xs">
          {isPending ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Flex>
  );
}
