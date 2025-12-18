import { renderHook, act } from '@testing-library/react';
import { useTodos } from '../hooks/useTodos';
import '../__mocks__/localStorageMock';

describe('useTodos', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(global, 'crypto', 'get').mockReturnValue({
      randomUUID: () => 'uuid-1',
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('adds, toggles, updates and deletes todos', async () => {
    const { result } = renderHook(() => useTodos());

    await act(async () => {});

    await act(async () => {
      await result.current.addTodo('Task A');
    });
    expect(result.current.todos.length).toBe(1);
    expect(result.current.todos[0].title).toBe('Task A');

    await act(async () => {
      await result.current.toggleTodo('uuid-1');
    });
    expect(result.current.todos[0].completed).toBe(true);

    await act(async () => {
      await result.current.updateTodo({ id: 'uuid-1', title: 'Task A+', completed: true });
    });
    expect(result.current.todos[0].title).toBe('Task A+');

    await act(async () => {
      await result.current.deleteTodo('uuid-1');
    });
    expect(result.current.todos.length).toBe(0);
  });

  test('clearCompleted removes completed items', async () => {
    const { result } = renderHook(() => useTodos());
    await act(async () => {});
    await act(async () => {
      await result.current.addTodo('A');
    });
    await act(async () => {
      await result.current.addTodo('B');
    });
    // toggle first to completed
    await act(async () => {
      await result.current.toggleTodo('uuid-1');
    });
    // clear completed
    await act(async () => {
      await result.current.clearCompleted();
    });
    expect(result.current.todos.find((t) => t.completed)).toBeUndefined();
  });
});
