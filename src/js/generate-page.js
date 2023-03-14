import { format } from 'date-fns';
import { captureDOM } from '../index.js';
import { toolbarFunctions, manageList, pageFunctions, renderDOM } from './functions.js';


// This module will hold all functions related to creating the bulletin boards (home page) DOM
const generateBulletinBoard = (function () {

    // Creating Functions
    // This set of instructions creates the toolbar

    const createToolbar = (configuration) => {
        if (configuration === 'initial') {

            // Creating Elements
            const toolbar = document.createElement('section');
            const leftSection = document.createElement('section');
            const middleSection = document.createElement('section');
            const rightSection = document.createElement('section');
            const title = document.createElement('h1');
            const addListButtonWrapper = document.createElement('section')
            const addListButton = document.createElement('img');

            // Manipulating Elements
            addListButtonWrapper.classList.add('add-todo-button-wrapper')
            addListButton.classList.add('add-todo-button');
            addListButton.setAttribute('src', '/src/images/add.svg');
            toolbar.classList.add('toolbar');
            leftSection.classList.add('tb-left', 'tb-expanded-flex');
            middleSection.classList.add('tb-middle', 'tb-reduced-flex');
            rightSection.classList.add('tb-right', 'tb-standard-flex');
            title.classList.add('title');
            title.textContent = 'Bulletin Board';

            // Adding event listeners
            // This hides and displays the form on the home
            addListButton.addEventListener('click', function () {
                toolbarFunctions.toggleForm('toggle', captureDOM.formSection);
            });


            // Appending Elements
            captureDOM.toolbarContainer.prepend(toolbar);
            toolbar.append(leftSection, middleSection, rightSection);
            leftSection.appendChild(title);
            addListButtonWrapper.appendChild(addListButton);
            rightSection.appendChild(addListButtonWrapper);
        }

        if (configuration === 'home') {
            // Grabbing DOM
            const leftSection = document.querySelector('.tb-left');
            const rightSection = document.querySelector('.tb-right');

            // Creating Elements
            const title = document.createElement('h1');
            const addListButton = document.createElement('img');

            // Manipulating Elements
            title.classList.add('title');
            title.textContent = 'Bulletin Board';

            addListButton.classList.add('add-todo-button');
            addListButton.setAttribute('src', '/src/images/add.svg');

            // Adding event listeners
            // This hides and displays the form on the home
            addListButton.addEventListener('click', function () {
                toolbarFunctions.toggleForm('toggle', captureDOM.formSection);
            });

            // Appending Elements
            leftSection.appendChild(title);
            rightSection.appendChild(addListButton);
        }
    }

    const createBoardNotification = () => {
        // Grabbing Relevant DOM
        const rightToolbarSection = document.querySelector('.tb-right')

        // Creating Elements
        const notificationSection = document.createElement('section');
        const notificationArrow = document.createElement('img');
        const notificationTextWrapper = document.createElement('section');
        const notificationText = document.createElement('p');

        // Manipulating Elements
        // notificationSection.classList.add('notification');

        notificationTextWrapper.classList.add('notification-text-wrapper');

        notificationText.classList.add('notification-text');
        notificationText.textContent += 'It appears you have no lists, click the button in the top right to get started!'

        notificationArrow.classList.add('notification-arrow');
        notificationArrow.setAttribute('src', '/src/images/up-arrow.svg');
        notificationArrow.setAttribute('alt', 'An arrow pointing at the add-list button');

        // Appending Elements
        // captureDOM.toolbarContainer.appendChild(notificationSection);
        // notificationSection.appendChild(notificationArrow);
        rightToolbarSection.appendChild(notificationArrow);
        captureDOM.content.appendChild(notificationTextWrapper);
        notificationTextWrapper.appendChild(notificationText);
    }

    // Function to create our lists, either through a loop or single increments
    // This feature is dependent on the configuration setting used
    // The two settings are "add" or "loop"
    const generateBoard = (configuration) => {

        // Function to add list to the DOM
        const bulletinBoardSetup = (index) => {

            // Creating Elements
            const list = document.createElement('section');
            const infoSection = document.createElement('section');
            const title = document.createElement('h2');
            const description = document.createElement('p');
            const dueDate = document.createElement('p');
            const deleteButton = document.createElement('img');


            // List Section
            list.dataset.id = manageList.bulletinBoard[index].id;
            list.classList.add('list-section');

            // Info Section
            infoSection.classList.add('info-section');

            // List Title
            title.classList.add('list-title');
            title.textContent = manageList.bulletinBoard[index].title;

            // List 
            description.classList.add('list-description');
            description.textContent = manageList.bulletinBoard[index].description;

            // List Due Date
            dueDate.classList.add('list-due-date');
            dueDate.textContent = `Due by ${pageFunctions.formatDate(manageList.bulletinBoard[index].dueDate)}`;

            // List Delete Button
            deleteButton.dataset.id = manageList.bulletinBoard[index].id;
            deleteButton.classList.add('list-delete-button');
            deleteButton.setAttribute('src', '/src/images/trashcan.svg');


            // Adding Event Listeners

            // On Click event listener that goes to page 2, the indepth versions of the list  
            list.addEventListener('click', function () {

                // This is to get the correct index of the currently clicked list, used in renderDOM.list(); 
                let index = 0;
                for (let f = 0; f < manageList.bulletinBoard.length; f++) {
                    if (manageList.bulletinBoard[f].id == list.dataset.id) {
                        index = f;
                    }
                }

                // This function renders out the bulletin board and replaces it
                // with the lists information
                renderDOM.list(index);
            });

            // On click event listener to the deleteButton
            deleteButton.addEventListener('click', function (event) {
                event.stopPropagation();
                for (let i = 0; i < manageList.bulletinBoard.length; i++) {
                    // we are doing a loop to find the list in manageList.bulletinBoard
                    // with the corresponding id to the trashcan SVG
                    if (deleteButton.dataset.id == manageList.bulletinBoard[i].id) {
                        manageList.bulletinBoard.splice(i, 1);
                        let list = document.querySelector(`[data-id="${deleteButton.dataset.id}"]`)
                        captureDOM.content.removeChild(list);
                    }
                }
                localStorage.setItem('bulletinBoard' , JSON.stringify(manageList.bulletinBoard));
                if (manageList.bulletinBoard.length === 0) {
                    generateBulletinBoard.createBoardNotification();
                    localStorage.clear();
                }
            });

            // Appending Elements
            captureDOM.content.appendChild(list);
            list.append(title, description, infoSection)
            infoSection.append(dueDate, deleteButton);
        }

        // This is used to render all stored lists
        if (configuration === 'loop') {
            for (let i = 0; i < manageList.bulletinBoard.length; i++) {
                bulletinBoardSetup(i);
            }
        }

        // This is used to render new lists through the form
        if (configuration === 'add') {
            let lastList = manageList.bulletinBoard.length - 1;
            bulletinBoardSetup(lastList);
            manageList.idCounter++;
        }
    }

    const removeBoardNotification = () => {
        const notificationArrow = document.querySelector('.notification-arrow');
        const notificationTextWrapper = document.querySelector('.notification-text-wrapper');

        notificationArrow.remove();
        notificationTextWrapper.remove();

    }


    return {
        generateBoard,
        createToolbar,
        createBoardNotification,
        removeBoardNotification,
    }
})();

export { generateBulletinBoard }