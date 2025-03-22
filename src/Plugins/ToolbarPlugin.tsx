import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Select,
} from "@chakra-ui/react";
import { css } from "@emotion/css";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { LOW_PRIORIRTY, RICH_TEXT_OPTIONS, RichTextAction } from "../constants";
import { mergeRegister } from "@lexical/utils";
import { useEffect, useState } from "react";
import { Divider } from "../Components/Divider";
import { Question, Tag } from "react-bootstrap-icons";
import { $createTagNode } from "../nodes/TagNode";
import { $createQuestionNode } from "../nodes/QuestionNode";

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

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
    }
  };

  const getSelectedBtnProps = (isSelected: boolean) =>
    isSelected
      ? {
          colorScheme: "blue",
          variant: "solid",
        }
      : {};

  const buttonGroupProps = {
    size: "md",
    isAttached: true,
    variant: "ghost",
    color: "#444",
    className: css({
      "& > button": { borderRadius: 0 },
      alignItems: "center",
    }),
  };

  const onAddTag = () => {
    editor.update(() => {
      const node = $createTagNode("Nice Tag");
      $insertNodes([node]);
    });
  };

  const onAddQuestion = () => {
    editor.update(() => {
      const node = $createQuestionNode({ question: "What?", options: [] });
      $insertNodes([node]);
    });
  };

  return (
    <Flex gap={2} direction={"column"}>
      <ButtonGroup {...buttonGroupProps}>
        {RICH_TEXT_OPTIONS.map(({ id, label, icon, fontSize }) =>
          id === RichTextAction.Divider ? (
            <Divider />
          ) : (
            <IconButton
              aria-label={label as string}
              icon={icon}
              fontSize={fontSize}
              onClick={() => onAction(id)}
              {...getSelectedBtnProps(selectionMap[id])}
            />
          )
        )}
      </ButtonGroup>
      <ButtonGroup {...buttonGroupProps}>
        <IconButton aria-label="Add Tag" icon={<Tag />} onClick={onAddTag} />
        <IconButton
          aria-label="Add Question"
          icon={<Question />}
          onClick={onAddQuestion}
        />
      </ButtonGroup>
    </Flex>
  );
}
