import { Box, ButtonGroup, Flex, IconButton, Select } from "@chakra-ui/react";
import { css } from "@emotion/css";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes } from "lexical";
import { Question } from "react-bootstrap-icons";
import { $createQuestionNode, createOption } from "../nodes/QuestionNode";

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const onAddQuestion = () => {
    editor.update(() => {
      const node = $createQuestionNode({
        question: "",
        options: Array.from({ length: 2 }, (_, i) => i).map((i) =>
          createOption(``)
        ),
      });
      $insertNodes([node]);
    });
  };

  return (
    <Flex gap={4}>
      <ButtonGroup
        size="md"
        isAttached
        variant="ghost"
        color="#444"
        className={css({
          "& > button": { borderRadius: 0 },
          alignItems: "center",
        })}
      >
        <IconButton
          aria-label="Add Question"
          icon={<Question />}
          onClick={onAddQuestion}
        />
      </ButtonGroup>
    </Flex>
  );
}
