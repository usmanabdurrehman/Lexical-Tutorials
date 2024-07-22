import { EditorThemeClasses } from "lexical";
import "./index.css";
import "./editor.css";

export const theme: EditorThemeClasses = {
  text: {
    bold: "bold",
    underline: "underline",
    strikethrough: "strikethrough",
    underlineStrikethrough: "underlineStrikethrough",
    italic: "italic",
    code: "code",
  },
  table: "table",
  tableCell: "tableCell",
  tableCellHeader: "tableCellHeader",
  code: "editorCode",
  codeHighlight: {
    atrule: "editorTokenAttr",
    attr: "editorTokenAttr",
    boolean: "editorTokenProperty",
    builtin: "editorTokenSelector",
    cdata: "editorTokenComment",
    char: "editorTokenSelector",
    class: "editorTokenFunction", // class constructor
    comment: "editorTokenComment", // comment
    constant: "editorTokenProperty",
    deleted: "editorTokenProperty",
    doctype: "editorTokenComment",
    entity: "editorTokenOperator",
    function: "editorTokenFunction", // es5 function
    important: "editorTokenVariable",
    inserted: "editorTokenSelector",
    keyword: "editorTokenAttr", // variable keyword like const/let
    namespace: "editorTokenVariable",
    number: "editorTokenProperty", // number values
    operator: "editorTokenOperator", // operator like +/*-
    prolog: "editorTokenComment",
    property: "editorTokenProperty",
    punctuation: "editorTokenPunctuation", // brackets of array, object
    regex: "editorTokenVariable",
    selector: "editorTokenSelector",
    string: "editorTokenSelector", // string values
    symbol: "editorTokenProperty",
    tag: "editorTokenProperty",
    url: "editorTokenOperator",
    variable: "editorTokenVariable",
  },
};
