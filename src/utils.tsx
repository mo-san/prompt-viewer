import exifr from "exifr";
import {
  acceptableTypes,
  exportType,
  exportVisibleOnly,
  ITableRow,
  keyFileName,
  keyFilePath,
  keyFileSize,
  keyLastModified,
  keyNegative,
  keyPositive,
  propertyToName,
  setIsDragOver,
  setShowTable,
  setTableRows,
  TableColumns,
  tableRows,
  tableRowSelected,
  TFileList,
  TPrompt,
  TPromptKeys,
  visibleColumns,
} from "./constants";

const bytesToSize = (bytes: number): string => {
  if (isNaN(bytes)) return `${bytes}`;
  const sizes = ["", "k", "M", "G", "T", "P", "Z", "Y", "R", "Q"];
  for (const item of sizes) {
    if (bytes <= 1024) return `${bytes.toFixed(2)} ${item}B`;
    bytes /= 1024;
  }
  return `${bytes} QB`;
};

const timestampToDateLocale = (timestamp: number): string => {
  const options: Intl.DateTimeFormatOptions = {
    dateStyle: "long",
    timeStyle: "long",
  };
  // interpreted as the user's locale
  return new Intl.DateTimeFormat([], options).format(timestamp);
};

export const getCellData = (row: ITableRow, property: TPromptKeys): string => {
  if (property === keyFileName) return row.file_name;
  if (property === keyFileSize) return bytesToSize(row.file_size);
  if (property === keyFilePath) return row.file_path;
  if (property === keyLastModified) return timestampToDateLocale(row.file_lastModified);
  return row[property] ?? "";
};

const makeFileName = (): string => `prompts_${new Date().toISOString().replaceAll(":", "-")}.${exportType()}`;

const downloadFile = (data: string, type: string): void => {
  const blob = new Blob([data], { type });
  const href = URL.createObjectURL(blob);
  const filename = makeFileName();

  const anchor = Object.assign(document.createElement("a"), { href, download: filename });
  anchor.click();
  URL.revokeObjectURL(href);
};

const exportTableByTsv = (header: string[], data: string[][]): string => {
  const _header = header.join("\t");
  const _data = data.map((row) => row.join("\t"));
  return [_header, ..._data].join("\n");
};

const exportTableByJson = (header: string[], data: string[][]): string => {
  const keyValPair = (columns: string[]): Array<[string, string]> => columns.map((col, index) => [header[index], col]);

  const reducer = (entire: Record<string, string>, [key, value]: [string, string]): Record<string, string> =>
    Object.assign(entire, { [key]: value });

  const result = data.map((columns) => keyValPair(columns).reduce(reducer, Object.create(null)));
  return JSON.stringify(result, null, 2);
};

export const exportTable = (): void => {
  const columnsToExport = exportVisibleOnly()
    ? TableColumns.filter((col) => visibleColumns().includes(col))
    : TableColumns;
  const header: string[] = columnsToExport.map((col) => propertyToName[col].replaceAll(" ", ""));
  const data: string[][] = tableRows()
    .filter((row) => tableRowSelected().includes(row.file_name))
    .map((row) => columnsToExport.map((col) => getCellData(row, col)));

  if (exportType() === "tsv") {
    const result = exportTableByTsv(header, data);
    downloadFile(result, "text/csv"); // not typo
    return;
  }

  const result = exportTableByJson(header, data);
  downloadFile(result, "application/json");
};

const parsePrompt = (prompt: string | undefined): TPrompt => {
  if (prompt == null) return {} as TPrompt;

  const arr = prompt.split("\n");
  const _params = arr[2].split(", ").map((param) => param.split(": ")) as Array<[TPromptKeys, string]>;
  const params = _params.reduce((all, [key, val]) => Object.assign(all, { [key]: val }), {});

  return {
    ...params,
    [keyPositive]: arr[0],
    [keyNegative]: arr[1].replace(/^Negative prompt: /, ""),
  } as TPrompt;
};

const createRow = (file: File, path: string, prompt: string | undefined): ITableRow => ({
  ...parsePrompt(prompt),
  file_name: file.name,
  file_path: path,
  file_imgUrl: URL.createObjectURL(file),
  file_lastModified: file.lastModified,
  file_size: file.size,
  file_isEmpty: prompt == null,
});

// ref: https://www.cresco.co.jp/blog/entry/16359/
// ref: https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem
async function scanFolder(items: DataTransferItemList | undefined): Promise<TFileList> {
  if (items == null) return [];

  const fileList: TFileList = []; // 取得したファイルを格納するリスト

  // ファイルスキャン関数
  const traverseFileTree = async (fsEntry: FileSystemEntry): Promise<void> => {
    if (fsEntry.isFile) {
      const file: File = await new Promise((resolve) => (fsEntry as FileSystemFileEntry).file((file) => resolve(file)));
      fileList.push({ file, path: fsEntry.fullPath });
      return;
    }

    const entries: FileSystemEntry[] = await new Promise((resolve) =>
      (fsEntry as FileSystemDirectoryEntry).createReader().readEntries((ent) => resolve(ent))
    );

    for (const item of entries) {
      // 再帰的な関数呼び出し
      await traverseFileTree(item as FileSystemDirectoryEntry);
    }
  };

  for (const item of items) {
    const entry = item.webkitGetAsEntry();
    if (entry == null) continue;
    // ここでドロップされた最初のディレクトリ（or ファイル）を渡す
    await traverseFileTree(entry);
  }
  return fileList;
}

async function handleFilesOnDrop(event: DragEvent): Promise<void> {
  // const files = event.dataTransfer?.files ?? new FileList();
  const files: TFileList = await scanFolder(event.dataTransfer?.items);

  for (const file of files) {
    if (!acceptableTypes.includes(file.file.type)) continue;

    const data = await exifr.parse(file.file);
    setShowTable(true);
    const newRow = createRow(file.file, file.path, data.parameters);
    setTableRows((prev) => [...prev, newRow]);
  }
}

async function handleFilesOnSelect(event: Event): Promise<void> {
  const files = (event.target as HTMLInputElement).files as FileList;

  for (const file of files) {
    if (!acceptableTypes.includes(file.type)) continue;

    const data = await exifr.parse(file);
    setShowTable(true);
    const newRow = createRow(file, "/", data.parameters);
    setTableRows((prev) => [...prev, newRow]);
  }
}

// TODO: move this parser to worker thread
export async function handleFiles(event: Event | DragEvent): Promise<void> {
  event.stopPropagation();
  event.preventDefault();

  setIsDragOver(false);

  if (event instanceof DragEvent) {
    await handleFilesOnDrop(event);
    return;
  }
  await handleFilesOnSelect(event);
}
