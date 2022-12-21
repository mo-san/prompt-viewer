import { Paper } from "@suid/material";
import { JSX } from "solid-js";
import { showTable, tableOrderBy, tableRowSelected, tableSortOrder } from "./constants";
import { ReturnToHome, ReturnToHomeOnClick } from "./Header";

export const Debug = (): JSX.Element => {
  return (
    <Paper
      style={{
        display: "grid",
        position: "fixed",
        bottom: "0.5rem",
        left: "0.5rem",
        "background-color": "rgba(227,165,165,0.59)",
        padding: "0.5rem",
        "z-index": "10",
        "max-width": "50vw",
        "max-height": "25vh",
        overflow: "auto",
      }}
    >
      <div onClick={ReturnToHomeOnClick}>
        <ReturnToHome />
      </div>
      <table>
        <tbody>
          <tr>
            <td>showTable</td>
            <td>{showTable() ? "Showing" : "Not showing"}</td>
          </tr>
          <tr>
            <td>tableOrderBy</td>
            <td>{`${tableOrderBy()}`}</td>
          </tr>
          <tr>
            <td>tableSortOrder</td>
            <td>{`${tableSortOrder()}`}</td>
          </tr>
          <tr>
            <td>tableRowSelected</td>
            <td>{`${JSON.stringify(tableRowSelected())}`}</td>
          </tr>
        </tbody>
      </table>
    </Paper>
  );
};
