import { Box, Flex } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";

import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { css } from "@emotion/css";
import { ToolbarPlugin } from "./Plugins";
import { EditorThemeClasses } from "lexical";
import CustomOnChangePlugin from "./Plugins/CustomOnChangePlugin";
import { ImageNode } from "./nodes/ImageNode";
import { YouTubeNode } from "./nodes/YoutubeNode";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { theme } from "./theme";

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
        nodes: [
          HeadingNode,
          CodeHighlightNode,
          CodeNode,
          ImageNode,
          YouTubeNode,
          TableNode,
          TableCellNode,
          TableRowNode,
          AutoLinkNode,
          LinkNode,
          ListItemNode,
          ListNode,
          HorizontalRuleNode,
          QuoteNode,
        ],
      }),
      [name]
    );

    return (
      <Box>
        <LexicalComposer initialConfig={initialConfig}>
          <ToolbarPlugin />
          <Box pos="relative" height={350}>
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className={css({
                    height: `100%`,
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
