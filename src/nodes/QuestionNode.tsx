// https://github.dev/facebook/lexical/blob/main/packages/lexical-playground/src/nodes/QuestionNode.tsx

import {
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import QuestionComponent from "../Components/Question";
import { Option } from "../types";
import { v4 as uuidv4 } from "uuid";

export const $createQuestionNode = ({
  question,
  options,
  answer,
}: {
  question: string;
  options: Option[];
  answer?: string;
}) => {
  return new QuestionNode({ question, options, answer });
};

const $convertQuestionElement = (
  domNode: HTMLElement
): DOMConversionOutput | null => {
  const question = domNode.getAttribute("data-lexical-question") || "";
  const options = JSON.parse(
    domNode.getAttribute("data-lexical-options") || "[]"
  );
  const answer = domNode.getAttribute("data-lexical-answer") || "";

  const node = $createQuestionNode({
    question,
    options,
    answer,
  });
  return { node };
};

export function createOption(text = ""): Option {
  return {
    text,
    id: uuidv4(),
  };
}

export type SerializedQuestionNode = Spread<
  {
    question: string;
    options: Option[];
  },
  SerializedLexicalNode
>;

export class QuestionNode extends DecoratorNode<JSX.Element> {
  __question: string;
  __options: Option[];
  __answer: string | undefined;

  constructor({
    question,
    options,
    key,
    answer,
  }: {
    question: string;
    options: Option[];
    key?: NodeKey;
    answer?: string;
  }) {
    super(key);
    this.__question = question;
    this.__options = options;
    this.__answer = answer;
  }

  static getType(): string {
    return "question";
  }

  static clone(node: QuestionNode): QuestionNode {
    return new QuestionNode({
      question: node.__question,
      options: node.__options,
      answer: node.__answer,
    });
  }

  decorate(): JSX.Element {
    return (
      <QuestionComponent
        nodeKey={this.__key}
        options={this.__options}
        question={this.__question}
        answer={this.__answer}
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
    element.setAttribute("data-lexical-answer", this.__answer || "");
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

  updateDOM(): false {
    return false;
  }

  addOption(): void {
    const self = this.getWritable();
    self.__options = [...self.__options, createOption()];
  }

  deleteOption(optionToDelete: Option): void {
    const self = this.getWritable();
    self.__options = self.__options.filter(
      (option) => option !== optionToDelete
    );
  }

  setOptionText(concernedOption: Option, text: string): void {
    const self = this.getWritable();
    self.__options = self.__options.map((option) =>
      option === concernedOption ? { ...option, text } : option
    );
  }

  setQuestionText(text: string): void {
    const self = this.getWritable();
    self.__question = text;
  }

  setQuestionAnswer(id: string): void {
    const self = this.getWritable();
    self.__answer = id;
  }
}

export const $isQuestionNode = (
  node: LexicalNode | null
): node is QuestionNode => {
  return node instanceof QuestionNode;
};
