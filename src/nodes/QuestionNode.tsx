import {
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  SerializedTextNode,
  Spread,
  TextNode,
} from "lexical";
import { ExtendedTextNode } from "./ExtendedTextNode";
import { Option } from "../types";
import Question from "../Components/Question";
import { v4 as uuid } from "uuid";

export type SerializedQuestionNode = Spread<
  {
    question: string;
    options: Option[];
    answer: string | undefined;
  },
  SerializedLexicalNode
>;

const $convertQuestionElement = (
  domNode: HTMLElement
): DOMConversionOutput | null => {
  const question = domNode.getAttribute("data-lexical-question") || "";
  const answer = domNode.getAttribute("data-lexical-answer") || "";
  const options = JSON.parse(
    domNode.getAttribute("data-lexical-options") || "[]"
  );

  const node = $createQuestionNode({ question, answer, options });

  return { node };
};

export class QuestionNode extends DecoratorNode<JSX.Element> {
  __question: string;
  __options: Option[];
  __answer: string | undefined;

  constructor(
    params: { question: string; options: Option[]; answer?: string },
    key?: NodeKey
  ) {
    const { question, options, answer } = params;
    super(key);
    this.__question = question;
    this.__options = options;
    this.__answer = answer;
  }

  static getType(): string {
    return "question";
  }

  static clone(node: QuestionNode): QuestionNode {
    return new QuestionNode(
      {
        question: node.__question,
        answer: node.__answer,
        options: node.__options,
      },
      node.__key
    );
  }

  createDOM(config: EditorConfig, editor?: LexicalEditor): HTMLElement {
    const element = document.createElement("span");

    return element;
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
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
          priority: 2,
          conversion: $convertQuestionElement,
        };
      },
    };
  }

  updateDOM(): boolean {
    return false;
  }

  decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element {
    return (
      <Question
        answer={this.__answer}
        question={this.__question}
        options={this.__options}
        nodeKey={this.getKey()}
      />
    );
  }

  setQuestionText(text: string) {
    const self = this.getWritable();
    self.__question = text;
  }

  setQuestionAnswer(id: string) {
    const self = this.getWritable();
    self.__answer = id;
  }

  addOption() {
    const self = this.getWritable();
    self.__options = [...self.__options, { id: uuid(), text: "" }];
  }

  deleteOption(optionToDelete: Option) {
    const self = this.getWritable();
    self.__options = self.__options.filter(
      (option) => option !== optionToDelete
    );
  }

  setOptionText(concernedOption: Option, text: string) {
    const self = this.getWritable();
    self.__options = self.__options.map((option) =>
      option === concernedOption ? { ...option, text } : option
    );
  }

  static importJSON(serializedNode: SerializedQuestionNode): QuestionNode {
    return $createQuestionNode(serializedNode).updateFromJSON(serializedNode);
  }

  exportJSON(): SerializedQuestionNode {
    return {
      ...super.exportJSON(),
      answer: this.__answer,
      question: this.__question,
      options: this.__options,
    };
  }
}

export const $createQuestionNode = (params: {
  question: string;
  options: Option[];
  answer?: string;
}) => {
  return new QuestionNode(params);
};

export const $isQuestionNode = (
  node: LexicalNode | null | undefined
): node is QuestionNode => {
  return node instanceof QuestionNode;
};
