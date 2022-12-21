import { JSX, Show } from "solid-js";
import { thresholdSmallScreen, windowSize } from "./constants";
import { handleFiles } from "./utils";

export const UploadForm = (): JSX.Element => {
  return (
    <>
      <label
        classList={{
          upload: true,
        }}
      >
        <span>Open Images</span>
        <Show when={windowSize().width > thresholdSmallScreen}>
          <span>or Drop Here</span>
        </Show>
        <input
          type="file"
          accept=".jpg, .jpeg, .png"
          multiple={true}
          // webkitdirectory={true}
          onChange={async (event) => await handleFiles(event)}
        />
      </label>
    </>
  );
};
