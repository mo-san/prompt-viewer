import { ErrorBoundary, onMount, Show } from "solid-js";
import { clsDropZone, isDev, isDragOver, setIsDragOver, setWindowSize, showTable } from "./constants";
import { DataTable } from "./DataTable";
import { Debug } from "./Debug";
import { Header } from "./Header";
import { Introduction } from "./Introduction";
import { handleFiles } from "./utils";
import type { Component } from "solid-js";

const onDragEnter = (event: DragEvent): void => {
  event.stopPropagation();
  event.preventDefault();

  const target = event.target as HTMLElement;
  if (!target.classList.contains(clsDropZone)) return;
  setIsDragOver(true);
};

const onDragLeave = (event: DragEvent): void => {
  event.stopPropagation();
  event.preventDefault();

  const target = event.target as HTMLElement;
  if (!target.classList.contains(clsDropZone)) return;
  setIsDragOver(false);
};

const updateWindowSize = (): void => {
  setWindowSize({ width: window.innerWidth, height: window.innerHeight });
};

export const App: Component = () => {
  onMount(() => {
    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);
  });

  return (
    <>
      <Show when={isDev}>
        <Debug />
      </Show>
      <main
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={handleFiles}
        onDragOver={(event) => event.preventDefault()}
        class={`main ${clsDropZone}`}
        classList={{
          isDragOver: isDragOver(),
          showTable: showTable(),
        }}
      >
        <Show
          when={showTable()}
          fallback={<Introduction />}
        >
          <ErrorBoundary fallback={<div>Error</div>}>
            <Header />
            <DataTable />
          </ErrorBoundary>
        </Show>
      </main>
    </>
  );
};
