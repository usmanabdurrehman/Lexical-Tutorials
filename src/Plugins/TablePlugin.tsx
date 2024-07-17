import {
  Button,
  IconButton,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import { useState } from "react";
import { Table } from "react-bootstrap-icons";
import { $createTableNodeWithDimensions } from "@lexical/table";

import Modal from "../Components/Modal";

export default function TablePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  const [isOpen, setIsOpen] = useState(false);
  const [rows, setRows] = useState<number>();
  const [columns, setColumns] = useState<number>();

  const onAdd = () => {
    if (!rows || !columns) return;
    editor.update(() => {
      const tableNode = $createTableNodeWithDimensions(rows, columns, true);
      $insertNodeToNearestRoot(tableNode);
    });
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
          <Button
            variant="ghost"
            onClick={onAdd}
            isDisabled={!rows || !columns}
          >
            Add
          </Button>
        }
      >
        <NumberInput>
          <NumberInputField
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            placeholder="Rows"
            autoFocus
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
