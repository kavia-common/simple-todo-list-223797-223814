import { env, useMock } from '../config/env';

const STORAGE_KEY = 'todo_app_v1';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * PUBLIC_INTERFACE
 * api - Provides async list/create/update/remove methods.
 * Uses localStorage when API_BASE is empty; otherwise would call real backend.
 */
export const api = {
  async list() {
    if (useMock) {
      await sleep(10);
      const raw = localStorage.getItem(STORAGE_KEY);
      try {
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }
    const res = await fetch(`${env.API_BASE}/todos`);
    if (!res.ok) throw new Error('Failed to fetch todos');
    return res.json();
  },

  async create(todo) {
    if (useMock) {
      await sleep(10);
      const raw = localStorage.getItem(STORAGE_KEY);
      const items = raw ? JSON.parse(raw) : [];
      const created = { ...todo };
      const next = [created, ...items];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return created;
    }
    const res = await fetch(`${env.API_BASE}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    });
    if (!res.ok) throw new Error('Failed to create todo');
    return res.json();
  },

  async update(todo) {
    if (useMock) {
      await sleep(10);
      const raw = localStorage.getItem(STORAGE_KEY);
      const items = raw ? JSON.parse(raw) : [];
      const next = items.map((t) => (t.id === todo.id ? { ...t, ...todo } : t));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return todo;
    }
    const res = await fetch(`${env.API_BASE}/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    });
    if (!res.ok) throw new Error('Failed to update todo');
    return res.json();
  },

  async remove(id) {
    if (useMock) {
      await sleep(10);
      const raw = localStorage.getItem(STORAGE_KEY);
      const items = raw ? JSON.parse(raw) : [];
      const next = items.filter((t) => t.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { success: true };
    }
    const res = await fetch(`${env.API_BASE}/todos/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete todo');
    return { success: true };
  },
};
