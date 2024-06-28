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
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { $wrapNodes } from "@lexical/selection";
import { $createHeadingNode, HeadingTagType } from "@lexical/rich-text";
import { useEffect, useState } from "react";
import {
  HEADINGS,
  LOW_PRIORIRTY,
  RichTextAction,
  RICH_TEXT_OPTIONS,
} from "../constants";
import { useKeyBindings } from "../hooks";
import { Divider } from "../Components/Divider";

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

  const $updateToolbar = () => {
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
    }
  };
  const updateHeadings = (heading: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        console.log({ inHeading: heading });
        $wrapNodes(selection, () => $createHeadingNode(heading));
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
        LOW_PRIORIRTY
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LOW_PRIORIRTY
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LOW_PRIORIRTY
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
      </ButtonGroup>
    </Flex>
  );
}
