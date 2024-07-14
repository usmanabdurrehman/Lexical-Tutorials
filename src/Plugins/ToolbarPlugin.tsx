import { Box, ButtonGroup, Flex, IconButton, Select } from "@chakra-ui/react";
import { css } from "@emotion/css";
import {
  HEADINGS,
  LOW_PRIORIRTY,
  RichTextAction,
  RICH_TEXT_OPTIONS,
} from "../constants";
import { Divider } from "../Components/Divider";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  createCommand,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalCommand,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useEffect, useRef, useState } from "react";
import {
  $insertFirst,
  $insertNodeToNearestRoot,
  mergeRegister,
} from "@lexical/utils";
import { HeadingTagType, $createHeadingNode } from "@lexical/rich-text";
import { $wrapNodes } from "@lexical/selection";
import { useKeyBindings } from "../hooks/useKeyBindings";
import { CameraVideo, ImageFill, Table } from "react-bootstrap-icons";
import { $createImageNode, ImagePayload } from "../nodes/ImageNode";
import {
  $computeTableMap,
  $computeTableMapSkipCellCheck,
  $createTableCellNode,
  $createTableNodeWithDimensions,
  $getNodeTriplet,
  $isTableCellNode,
  $isTableNode,
  $isTableRowNode,
  applyTableHandlers,
  INSERT_TABLE_COMMAND,
  TableCellNode,
  TableNode,
  TableRowNode,
} from "@lexical/table";
import YouTubePlugin from "./YoutubePlugin";
import ImagePlugin from "./ImagePlugin";
import TablePlugin from "./TablePlugin";
import ColorPlugin from "./ColorPlugin";
import CodeBlockPlugin from "./CodeBlockPlugin";

export type InsertImagePayload = Readonly<ImagePayload>;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand("INSERT_IMAGE_COMMAND");
export const INSERT_VIDEO_COMMAND = createCommand("INSERT_VIDEO_COMMAND");

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [disableMap, setDisableMap] = useState<{ [id: string]: boolean }>({
    [RichTextAction.Undo]: true,
    [RichTextAction.Redo]: true,
  });
  const [selectionMap, setSelectionMap] = useState<{ [id: string]: boolean }>(
    {}
  );

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
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setDisableMap((prevDisableMap) => ({
            ...prevDisableMap,
            undo: !payload,
          }));
          return false;
        },
        LOW_PRIORIRTY
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setDisableMap((prevDisableMap) => ({
            ...prevDisableMap,
            redo: !payload,
          }));
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

  const getSelectedBtnProps = (isSelected: boolean) =>
    isSelected
      ? {
          colorScheme: "blue",
          variant: "solid",
        }
      : { color: "#444" };

  const updateHeading = (heading: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createHeadingNode(heading));
      }
    });
  };

  return (
    <Box>
      <Flex alignItems="center" gap={1}>
        {RICH_TEXT_OPTIONS.map(({ id, label, icon, fontSize }) =>
          id === RichTextAction.Divider ? (
            <Divider />
          ) : (
            <IconButton
              aria-label={label as string}
              icon={icon}
              fontSize={fontSize}
              onClick={() => onAction(id)}
              isDisabled={disableMap[id]}
              size="sm"
              variant="ghost"
              {...getSelectedBtnProps(selectionMap[id])}
            />
          )
        )}
        <Select
          size="xs"
          mr={2}
          placeholder="Select Heading"
          onChange={(e) => {
            updateHeading(e.target.value as HeadingTagType);
          }}
          width={"140px"}
        >
          {HEADINGS.map((heading) => (
            <option value={heading}>{heading}</option>
          ))}
        </Select>
      </Flex>
      <Flex>
        <ColorPlugin />
        <TablePlugin />
        <ImagePlugin />
        <YouTubePlugin />
        <CodeBlockPlugin />
      </Flex>
    </Box>
  );
}
