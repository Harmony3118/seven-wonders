import type { Identity } from "@/types";

const KEY = 'seven-wonders-identity'

export function saveIdentity(identity: Identity): void {
    localStorage.setItem(KEY, JSON.stringify(identity))
}

export function loadIdentity(): Identity | null {
    try {
        const raw = localStorage.getItem(KEY)
        return raw ? (JSON.parse(raw) as Identity) : null
    } catch {
        return null
    }
}

export function clearIdentity(): void {
    localStorage.removeItem(KEY)
}