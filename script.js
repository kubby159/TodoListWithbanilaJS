(function () {
  "use strict";

  const get = (target) => {
    return document.querySelector(target);
  };

  const API_URL = "http://localhost:3001/todos";
  const $todos = get(".todos");
  const $form = get(".todo_form");
  const $todoInput = get(".todo_input");

  const createTodoElement = (item) => {
    const { id, content } = item;
    const $todoItem = document.createElement("div");
    $todoItem.classList.add("item");
    $todoItem.dataset.id = id;
    $todoItem.innerHTML = `
            <div class="content">
              <input
                type="checkbox"
                class='todo_checkbox' 
              />
              <label>${content}</label>
              <input type="text" value="${content}" />
            </div>
            <div class="item_buttons content_buttons">
              <button class="todo_edit_button">
                <i class="far fa-edit"></i>
              </button>
              <button class="todo_remove_button">
                <i class="far fa-trash-alt"></i>
              </button>
            </div>
            <div class="item_buttons edit_buttons">
              <button class="todo_edit_confirm_button">
                <i class="fas fa-check"></i>
              </button>
              <button class="todo_edit_cancel_button">
                <i class="fas fa-times"></i>
              </button>
            </div>
      `;
    return $todoItem;
  };

  //! renderAllTodos

  const renderAllTodos = (todos) => {
    $todos.innerHTML = ""; //초기화
    todos.forEach((item) => {
      const todoElement = createTodoElement(item);
      $todos.appendChild(todoElement);
    });
  };

  //! getTodos
  const getTodos = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((todos) => renderAllTodos(todos))
      .catch((error) => console.error(error));
  };

  // ! addTodo

  const addTodo = (e) => {
    e.preventDefault();
    // fetch 이용해서 input value 전송하기
    const todo = {
      content: $todoInput.value,
      completed: false,
    };
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    })
      .then(getTodos)
      .then(() => {
        $todoInput.value = "";
        $todoInput.focus();
      })
      .catch((error) => console.error(error));
  };

  const init = () => {
    window.addEventListener("DOMContentLoaded", () => {
      getTodos();
    });
    $form.addEventListener("submit", addTodo);
  };
  init();
})();
