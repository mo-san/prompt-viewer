import { ContentPaste } from "@suid/icons-material";
import {
  Alert,
  Box,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@suid/material";
import { For, JSX } from "solid-js";
import {
  alertVisible,
  hoveringImage,
  ITableRow,
  setAlertVisible,
  setHoveringImage,
  setTableRowSelected,
  TableColumns,
  tableOrderBy,
  tableRows,
  tableRowSelected,
  tableSortOrder,
  TableSortOrder,
  TPromptKeys,
  visibleColumns,
  wrapLine,
} from "./constants";
import { DataTableHeadRow } from "./DataTableHeadRow";
import { getCellData } from "./utils";

const onCopy = async (event: MouseEvent): Promise<void> => {
  event.stopPropagation();

  const elem = ((event.currentTarget as HTMLElement).parentElement as HTMLElement).querySelector(".text");
  const text = elem?.textContent ?? "";
  if (text.length < 1) return;

  await navigator.clipboard.writeText(text);
  setAlertVisible(true);
  setTimeout(() => setAlertVisible(false), 2000);
};

const CopyButton = (): JSX.Element => (
  <IconButton
    class="copy"
    sx={{ display: "none", position: "absolute", borderRadius: "8px" }}
    onClick={onCopy}
    size="small"
  >
    <ContentPaste />
    Copy
  </IconButton>
);

const CheckBoxCell = (prop: { name: string }): JSX.Element => (
  <TableCell
    padding="checkbox"
    class="col-checkbox"
  >
    <Checkbox
      color="primary"
      checked={tableRowSelected().includes(prop.name)}
    />
  </TableCell>
);

const ImageCell = (prop: { url: string; name: string; handleHover: (url?: string) => void }): JSX.Element => (
  <TableCell
    component="th"
    scope="row"
    padding="none"
    class="col-image"
    onPointerOver={() => prop.handleHover(prop.url)}
    onPointerLeave={() => prop.handleHover()}
  >
    <img
      src={prop.url}
      alt={`the thumbnail of "${prop.name}"`}
    />
  </TableCell>
);

const MyTableCell = (row: ITableRow, property: TPromptKeys): JSX.Element => (
  <TableCell
    classList={{
      hidden: !visibleColumns().includes(property),
      empty: row.file_isEmpty,
    }}
  >
    <div class="text">{getCellData(row, property)}</div>
    <CopyButton />
  </TableCell>
);

export function DataTable(): JSX.Element {
  function descendingComparator(a: ITableRow, b: ITableRow, orderBy: TPromptKeys): number {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  }

  function getComparator(order: TableSortOrder, orderBy: TPromptKeys): (a: ITableRow, b: ITableRow) => number {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const handleClick = (name: string): string[] => {
    const selectedIndex = tableRowSelected().indexOf(name);

    if (selectedIndex === -1) return setTableRowSelected([...tableRowSelected(), name]);
    if (selectedIndex === 0) return setTableRowSelected([...tableRowSelected().slice(1)]);
    if (selectedIndex === tableRowSelected.length - 1) return setTableRowSelected([...tableRowSelected().slice(0, -1)]);
    return setTableRowSelected([
      ...tableRowSelected().slice(0, selectedIndex),
      ...tableRowSelected().slice(selectedIndex + 1),
    ]);
  };

  return (
    <>
      <Paper classList={{ alert: true, alertVisible: alertVisible() }}>
        <Alert severity="success">Copied!</Alert>
      </Paper>
      <TableContainer class="table-container">
        <Table
          size="small"
          class="data-table"
          classList={{ wrap: wrapLine() }}
        >
          <TableHead>
            <DataTableHeadRow />
          </TableHead>
          <TableBody>
            <For each={tableRows().sort(getComparator(tableSortOrder(), tableOrderBy()))}>
              {(row) => (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  selected={tableRowSelected().includes(row.file_name)}
                  onClick={() => handleClick(row.file_name)}
                >
                  <CheckBoxCell name={row.file_name} />
                  <ImageCell
                    url={row.file_imgUrl}
                    name={row.file_name}
                    handleHover={setHoveringImage}
                  />
                  <For each={TableColumns}>{(col) => MyTableCell(row, col)}</For>
                </TableRow>
              )}
            </For>
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        class="preview"
        classList={{ "preview-visible": Boolean(hoveringImage()) }}
      >
        <img
          src={hoveringImage()}
          alt="preview of an image where the mouse is over"
        />
      </Box>
    </>
  );
}
