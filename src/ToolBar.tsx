import { Check, FileDownload, KeyboardArrowDown, ViewColumnOutlined } from "@suid/icons-material";
import {
  Button,
  ButtonGroup,
  Divider,
  FormControlLabel,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
} from "@suid/material";
import { createSignal, For, JSX, Show } from "solid-js";
import {
  exportType,
  exportVisibleOnly,
  propertyToName,
  setExportType,
  setExportVisibleOnly,
  setVisibleColumns,
  setWrapLine,
  TableColumns,
  thresholdSmallScreen,
  TPromptKeys,
  visibleColumns,
  windowSize,
  wrapLine,
} from "./constants";
import { exportTable } from "./utils";

interface Props {
  property: TPromptKeys;
}

const MyMenuItem = (props: Props): JSX.Element => (
  <>
    <MenuItem
      // divider={props.divider ?? false}
      onClick={() => handleColumnClick(props.property)}
    >
      <ListItemIcon>
        <Show when={visibleColumns().includes(props.property)}>
          <Check />
        </Show>
      </ListItemIcon>
      <ListItemText>{propertyToName[props.property]}</ListItemText>
    </MenuItem>
  </>
);

const handleColumnClick = (property: TPromptKeys): void => {
  setVisibleColumns((prev) => {
    return prev.includes(property) ? prev.filter((col) => col !== property) : [...prev, property];
  });
};

export const ToolBar = (): JSX.Element => {
  const [anchorEl1, setAnchorEl1] = createSignal<HTMLElement | undefined>();
  const [anchorEl2, setAnchorEl2] = createSignal<HTMLElement | undefined>();
  const isOpen1 = (): boolean => Boolean(anchorEl1());
  const isOpen2 = (): boolean => Boolean(anchorEl2());
  const handleClose1 = (): void => setAnchorEl1();
  const handleClose2 = (): void => setAnchorEl2();

  return (
    <>
      <div class="options">
        <ButtonGroup
          orientation={windowSize().width < thresholdSmallScreen ? "vertical" : "horizontal"}
          variant="text"
          sx={{ columnGap: "2px" }}
        >
          <Button sx={{ textTransform: "unset" }}>
            <FormControlLabel
              label="Wrap long lines?"
              onChange={() => setWrapLine((prev) => !prev)}
              checked={wrapLine()}
              sx={{ margin: "0" }}
              control={<Switch size="small" />}
              disableTypography
            />
          </Button>
          <Button
            aria-controls={isOpen1() ? "column-selector" : undefined}
            aria-haspopup="true"
            aria-expanded={isOpen1() ? "true" : undefined}
            startIcon={<ViewColumnOutlined />}
            onClick={(event) => setAnchorEl1(event.currentTarget)}
            sx={{ textTransform: "unset" }}
          >
            Select columns
          </Button>
          <Button
            aria-controls={isOpen2() ? "export-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={isOpen2() ? "true" : undefined}
            onClick={(event) => setAnchorEl2(event.currentTarget)}
            startIcon={<FileDownload />}
            endIcon={<KeyboardArrowDown />}
            sx={{ textTransform: "unset" }}
          >
            Export to {exportType().toUpperCase()}
          </Button>
        </ButtonGroup>
      </div>

      <Menu
        id="column-selector"
        anchorEl={anchorEl1()}
        open={isOpen1()}
        onClose={handleClose1}
      >
        <For each={TableColumns}>{(col) => <MyMenuItem property={col} />}</For>
      </Menu>

      <Menu
        id="export-menu"
        anchorEl={anchorEl2()}
        open={isOpen2()}
        onClose={handleClose2}
      >
        <MenuItem
          disableGutters
          dense
          disableRipple
          sx={{
            justifyContent: "space-between",
            paddingLeft: "4px",
            paddingRight: "4px",
            columnGap: "4px",
          }}
        >
          <span>Export</span>
          <ToggleButtonGroup
            color="primary"
            exclusive
            size="medium"
            value={exportVisibleOnly()}
            onChange={(_event, newValue) => newValue != null && setExportVisibleOnly(newValue)}
          >
            <ToggleButton
              value={true}
              sx={{ lineHeight: "normal" }}
            >
              Only Visible
            </ToggleButton>
            <ToggleButton
              value={false}
              sx={{ lineHeight: "normal" }}
            >
              All
            </ToggleButton>
          </ToggleButtonGroup>
          <span>columns</span>
        </MenuItem>

        <MenuItem
          disableGutters
          dense
          disableRipple
          sx={{
            justifyContent: "space-between",
            paddingLeft: "4px",
            paddingRight: "4px",
            columnGap: "4px",
          }}
        >
          <span>Export as</span>
          <ToggleButtonGroup
            color="primary"
            exclusive
            size="medium"
            value={exportType()}
            onChange={(_event, newValue) => newValue != null && setExportType(newValue)}
          >
            <ToggleButton
              value="tsv"
              sx={{ lineHeight: "normal" }}
            >
              TSV
            </ToggleButton>
            <ToggleButton
              value="json"
              sx={{ lineHeight: "normal" }}
            >
              JSON
            </ToggleButton>
          </ToggleButtonGroup>
        </MenuItem>

        <Divider />

        <MenuItem onClick={exportTable}>
          <Button
            fullWidth
            startIcon={<FileDownload />}
            sx={{ textTransform: "unset" }}
          >
            Export to {exportType().toUpperCase()}
          </Button>
        </MenuItem>
      </Menu>
    </>
  );
};
