import { Box } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";

import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { css } from "@emotion/css";
import { ToolbarPlugin } from "./Plugins";
import { EditorThemeClasses } from "lexical";
import CustomOnChangePlugin from "./Plugins/CustomOnChangePlugin";
import { QuestionNode } from "./nodes/QuestionNode";

const theme: EditorThemeClasses = {};

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = React.memo(
  function RichTextEditor({ value, onChange, placeholder, name }) {
    const initialConfig = useMemo(
      () => ({
        namespace: name,
        theme,
        onError: () => {},
        nodes: [QuestionNode],
      }),
      [name]
    );

    return (
      <Box>
        <LexicalComposer initialConfig={initialConfig}>
          <ToolbarPlugin />
          <Box pos="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className={css({
                    height: 600,
                    fontSize: 12,
                    padding: 8,
                    overflow: "auto",
                    outline: "none",
                    border: "1px solid black",
                    borderRadius: "4px",
                  })}
                />
              }
              placeholder={
                <Box
                  className={css({
                    position: "absolute",
                    color: "#999",
                    top: 8,
                    left: 10,
                    fontSize: 12,
                  })}
                >
                  {placeholder}
                </Box>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </Box>
          <AutoFocusPlugin />
          <HistoryPlugin />
          <CustomOnChangePlugin value={value} onChange={onChange} />
        </LexicalComposer>
      </Box>
    );
  }
);
