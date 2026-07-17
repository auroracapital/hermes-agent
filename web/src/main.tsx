import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { SystemActionsProvider } from "./contexts/SystemActions";
import { I18nProvider } from "./i18n";
import { exposePluginSDK } from "./plugins";
import { ThemeProvider } from "./themes";
import { HERMES_BASE_PATH } from "./lib/api";
import { shouldReloadAfterPreloadError } from "./lib/preload-recovery";

const PRELOAD_RELOAD_KEY = "hermes.preloadReloadAt";
let preloadReloadRequested = false;

// An open dashboard tab can outlive a Hermes update. Its old HTML may then
// request a lazy route chunk whose hashed filename no longer exists. Vite
// emits this event before rejecting the import; reload once to fetch the new
// HTML/manifest, with a cooldown so a genuine asset outage cannot reload-loop.
window.addEventListener("vite:preloadError", (event) => {
  if (preloadReloadRequested) return;
  let lastReloadAt: number | null = null;
  try {
    const stored = sessionStorage.getItem(PRELOAD_RELOAD_KEY);
    if (stored !== null) lastReloadAt = Number(stored);
  } catch {
    // Privacy mode: the in-memory guard still prevents duplicate reloads.
  }

  const now = Date.now();
  if (!shouldReloadAfterPreloadError(lastReloadAt, now)) return;

  event.preventDefault();
  preloadReloadRequested = true;
  try {
    sessionStorage.setItem(PRELOAD_RELOAD_KEY, String(now));
  } catch {
    // ignore
  }
  window.location.reload();
});

// Expose the plugin SDK before rendering so plugins loaded via <script>
// can access React, components, etc. immediately.
exposePluginSDK();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={HERMES_BASE_PATH || undefined}>
    <I18nProvider>
      <ThemeProvider>
        <SystemActionsProvider>
          <App />
        </SystemActionsProvider>
      </ThemeProvider>
    </I18nProvider>
  </BrowserRouter>,
);
