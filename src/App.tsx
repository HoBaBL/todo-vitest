import { FC, useRef, useState } from "react";
import style from './App.module.css'
import { FaCheck, FaTrash } from "react-icons/fa6";

interface todosType {
    id:number,
    text:string,
    completed:boolean
}

const App:FC = () => {
    
  const [todos, setTodos] = useState<todosType[]>([]) /// главный массив где хранятся все задачи
  const [todosClone, setTodosClone] = useState<todosType[]>([]) /// массив, который мы выводим и изменяем
  const inputRef = useRef<HTMLInputElement>(null);/// сюда пишется текст
  const filter = ["All", "Active", "Completed"] /// для фильтр кнопок
  const [btnFilter, setBtnFilter] = useState('All') /// какая фильтр кнопка сейчас нажата

  /// Функция добавления задачи в массив
  function AddTodos() {
    if (inputRef.current !== null) {
        const copy = [...todos]
        const obj = {
            id:Math.random(),
            text: inputRef.current.value,
            completed: false
        }
  
        copy.unshift(obj)
        setTodosClone(copy)
        setTodos(copy)
        inputRef.current.value = ""
    }
  }
  /// Функция чека
  function CheckTodos(id:number) {
      const copy = [...todos]
      copy.map(todo => {
          if (todo.id === id) {
              todo.completed = !todo.completed
          }
      })
      setTodos(copy)
  }
  /// считает сколько задач ещё нужно сделать
  let sum = 0
  todos.map(todo => {
      if (todo.completed === false) {
          sum++
      }
  })
  /// фильтруем массив и записываем полученное значение в другой массив, чтобы ничего не пропало 
  function filterTodos(item:string) {
      const copyTodo = [...todos]
      setBtnFilter(item)
      if (item === "All") {
          setTodosClone(todos)
      } else if (item === "Active") {
          const copy = copyTodo.filter((check) => check.completed === false)
          setTodosClone(copy)
      } else if (item === "Completed") {
          const copy = copyTodo.filter((check) => check.completed === true)
          setTodosClone(copy)
      }
  }
  //// добавление задачи с помощью enter
    const something=(event: React.KeyboardEvent)=> {
        if (event.keyCode === 13) {
            AddTodos()
        }   
    }
    //// delete todo
    function deleteTodo(id:number) {
        const copy = [...todos]
        const deletArr = copy.filter((item) => item.id !== id)
        setTodosClone(deletArr)
        setTodos(deletArr)
    }
    // value={task} onChange={(event) => setTask(event.target.value)}
  return (
    <div className={style.home}>
      <div className={style.header}>
          <h1 className={style.headerText}>TODO</h1>
          <div className={style.headerFlex}>
              <input data-testid="newTodoInput" onKeyDown={(e) => something(e)} ref={inputRef} className={style.input} type="text" placeholder="Create a new todo..."/>
              <button data-testid="add" onClick={() => AddTodos()} className={style.btnHeader}>Add</button>
          </div>
      </div>
      <div className={style.main}>
        <div data-testid="todos">
            { todosClone.length > 0 ?
                todosClone.map((todo) => 
                    <div data-testid="todo" className={style.boxTodo} key={todo.id}>
                        <span className={style.boxTodoflex}>
                            <span className={style.circle} onClick={() => CheckTodos(todo.id) }>
                                {todo.completed ? <FaCheck className={style.check} size={14}/> : ""}
                            </span>
                            <p className={todo.completed ? style.textMainCopleted : style.textMain}>{todo.text}</p>
                        </span>
                        <button data-testid="delete" className={style.btnDelete} onClick={() => deleteTodo(todo.id)}><FaTrash size={17}/></button>
                    </div>
            )
            :
            ''
            }
        </div>
          <div className={style.footer}>
              <p className={style.footerText}>{sum} items left</p>
              <div className={style.footerFlex}>
                  { filter.map((item) => 
                      <button onClick={() => filterTodos(item)} key={item} className={btnFilter === item ? style.footerBtnActive : style.footerBtn}>{item}</button>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
}

export default App;
