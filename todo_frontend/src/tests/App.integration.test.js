import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import '../__mocks__/localStorageMock';

function addTodo(title) {
  const input = screen.getByLabelText(/new todo title/i);
  fireEvent.change(input, { target: { value: title } });
  fireEvent.click(screen.getByRole('button', { name: /add todo/i }));
}

describe('App Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders header and empty state', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText(/No todos yet/i)).toBeInTheDocument();
  });

  test('add, toggle, edit with Enter/Escape, delete, and clear completed', () => {
    render(<App />);

    addTodo('Write tests');
    addTodo('Build feature');

    expect(screen.getByText('Write tests')).toBeInTheDocument();
    expect(screen.getByText('Build feature')).toBeInTheDocument();

    // toggle first
    const firstCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(firstCheckbox);
    expect(firstCheckbox).toBeChecked();

    // edit second todo
    const secondText = screen.getByText('Build feature');
    // start edit via keyboard Enter
    secondText.focus();
    fireEvent.keyDown(secondText, { key: 'Enter', code: 'Enter' });
    const editor = screen.getByLabelText(/edit todo/i);
    fireEvent.change(editor, { target: { value: 'Build feature v2' } });
    // cancel with Esc
    fireEvent.keyDown(editor, { key: 'Escape', code: 'Escape' });
    expect(screen.getByText('Build feature')).toBeInTheDocument();

    // edit again and save with Enter
    fireEvent.keyDown(secondText, { key: 'Enter', code: 'Enter' });
    const editor2 = screen.getByLabelText(/edit todo/i);
    fireEvent.change(editor2, { target: { value: 'Build feature v3' } });
    fireEvent.keyDown(editor2, { key: 'Enter', code: 'Enter' });
    expect(screen.getByText('Build feature v3')).toBeInTheDocument();

    // delete first
    const deleteButtons = screen.getAllByRole('button', { name: /delete todo/i });
    fireEvent.click(deleteButtons[0]);
    expect(screen.queryByText('Write tests')).not.toBeInTheDocument();

    // clear completed (none now)
    fireEvent.click(screen.getByRole('button', { name: /clear completed/i }));
    expect(screen.getByText('Build feature v3')).toBeInTheDocument();
  });
});
