import App from "../App.tsx";
import { it, describe } from "vitest";
import { render, RenderResult} from '@testing-library/react';
import '@testing-library/jest-dom';

const testAddTodo = async (todoList: RenderResult, text: string) => {
  const addBtn = await todoList.findByTestId('add');
  const addText = await todoList.findByTestId('newTodoInput');

  (addText as HTMLInputElement).value = text;
  addBtn.click();
};

describe('test code', () => { 
  it('список задач должен быть пустым', async () => {
    const todoList = render(<App />);
    const todoElmts = await todoList.findByTestId('todos');
    expect(todoElmts.querySelectorAll('div').length).toBe(0);
  });

  it('Необходимо создать задачу todo', async () => {
    const todoList = render(<App />);

    await testAddTodo(todoList, "new");

    const todosElmt = await todoList.findByTestId('todos');
    expect(todosElmt.querySelectorAll('div').length).toBe(1);
  });

  it('Задача должна быть удалена при нажатии кнопки удалить', async () => {
    const todoList = render(<App />);

    await testAddTodo(todoList, 'new1');
    await testAddTodo(todoList, 'new2');
    await testAddTodo(todoList, 'new3');

    const todosElmt = await todoList.findByTestId('todos');
    const todoElmtList = await todosElmt.querySelectorAll<HTMLDivElement>('div');

    expect(todoElmtList.length).toBe(3);
    expect(await todoList.findByText('new2')).toBeInTheDocument();
    await todoElmtList[1].querySelector('button')?.click();
    expect(await todoList.findByText('new1')).toBeInTheDocument();
    expect(await todoList.queryByText('new2')).not.toBeInTheDocument();
    expect(await todoList.findByText('new3')).toBeInTheDocument();
  });

});