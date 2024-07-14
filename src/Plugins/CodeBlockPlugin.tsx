import React, { useState, useEffect } from "react";
import {
  $createCodeNode,
  $isCodeNode,
  getDefaultCodeLanguage,
  getCodeLanguages,
  registerCodeHighlighting,
} from "@lexical/code";
import { Flex, IconButton, Select } from "@chakra-ui/react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  createCommand,
  LexicalCommand,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { LOW_PRIORIRTY } from "../constants";
import {
  $patchStyleText,
  $getSelectionStyleValueForProperty,
} from "@lexical/selection";
import { SketchPicker } from "react-color";
import { mergeRegister } from "@lexical/utils";
import { CodeSquare } from "react-bootstrap-icons";
import {
  $isParentElementRTL,
  $wrapNodes,
  $isAtNodeEnd,
} from "@lexical/selection";

const codeLanguages = getCodeLanguages();

export const ADD_CODE_COMMAND = createCommand("ADD_CODE_COMMAND");

export default function CodeBlockPlugin() {
  const [language, setLanguage] = useState("javascript");
  const [selectedElementKey, setSelectedElementKey] = useState("");
  const [editor] = useLexicalComposerContext();

  const updateToolbar = () => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);

        if ($isCodeNode(element)) {
          setLanguage(element.getLanguage() || getDefaultCodeLanguage());
        }
      }
    }
  };

  useEffect(() => {
    registerCodeHighlighting(editor);

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
        ADD_CODE_COMMAND,
        () => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            $wrapNodes(selection, () => $createCodeNode());
          }
          return true;
        },
        LOW_PRIORIRTY
      )
    );
  }, [editor]);

  return (
    <Flex gap={1} alignItems="center">
      <IconButton
        aria-label={"Add Code Block"}
        icon={<CodeSquare />}
        size="sm"
        variant="ghost"
        onClick={() => editor.dispatchCommand(ADD_CODE_COMMAND, undefined)}
      />
      <Select
        value={language}
        onChange={(e) => {
          const newLanguage = e.target.value;
          setLanguage(newLanguage);
          editor.update(() => {
            if (selectedElementKey !== null) {
              const node = $getNodeByKey(selectedElementKey);
              if ($isCodeNode(node)) {
                node.setLanguage(newLanguage);
              }
            }
          });
        }}
        size="sm"
      >
        {codeLanguages.map((language) => (
          <option value={language}>{language}</option>
        ))}
      </Select>
    </Flex>
  );
}
