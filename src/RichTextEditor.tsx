import { Box } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";

import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { css } from "@emotion/css";
import { ToolbarPlugin } from "./Plugins";
import CustomOnChangePlugin from "./Plugins/CustomOnChangePlugin";
import { theme } from "./theme";
import { ListNode, ListItemNode } from "@lexical/list";
import { CustomParagraphNode } from "./nodes/CustomParagraphNode";
import { ParagraphNode } from "lexical";
import { CustomListItemNode } from "./nodes/CustomListItemNode";

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
          ListNode,
          ListItemNode,
          CustomParagraphNode,
          {
            replace: ParagraphNode,
            with: () => new CustomParagraphNode(),
            withKlass: CustomParagraphNode,
          },
          CustomListItemNode,
          {
            replace: ListItemNode,
            with: () => new CustomListItemNode(),
            withKlass: CustomListItemNode,
          },
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
              ErrorBoundary={LexicalErrorBoundary}
            />
          </Box>
          <AutoFocusPlugin />
          <HistoryPlugin />
          <ListPlugin />
          <CustomOnChangePlugin value={value} onChange={onChange} />
        </LexicalComposer>
      </Box>
    );
  }
);
