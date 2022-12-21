import { House } from "@suid/icons-material";
import { Box, Paper, Typography } from "@suid/material";
import { JSX } from "solid-js";
import githubLogo from "./github-mark.svg";
import { UploadForm } from "./UploadForm";

export const Introduction = (): JSX.Element => {
  return (
    <>
      <Paper
        elevation={4}
        class="introduction"
      >
        <Box>
          <Typography
            variant="h1"
            gutterBottom
            sx={{ fontSize: "3rem" }}
          >
            Prompt Viewer
          </Typography>
          <Typography
            variant="h2"
            gutterBottom
            sx={{ fontSize: "1.4rem" }}
          >
            for Stable Diffusion WebUI
          </Typography>
        </Box>
        <UploadForm />
        <Box
          sx={{
            display: "grid",
            gap: "2rem",
            marginTop: "1rem",
            width: "100%",
            gridColumn: "span 2",
          }}
        >
          <Paper
            sx={{
              padding: "1rem",
            }}
          >
            <p>This tool extracts and shows the embedded prompts in the generated images.</p>
            <ul>
              <li>Select your PNG images from the button above or drop them into anywhere this window.</li>
              <li>If the image has no prompt information, table cells are displayed in gray.</li>
              <li>You can export data to TSV (like CSV, but uses Tab) or JSON.</li>
            </ul>
          </Paper>
          <Paper class="links">
            <a href="https://mo-san.github.io/">
              <House />
            </a>
            <a href="https://github.com/mo-san/prompt-viewer/">
              <img
                src={githubLogo}
                alt="GitHub logo"
              />
            </a>
          </Paper>
        </Box>
      </Paper>
    </>
  );
};
