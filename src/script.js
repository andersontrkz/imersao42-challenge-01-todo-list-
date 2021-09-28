window.onload = () => {
  getStoredTaskList();

  actionEventsListener();

  setCurrentDate();
};

let taskObject = {};
const task_list = document.getElementById('task-list');

const setCurrentDate = () => {
  const startDateInput = document.getElementById('task-start-date');

  startDateInput.value = new Date().toLocaleDateString();
};

const actionEventsListener = () => {
  const addButton = document.getElementById('add-task');
  const clearListButton = document.getElementById('clear-task-list');
  const taskInput = document.getElementById('task');
  const endDate = document.getElementById('task-end-date');
  const orderAscButton = document.getElementById('order-asc-task-list');
  const orderDescButton = document.getElementById('order-desc-task-list');

  orderAscButton.addEventListener('click', orderByEndDateAsc);
  orderDescButton.addEventListener('click', orderByEndDateDesc);
  endDate.addEventListener('input', validateFields);
  taskInput.addEventListener('input', validateFields);
  addButton.addEventListener('click', addTask);
  clearListButton.addEventListener('click', clearList);
};

const deleteTask = (deleteButton) => {
  const row = deleteButton.parentNode.parentNode;

  deleteButton.parentNode.parentNode.parentNode.removeChild(row);

  storeTaskList();
};

const moveUpTask = (moveUpButton) => {
  const row = moveUpButton.parentNode.parentNode;

  if (row != task_list.firstChild) {
    task_list.insertBefore(row, row.previousSibling);
  }

  storeTaskList();
};

const moveDownTask = (moveDownButton) => {
  const row = moveDownButton.parentNode.parentNode;

  if (row != task_list.lastChild) {
    task_list.insertBefore(row, row.nextSibling.nextSibling);
  }

  storeTaskList();
};

const generateActionColumn = () => {
  const actionSection = document.createElement('section');
  const moveUp = document.createElement('button');
  const moveDown = document.createElement('button');
  const deleteButton = document.createElement('button');

  moveUp.innerText = '⏫';
  moveDown.innerText = '⏬';
  deleteButton.innerText = '⛔';

  moveUp.classList.add("move-up-task");
  moveDown.classList.add("move-down-task");
  deleteButton.classList.add("delete-task");

  actionSection.appendChild(moveUp);
  actionSection.appendChild(moveDown);
  actionSection.appendChild(deleteButton);

  actionSection.className = 'task-card__action-section';

  return actionSection;
};

const setActionColumnEvents = (taskList) => {
  const lastColumn = taskList.lastChild.lastChild.lastChild;

  taskList.lastChild.lastChild.firstChild.addEventListener('click',
  () => moveUpTask(lastColumn));

  taskList.lastChild.lastChild.lastChild.previousSibling.addEventListener('click',
  () => moveDownTask(lastColumn));

  taskList.lastChild.lastChild.lastChild.addEventListener('click',
  () => deleteTask(lastColumn));
};

const generateTaskList = ({ task, startDate, endDate, taskStatus }) => {
  const taskCard = document.createElement("main");
  const taskSection = document.createElement("section");
  const startDateSection = document.createElement("section");
  const endDateSection = document.createElement("section");
  const statusSection = document.createElement("section");

  taskSection.innerHTML = task;
  startDateSection.innerHTML = startDate;
  endDateSection.innerHTML = endDate;
  statusSection.innerHTML = taskStatus; 

  taskSection.className = 'task-card__task-section';
  startDateSection.className = 'task-card__start-date-section';
  endDateSection.className = 'task-card__end-date-section';
  statusSection.className = 'task-card__status-section';

  taskCard.appendChild(taskSection);
  taskCard.appendChild(startDateSection);
  taskCard.appendChild(endDateSection);
  taskCard.appendChild(statusSection);

  taskCard.appendChild(generateActionColumn());

  taskCard.className = 'task-card__main';

  task_list.appendChild(taskCard);

  setActionColumnEvents(task_list);
};

const clearTaskForm = () => {
  const taskInput = document.getElementById('task');
  const taskStatus = document.getElementById('task-status');
  const endDateInput = document.getElementById('task-end-date');

  taskInput.value = '';
  taskStatus.value = 'Incompleto';
  endDateInput.value = '';
};

const endDateConverter = (date) => {
  const [year, month , day] = date.split("-");

  return `${day}/${month}/${year}`;
}

const addTask = () => {  
  const addButton = document.getElementById('add-task');
  const endDate = document.getElementById('task-end-date').value;
  
  taskObject.task = document.getElementById('task').value;
  taskObject.taskStatus = document.getElementById('task-status').value;
  taskObject.startDate = document.getElementById('task-start-date').value;
  taskObject.endDate = endDateConverter(endDate);

  generateTaskList(taskObject);

  storeTaskList();
  clearTaskForm();

  addButton.setAttribute('disabled', true)
};

const clearList = () => {
  while (task_list.firstChild) {
    task_list.removeChild(task_list.firstChild);
  };

  storeTaskList();
};

const storeTaskList = () => {
  const taskListStore = [];

  for (let index = 0; index < task_list.childElementCount; index += 1) {
    taskListStore.push({
      task: task_list.children[index].children[0].innerHTML,
      startDate: task_list.children[index].children[1].innerHTML,
      endDate: task_list.children[index].children[2].innerHTML,
      taskStatus: task_list.children[index].children[3].innerHTML,
    });
  };

  localStorage.setItem("taskList", JSON.stringify(taskListStore));
};

const getStoredTaskList = () => {
  const storedTaskList = JSON.parse(localStorage.getItem('taskList'))
  
  if (!storedTaskList) return;
  
  for (let index = 0; index < storedTaskList.length; index += 1) {
    taskObject.task = storedTaskList[index].task;
    taskObject.startDate = storedTaskList[index].startDate;
    taskObject.endDate = storedTaskList[index].endDate;
    taskObject.taskStatus = storedTaskList[index].taskStatus;

    generateTaskList(taskObject);
  };
};


const validateFields = () => {
  const addButton = document.getElementById('add-task');
  const task = document.getElementById('task').value;
  const endDate = document.getElementById('task-end-date').value;

  if (!task || !endDate) {
    addButton.setAttribute('disabled', true);
  } else {
    addButton.removeAttribute('disabled');
  }
};

const convertToOrdenableDate = (date) => {
  const [day, month, year] = date.split("/");
  
  return `${year}${month}${day}`;
}

const orderByEndDateAsc = () => {
  const storedTaskList = JSON.parse(localStorage.getItem('taskList'));

  const orderedTasksAsc = storedTaskList.sort((taskA, taskB) =>  {
    if (convertToOrdenableDate(taskA.endDate) > convertToOrdenableDate(taskB.endDate)) {
      return 1;
    }
    if (convertToOrdenableDate(taskA.endDate) < convertToOrdenableDate(taskB.endDate)) {
      return -1;
    }
  });

  localStorage.setItem('taskList', JSON.stringify(orderedTasksAsc));

  location.reload();
}

const orderByEndDateDesc = () => {
  const storedTaskList = JSON.parse(localStorage.getItem('taskList'));

  const orderedTasksDesc = storedTaskList.sort((taskA, taskB) =>  {
    if (convertToOrdenableDate(taskA.endDate) > convertToOrdenableDate(taskB.endDate)) {
      return -1;
    }
    if (convertToOrdenableDate(taskA.endDate) < convertToOrdenableDate(taskB.endDate)) {
      return 1;
    }
  });

  localStorage.setItem('taskList', JSON.stringify(orderedTasksDesc));

  location.reload();
}