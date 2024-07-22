import { Flex, IconButton, Select } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { CodeSquare } from "react-bootstrap-icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  registerCodeHighlighting,
  $createCodeNode,
  getCodeLanguages,
  $isCodeNode,
} from "@lexical/code";
import { $getNodeByKey, $getSelection, $isRangeSelection } from "lexical";
import { $wrapNodes } from "@lexical/selection";

const lanugages = getCodeLanguages();

interface CodeBlockPluginProps {
  codeLanguage: string;
  blockType: string;
  selectedElementKey: string;
}

export default function CodeBlockPlugin({
  codeLanguage,
  blockType,
  selectedElementKey,
}: CodeBlockPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    registerCodeHighlighting(editor);
  }, [editor]);

  const onAddCodeBlock = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createCodeNode());
      }
    });
  };

  const onLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lanugage = e.target.value;
    editor.update(() => {
      if (!selectedElementKey) return;
      const node = $getNodeByKey(selectedElementKey);
      if ($isCodeNode(node)) {
        node.setLanguage(lanugage);
      }
    });
  };

  return (
    <Flex gap={1} alignItems="center">
      <IconButton
        icon={<CodeSquare />}
        aria-label="Add Code Block"
        size="sm"
        variant="ghost"
        onClick={onAddCodeBlock}
      />
      {blockType && (
        <Select size="sm" value={codeLanguage} onChange={onLanguageChange}>
          {lanugages.map((language) => (
            <option value={language}>{language}</option>
          ))}
        </Select>
      )}
    </Flex>
  );
}
