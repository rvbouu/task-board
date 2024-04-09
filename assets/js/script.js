// Retrieve tasks and nextId from localStorage
// let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
// let nextId = JSON.parse(localStorage.getItem("nextId"));
const taskName = $("#name");
const taskDueDate = $("#taskDueDate");
const taskContent = $("#content");
const taskLanes = $(".swim-lanes");
const taskForm = $("#formModal");

function readTasksFromStorage() {
  let stringData = localStorage.getItem("tasks");
  let taskList = JSON.parse(stringData) || [];
  return taskList;
}

function readNextIdFromStorage() {
  let stringData = localStorage.getItem("nextId");
  let nextId = JSON.parse(stringData);
  return nextId;
}

function saveTasksToStorage(taskList) {
  let savedTasks = JSON.stringify(taskList);
  localStorage.setItem("tasks", savedTasks);
}
// Todo: create a function to generate a unique task id
function generateTaskId() {
  let id = crypto.randomUUID();
  return id;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  // creates new section aka 'task card'
  const taskCard = $("<section>");
  // adds card, task-card, draggable, and my-3 class
  taskCard.addClass("card task-card draggable my-3");
  // add task id under data-task-id attribute
  taskCard.attr("data-task-id", task.id);

  // creates h4 for task title
  const header = $("<h4>");
  // adds card-header and h4 class and task title as text
  header.addClass("card-header h4").text(task.name);

  // creates div for body of card
  const body = $("<div>");
  // adds card-body class
  body.addClass("card-body");

  // creates p tag for task description
  const content = $("<p>");
  // adds card-text class and task content as text
  content.addClass("card-text").text(task.content);

  // creates p tag for due date
  const dueDate = $("<p>");
  // adds card-text class and due date as text
  dueDate.addClass("card-text").text(task.dueDate);

  // creates button for delete button
  const deleteBtn = $("<button>");
  // adds btn, btn-danger, and delete class
  // adds 'Delete' as text
  // adds task id under data-task-id attribute
  deleteBtn
    .addClass("btn btn-danger delete")
    .text("Delete")
    .attr("data-task-id", task.id);

  // sets card background depending on due date. Only applies if dueDate exists and status is not done.
  if (task.dueDate && task.status !== "done") {
    const now = dayjs();
    const taskDueDate = dayjs(task.dueDate, "DD/MM/YYYY");

    // makes card red if overdue; makes card yellow if due today
    if (now.isSame(taskDueDate, "day")) {
      taskCard.addClass("bg-warning text-white");
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass("bg-danger text-white");
      deleteBtn.addClass("border-light");
    }
  }

  content.appendTo(body);
  dueDate.appendTo(body);
  deleteBtn.appendTo(body);

  header.appendTo(taskCard);
  body.appendTo(taskCard);

  return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  const taskList = readTasksFromStorage();

  const todoList = $("#todo-cards");
  todoList.empty();

  const inProgressList = $("#in-progress-cards");
  inProgressList.empty();

  const doneList = $("#done-cards");
  doneList.empty();

  // loops through taskList and creates task cards for each status
  for (let task of taskList) {
    if (task.status == "to-do") {
      createTaskCard(task).appendTo(todoList);
    } else if (task.status == "in-progress") {
      createTaskCard(task).appendTo(inProgressList);
    } else if (task.status == "done") {
      createTaskCard(task).appendTo(doneList);
    }
  }
  // Uses jQuery UI to make task cards draggable
  $(".draggable").draggable({
    opacity: 0.7,
    zIndex: 100,

    // creates clone of card being dragged (visual only)
    helper: function (e) {
      // checks whether target of drag is card itself or child element. If card itself, clone it, else find parent card that is draggable and clone that.
      const original = $(e.target).hasClass("ui-draggable")
        ? $(e.target)
        : $(e.target).closest(".ui-draggable");
      // returns clone with same width as original card
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const name = taskName.val();
  const dueDate = taskDueDate.val();
  const content = taskContent.val();

  const newTask = {
    id: generateTaskId(),
    name: name,
    dueDate: dueDate,
    content: content,
    status: "to-do",
  };
  const taskList = readTasksFromStorage();
  taskList.push(newTask);

  saveTasksToStorage(taskList);

  renderTaskList();

  taskName.val("");
  taskDueDate.val("");
  taskContent.val("");
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  const taskId = $(this).attr("data-task-id");
  const taskList = readTasksFromStorage();

  // forEach loop to remove task with matching id
  taskList.forEach((task, i) => {
    if (task.id == taskId) {
      taskList.splice(i, 1);
    }
  });

  // saves updated taskList to localStorage
  saveTasksToStorage(taskList);

  // renders updated taskList
  renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  // gets taskList from localStorage
  const taskList = readTasksFromStorage();

  // gets task id from the event
  const taskId = ui.draggable[0].dataset.taskId;

  // gets the id of the lane that the card was dropped into
  const newStatus = event.target.id;

  for (let task of taskList) {
    // finds task card by id and updates status
    if (task.id === taskId) {
      task.status = newStatus;
    }
  }

  // saves updated tasks array to localStorage and renders new data
  saveTasksToStorage(taskList);

  renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
taskForm.on("click", ".add-task-btn", function (e) {
  e.preventDefault();
  handleAddTask();
  taskForm.modal("hide");
});

taskLanes.on("click", ".delete", handleDeleteTask);

$(document).ready(function () {
  // renders tasks if there is any
  renderTaskList();

  // allows due date month/year to be changed with drop down menus
  $("#taskDueDate").datepicker({
    changeMonth: true,
    changeYear: true,
  });

  // makes lanes droppable
  $(".lane").droppable({
    accept: ".draggable",
    drop: handleDrop,
  });
});
