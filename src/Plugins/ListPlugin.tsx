import { IconButton } from "@chakra-ui/react";
import React from "react";
import { ListOl, ListUl } from "react-bootstrap-icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { getSelectedBtnProps } from "../utils";

interface ListPluginProps {
  blockType: string;
}

export default function ListPlugin({ blockType }: ListPluginProps) {
  const [editor] = useLexicalComposerContext();

  return (
    <>
      <IconButton
        icon={<ListOl />}
        aria-label="Add Ordered list"
        size="sm"
        variant="ghost"
        onClick={() => {
          if (blockType === "ol") {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          }
        }}
        {...getSelectedBtnProps(blockType === "ol")}
      />
      <IconButton
        icon={<ListUl />}
        aria-label="Add Unordered List"
        size="sm"
        variant="ghost"
        onClick={() => {
          if (blockType === "ul") {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          }
        }}
        {...getSelectedBtnProps(blockType === "ul")}
      />
    </>
  );
}
