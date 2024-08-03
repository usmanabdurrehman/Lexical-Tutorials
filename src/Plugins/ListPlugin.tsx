// https://github.com/facebook/lexical/discussions/3559

import { IconButton } from "@chakra-ui/react";
import React from "react";
import { ListOl, ListUl } from "react-bootstrap-icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $createListItemNode,
  $createListNode,
} from "@lexical/list";
import { getSelectedBtnProps } from "../utils";
import { $insertNodes } from "lexical";

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
          // editor.update(() => {
          //   // const node = $createListNode("bullet");
          //   const node1 = $createListItemNode();
          //   $insertNodes([node1]);
          // });
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        }}
      />
    </>
  );
}
