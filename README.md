# Task Board

## Description

This Task Board application is a simple task board that allows a team to manage project tasks. It includes a modal form where users will input the name of their task, due date, and description. The task list be savedd to localStorage and dynamically generated to each task lane.

## Usage

When a user first opens the application, they are greeted with a task board with three lanes and an 'Add Task" button.
![Screenshot of Add Task button highlighted](./assets/images/task-board1.jpg)

When they click the button, a modal form will pop up with three input areas: Task Title, Task Date (a date picker when clicked), and Task Description. After the user fills out the fields and clicks the "Add Task" button,
![Screenshot of modal form with inputs and button highlighted](./assets/images/task-board2.jpg)

the modal form will close automatically and their task will be set in the default lane. Tasks are colored by due date.
![Screenshot of different colored task cards w/ explanations](./assets/images/task-board3.jpg)

the user will be able to drag each task between all three lanes: To Do, In Progress, and Done.
![Screenshot of tasks in different lanes](./assets/images/task-board4.jpg)

When a task is placed in the "Done" lane, the card will turn white: this signifies the task is complete.
![Screenshot of red card turning white in "Done" lane](./assets/images/task-board5.jpg)

The user will also be able to delete individual tasks by clicking the red "Delete" button on the respective task.

## Screenshot

![Gif of webpage in action](./assets/images/task-board.gif)

## Deployed Application

[Click here](https://rvbouu.github.io/task-board/) to view the deployed version.