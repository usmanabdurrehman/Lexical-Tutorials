import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  BaseSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  NodeKey,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";

import { Option } from "../types";
import {
  QuestionNode,
  $isQuestionNode,
  createOption,
} from "../nodes/QuestionNode";
import { Box, Button, Flex, Text } from "@chakra-ui/react";

function PollOptionComponent({
  option,
  index,
  options,
  withQuestionNode,
}: {
  index: number;
  option: Option;
  options: Option[];
  withQuestionNode: (
    cb: (QuestionNode: QuestionNode) => void,
    onSelect?: () => void
  ) => void;
}): JSX.Element {
  const text = option.text;

  return (
    <Flex alignItems="center">
      <input
        className="QuestionNode__optionInput"
        type="text"
        value={text}
        onChange={(e) => {
          const target = e.target;
          const value = target.value;
          const selectionStart = target.selectionStart;
          const selectionEnd = target.selectionEnd;
          withQuestionNode(
            (node) => {
              node.setOptionText(option, value);
            },
            () => {
              target.selectionStart = selectionStart;
              target.selectionEnd = selectionEnd;
            }
          );
        }}
        placeholder={`Option ${index + 1}`}
      />
      <button
        disabled={options.length < 3}
        aria-label="Remove"
        onClick={() => {
          withQuestionNode((node) => {
            node.deleteOption(option);
          });
        }}
      />
    </Flex>
  );
}

export default function QuestionComponent({
  question,
  options,
  nodeKey,
}: {
  nodeKey: NodeKey;
  options: Option[];
  question: string;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const [selection, setSelection] = useState<BaseSelection | null>(null);
  const ref = useRef(null);

  const $onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload;
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if ($isQuestionNode(node)) {
          node.remove();
          return true;
        }
      }
      return false;
    },
    [isSelected, nodeKey]
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        setSelection(editorState.read(() => $getSelection()));
      }),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (payload) => {
          const event = payload;

          if (event.target === ref.current) {
            if (!event.shiftKey) {
              clearSelection();
            }
            setSelected(!isSelected);
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        $onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        $onDelete,
        COMMAND_PRIORITY_LOW
      )
    );
  }, [clearSelection, editor, isSelected, nodeKey, $onDelete, setSelected]);

  const withQuestionNode = (
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

  const addOption = () => {
    withQuestionNode((node) => {
      node.addOption(createOption());
    });
  };

  const isFocused = $isNodeSelection(selection) && isSelected;

  return (
    <Box
      // className={`QuestionNode__container ${isFocused ? "focused" : ""}`}
      ref={ref}
      userSelect="none"
    >
      <Box className="QuestionNode__inner">
        <Text fontSize="medium">{question}</Text>
        {options.map((option, index) => {
          const key = option.uid;
          return (
            <PollOptionComponent
              key={key}
              withQuestionNode={withQuestionNode}
              option={option}
              index={index}
              options={options}
            />
          );
        })}
        <div className="QuestionNode__footer">
          <Button onClick={addOption}>Add Option</Button>
        </div>
      </Box>
    </Box>
  );
}
