import {
  Button,
  IconButton,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Table } from "react-bootstrap-icons";
import Modal from "../Components/Modal";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createTableNodeWithDimensions } from "@lexical/table";
import { $insertNodeToNearestRoot } from "@lexical/utils";

export default function TablePlugin() {
  const [isOpen, setIsOpen] = useState(false);
  const [rows, setRows] = useState<number>();
  const [columns, setColumns] = useState<number>();
  const [editor] = useLexicalComposerContext();

  const onAddTable = () => {
    if (!rows || !columns) return;
    editor.update(() => {
      const tableNode = $createTableNodeWithDimensions(rows, columns, true);
      $insertNodeToNearestRoot(tableNode);
    });
    setRows(undefined);
    setColumns(undefined);
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <Modal
          title="Add Table"
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          footer={
            <Button
              variant="ghost"
              onClick={onAddTable}
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
      )}
      <IconButton
        icon={<Table />}
        aria-label="Add Table"
        size="sm"
        variant="ghost"
        onClick={() => setIsOpen(true)}
      />
    </>
  );
}
