import React, { useState, useEffect } from "react";
import {
  $createCodeNode,
  $isCodeNode,
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
} from "lexical";
import { LOW_PRIORIRTY } from "../constants";
import { mergeRegister } from "@lexical/utils";
import { CodeSquare } from "react-bootstrap-icons";
import { $wrapNodes } from "@lexical/selection";
import { getSelectedBtnProps } from "../utils";

const codeLanguages = getCodeLanguages();

export const ADD_CODE_COMMAND = createCommand("ADD_CODE_COMMAND");

interface CodeBlockPluginProps {
  selectedElementKey: string;
  codeLanguage: string;
  blockType: string;
}

export default function CodeBlockPlugin({
  codeLanguage,
  selectedElementKey,
  blockType,
}: CodeBlockPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    registerCodeHighlighting(editor);

    return mergeRegister(
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
        {...getSelectedBtnProps(blockType === "code")}
      />
      {blockType === "code" && (
        <Select
          value={codeLanguage}
          onChange={(e) => {
            const newLanguage = e.target.value;
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
      )}
    </Flex>
  );
}
