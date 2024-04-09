// getting inputs from modal form
const taskName = $('#name');
const taskDueDate = $('#taskDueDate');
const taskContent = $('#content');

// creating variables click and drag/drop events
const taskLanes = $('.swim-lanes'); // DOM element for task lanes
const taskForm = $('#formModal'); // DOM element for modal form

// function to read info from localStorage, parse it, and return it
function readTasksFromStorage() {
  let stringData = localStorage.getItem('tasks');
  let taskList = JSON.parse(stringData) || [];
  return taskList;
}

// Not sure what this function/variable was for but wasn't needed in my code
// function readNextIdFromStorage() {
//   let stringData = localStorage.getItem('nextId');
//   let nextId = JSON.parse(stringData);
//   return nextId;
// }

// function to stringify array of objects and save to localStorage
function saveTasksToStorage(taskList) {
  let savedTasks = JSON.stringify(taskList);
  localStorage.setItem('tasks', savedTasks);
}
// function creating random id with crypto tool and returning it
function generateTaskId() {
  let id = crypto.randomUUID();
  return id;
}

// function to create task cards
function createTaskCard(task) {
  // creates new section aka 'task card'
  const taskCard = $('<section>');
  // adds 'card', 'task-card', 'draggable', and 'my-3' classes
  taskCard.addClass('card task-card draggable my-3');
  // add task id under 'data-task-id' attribute
  taskCard.attr('data-task-id', task.id);

  // creates h4 for task title
  const header = $('<h4>');
  // adds 'card-header' and 'h4' class and task title as text
  header.addClass('card-header h4').text(task.name);

  // creates div for body of card
  const body = $('<div>');
  // adds 'card-body' class
  body.addClass('card-body');

  // creates p tag for task description
  const content = $('<p>');
  // adds 'card-text' class and task content as text
  content.addClass('card-text').text(task.content);

  // creates p tag for due date
  const dueDate = $('<p>');
  // adds 'card-text' class and due date as text
  dueDate.addClass('card-text').text(task.dueDate);

  // creates button for delete button
  const deleteBtn = $('<button>');
  // adds 'btn', 'btn-dange'r, and 'delete' class
  // adds 'Delete' as text
  // adds task id under 'data-task-id' attribute
  deleteBtn
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-task-id', task.id);

  // sets card background depending on due date. Only applies if dueDate exists and status is not done.
  if (task.dueDate && task.status !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

    // makes card red if overdue; makes card yellow if due today
    if (now.isSame(taskDueDate, 'day')) {
      taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass('bg-danger text-white');
      deleteBtn.addClass('border-light');
    }
  }
  // appending task content, due date, and delete button to body of task card
  content.appendTo(body);
  dueDate.appendTo(body);
  deleteBtn.appendTo(body);
  // appending task title and task body to task card
  header.appendTo(taskCard);
  body.appendTo(taskCard);
  // returns task card
  return taskCard;
}

// function that renders task list and makes cards draggable 
function renderTaskList() {
  // gets data from localStorage
  const taskList = readTasksFromStorage();

  // Empties existing project cards from lanes
  const todoList = $('#todo-cards');
  todoList.empty();

  const inProgressList = $('#in-progress-cards');
  inProgressList.empty();

  const doneList = $('#done-cards');
  doneList.empty();

  // loops through taskList array and creates task cards for each status
  for (let task of taskList) {
    if (task.status == 'to-do') {
      createTaskCard(task).appendTo(todoList);
    } else if (task.status == 'in-progress') {
      createTaskCard(task).appendTo(inProgressList);
    } else if (task.status == 'done') {
      createTaskCard(task).appendTo(doneList);
    }
  }
  // Uses jQuery UI to make task cards draggable
  $('.draggable').draggable({
    opacity: 0.7,
    zIndex: 100,

    // creates clone of card being dragged (visual only)
    helper: function (e) {
      // checks whether target of drag is card itself or child element. If card itself, clone it, else find parent card that is draggable and clone that.
      const original = $(e.target).hasClass('ui-draggable')
        ? $(e.target)
        : $(e.target).closest('.ui-draggable');
      // returns clone with same width as original card
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}

// function to handle adding new tasks
function handleAddTask() {
  // assigns values from form inputs to variables
  const name = taskName.val();
  const dueDate = taskDueDate.val();
  const content = taskContent.val();

  // makes a new object for each task with data from form and generateTaskId function
  const newTask = {
    id: generateTaskId(),
    name: name,
    dueDate: dueDate,
    content: content,
    status: 'to-do',
  };

  // gets data from localStorage
  const taskList = readTasksFromStorage();
  // pushes newTask to taskList array
  taskList.push(newTask);

  // saves updated array to localStorage
  saveTasksToStorage(taskList);

  // renders updated taskList to screen
  renderTaskList();

  // clears form inputs
  taskName.val('');
  taskDueDate.val('');
  taskContent.val('');
}

// function to handle deleting task
function handleDeleteTask() {
  const taskId = $(this).attr('data-task-id');
  const taskList = readTasksFromStorage();

  // forEach arrow function to remove task with matching id
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

// function to handle dropping task in new status lane
function handleDrop(event, ui) {
  // gets taskList from localStorage
  const taskList = readTasksFromStorage();

  // gets task id from the event
  const taskId = ui.draggable[0].dataset.taskId;

  // gets the id of the lane that the card was dropped into
  const newStatus = event.target.id;

  // for of loop to update task id when switching status lanes
  for (let task of taskList) {
    // finds task card by id and updates status
    if (task.id === taskId) {
      task.status = newStatus;
    }
  }

  // saves updated tasks array to localStorage and renders new data
  saveTasksToStorage(taskList);
  // renders updated task list to screen
  renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
// event listener for modal form
taskForm.on('click', '.add-task-btn', function (e) {
  e.preventDefault();
  handleAddTask();
  taskForm.modal('hide'); // takes modal away once button is clicked
});

// event listener for deleting an individual task
taskLanes.on('click', '.delete', handleDeleteTask);

// events to happen when page loads
$(document).ready(function () {
  // renders tasks if there is any
  renderTaskList();

  // allows due date month/year to be changed with drop down menus
  $('#taskDueDate').datepicker({
    changeMonth: true,
    changeYear: true,
  });

  // makes lanes droppable
  $('.lane').droppable({
    accept: '.draggable',
    drop: handleDrop,
  });
});
