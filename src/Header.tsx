import { Button } from "@suid/material";
import { JSX } from "solid-js";
import { setShowTable, setTableRows, tableRows } from "./constants";
import { ToolBar } from "./ToolBar";
import { UploadForm } from "./UploadForm";

export const ReturnToHomeOnClick = (): void => {
  setShowTable(false);
  tableRows().map((row) => URL.revokeObjectURL(row.file_imgUrl));
  setTableRows([]);
};

export const ReturnToHome = (): JSX.Element => <Button onClick={ReturnToHomeOnClick}>Return to Home</Button>;

export const Header = (): JSX.Element => {
  return (
    <>
      <header class="header">
        <ReturnToHome />
        <UploadForm />
        <ToolBar />
      </header>
    </>
  );
};
