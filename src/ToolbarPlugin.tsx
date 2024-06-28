import { Box, ButtonGroup, Flex, IconButton, Select } from "@chakra-ui/react";
import { css } from "@emotion/css";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  KEY_ENTER_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  TextNode,
  UNDO_COMMAND,
} from "lexical";
import { $wrapNodes } from "@lexical/selection";
import { $createHeadingNode, HeadingTagType } from "@lexical/rich-text";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { RichTextAction, RICH_TEXT_OPTIONS } from "./constants";
import { useKeyBindings } from "./hooks";
import ColorPicker from "./Components/ColorPicker";

const LowPriority = 1;

const HEADINGS = ["h1", "h2", "h3", "h4", "h5", "h6"];

const getStyleValue = (style: string, key: string) => {
  return style
    .split(";")
    .map((rule) => rule.split(": "))
    .filter(([ruleName]) => {
      return ruleName === key;
    })?.[0]?.[1];
};

const Divider = () => <Box width="1px" bg="#f4f4f4" margin="0 6px" h={4}></Box>;

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isHighlight, setIsHighlight] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  const actionCurrentMap: { [id: string]: boolean } = {
    [RichTextAction.Bold]: isBold,
    [RichTextAction.Underline]: isUnderline,
    [RichTextAction.Italics]: isItalic,
    [RichTextAction.Strikethrough]: isStrikethrough,
    [RichTextAction.Highlight]: isHighlight,
    [RichTextAction.Superscript]: isSuperscript,
    [RichTextAction.Subscript]: isSubscript,
    [RichTextAction.Code]: isCode,
  };

  const actionDisabledMap: { [id: string]: boolean } = {
    [RichTextAction.Undo]: !canUndo,
    [RichTextAction.Redo]: !canRedo,
  };

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsHighlight(selection.hasFormat("highlight"));
      setIsSuperscript(selection.hasFormat("superscript"));
      setIsSubscript(selection.hasFormat("subscript"));
      setIsCode(selection.hasFormat("code"));
      const style = (
        selection
          .getNodes()
          .filter((node) => !!(node as TextNode)?.getStyle) as TextNode[]
      ).map((node) => {
        return node.getStyle();
      })?.[0];
      if (!style) return;

      setColor(getStyleValue(style, "color"));
      setBgColor(getStyleValue(style, "background"));
    }
  }, []);

  const updateHeadings = (heading: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        console.log({ inHeading: heading });
        $wrapNodes(selection, () => $createHeadingNode(heading));
      }
    });
  };

  const updateColor = (color: string) => {
    editor.update(() => {
      const selection = $getSelection();
      console.log({ selection });

      if ($isRangeSelection(selection)) {
        console.log("yo", selection);
        selection.getNodes().forEach((node) => {
          if ((node as TextNode)?.setStyle)
            (node as TextNode)?.setStyle(`color: ${color}`);
        });
      }
    });
  };

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, $updateToolbar]);

  const getSelectedBtnProps = (isSelected: boolean) =>
    isSelected
      ? {
          colorScheme: "blue",
          variant: "solid",
        }
      : {};

  const onAction = (action: RichTextAction) => {
    switch (action) {
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
      case RichTextAction.JustifyAlign: {
        editor.dispatchCommand(REDO_COMMAND, undefined);
        break;
      }
    }
  };

  useKeyBindings({ onAction });

  return (
    <Flex gap={4}>
      <ButtonGroup
        borderRadius={0}
        size="xs"
        isAttached
        variant="ghost"
        color="#444"
        className={css({
          "& > button": { borderRadius: 0 },
          alignItems: "center",
        })}
      >
        <Select
          placeholder="Select Heading"
          size="xs"
          onChange={(e) => updateHeadings(e.target.value as HeadingTagType)}
          mr={2}
        >
          {HEADINGS.map((heading) => (
            <option value={heading}>{heading}</option>
          ))}
        </Select>
        {RICH_TEXT_OPTIONS.map(({ id, label, icon, fontSize }) =>
          id === RichTextAction.Divider ? (
            <Divider />
          ) : (
            <IconButton
              onClick={() => onAction(id)}
              aria-label={label as string}
              icon={icon}
              {...getSelectedBtnProps(actionCurrentMap[id])}
              isDisabled={actionDisabledMap[id]}
              fontSize={fontSize}
            />
          )
        )}
        <Box
          h={3}
          w={3}
          border="1px solid #333"
          bg={color}
          cursor="pointer"
        ></Box>
        <ColorPicker onClick={updateColor} />
      </ButtonGroup>
    </Flex>
  );
}
