import React from "react";
import { Option } from "../types";
import { $getNodeByKey, NodeKey } from "lexical";
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
import { $isQuestionNode, QuestionNode } from "../nodes/QuestionNode";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const QuestionOption = ({
  option,
  index,
  options,
  updateNode,
}: {
  option: Option;
  index: number;
  options: Option[];
  updateNode: (cb: (node: QuestionNode) => void) => void;
}) => {
  return (
    <Flex alignItems={"center"} gap={2}>
      <Radio value={option.id} />
      <Input
        fontSize="sm"
        value={option.text}
        height="30px"
        placeholder={`Option ${index + 1}`}
        onChange={(e) =>
          updateNode((node) => node.setOptionText(option, e.target.value))
        }
      />
      <IconButton
        aria-label="Remove Option"
        icon={<X />}
        colorScheme="red"
        size="sm"
        isDisabled={options.length < 3}
        onClick={() => updateNode((node) => node.deleteOption(option))}
      />
    </Flex>
  );
};

export default function Question({
  question,
  options,
  answer,
  nodeKey,
}: {
  question: string;
  options: Option[];
  answer: string | undefined;
  nodeKey: NodeKey;
}) {
  const [editor] = useLexicalComposerContext();

  const updateNode = (cb: (node: QuestionNode) => void): void => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isQuestionNode(node)) {
        cb(node);
      }
    });
  };

  return (
    <Box
      width="260px"
      mt={4}
      p={3}
      border="2px solid #3b3bee"
      borderRadius="lg"
      pos="relative"
      role="group"
    >
      <IconButton
        aria-label="Remove Question"
        pos="absolute"
        top={-2}
        right={-2}
        icon={<X />}
        size="xs"
        zIndex={1}
        display="none"
        _groupHover={{ display: "flex" }}
        onClick={() => {
          updateNode((node) => node.remove());
        }}
      />
      <Input
        value={question}
        placeholder="Question"
        onChange={(e) => {
          updateNode((node) => node.setQuestionText(e.target.value));
        }}
      />
      <RadioGroup
        value={answer}
        onChange={(id) => {
          updateNode((node) => node.setQuestionAnswer(id));
        }}
      >
        <Flex flexDir={"column"} gap={1} mt={2}>
          {options.map((option, index) => (
            <QuestionOption
              option={option}
              index={index}
              options={options}
              updateNode={updateNode}
            />
          ))}
        </Flex>
      </RadioGroup>
      <Button
        size="xs"
        mt={2}
        onClick={() => updateNode((node) => node.addOption())}
      >
        Add Option
      </Button>
    </Box>
  );
}
