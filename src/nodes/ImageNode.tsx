import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  NodeKey,
} from "lexical";

import { DecoratorNode } from "lexical";

export interface ImagePayload {
  altText: string;
  height?: number;
  key?: NodeKey;
  maxWidth?: number;
  src: string;
  width?: number;
}

function convertImageElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLImageElement) {
    const { alt: altText, src } = domNode;
    const node = $createImageNode({ altText, src });
    return { node };
  }
  return null;
}

export type SerializedImageNode = {
  altText: string;
  height?: number;
  maxWidth: number;
  src: string;
  width?: number;
  type: "image";
  version: 1;
};

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __width: "inherit" | number;
  __height: "inherit" | number;
  __maxWidth: number;

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode({
      src: node.__src,
      altText: node.__altText,
      maxWidth: node.__maxWidth,
      width: node.__width,
      height: node.__height,
    });
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("img");
    element.setAttribute("src", this.__src);
    element.setAttribute("alt", this.__altText);
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (node: Node) => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    };
  }

  constructor({
    src,
    altText,
    maxWidth,
    width,
    height,
    key,
  }: {
    src: string;
    altText: string;
    maxWidth: number;
    width?: "inherit" | number;
    height?: "inherit" | number;
    key?: NodeKey;
  }) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__maxWidth = maxWidth;
    this.__width = width || "inherit";
    this.__height = height || "inherit";
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    // checking theme class for image from theme and assigning it if any
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  decorate(): JSX.Element {
    return (
      <img
        src={this.__src}
        alt={this.__altText}
        style={{
          height: this.__height,
          maxWidth: this.__maxWidth,
          width: this.__width,
        }}
      />
    );
  }
}

export function $createImageNode({
  altText,
  height,
  maxWidth = 400,
  src,
  width,
}: ImagePayload): ImageNode {
  return new ImageNode({ src, altText, maxWidth, width, height });
}
