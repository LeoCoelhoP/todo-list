import contentView from "./views/contentView.js";
import listsView from "./views/listsView.js";
import Todo from "./Todo";
import "./css/containers.css";
import "./css/menu.css";
import "./css/todoCard.css";

class controller {
  #parentElement = document.querySelector(".content--container");
  constructor() {
    this.createObjectToDo();
  }

  // Storage controller

  // Retrive data from local storage
  retrieveLocalStorage(type = "list") {
    const Lists = [];
    const ToDos = [];

    const allKeys = Object.keys(localStorage);
    const localStorageData = allKeys.map((key, i) => {
      let data;
      try {
        data = JSON.parse(localStorage.getItem(key));
      } catch (err) {
        data = localStorage.getItem(key);
      }

      key.length < 10 ? Lists.push(data) : ToDos.push(data);
    });
    return type === "todo" ? ToDos : Lists;
  }

  // Add data from local storage
  addToLocalStorage(key = "Lists", object) {
    const stringifiedObject = JSON.stringify(object);
    localStorage.setItem(key, stringifiedObject);
  }

  // Remove data from local storage
  removeFromLocalStorage(key) {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error(err);
    }
  }

  // To do Controller

  // Create to do object
  createObjectToDo() {
    const toDoArray = this.retrieveLocalStorage("todo");
    toDoArray.forEach(
      (todo) =>
        new Todo(todo.title, todo.description, todo.dueDate, todo.priority)
    );
    this.renderAllToDos(toDoArray);
  }
  removeToDo(id) {
    toDoManager.removeFromLocalStorage(id);
    toDoManager.renderAllToDos(toDoManager.retrieveLocalStorage("todo"));
  }
  // Render all to do objects
  renderAllToDos(toDoArray) {
    contentView.clearContentContainer();
    toDoArray.forEach((todo) => contentView.render(todo));
  }

  // List Controller

  // Add new list
  addNewList() {
    const listName = listsView.createNewList();
    const listArray = toDoManager.retrieveLocalStorage("list");
    const uniqueLists = new Set(listArray);
    if (uniqueLists.has(listName)) return;
    const stringifiedListName = JSON.stringify(listName);
    toDoManager.addToLocalStorage(listName, listName);
    listsView.render(listName);
  }

  renderAllList() {
    const listArray = toDoManager.retrieveLocalStorage("list");
    const uniqueLists = new Set(listArray);
    uniqueLists.forEach((element) => {
      const listName = element.replaceAll("'", "").replaceAll('"', "");
      listsView.render(listName);
    });
  }
}

// Home, Today and Week Logic

window.addEventListener("click", function (e) {
  if (e.target.className !== "sidebar--menu-options") return;

  if (e.target.textContent === "Home") {
    toDoManager.createObjectToDo();
    return;
  }
  const toBeDisplayed = [];
  const date = new Date();

  if (e.target.textContent === "Today") {
    const yearNow = +date.getFullYear().toString().replace("20", "");
    const monthNow = +date.getMonth() + 1;
    const dayNow = +date.getDate();
    toDoManager.retrieveLocalStorage("todo").forEach((todo) => {
      const [day, month, year] = todo.dueDate.split("/", 3);
      if ((yearNow === +year, monthNow === +month, dayNow === +day))
        toBeDisplayed.push(todo);
    });
  }
  if (e.target.textContent === "Week") {
    toDoManager.retrieveLocalStorage("todo").forEach((todo) => {
      const [day, month, year] = todo.dueDate.split("/");
      const toDoDate = new Date(year, month, day);
      const today = new Date();
      const difference = new Date(
        Math.floor(today.getTime() - toDoDate.getTime())
      );
      if (difference.getDate() - 1 >= 7) toBeDisplayed.push(todo);
    });
  }
  const toBeDisplayedUniques = new Set(toBeDisplayed);
  toDoManager.renderAllToDos(toBeDisplayedUniques);
});

// Initialization

const toDoManager = new controller();

const createTodo = function (target) {
  const toDoInfo = listsView.getTodoInfo();
  const todo = new Todo(
    target.textContent,
    toDoInfo[0],
    toDoInfo[1],
    toDoInfo[2]
  );
  toDoManager.addToLocalStorage(todo.id, todo);
  toDoManager.createObjectToDo();
};

listsView.addNewListClickHandler(toDoManager.addNewList);
listsView.addOnLoadHandler(toDoManager.renderAllList);
listsView.addNewToDoClickHandler(createTodo);
contentView.addCheckClickHandler(toDoManager.removeToDo);
