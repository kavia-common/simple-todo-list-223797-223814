import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';

const STORAGE_KEY = 'todo_app_v1';

/**
 * PUBLIC_INTERFACE
 * useTodos - Hook to manage todos with CRUD operations and persistence.
 */
export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const list = await api.list();
      setTodos(list);
    } catch (e) {
      console.error(e);
      setError('Failed to load todos.');
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        setTodos(raw ? JSON.parse(raw) : []);
      } catch {
        setTodos([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addTodo = useCallback(async (title) => {
    const newTodo = { id: (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now())), title, completed: false };
    const created = await api.create(newTodo);
    setTodos((prev) => {
      const updated = [created, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateTodo = useCallback(async (todo) => {
    const updated = await api.update(todo);
    setTodos((prev) => {
      const next = prev.map((t) => (t.id === todo.id ? updated : t));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleTodo = useCallback(async (id) => {
    const current = todos.find((t) => t.id === id);
    if (!current) return;
    await updateTodo({ ...current, completed: !current.completed });
  }, [todos, updateTodo]);

  const deleteTodo = useCallback(async (id) => {
    await api.remove(id);
    setTodos((prev) => {
      const next = prev.filter((t) => t.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearCompleted = useCallback(async () => {
    const active = todos.filter((t) => !t.completed);
    const completed = todos.filter((t) => t.completed);
    await Promise.all(completed.map((t) => api.remove(t.id)));
    setTodos(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(active));
      return active;
    });
  }, [todos]);

  return {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
  };
}
