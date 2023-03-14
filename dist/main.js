/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"captureForm\": () => (/* binding */ captureForm),\n/* harmony export */   \"bulletinBoardLogic\": () => (/* binding */ bulletinBoardLogic)\n/* harmony export */ });\n/* harmony import */ var _js_functions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js/functions.js */ \"./src/js/functions.js\");\n\r\n\r\nconst captureForm = (function() {\r\n    // Grabbing all form inputs \r\n    const formTitle = document.querySelector('input[name=\"title\"]');\r\n    const formDescription = document.querySelector('input[name=\"description\"]');\r\n    const formDueDate = document.querySelector('input[name=\"form-due-date\"]');\r\n    const formColor = document.querySelector('input[name=\"color\"]');\r\n    const formButton =  document.querySelector('add-list-button');\r\n\r\n    return {\r\n        formTitle: formTitle,\r\n        formDescription: formDescription,\r\n        formDueDate: formDueDate,\r\n        formColor: formColor,\r\n        formButton: formButton,\r\n    }\r\n    \r\n})();\r\n\r\nconst bulletinBoardLogic = (function() {\r\n    \r\n    // This array will hold all of our todo's \r\n    let bulletinBoard = [];\r\n    \r\n    // This is a sample Todo, it's to see if we can render our lists on the page\r\n    let blankTodoList = ['Take out trash', 'Feed Dog', 'Feed Self']\r\n    \r\n    // Event Listener on Button Press Logic\r\n    // This creates a to do list\r\n    captureForm.formButton.addEventListener('submit', (0,_js_functions_js__WEBPACK_IMPORTED_MODULE_0__.createTodo)(e));\r\n\r\n    \r\n    return {\r\n        bulletinBoard: bulletinBoard,\r\n    }\r\n\r\n})();\r\n\r\n\n\n//# sourceURL=webpack://project9-to-do-list/./src/index.js?");

/***/ }),

/***/ "./src/js/functions.js":
/*!*****************************!*\
  !*** ./src/js/functions.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createTodo\": () => (/* binding */ createTodo)\n/* harmony export */ });\n/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index.js */ \"./src/index.js\");\n\r\n\r\n\r\nconst createTodo = (function() {\r\n    // Creating a Checklist Factory Function\r\n    const todoList = (id, color, title, description, creationDate, dueDate, priority, todos) => {\r\n        return {id, color, title, description, creationDate, dueDate, priority, todos};\r\n    }\r\n    \r\n    // This counter is used to add IDs to the new todoList objects\r\n    let idCounter = 0;\r\n    \r\n    const createTodo = (e) => {\r\n        // Preventing the page from reloading\r\n        e.preventDefault();\r\n\r\n        // creating a new todo and placing at index idCounter\r\n        //      bulletinBoard in from factory function todoList\r\n        bulletinBoard[idCounter] = todoList();\r\n\r\n        // Pulling form data, and placing it into an object called fd\r\n        let form = e.target;\r\n        const fd = new FormData(form);\r\n\r\n        // from fd's object keys, we are stuffing those into the current todo we are making\r\n        for(key in fd(keys)) {\r\n            bulletinBoard[idCounter[key]] = fd.get(key);\r\n        }\r\n\r\n        // now that we are done creating the todo, we increment our idCounter\r\n        idCounter++;\r\n\r\n    }\r\n\r\n    return {\r\n        createTodo: createTodo,\r\n    }\r\n})();\r\n\r\nconst DOM = (function() {\r\n\r\n})();\r\n\r\n\n\n//# sourceURL=webpack://project9-to-do-list/./src/js/functions.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;