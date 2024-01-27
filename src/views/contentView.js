class contentView {
  #parentElement = document.querySelector(".content--container");
  #data;
  render(data) {
    this.#data = data;
    const markup = this.#generateMarkup();
    this.#parentElement.insertAdjacentHTML("beforeend", markup);
  }

  addCheckClickHandler(handler) {
    window.addEventListener("click", function (e) {
      const target = e.target;
      if (!(target.className === "btn--close")) return;

      const todo = target.closest(".todo-card");
      handler(todo.dataset.id);
    });
  }
  clearContentContainer() {
    this.#parentElement.innerHTML = "";
  }
  #generateMarkup() {
    const todo = this.#data;

    return `
    <div class="todo-card ${todo.priority}" data-id="${todo.id}">
      <div class="todo-card-labels">
        <p class=".list-title">${todo.title}</p>
        <p class=".card-description">${todo.description}</p>
        <p class=".card-due-date">${todo.dueDate}</p>
      </div>
      <div class="todo-card-options">
        <div class="btn--close">✔</div>

    </div>
    `;
  }
}

export default new contentView();
