import { createSignal } from "solid-js";

export const isDev = import.meta.env.DEV;
export const [showTable, setShowTable] = createSignal(false);
export const [isDragOver, setIsDragOver] = createSignal(false);
export const [wrapLine, setWrapLine] = createSignal(true);
export const [alertVisible, setAlertVisible] = createSignal(false);
export const [windowSize, setWindowSize] = createSignal({ width: Infinity, height: Infinity });
export const [exportVisibleOnly, setExportVisibleOnly] = createSignal(true);
export const [exportType, setExportType] = createSignal<"tsv" | "json">("tsv");

export const thresholdSmallScreen = 600;
export const clsDropZone = "dropzone" as const;

export const acceptableTypes = ["image/png", "image/jpeg"];
export type TFileList = Array<{ file: File; path: string }>;
export const keyFileName = "file_name" as const;
export const keyLastModified = "file_lastModified" as const;
export const keyFileSize = "file_size" as const;
export const keyFilePath = "file_path" as const;
export const keyPositive = "positive" as const;
export const keyNegative = "negative" as const;
const keySteps = "Steps" as const;
const keySampler = "Sampler" as const;
const keyCFGScale = "CFG scale" as const;
const keySeed = "Seed" as const;
const keySize = "Size" as const;
const keyModelHash = "Model hash" as const;
const keyDenoise = "Denoising strength" as const;
const keyMaskblur = "Mask blur" as const;

export const propertyToName = {
  [keyFileName]: "File Name",
  [keyPositive]: "Positive Prompt",
  [keyNegative]: "Negative Prompt",
  [keySteps]: "Steps",
  [keySampler]: "Sampler",
  [keyCFGScale]: "CFG Scale",
  [keySeed]: "Seed",
  [keySize]: "Image Size",
  [keyModelHash]: "Model Hash",
  [keyLastModified]: "Last Modified Date",
  [keyFileSize]: "File Size",
  [keyFilePath]: "File Path",
  [keyDenoise]: "Denoise Strength",
  [keyMaskblur]: "Mask Blur",
};

export interface TPrompt {
  [keyFileName]: string;
  [keyFilePath]: string;
  [keyFileSize]: number;
  [keyLastModified]: number;
  [keyPositive]: string;
  [keyNegative]: string;
  [keySteps]: string;
  [keySampler]: string;
  [keyCFGScale]: string;
  [keySeed]: string;
  [keySize]: string;
  [keyModelHash]: string;
  [keyDenoise]: string;
  [keyMaskblur]: string;
}
export type TPromptKeys = keyof TPrompt;

export const TableColumns: TPromptKeys[] = [
  keyFileName,
  keyPositive,
  keyNegative,
  keySteps,
  keySampler,
  keyCFGScale,
  keySeed,
  keySize,
  keyDenoise,
  keyMaskblur,
  keyModelHash,
  keyLastModified,
  keyFileSize,
  keyFilePath,
];

export type ITableRow = {
  [key in TPromptKeys]: TPrompt[key];
} & {
  file_imgUrl: string;
  file_isEmpty: boolean;
};

export type TableSortOrder = "asc" | "desc";
export const [tableSortOrder, setTableSortOrder] = createSignal<TableSortOrder>("asc");
export const [tableOrderBy, setTableOrderBy] = createSignal<TPromptKeys>(keyFileName);
export const [tableRowSelected, setTableRowSelected] = createSignal<readonly string[]>([]);
export const [tableRows, setTableRows] = createSignal<ITableRow[]>([]);
export const [visibleColumns, setVisibleColumns] = createSignal<TPromptKeys[]>(TableColumns);
export const [hoveringImage, setHoveringImage] = createSignal<string | undefined>();
