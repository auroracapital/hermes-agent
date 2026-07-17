export type WhatsAppMode = "bot" | "self-chat";

export interface WhatsAppModeSelection {
  configuredMode: WhatsAppMode | null;
  value: WhatsAppMode;
}

export function synchronizeWhatsAppMode(
  selection: WhatsAppModeSelection,
  configuredMode: WhatsAppMode | null,
): WhatsAppModeSelection {
  if (selection.configuredMode === configuredMode) return selection;
  return {
    configuredMode,
    value: configuredMode ?? "bot",
  };
}
