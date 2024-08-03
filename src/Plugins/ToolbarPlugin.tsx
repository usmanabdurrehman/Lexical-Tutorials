import { Box } from "@chakra-ui/react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import ListPlugin from "./ListPlugin";

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  return (
    <Box>
      <ListPlugin />
    </Box>
  );
}
