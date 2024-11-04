import { Box, Flex, IconButton } from "@chakra-ui/react";
import { LOW_PRIORIRTY, RichTextAction, RICH_TEXT_OPTIONS } from "../constants";
import { Divider } from "../Components/Divider";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useEffect, useState } from "react";
import { mergeRegister, $getNearestNodeOfType } from "@lexical/utils";
import {
  HeadingTagType,
  $createHeadingNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import { $wrapNodes } from "@lexical/selection";
import { useKeyBindings } from "../hooks/useKeyBindings";

import { getSelectedBtnProps } from "../utils";
import ColorPlugin from "./ColorPlugin";
import ListPlugin from "./ListPlugin";
import { $isListNode, ListNode } from "@lexical/list";
import TablePlugin from "./TablePlugin";
import CodeBlockPlugin from "./CodeBlockPlugin";
import { $isCodeNode, getDefaultCodeLanguage } from "@lexical/code";
import ImagePlugin from "./ImagePlugin";
import AudioPlugin from "./AudioPlugin";

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const [selectionMap, setSelectionMap] = useState<{ [id: string]: boolean }>(
    {}
  );

  const [blockType, setBlockType] = useState("paragraph");
  const [codeLanguage, setCodeLanguage] = useState(getDefaultCodeLanguage());
  const [selectedElementKey, setSelectedElementKey] = useState("");

  const updateToolbar = () => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const newSelectionMap = {
        [RichTextAction.Bold]: selection.hasFormat("bold"),
        [RichTextAction.Italics]: selection.hasFormat("italic"),
        [RichTextAction.Underline]: selection.hasFormat("underline"),
        [RichTextAction.Strikethrough]: selection.hasFormat("strikethrough"),
        [RichTextAction.Superscript]: selection.hasFormat("superscript"),
        [RichTextAction.Subscript]: selection.hasFormat("subscript"),
        [RichTextAction.Code]: selection.hasFormat("code"),
        [RichTextAction.Highlight]: selection.hasFormat("highlight"),
      };
      setSelectionMap(newSelectionMap);

      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      setSelectedElementKey(elementKey);
      const elementDOM = editor.getElementByKey(elementKey);

      if (!elementDOM) return;

      if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType(anchorNode, ListNode);
        const type = parentList ? parentList.getTag() : element.getTag();
        setBlockType(type);
      } else {
        const type = $isHeadingNode(element)
          ? element.getTag()
          : element.getType();
        setBlockType(type);
        if ($isCodeNode(element)) {
          setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
        }
      }
    }
  };

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (payload) => {
          updateToolbar();
          return false;
        },
        LOW_PRIORIRTY
      )
    );
  }, [editor]);

  const onAction = (id: RichTextAction) => {
    switch (id) {
      case RichTextAction.Bold: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        break;
      }
      case RichTextAction.Italics: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        break;
      }
      case RichTextAction.Underline: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        break;
      }
      case RichTextAction.Strikethrough: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        break;
      }
      case RichTextAction.Superscript: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
        break;
      }
      case RichTextAction.Subscript: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
        break;
      }
      case RichTextAction.Highlight: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight");
        break;
      }
      case RichTextAction.Code: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
        break;
      }
      case RichTextAction.LeftAlign: {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        break;
      }
      case RichTextAction.RightAlign: {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        break;
      }
      case RichTextAction.CenterAlign: {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        break;
      }
      case RichTextAction.JustifyAlign: {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        break;
      }
      case RichTextAction.Undo: {
        editor.dispatchCommand(UNDO_COMMAND, undefined);
        break;
      }
      case RichTextAction.Redo: {
        editor.dispatchCommand(REDO_COMMAND, undefined);
        break;
      }
    }
  };

  useKeyBindings({ onAction });

  return (
    <Box bg="#f9f9f9">
      <Flex alignItems="center">
        {RICH_TEXT_OPTIONS.map(({ id, label, icon }) => (
          <IconButton
            aria-label={label as string}
            icon={icon}
            onClick={() => onAction(id)}
            size="sm"
            variant="ghost"
            {...getSelectedBtnProps(selectionMap[id])}
          />
        ))}
        <Divider />
        L
        <Divider />
        <ListPlugin blockType={blockType} />
        <Divider />
        Q
        <Divider />
        <CodeBlockPlugin
          blockType={blockType}
          selectedElementKey={selectedElementKey}
          codeLanguage={codeLanguage}
        />
      </Flex>

      {/* <Flex gap={1}>
        <AudioPlugin />
      </Flex> */}
    </Box>
  );
}
