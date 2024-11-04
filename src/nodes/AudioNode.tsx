import {
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  LexicalNode,
  NodeKey,
} from "lexical";

import { AudioVisualizer } from "react-audio-visualize";

export const $createAudioNode = ({ url }: { url: string }) => {
  return new AudioNode({ url });
};

const ID_ATTR = "data-lexical-audio";

const convertYoutubeElement = (
  domNode: HTMLElement
): DOMConversionOutput | null => {
  const url = domNode?.getAttribute(ID_ATTR);
  if (!url) return null;
  const node = $createAudioNode({ url });
  return { node };
};

export class AudioNode extends DecoratorNode<JSX.Element> {
  __url: string;

  constructor({ url, key }: { url: string; key?: NodeKey }) {
    super(key);
    this.__url = url;
  }

  static getType(): string {
    return "audio";
  }

  static clone(_node: AudioNode): AudioNode {
    return new AudioNode({
      url: _node.__url,
    });
  }

  decorate(): JSX.Element {
    return <div></div>;
    //   <AudioVisualizer
    //   blob={blob}
    //   width={500}
    //   height={75}
    //   barWidth={1}
    //   gap={0}
    //   barColor={'#f76565'}
    // />
    // );
  }

  createDOM(): HTMLElement {
    const div = document.createElement("div");
    return div;
  }

  exportDOM(): DOMExportOutput {
    const iframe = document.createElement("iframe");
    iframe.setAttribute(ID_ATTR, this.__url);
    // iframe.setAttribute("height", HEIGHT);
    // iframe.setAttribute("width", WIDTH);

    return { element: iframe };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      iframe: (node: Node) => {
        return { conversion: convertYoutubeElement, priority: 0 };
      },
    };
  }
}
