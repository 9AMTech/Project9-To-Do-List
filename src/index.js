import { manageList, toolbarFunctions, pageFunctions } from './js/functions.js';
import { generateBulletinBoard } from './js/generate-page.js'

const captureDOM = (function () {

    // Grabbing add-todo-section
    const toolbarContainer = document.querySelector('.toolbar-container');

    // Grabbing content section
    const content = document.querySelector('.content');

    // Grabbing all form inputs
    const formSection = document.querySelector('.form-section')
    const form = document.querySelector("#form-add-todo");
    const formTitle = document.querySelector('input[name="title"]');
    const formDescription = document.querySelector('input[name="description"]');
    const formDueDate = document.querySelector('input[name="form-due-date"]');
    const formButton = document.querySelector(".form-submit");

    // Grabbing list inputs
    const list = document.querySelector('.list-section');

    return {
        toolbarContainer,
        content,
        formSection,
        form,
        formTitle,
        formDescription,
        formDueDate,
        formButton,
        list,
    };
})();

// This section will have the event listeners that render the DOM
const initialRender = (function () {

    // Generating the bulletin board lists
    generateBulletinBoard.generateBoard('loop');
    generateBulletinBoard.createToolbar('initial');
    if (manageList.bulletinBoard.length === 0) {
        generateBulletinBoard.createBoardNotification();
    }
    return {
    }
})();

const bulletinBoardLogic = (function () {
    // This will change the transparancy of the form to show up
    captureDOM.formSection.addEventListener('click', function () {
        toolbarFunctions.toggleForm('add', captureDOM.formSection);
    });

    // This will remove the form when clicking outside the form
    captureDOM.form.addEventListener('click', function (event) {
        toolbarFunctions.toggleForm('remove', captureDOM.formSection);
        event.stopPropagation();
    });

    // This creates a to do list
    captureDOM.form.addEventListener("submit", function (event) {
        if (manageList.bulletinBoard.length === 0) {
            generateBulletinBoard.removeBoardNotification();
        }
        manageList.createList(event);
        generateBulletinBoard.generateBoard('add');

    });

    pageFunctions.formTextLimit(captureDOM.formTitle, 20);
    pageFunctions.formTextLimit(captureDOM.formDescription, 35);

    return {
    };

})();

export { captureDOM };