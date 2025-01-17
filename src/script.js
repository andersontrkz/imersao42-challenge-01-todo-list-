window.onload = () => {
  getStoredTaskList();

  actionEventsListener();

  setCurrentDate();
};

const setCurrentDate = () => {
  const day = new Date().getDay();
  const month = new Date().getMonth();
  const year = new Date().getFullYear();

  const startDateInput = document.getElementById('task-start-date');

  startDateInput.value = `${day}/${month}/${year}`;
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
  const taskList = document.getElementById('task-list');
  const row = moveUpButton.parentNode.parentNode;

  if (row != taskList.firstChild) {
    taskList.insertBefore(row, row.previousSibling);
  }

  storeTaskList();
};

const moveDownTask = (moveDownButton) => {
  const taskList = document.getElementById('task-list');
  const row = moveDownButton.parentNode.parentNode;

  if (row != taskList.lastChild) {
    taskList.insertBefore(row, row.nextSibling.nextSibling);
  }

  storeTaskList();
};

const generateActionColumn = () => {
  const actionColumn = document.createElement('td');
  const moveUp = document.createElement('button');
  const moveDown = document.createElement('button');
  const deleteButton = document.createElement('button');

  moveUp.innerText = '⏫';
  moveDown.innerText = '⏬';
  deleteButton.innerText = '⛔';

  moveUp.classList.add("move-up-task");
  moveDown.classList.add("move-down-task");
  deleteButton.classList.add("delete-task");

  actionColumn.appendChild(moveUp);
  actionColumn.appendChild(moveDown);
  actionColumn.appendChild(deleteButton);

  return actionColumn;
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

const generateTaskList = (task, startDate, endDate, taskStatus) => {
  const taskList = document.getElementById('task-list');
  const taskRow = document.createElement("tr");
  const taskColumn = document.createElement("td");
  const startDateColumn = document.createElement("td");
  const endDateColumn = document.createElement("td");
  const taskStatusColumn = document.createElement("td");

  taskColumn.innerHTML = task;
  startDateColumn.innerHTML = startDate;
  endDateColumn.innerHTML = endDate;
  taskStatusColumn.innerHTML = taskStatus; 

  taskRow.appendChild(taskColumn);
  taskRow.appendChild(startDateColumn);
  taskRow.appendChild(endDateColumn);
  taskRow.appendChild(taskStatusColumn);

  taskRow.appendChild(generateActionColumn());

  taskList.appendChild(taskRow);

  setActionColumnEvents(taskList);
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

const startDateConverter = (date) => {
  let [day, month , year] = date.split("/");

  if (day.length < 10) day = `0${day}`;
  if (month.length < 10) month = `0${month}`;

  return `${day}/${month}/${year}`;
}

const addTask = () => {
  const addButton = document.getElementById('add-task');
  const task = document.getElementById('task').value;
  const startDate = document.getElementById('task-start-date').value;
  const endDate = document.getElementById('task-end-date').value;
  const taskStatus = document.getElementById('task-status').value;

  const convertedStartDate = startDateConverter(startDate);
  const convertedEndDate = endDateConverter(endDate);

  generateTaskList(
    task,
    convertedStartDate,
    convertedEndDate,
    taskStatus
  )

  storeTaskList();
  clearTaskForm();

  addButton.setAttribute('disabled', true)
};

const clearList = () => {
  const taskList = document.getElementById('task-list');

  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  };

  storeTaskList();
};

const storeTaskList = () => {
  const taskList = document.getElementById('task-list');
  const taskListStore = [];

  for (let index = 0; index < taskList.childElementCount; index += 1) {
    taskListStore.push({
      task: taskList.children[index].children[0].innerHTML,
      startDate: taskList.children[index].children[1].innerHTML,
      endDate: taskList.children[index].children[2].innerHTML,
      taskStatus: taskList.children[index].children[3].innerHTML,
    });
  };

  localStorage.setItem("taskList", JSON.stringify(taskListStore));
};

const getStoredTaskList = () => {
  const storedTaskList = JSON.parse(localStorage.getItem('taskList'))
  
  if (!storedTaskList) return;
  
  for (let index = 0; index < storedTaskList.length; index += 1) {
    generateTaskList(
      storedTaskList[index].task,
      storedTaskList[index].startDate,
      storedTaskList[index].endDate,
      storedTaskList[index].taskStatus
    );
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