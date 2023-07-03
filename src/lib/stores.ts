import { writable } from 'svelte/store';

export const search_address = writable(null);

// UI
export const show_modal = writable(false);
export const toasts = writable([]);
