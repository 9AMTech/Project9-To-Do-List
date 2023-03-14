import { format } from 'date-fns';
import { captureDOM } from '../index.js';
import { generateBulletinBoard } from './generate-page.js';
require.context('../images/', false, /\.png$/)
require.context('../images/', false, /\.png$/)

// Modules
const manageList = (function () {

    // This function is used to determine if we can use Local Storage
    const testData = {
        id: 0,
        title: 'The First',
        description: 'This is a test description testing the length limit of this ROW',
        creationDate: format(new Date(), 'MM/dd/yyyy'),
        dueDate: new Date('5/20/22'),
        priority: 'HIGH',
        list: [{
            taskID: 0,
            priority: 'HIGH',
            task: 'Take out the trash!'
        },
        {
            taskID: 1,
            priority: 'MED',
            task: 'Buy lettuce.'
        },
        {
            taskID: 2,
            priority: 'LOW',
            task: 'Find Tacitos from 711'
        }],
    };
    // let bulletinBoard = [testData];
    let bulletinBoard = [];
    let idCounter = 0;
    let highestTaskID = 0;


    // This will have code that populates our bulletinboard array with 
    // the todos already within our Local Storage, this data needs to be changed
    if (localStorage.length !== 0) {
        bulletinBoard = JSON.parse(localStorage.bulletinBoard);
    }

    else {
        bulletinBoard = [];
    }

    // These nested loops will handle getting the correct largest ID Counters
    // For both the todo-lists and tasks to make sure we don't delete the wrong ones
    if (bulletinBoard.length !== 0) {
        idCounter = Math.max(...bulletinBoard.map(x => x.id));
        highestTaskID = Math.max(...bulletinBoard.flatMap(x => x.list.map(x => x.taskID)));

        // We increment these two values by 1 to prevent them from overwriting our future values
        idCounter++;
        highestTaskID++;
    };

    // Creating a Checklist Factory Function
    const listFactory = (
        id, title, description, creationDate,
        dueDate, priority, list,
    ) => {
        return {
            id, title, description, creationDate,
            dueDate, priority, list,
        };
    };

    // This counter is used to add IDs to the new listList objects
    const createList = (event) => {
        // Preventing the page from reloading
        event.preventDefault();

        // Puling form data
        let fd = new FormData(captureDOM.form);

        let newList = listFactory();
        newList.id = manageList.idCounter;

        newList.list = [];

        // WITH DATE FNS ADD THE CURRENT DATE TODAY, FOR THE CREATION DATE
        newList.creationDate = format(new Date(), 'M/dd/yyyy');

        // Giving the property an empty list by default, this is how it should be
        // The below tasks are just test data to fill the pages
        newList.list = [];

        let key;
        for (key of fd.keys(key)) {
            newList[key] = fd.get(key);
        }

        // Resetting form values
        captureDOM.form.reset();

        // now that we are done creating the list, we add the list to 
        // our bulletinBoard, then increment our idCounter
        bulletinBoard.push(newList);
        localStorage.setItem('bulletinBoard', JSON.stringify(bulletinBoard));
    };

    return {
        idCounter,
        highestTaskID,
        bulletinBoard,
        createList,
    };
})();


const toolbarFunctions = (function () {

    const toggleForm = (configuration, x) => {
        switch (configuration) {
            case 'toggle':
                if (x.classList.contains('hidden') == true) {
                    x.classList.remove('hidden');
                }
                else {
                    x.classList.add('hidden');
                }
                break;

            case 'add':
                x.classList.add('hidden');
                break;

            case 'remove':
                x.classList.remove('hidden');
                break;
        }
    }

    return {
        toggleForm,
    }
})();

const pageFunctions = (function () {

    const edit = (text) => {
        text.setAttribute('contenteditable', 'true');
        text.focus();
        let sel = document.getSelection();
        sel.selectAllChildren(text);
        sel.collapseToEnd();
    }

    const formatDate = (todoDate) => {
        let parsedDate = new Date(todoDate);
        let currentYear = new Date().getFullYear();
        const dtDateOnly = new Date(parsedDate.valueOf() + parsedDate.getTimezoneOffset() * 60 * 1000);

        if (currentYear != parsedDate.getFullYear()) {
            let convertedDate = format(dtDateOnly, 'M/dd/yyyy');
            return convertedDate;
        }
        else {
            let convertedDate = format(dtDateOnly, 'M/dd');
            return convertedDate;
        }
    };

    const optionValueGrabber = (selected) => {
        return selected.options[selected.selectedIndex].value;
    }

    const preventEnter = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
        }
    }

    const removeChildren = (parent) => {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
    
    const formTextLimit = (textNode, characterLimit, callback) => {
        textNode.addEventListener('keypress', function (event) {
            console.log('HA')
            if (textNode.value.length >= characterLimit) {
                event.preventDefault();
            }
        })
    }
    
    const textLimit = (textNode, characterLimit, callback) => {
        textNode.addEventListener('keypress', function (event) {
            if (textNode.textContent.length >= characterLimit) {
                event.preventDefault();
            }
            callback(textNode.textContent);
        })
    }




    return {
        edit,
        formatDate,
        formTextLimit,
        preventEnter,
        optionValueGrabber,
        removeChildren,
        textLimit,
    }
})();


const renderDOM = (function () {
    // This function adds 3 reusable event listeners
    // 1 = Prevents user from entering a new line
    // 2 = Updates the array with the new text content
    // 3 = When the edit button is pressed, allows the user to edit the text node
    const editEventListeners = (textNode, editButton, callback) => {
        textNode.addEventListener('keypress', function (event) {
            pageFunctions.preventEnter(event);
        });

        textNode.addEventListener('keyup', function () {
            callback(textNode.textContent);
        });

        textNode.addEventListener('blur', function () {
            if (textNode.classList.contains('textarea') === true) {
                callback(textNode.textContent);
                localStorage.setItem('bulletinBoard', JSON.stringify(manageList.bulletinBoard));
                return;
            }
            textNode.setAttribute('contenteditable', 'false');
            localStorage.setItem('bulletinBoard', JSON.stringify(manageList.bulletinBoard));
        });

        editButton.addEventListener('click', function () {
            pageFunctions.edit(textNode);
        });
    }

    const createButton = (button, className, path) => {
        button.classList += className;
        button.setAttribute('src', path);
    }

    // This function creates the list page when a todo list is clicked
    const list = (index) => {

        // This function makes the tasks portion after the description
        // This is meant to be looped if tasks exist already
        // or called when a task is added
        const createTasks = (taskList, listIndex, todoIndex) => {
            // Creating Variables
            const taskItem = document.createElement('li');
            const priorityList = document.createElement('section');
            const prioritySelect = document.createElement('select');
            const priorityFragment = document.createDocumentFragment();
            const taskDescription = document.createElement('section');
            const descriptionText = document.createElement('p');
            const taskOptions = document.createElement('section');
            const taskEditButton = document.createElement('img');
            const taskDeleteButton = document.createElement('img');

            if (taskList == undefined) {
                let task = {
                    taskID: todoIndex,
                    priority: 'LOW',
                    task: '',
                }
                manageList.bulletinBoard[listIndex].list.push(task);
                taskList = manageList.bulletinBoard[listIndex].list[todoIndex];
            }

            // Manipulating Variables
            taskItem.classList.add('task');
            // taskItem.dataset.id = taskList.taskID;

            taskDescription.classList.add('task-description');

            descriptionText.classList.add('task-description-text');
            descriptionText.textContent = taskList.task;

            descriptionEditButton.classList.add('edit-button');
            descriptionEditButton.setAttribute('src', 'edit-pencil.png');

            priorityList.classList.add('task-priority');
            prioritySelect.classList.add('task-priority-level');

            priority.forEach(function (task) {
                let option = document.createElement('option');
                option.textContent = task.level;
                option.value = task.level;
                option.classList.add(task.class);

                if (task.level == taskList.priority) {
                    option.setAttribute('selected', 'selected');
                }
                priorityFragment.appendChild(option);
            });

            taskOptions.classList.add('task-options');

            taskEditButton.classList.add('task-edit-button', 'icon');
            taskEditButton.setAttribute('src', 'edit-pencil.png');

            taskDeleteButton.classList.add('task-delete-button', 'icon');
            taskDeleteButton.setAttribute('src', 'delete-x.png');

            // Adding Event Listeners
            // Click listener that allows the user to update description of the selected task
            // Clicking away from the description box will save it, if the desc is left empty will delete the todo

            // When clicking off the actual description box
            descriptionText.addEventListener('blur', function () {
                if (descriptionText.textContent.length === 0) {
                    manageList.bulletinBoard[listIndex].list.splice(todoIndex, 1);
                    list.removeChild(taskItem);
                };
            });

            editEventListeners(descriptionText, taskEditButton, (val) => manageList.bulletinBoard[listIndex].list[todoIndex].task = val);

            prioritySelect.addEventListener('change', function () {
                manageList.bulletinBoard[listIndex].list[todoIndex].priority = pageFunctions.optionValueGrabber(this);
                localStorage.setItem('bulletinBoard' , JSON.stringify(manageList.bulletinBoard));
            });

            // Click listener that allows the user to delete the selected task, removing it 
            // from the DOM and from the object's list
            taskDeleteButton.addEventListener('click', function () {
                manageList.bulletinBoard[listIndex].list.splice(todoIndex, 1);
                list.removeChild(taskItem);
                localStorage.setItem('bulletinBoard', JSON.stringify(manageList.bulletinBoard));
            });

            // Appending DOM
            list.appendChild(taskItem);
            taskItem.append(taskDescription, taskOptions);
            taskDescription.appendChild(descriptionText);
            priorityList.appendChild(prioritySelect);
            prioritySelect.appendChild(priorityFragment);
            taskOptions.append(priorityList, taskEditButton, taskDeleteButton);
        }
        // END OF createTasks()

        // CONTINUATION OF lists() 
        // Creating Elements for List Page
        const priority = [{
            level: 'LOW',
            class: 'low-level'
        }, {
            level: 'MED',
            class: 'med-level'
        }, {
            level: 'HIGH',
            class: 'high-level'
        }];

        const backButton = document.createElement('img');
        const newTitle = document.createElement('h1');
        const titleEditButton = document.createElement('img');
        const infoSection = document.createElement('section');
        const description = document.createElement('h2');
        const descriptionEditButton = document.createElement('img');
        const creationDate = document.createElement('p');
        const dueDate = document.createElement('p');
        const dueDateEditButton = document.createElement('input');
        const listWrapper = document.createElement('section');
        const list = document.createElement('ul');

        let numOfLists = manageList.bulletinBoard[index].list.length;

        // Creating Elements
        const addTask = document.createElement('section');
        const addTaskButton = document.createElement('img');

        // Grabbing DOM 
        const leftSection = document.querySelector('.tb-left');
        const middleSection = document.querySelector('.tb-middle');
        const rightSection = document.querySelector('.tb-right');
        const oldTitle = document.querySelector('.title');
        const addListButtonWrapper = document.querySelector('.add-todo-button-wrapper');
        const addListButton = document.querySelector('.add-todo-button');
        const notification = document.querySelector('.notification');
        const lists = document.querySelectorAll('.list-section');

        // Emptying Old Page
        leftSection.removeChild(oldTitle);
        pageFunctions.removeChildren(rightSection);
        pageFunctions.removeChildren(captureDOM.content);

        // Manipulating Elements
        captureDOM.content.classList.toggle('list');

        leftSection.classList.toggle('tb-expanded-flex');
        leftSection.classList.toggle('tb-standard-flex');

        middleSection.classList.toggle('tb-reduced-flex');
        middleSection.classList.toggle('tb-expanded-flex');

        backButton.classList.add('back-arrow');
        backButton.setAttribute('src', 'back-arrow.png');

        newTitle.classList.add('todo-title');
        newTitle.textContent = manageList.bulletinBoard[index].title;

        titleEditButton.classList.add('icon', 'edit-button', 'title-edit-button');
        titleEditButton.setAttribute('src', 'edit-pencil.png');

        creationDate.classList.add('todo-creation-date');
        creationDate.textContent = `Created ${pageFunctions.formatDate(manageList.bulletinBoard[index].creationDate)}`;

        infoSection.classList.add('todo-info-section');

        dueDate.classList.add('todo-due-date');
        dueDate.textContent = `Due by ${pageFunctions.formatDate(manageList.bulletinBoard[index].dueDate)}`;

        dueDateEditButton.classList.add('edit-button', 'icon', 'due-date-edit-button');
        dueDateEditButton.setAttribute('type', 'date');
        dueDateEditButton.setAttribute('src', 'edit-pencil.png');

        description.classList.add('todo-description', 'textarea');
        if (manageList.bulletinBoard[index].description.length === 0 || manageList.bulletinBoard[index].description === '') {
            description.textContent = 'This is a placeholder description!';
        }
        else {
            description.textContent = manageList.bulletinBoard[index].description;
        }

        descriptionEditButton.classList.add('edit-button', 'icon');
        descriptionEditButton.setAttribute('src', 'edit-pencil.png');

        listWrapper.classList.add('todo-list-wrapper');

        list.classList.add('todo-list');

        addTask.classList.add('add-task');
        addTaskButton.classList.add('add-task-button', 'icon', 'edit-button');
        addTaskButton.setAttribute('src', 'add.png');

        if (numOfLists !== 0) {
            for (let p = 0; p < numOfLists; p++) {
                createTasks(manageList.bulletinBoard[index].list[p], index, p);
            }
        };


        // Adding Event Listeners
        // Listener to Add Tasks
        // On Click will prepend addTask with an empty already activated description box
        // ready to be typed in, if the user clicks away then it deletes the todo
        // Will push to the bulletinBoard[x].list array
        // Will increment the highestTaskIDCounter
        addTaskButton.addEventListener('click', function () {
            let newIndex = manageList.bulletinBoard[index].list.length;
            createTasks(manageList.bulletinBoard[index].list[newIndex], index, newIndex);
            let newTask = document.querySelector('.task:last-of-type');
            let newTaskDescription = newTask.querySelector('.task-description-text');

            pageFunctions.edit(newTaskDescription);

            newTaskDescription.addEventListener('blur', function () {
                if (newTaskDescription.textContent.length === 0) {
                    manageList.bulletinBoard[index].list.splice(newIndex, 1);
                    localStorage.setItem('bulletinBoard', JSON.stringify(manageList.bulletinBoard));
                };
            });
        });

        editEventListeners(newTitle, titleEditButton, (val) => manageList.bulletinBoard[index].title = val);
        editEventListeners(description, descriptionEditButton, (val) => manageList.bulletinBoard[index].description = val);

        pageFunctions.textLimit(newTitle, 20, (val) => manageList.bulletinBoard[index].title = val);
        pageFunctions.textLimit(description, 35, (val) => manageList.bulletinBoard[index].description = val);

        // Pulls up a date selector, the date selected becomes the new due sentence date in the todo info section
        dueDateEditButton.addEventListener('change', function () {
            // manageList.bulletinBoard[index].dueDate = dueDateEditButton.value;
            manageList.bulletinBoard[index].dueDate = format(Date.parse(dueDateEditButton.value), 'Pp');
            dueDate.textContent = `Due by ${pageFunctions.formatDate(manageList.bulletinBoard[index].dueDate)}`;
            localStorage.setItem('bulletinBoard' , JSON.stringify(manageList.bulletinBoard));
        });

        // On Click will go back to the homescreen.
        backButton.addEventListener('click', function () {
            // Clearing Old Content
            leftSection.removeChild(backButton);
            pageFunctions.removeChildren(middleSection);
            pageFunctions.removeChildren(rightSection);
            pageFunctions.removeChildren(captureDOM.content);

            // Toggling Classnames
            captureDOM.content.classList.toggle('list');

            leftSection.classList.toggle('tb-standard-flex');
            leftSection.classList.toggle('tb-expanded-flex');

            middleSection.classList.toggle('tb-expanded-flex');
            middleSection.classList.toggle('tb-reduced-flex');

            // Filling New Data
            generateBulletinBoard.createToolbar('home');
            generateBulletinBoard.generateBoard('loop');
        });

        // Appending Elements
        leftSection.appendChild(backButton);
        middleSection.append(newTitle, titleEditButton);
        rightSection.append(creationDate);
        infoSection.append(dueDate, dueDateEditButton, description, descriptionEditButton);
        addTask.appendChild(addTaskButton);
        listWrapper.appendChild(list);
        captureDOM.content.append(infoSection, listWrapper, addTask);
    }

    return {
        list,
    }
})();


export { manageList, toolbarFunctions, pageFunctions, renderDOM };