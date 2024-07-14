import {
  Button,
  IconButton,
  Input,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import { createCommand, LexicalCommand } from "lexical";
import { useEffect, useState } from "react";
import { Table, Youtube } from "react-bootstrap-icons";
import { LOW_PRIORIRTY } from "../constants";
import { TableNode, $createTableNodeWithDimensions } from "@lexical/table";

import Modal from "../Components/Modal";

export const INSERT_TABLE_COMMAND: LexicalCommand<{
  rows: number;
  columns: number;
}> = createCommand("INSERT_TABLE_COMMAND");

export default function TablePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([TableNode])) {
      throw new Error("TablePlugin: TableNode not registered on editor");
    }

    return editor.registerCommand<{
      rows: number;
      columns: number;
    }>(
      INSERT_TABLE_COMMAND,
      ({ rows, columns }) => {
        const tableNode = $createTableNodeWithDimensions(rows, columns, true);
        $insertNodeToNearestRoot(tableNode);
        return true;
      },
      LOW_PRIORIRTY
    );
  }, [editor]);

  const [isOpen, setIsOpen] = useState(false);
  const [rows, setRows] = useState<number>();
  const [columns, setColumns] = useState<number>();

  const onAdd = () => {
    if (!(rows && columns)) return;
    editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows, columns });
    setIsOpen(false);
    setRows(undefined);
    setColumns(undefined);
  };

  return (
    <>
      <IconButton
        aria-label={"Add Table"}
        icon={<Table />}
        size="sm"
        variant="ghost"
        onClick={() => {
          setIsOpen(true);
        }}
      />
      <Modal
        title="Add Table"
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
        footer={
          <>
            <Button variant="ghost" onClick={onAdd}>
              Add
            </Button>
          </>
        }
      >
        <NumberInput>
          <NumberInputField
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            placeholder="Rows"
          />
        </NumberInput>

        <NumberInput>
          <NumberInputField
            mt={4}
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
            placeholder="Columns"
          />
        </NumberInput>
      </Modal>
    </>
  );
}
