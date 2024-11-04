import {
  ArrowClockwise,
  ArrowCounterclockwise,
  Code,
  Highlighter,
  Justify,
  JustifyLeft,
  JustifyRight,
  Subscript,
  Superscript,
  TextCenter,
  TypeBold,
  TypeItalic,
  TypeStrikethrough,
  TypeUnderline,
} from "react-bootstrap-icons";

export enum RichTextAction {
  Bold = "bold",
  Italics = "italics",
  Underline = "underline",
  Strikethrough = "strikethrough",
  Superscript = "superscript",
  Subscript = "subscript",
  Highlight = "highlight",
  Code = "code",
  LeftAlign = "leftAlign",
  CenterAlign = "centerAlign",
  RightAlign = "rightAlign",
  JustifyAlign = "justifyAlign",
  Divider = "divider",
  Undo = "undo",
  Redo = "redo",
}

export const RICH_TEXT_OPTIONS = [
  { id: RichTextAction.Bold, icon: <TypeBold />, label: "Bold" },
  { id: RichTextAction.Italics, icon: <TypeItalic />, label: "Italics" },
  {
    id: RichTextAction.Strikethrough,
    icon: <TypeStrikethrough />,
    label: "Strikethrough",
  },
];

export const LOW_PRIORIRTY = 1;
