import { IconButton } from "@chakra-ui/react";
import { ListUl } from "react-bootstrap-icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";

interface ListPluginProps {}

export default function ListPlugin({}: ListPluginProps) {
  const [editor] = useLexicalComposerContext();

  return (
    <>
      <IconButton
        icon={<ListUl />}
        aria-label="Add Unordered List"
        size="sm"
        variant="ghost"
        onClick={() => {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        }}
      />
    </>
  );
}
