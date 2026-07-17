import { describe, expect, it } from "vitest";
import {
  synchronizeWhatsAppMode,
  type WhatsAppModeSelection,
} from "./whatsapp-mode";

describe("synchronizeWhatsAppMode", () => {
  it("tracks configured mode across an A to B to A cycle", () => {
    let selection: WhatsAppModeSelection = {
      configuredMode: "bot",
      value: "bot",
    };

    selection = { ...selection, value: "self-chat" };
    selection = synchronizeWhatsAppMode(selection, "self-chat");
    expect(selection).toEqual({
      configuredMode: "self-chat",
      value: "self-chat",
    });

    selection = synchronizeWhatsAppMode(selection, "bot");
    expect(selection).toEqual({ configuredMode: "bot", value: "bot" });
  });

  it("falls back to bot when configuration is removed", () => {
    const selection: WhatsAppModeSelection = {
      configuredMode: "self-chat",
      value: "self-chat",
    };

    expect(synchronizeWhatsAppMode(selection, null)).toEqual({
      configuredMode: null,
      value: "bot",
    });
  });

  it("preserves object identity when already synchronized", () => {
    const selection: WhatsAppModeSelection = {
      configuredMode: "bot",
      value: "self-chat",
    };

    expect(synchronizeWhatsAppMode(selection, "bot")).toBe(selection);
  });
});
