import { openUrl } from "@tauri-apps/plugin-opener";

export const FEEDBACK_URL = "https://forms.gle/g9yAdopshj77kERC7";

/** Open the feedback form in the system browser (Tauri) or a new tab (web). */
export async function openFeedback(): Promise<void> {
  try {
    await openUrl(FEEDBACK_URL);
  } catch {
    window.open(FEEDBACK_URL, "_blank", "noopener,noreferrer");
  }
}
