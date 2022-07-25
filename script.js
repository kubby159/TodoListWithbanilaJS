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
    const { id, content, completed } = item;
    const $todoItem = document.createElement("div");
    const isChecked = completed ? "checked" : "";
    $todoItem.classList.add("item");
    $todoItem.dataset.id = id;
    $todoItem.innerHTML = `
            <div class="content">
              <input
                type="checkbox"
                class='todo_checkbox'
                ${isChecked} 
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

  // !toggleTodo
  const toggleTodo = (e) => {
    if (e.target.className !== "todo_checkbox") return;
    const $item = e.target.closest(".item");
    const id = $item.dataset.id;
    const completed = e.target.checked;
    fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    })
      .then(getTodos)
      .catch((error) => console.error(error));
  };

  // !changeEditMode
  const changeEditMode = (e) => {
    const $item = e.target.closest(".item");
    const $label = $item.querySelector("label");
    const $editInput = $item.querySelector('input[type="text"]');
    const $contentButton = $item.querySelector(".content_buttons");
    const $editButton = $item.querySelector(".edit_buttons");
    const value = $editInput.value;
    if (e.target.className === "todo_edit_button") {
      $label.style.display = "none";
      $editInput.style.display = "block";
      $contentButton.style.display = "none";
      $editButton.style.display = "block";
      $editInput.focus();
      $editInput.value = "";
      $editInput.value = value;
    }

    if (e.target.className === "todo_edit_cancel_button") {
      $label.style.display = "block";
      $editInput.style.display = "none";
      $contentButton.style.display = "block";
      $editButton.style.display = "none";
      $editInput.value = $label.innerText;
    }
  };

  // !editTodo
  const editTodo = (e) => {
    if (e.target.className !== "todo_edit_confirm_button") return;
    const $item = e.target.closest(".item");
    const id = $item.dataset.id;
    const editInput = $item.querySelector('input[type="text"]');
    const content = editInput.value;

    fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    })
      .then(getTodos)
      .catch((error) => console.error(error));
  };

  const init = () => {
    window.addEventListener("DOMContentLoaded", () => {
      getTodos();
    });
    $form.addEventListener("submit", addTodo);
    $todos.addEventListener("click", toggleTodo);
    $todos.addEventListener("click", changeEditMode);
    $todos.addEventListener("click", editTodo);
  };
  init();
})();
