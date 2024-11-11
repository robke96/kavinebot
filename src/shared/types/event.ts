import type { Events } from "discord.js";

export interface EventI {
    name: string | Events;
    once?: boolean;
    isEnabled: boolean;
    execute: (...args: any[]) => void;
}