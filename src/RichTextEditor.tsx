import React, { useMemo, useState } from "react";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

import { ToolbarPlugin } from "./Plugins";
import { css } from "@emotion/css";
import { CustomOnChangePlugin } from "./Plugins/CustomOnChangePlugin";
import { Box } from "@chakra-ui/react";

import { HeadingNode } from "@lexical/rich-text";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { EditorThemeClasses } from "lexical";

const theme: EditorThemeClasses = {
  text: {
    bold: css({
      fontWeight: "bold",
    }),
    italic: css({
      fontStyle: "italic",
    }),
    underline: css({
      textDecoration: "underline",
    }),
    strikethrough: css({
      textDecoration: "line-through",
    }),
    underlineStrikethrough: css({
      textDecoration: "underline line-through",
    }),
    code: css({
      background: "#eee",
      color: "black",
      padding: 2,
      border: "1px solid #ccc",
    }),
  },
};

interface RichTextEditorProps {
  name: string;
  placeholder?: string;
  onChange: (value: string) => void;
  value: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = React.memo(
  function RichTextEditor({ name, onChange, value, placeholder }) {
    const initialConfig = useMemo(() => {
      return {
        namespace: name,
        theme,
        onError: () => {},
        nodes: [HeadingNode, CodeNode, CodeHighlightNode],
      };
    }, [name]);

    return (
      <LexicalComposer initialConfig={initialConfig}>
        <Box>
          <ToolbarPlugin />
          <Box
            bg="#fff"
            pos="relative"
            border="1px solid #aaa"
            borderRadius="md"
          >
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className={css(`
                    height: ${120}px;
                    overflow: auto;
                    font-size: 12px;
                    padding: 8px;
                    outline: none;
                `)}
                />
              }
              placeholder={
                <Box
                  className={css(`
                    color: #999;
                    position: absolute;
                    top: 8px;
                    left: 10px;
                    font-size: 12px;
                  `)}
                >
                  {placeholder}
                </Box>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <CustomOnChangePlugin initialHtml={value} onChange={onChange} />
          </Box>
        </Box>
      </LexicalComposer>
    );
  }
);
