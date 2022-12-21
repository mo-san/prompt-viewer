import { ArrowUpward } from "@suid/icons-material";
import { ButtonBase, Checkbox, TableCell, TableRow } from "@suid/material";
import { For, JSX } from "solid-js";
import {
  ITableRow,
  propertyToName,
  setTableOrderBy,
  setTableRowSelected,
  setTableSortOrder,
  TableColumns,
  tableOrderBy,
  tableRows,
  tableRowSelected,
  tableSortOrder,
  TPromptKeys,
  visibleColumns,
} from "./constants";

const handleSelectAllClick = (event: Event, rows: ITableRow[]): void => {
  // when previously checked, unselect all
  if ((event.currentTarget as HTMLInputElement).checked) {
    setTableRowSelected([]);
  } else {
    setTableRowSelected(rows.map((n) => n.file_name));
  }
};

const handleRequestSort = (property: TPromptKeys): void => {
  const isAsc = tableOrderBy() === property && tableSortOrder() === "asc";
  setTableSortOrder(isAsc ? "desc" : "asc");
  setTableOrderBy(property);
};

const HeaderCheckBox = (): JSX.Element => (
  <TableCell
    component="th"
    padding="checkbox"
    class="col-checkbox"
  >
    <Checkbox
      color="primary"
      indeterminate={tableRowSelected().length > 0 && tableRowSelected().length < tableRows().length}
      checked={tableRows().length > 0 && tableRowSelected().length === tableRows().length}
      onChange={(event) => handleSelectAllClick(event, tableRows())}
      inputProps={{
        "aria-label": "select all desserts",
      }}
    />
  </TableCell>
);

const TableSortLabel = (props: {
  id: string;
  onClick: (event: MouseEvent) => void;
  children: JSX.Element;
}): JSX.Element => {
  return (
    <>
      <ButtonBase
        class="header-button"
        onClick={(event) => props.onClick(event)}
      >
        <span
          class="header-arrow"
          style={{
            transform: tableOrderBy() === props.id && tableSortOrder() === "desc" ? "rotate(180deg)" : "rotate(0deg)",
          }}
          classList={{
            visible: tableOrderBy() === props.id,
          }}
          aria-label={tableSortOrder() === "desc" ? "sorted descending" : "sorted ascending"}
        >
          <ArrowUpward />
        </span>
        <span class="header-label">{props.children}</span>
      </ButtonBase>
    </>
  );
};

export const DataTableHeadRow = (): JSX.Element => (
  <TableRow>
    <HeaderCheckBox />
    <TableCell
      component="th"
      class="header-cell col-image"
    >
      &nbsp;
    </TableCell>
    <For each={TableColumns}>
      {(col) => (
        <TableCell
          padding="none"
          classList={{ hidden: !visibleColumns().includes(col) }}
          class="header-cell"
          component="th"
          sortDirection={tableOrderBy() === col ? tableSortOrder() : false}
        >
          <TableSortLabel
            id={col}
            onClick={() => handleRequestSort(col)}
          >
            {propertyToName[col]}
          </TableSortLabel>
        </TableCell>
      )}
    </For>
  </TableRow>
);
