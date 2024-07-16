import { Box, IconButton } from "@chakra-ui/react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ListOl, ListUl } from "react-bootstrap-icons";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { getSelectedBtnProps } from "../utils";

interface ListPluginProps {
  blockType: string;
}

export default function ListPlugin({
  blockType,
}: ListPluginProps): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  return (
    <>
      <IconButton
        aria-label={"Add Ordered List"}
        icon={<ListOl />}
        size="sm"
        variant="ghost"
        onClick={() => {
          if (blockType !== "ol") {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          }
        }}
        {...getSelectedBtnProps(blockType === "ol")}
      />
      <IconButton
        aria-label={"Add UnOrdered List"}
        icon={<ListUl />}
        size="sm"
        variant="ghost"
        onClick={() => {
          if (blockType !== "ul") {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          }
        }}
        {...getSelectedBtnProps(blockType === "ul")}
      />
    </>
  );
}
