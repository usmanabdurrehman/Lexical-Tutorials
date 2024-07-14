import { Box, IconButton } from "@chakra-ui/react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  createCommand,
  LexicalCommand,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { useEffect, useState } from "react";
import { LOW_PRIORIRTY } from "../constants";
import {
  $patchStyleText,
  $getSelectionStyleValueForProperty,
} from "@lexical/selection";
import { SketchPicker } from "react-color";
import { mergeRegister } from "@lexical/utils";
import ColorPicker from "../Components/ColorPicker";
import { PaintBucket, Type } from "react-bootstrap-icons";

type ColorPayload = {
  property: "background" | "color";
  value: string;
};
export const CHANGE_COLOR_COMMAND: LexicalCommand<ColorPayload> = createCommand(
  "CHANGE_COLOR_COMMAND"
);

export default function ColorPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [{ color, bgColor }, setColors] = useState<{
    color: string;
    bgColor: string;
  }>({
    color: "#000",
    bgColor: "#fff",
  });

  const updateToolbar = () => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const color = $getSelectionStyleValueForProperty(
        selection,
        "color",
        "#000"
      );

      const bgColor = $getSelectionStyleValueForProperty(
        selection,
        "background",
        "#fff"
      );
      setColors({ color, bgColor });
    }
  };

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (payload) => {
          updateToolbar();
          return false;
        },
        LOW_PRIORIRTY
      ),
      editor.registerCommand<ColorPayload>(
        CHANGE_COLOR_COMMAND,
        ({ property, value }) => {
          const selection = $getSelection();
          if (selection !== null) {
            $patchStyleText(selection, { [property]: value });
          }
          return true;
        },
        LOW_PRIORIRTY
      )
    );
  }, [editor]);

  console.log({ color, bgColor });

  return (
    <>
      <ColorPicker
        color={color}
        icon={<Type />}
        onChange={(color) => {
          editor.dispatchCommand(CHANGE_COLOR_COMMAND, {
            property: "color",
            value: color,
          });
        }}
      />
      <ColorPicker
        color={bgColor}
        icon={<PaintBucket />}
        onChange={(color) => {
          editor.dispatchCommand(CHANGE_COLOR_COMMAND, {
            property: "background",
            value: color,
          });
        }}
      />
    </>
  );
}
