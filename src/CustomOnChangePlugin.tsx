import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $insertNodes } from "lexical";
import React, { useEffect, useState } from "react";

interface Props {
  initialHtml?: string;
  onChange: (value: string) => void;
}

export const CustomOnChangePlugin: React.FC<any> = React.memo(
  function HtmlPlugin({ initialHtml, onChange }: Props) {
    const [editor] = useLexicalComposerContext();

    const [isFirstRender, setIsFirstRender] = useState(true);

    useEffect(() => {
      if (!initialHtml || !isFirstRender) return;

      setIsFirstRender(false);

      editor.update(() => {
        const currentHtml = $generateHtmlFromNodes(editor);
        if (currentHtml !== initialHtml) {
          $getRoot().clear();
          const parser = new DOMParser();
          const dom = parser.parseFromString(initialHtml, "text/html");
          const nodes = $generateNodesFromDOM(editor, dom);
          $insertNodes(nodes);
        }
      });
    }, [editor, initialHtml, isFirstRender]);

    useEffect(() => {
      setIsFirstRender(true);
    }, [initialHtml]);

    return (
      <OnChangePlugin
        onChange={(editorState) => {
          editorState.read(() => {
            //  editor.getRootElement()?.textContent
            onChange($generateHtmlFromNodes(editor));
          });
        }}
      />
    );
  }
);
