import React, { useState } from "react";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

import ToolbarPlugin from "./ToolbarPlugin";
import { css } from "@emotion/css";
import { CustomOnChangePlugin } from "./CustomOnChangePlugin";
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
    }),
  },
};

const initialConfig = {
  namespace: "MyEditor",
  theme,
  onError: () => {},
  nodes: [HeadingNode, CodeNode, CodeHighlightNode],
};

interface RichTextEditorProps {}

const placeholder = "Enter text";

export const RichTextEditor: React.FC<RichTextEditorProps> = React.memo(
  function RichTextEditor() {
    const [value, setValue] = useState("");

    const onChange = (newValue: string) => {
      setValue(newValue);
    };

    return (
      <LexicalComposer initialConfig={initialConfig}>
        <Box width="auto">
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
                    outline:none;
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
