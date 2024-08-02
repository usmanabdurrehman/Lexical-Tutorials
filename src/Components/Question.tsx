import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey, NodeKey } from "lexical";

import { Option } from "../types";
import { QuestionNode, $isQuestionNode } from "../nodes/QuestionNode";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { X } from "react-bootstrap-icons";

function PollOptionComponent({
  option,
  index,
  options,
  updateNode,
}: {
  index: number;
  option: Option;
  options: Option[];
  updateNode: (
    cb: (QuestionNode: QuestionNode) => void,
    onSelect?: () => void
  ) => void;
}): JSX.Element {
  return (
    <Flex alignItems="center" gap={2}>
      <Radio value={option.id} />
      <Input
        type="text"
        fontSize="sm"
        value={option.text}
        height="30px"
        placeholder={`Option ${index + 1}`}
        onChange={(e) => {
          updateNode((node) => {
            node.setOptionText(option, e.target.value);
          });
        }}
      />
      <IconButton
        aria-label="Remove"
        icon={<X />}
        colorScheme="red"
        size="sm"
        onClick={() => {
          updateNode((node) => {
            node.deleteOption(option);
          });
        }}
        isDisabled={options.length < 3}
      />
    </Flex>
  );
}

export default function QuestionComponent({
  question,
  options,
  nodeKey,
  answer,
}: {
  nodeKey: NodeKey;
  options: Option[];
  question: string;
  answer: string | undefined;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();

  const updateNode = (
    cb: (node: QuestionNode) => void,
    onUpdate?: () => void
  ): void => {
    editor.update(
      () => {
        const node = $getNodeByKey(nodeKey);
        if ($isQuestionNode(node)) {
          cb(node as QuestionNode);
        }
      },
      { onUpdate }
    );
  };

  return (
    <Box
      width="260px"
      mt={4}
      p={3}
      border="2px solid #3b3bee"
      borderRadius="lg"
    >
      <Input
        value={question}
        placeholder="Question"
        onChange={(e) => {
          updateNode((node) => {
            node.setQuestionText(e.target.value);
          });
        }}
      />
      <RadioGroup
        onChange={(answer) =>
          updateNode((node) => {
            node.setQuestionAnswer(answer);
          })
        }
        value={answer}
      >
        <Flex direction={"column"} gap={1} mt={2}>
          {options.map((option, index) => {
            const key = option.id;
            return (
              <PollOptionComponent
                key={key}
                updateNode={updateNode}
                option={option}
                index={index}
                options={options}
              />
            );
          })}
        </Flex>
      </RadioGroup>

      <Button
        onClick={() =>
          updateNode((node) => {
            node.addOption();
          })
        }
        size="xs"
        mt={2}
      >
        Add Option
      </Button>
    </Box>
  );
}
