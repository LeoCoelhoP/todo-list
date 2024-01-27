class listView {
  #parentElement = document.querySelector(".sidebar--list-view");
  #data;
  render(listName) {
    this.#data = listName;
    const markup = this.#generateMarkup(listName);
    this.#parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  createNewList() {
    const listName = prompt("What is the list name?");
    return listName;
  }
  addNewListClickHandler(handler) {
    window.addEventListener("click", function (e) {
      const target = e.target;
      if (!target.className.includes("btn--add-list")) return;
      handler();
    });
  }
  addNewToDoClickHandler(handler) {
    window.addEventListener("click", function (e) {
      const target = e.target;
      if (!target.className.includes("lists-option")) return;
      handler(e.target);
    });
  }

  getTodoInfo() {
    const description = prompt("What is the to do description?");
    const dueDate = prompt("What is the to do due date? eg: day/month/yy");
    const priority = prompt("What is the to do priority? High / Medium / Low");
    return [description, dueDate, priority];
  }

  addOnLoadHandler(handler) {
    window.addEventListener("load", handler);
  }

  clearListContainer() {
    const childrenList = Array.from(this.#parentElement.children);
    childrenList.forEach((child) => {
      if (!child.className.includes("btn--add-list"))
        this.#parentElement.removeChild(child);
    });
  }
  #generateMarkup(listName) {
    return `
      <li class="lists-option">
        <h1 class="lists-option">${listName}</h1>
      </li>
    `;
  }
}

export default new listView();
