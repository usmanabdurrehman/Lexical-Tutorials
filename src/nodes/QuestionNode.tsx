// https://github.dev/facebook/lexical/blob/main/packages/lexical-playground/src/nodes/QuestionNode.tsx

import {
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  LexicalNode,
  NodeKey,
} from "lexical";
import QuestionComponent from "../Components/Question";
import { Option } from "../types";

export const $createQuestionNode = ({
  question,
  options,
}: {
  question: string;
  options: Option[];
}) => {
  return new QuestionNode({ question, options });
};

const $convertQuestionElement = (
  domNode: HTMLElement
): DOMConversionOutput | null => {
  const question = domNode.getAttribute("data-lexical-question");
  const options = domNode.getAttribute("data-lexical-options");
  if (question !== null && options !== null) {
    const node = $createQuestionNode({
      question,
      options: JSON.parse(options),
    });
    return { node };
  }
  return null;
};

function createUID(): string {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 5);
}

export function createOption(text = ""): Option {
  return {
    text,
    uid: createUID(),
  };
}

function cloneOption(option: Option, text: string): Option {
  return {
    text,
    uid: option.uid,
  };
}

export class QuestionNode extends DecoratorNode<JSX.Element> {
  __question: string;
  __options: Option[];

  constructor({
    question,
    options,
    key,
  }: {
    question: string;
    options: Option[];
    key?: NodeKey;
  }) {
    super(key);
    this.__question = question;
    this.__options = options;
  }

  static getType(): string {
    return "question";
  }

  static clone(node: QuestionNode): QuestionNode {
    return new QuestionNode({
      question: node.__question,
      options: node.__options,
    });
  }

  decorate(): JSX.Element {
    return (
      <QuestionComponent
        nodeKey={this.__key}
        options={this.__options}
        question={this.__question}
      />
    );
  }

  createDOM(): HTMLElement {
    const span = document.createElement("span");
    return span;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("span");
    element.setAttribute("data-lexical-question", this.__question);
    element.setAttribute(
      "data-lexical-options",
      JSON.stringify(this.__options)
    );
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute("data-lexical-question")) {
          return null;
        }
        return {
          conversion: $convertQuestionElement,
          priority: 2,
        };
      },
    };
  }

  addOption(option: Option): void {
    const self = this.getWritable();
    const options = Array.from(self.__options);
    options.push(option);
    self.__options = options;
  }

  deleteOption(option: Option): void {
    const self = this.getWritable();
    const options = Array.from(self.__options);
    const index = options.indexOf(option);
    options.splice(index, 1);
    self.__options = options;
  }

  setOptionText(option: Option, text: string): void {
    const self = this.getWritable();
    // const clonedOption = cloneOption(option, text);
    // const options = Array.from(self.__options);
    // const index = options.indexOf(option);
    // options[index] = clonedOption;
    // self.__options = options;
  }
}

export const $isQuestionNode = (
  node: LexicalNode | null
): node is QuestionNode => {
  return node instanceof QuestionNode;
};
