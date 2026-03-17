// =============================================================================
// Seed Script — 150 JavaScript Quiz Questions
// =============================================================================
// Run this script to populate the database with quiz questions.
//
// Usage:
//   cd server
//   npm run seed
//
// The script connects to MongoDB, clears existing questions, inserts 150 new
// questions (50 per difficulty level), and then disconnects.
//
// CATEGORIES COVERED:
//   Easy:   Variables, Data Types, Operators, Strings, Arrays (basics),
//           Conditionals, Loops, Functions (basics), Objects (basics), DOM
//   Medium: Scope, Closures, Array Methods, Object Methods, Destructuring,
//           Spread/Rest, Promises, Error Handling, ES6+, Prototypes
//   Hard:   Async/Await, Event Loop, Generators, Proxies, WeakMap/WeakSet,
//           Design Patterns, Memory Management, Modules, Performance, Security
// =============================================================================

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Question = require("../models/Question");

// Load environment variables
dotenv.config();

// ---------------------------------------------------------------------------
// 50 EASY QUESTIONS
// ---------------------------------------------------------------------------
const easyQuestions = [
  {
    question: "Which keyword is used to declare a variable that cannot be reassigned?",
    options: ["var", "let", "const", "static"],
    correctAnswer: "const",
    difficulty: "easy",
    category: "Variables",
  },
  {
    question: "What is the output of: typeof null?",
    options: ["'null'", "'undefined'", "'object'", "'boolean'"],
    correctAnswer: "'object'",
    difficulty: "easy",
    category: "Data Types",
  },
  {
    question: "Which method converts a JSON string into a JavaScript object?",
    options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.toObject()"],
    correctAnswer: "JSON.parse()",
    difficulty: "easy",
    category: "Data Types",
  },
  {
    question: "What does the '===' operator check?",
    options: ["Value only", "Type only", "Value and type", "Reference only"],
    correctAnswer: "Value and type",
    difficulty: "easy",
    category: "Operators",
  },
  {
    question: "Which array method adds an element to the end of an array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    correctAnswer: "push()",
    difficulty: "easy",
    category: "Arrays",
  },
  {
    question: "What is the output of: console.log(2 + '2')?",
    options: ["4", "22", "'22'", "NaN"],
    correctAnswer: "'22'",
    difficulty: "easy",
    category: "Operators",
  },
  {
    question: "Which keyword is used to define a function?",
    options: ["func", "def", "function", "fn"],
    correctAnswer: "function",
    difficulty: "easy",
    category: "Functions",
  },
  {
    question: "How do you write a single-line comment in JavaScript?",
    options: ["<!-- comment -->", "// comment", "# comment", "/* comment */"],
    correctAnswer: "// comment",
    difficulty: "easy",
    category: "Variables",
  },
  {
    question: "Which method removes the last element from an array?",
    options: ["pop()", "push()", "shift()", "slice()"],
    correctAnswer: "pop()",
    difficulty: "easy",
    category: "Arrays",
  },
  {
    question: "What is the default value of an uninitialized variable in JavaScript?",
    options: ["null", "0", "undefined", "NaN"],
    correctAnswer: "undefined",
    difficulty: "easy",
    category: "Variables",
  },
  {
    question: "Which loop is best for iterating over array elements?",
    options: ["for...in", "for...of", "while", "do...while"],
    correctAnswer: "for...of",
    difficulty: "easy",
    category: "Loops",
  },
  {
    question: "What does document.getElementById() return if no element is found?",
    options: ["undefined", "false", "null", "0"],
    correctAnswer: "null",
    difficulty: "easy",
    category: "DOM",
  },
  {
    question: "How do you declare a string variable in JavaScript?",
    options: ["string name = 'hello'", "let name = 'hello'", "var name: string = 'hello'", "String name = 'hello'"],
    correctAnswer: "let name = 'hello'",
    difficulty: "easy",
    category: "Variables",
  },
  {
    question: "Which method returns the length of a string?",
    options: [".size()", ".length", ".count()", ".strlen()"],
    correctAnswer: ".length",
    difficulty: "easy",
    category: "Strings",
  },
  {
    question: "What is the output of: Boolean('')?",
    options: ["true", "false", "null", "undefined"],
    correctAnswer: "false",
    difficulty: "easy",
    category: "Data Types",
  },
  {
    question: "How do you create an object in JavaScript?",
    options: ["let obj = ()", "let obj = {}", "let obj = []", "let obj = new Array()"],
    correctAnswer: "let obj = {}",
    difficulty: "easy",
    category: "Objects",
  },
  {
    question: "Which operator is used for string concatenation?",
    options: ["&", "+", ".", ">>"],
    correctAnswer: "+",
    difficulty: "easy",
    category: "Operators",
  },
  {
    question: "What does the isNaN() function check?",
    options: ["If value is null", "If value is not a number", "If value is negative", "If value is zero"],
    correctAnswer: "If value is not a number",
    difficulty: "easy",
    category: "Data Types",
  },
  {
    question: "Which method converts a number to a string?",
    options: ["toString()", "toNumber()", "String()", "Both toString() and String()"],
    correctAnswer: "Both toString() and String()",
    difficulty: "easy",
    category: "Data Types",
  },
  {
    question: "What is the correct syntax for an if statement?",
    options: ["if x > 5 {}", "if (x > 5) {}", "if x > 5 then {}", "if [x > 5] {}"],
    correctAnswer: "if (x > 5) {}",
    difficulty: "easy",
    category: "Conditionals",
  },
  {
    question: "Which method finds the index of an element in an array?",
    options: ["find()", "indexOf()", "search()", "locate()"],
    correctAnswer: "indexOf()",
    difficulty: "easy",
    category: "Arrays",
  },
  {
    question: "What does 'NaN' stand for?",
    options: ["Not a Null", "Not a Number", "No Assigned Name", "Null and None"],
    correctAnswer: "Not a Number",
    difficulty: "easy",
    category: "Data Types",
  },
  {
    question: "How do you add an event listener to a button?",
    options: [
      "button.listen('click', fn)",
      "button.addEventListener('click', fn)",
      "button.on('click', fn)",
      "button.click(fn)",
    ],
    correctAnswer: "button.addEventListener('click', fn)",
    difficulty: "easy",
    category: "DOM",
  },
  {
    question: "Which array method creates a new array with filtered elements?",
    options: ["map()", "filter()", "reduce()", "find()"],
    correctAnswer: "filter()",
    difficulty: "easy",
    category: "Arrays",
  },
  {
    question: "What is the output of: typeof undefined?",
    options: ["'null'", "'undefined'", "'object'", "'void'"],
    correctAnswer: "'undefined'",
    difficulty: "easy",
    category: "Data Types",
  },
  {
    question: "How do you write an arrow function?",
    options: ["function => ()", "() => {}", "=> () {}", "fn() => {}"],
    correctAnswer: "() => {}",
    difficulty: "easy",
    category: "Functions",
  },
  {
    question: "What does the 'break' statement do in a loop?",
    options: ["Skips current iteration", "Exits the loop", "Restarts the loop", "Pauses the loop"],
    correctAnswer: "Exits the loop",
    difficulty: "easy",
    category: "Loops",
  },
  {
    question: "Which property returns the number of elements in an array?",
    options: [".size", ".count", ".length", ".total"],
    correctAnswer: ".length",
    difficulty: "easy",
    category: "Arrays",
  },
  {
    question: "How do you access the first element of an array?",
    options: ["arr[1]", "arr[0]", "arr.first()", "arr.get(0)"],
    correctAnswer: "arr[0]",
    difficulty: "easy",
    category: "Arrays",
  },
  {
    question: "What is the correct way to write a for loop?",
    options: [
      "for (i = 0; i < 5; i++)",
      "for (let i = 0; i < 5; i++)",
      "for i in range(5)",
      "loop (i from 0 to 5)",
    ],
    correctAnswer: "for (let i = 0; i < 5; i++)",
    difficulty: "easy",
    category: "Loops",
  },
  {
    question: "Which method is used to join array elements into a string?",
    options: ["concat()", "join()", "merge()", "combine()"],
    correctAnswer: "join()",
    difficulty: "easy",
    category: "Arrays",
  },
  {
    question: "What does 'this' refer to in a regular function (non-strict)?",
    options: ["The function itself", "The global object", "undefined", "The parent scope"],
    correctAnswer: "The global object",
    difficulty: "easy",
    category: "Functions",
  },
  {
    question: "How do you convert a string to lowercase?",
    options: ["toLower()", "toLowerCase()", "lower()", "caseLower()"],
    correctAnswer: "toLowerCase()",
    difficulty: "easy",
    category: "Strings",
  },
  {
    question: "Which value is NOT falsy in JavaScript?",
    options: ["0", "''", "'false'", "null"],
    correctAnswer: "'false'",
    difficulty: "easy",
    category: "Data Types",
  },
  {
    question: "What is the output of: 10 % 3?",
    options: ["3", "1", "0", "3.33"],
    correctAnswer: "1",
    difficulty: "easy",
    category: "Operators",
  },
  {
    question: "Which built-in method sorts an array?",
    options: ["order()", "arrange()", "sort()", "organize()"],
    correctAnswer: "sort()",
    difficulty: "easy",
    category: "Arrays",
  },
  {
    question: "How do you check if a variable is an array?",
    options: ["typeof arr", "arr instanceof Array", "Array.isArray(arr)", "Both instanceof and isArray"],
    correctAnswer: "Both instanceof and isArray",
    difficulty: "easy",
    category: "Arrays",
  },
  {
    question: "What is template literal syntax in ES6?",
    options: ["'Hello ' + name", "`Hello ${name}`", '"Hello #{name}"', "'Hello @{name}'"],
    correctAnswer: "`Hello ${name}`",
    difficulty: "easy",
    category: "Strings",
  },
  {
    question: "Which method removes the first element of an array?",
    options: ["pop()", "unshift()", "shift()", "splice(0, 1)"],
    correctAnswer: "shift()",
    difficulty: "easy",
    category: "Arrays",
  },
  {
    question: "What does the 'continue' keyword do in a loop?",
    options: ["Exits the loop", "Skips to next iteration", "Restarts the loop", "Breaks the function"],
    correctAnswer: "Skips to next iteration",
    difficulty: "easy",
    category: "Loops",
  },
  {
    question: "How do you create a multi-line string in JavaScript?",
    options: ["Using \\n", "Using backticks ``", "Using + operator", "All of the above"],
    correctAnswer: "All of the above",
    difficulty: "easy",
    category: "Strings",
  },
  {
    question: "What does parseInt('42px') return?",
    options: ["NaN", "42", "'42'", "0"],
    correctAnswer: "42",
    difficulty: "easy",
    category: "Data Types",
  },
  {
    question: "Which method checks if an array contains a specific value?",
    options: ["contains()", "has()", "includes()", "exists()"],
    correctAnswer: "includes()",
    difficulty: "easy",
    category: "Arrays",
  },
  {
    question: "What is the output of: !true?",
    options: ["true", "false", "null", "1"],
    correctAnswer: "false",
    difficulty: "easy",
    category: "Operators",
  },
  {
    question: "How do you get the current date in JavaScript?",
    options: ["Date.current()", "new Date()", "Date.now()", "Both new Date() and Date.now()"],
    correctAnswer: "Both new Date() and Date.now()",
    difficulty: "easy",
    category: "Objects",
  },
  {
    question: "What is the output of: '5' - 3?",
    options: ["'53'", "2", "NaN", "'2'"],
    correctAnswer: "2",
    difficulty: "easy",
    category: "Operators",
  },
  {
    question: "Which keyword stops a function and returns a value?",
    options: ["break", "exit", "return", "stop"],
    correctAnswer: "return",
    difficulty: "easy",
    category: "Functions",
  },
  {
    question: "What does console.log() do?",
    options: ["Writes to a file", "Prints output to the console", "Creates a log file", "Sends data to server"],
    correctAnswer: "Prints output to the console",
    difficulty: "easy",
    category: "Variables",
  },
  {
    question: "Which method creates a shallow copy of an array?",
    options: ["copy()", "clone()", "slice()", "duplicate()"],
    correctAnswer: "slice()",
    difficulty: "easy",
    category: "Arrays",
  },
  {
    question: "How do you declare a constant in JavaScript?",
    options: ["constant x = 5", "const x = 5", "let constant x = 5", "final x = 5"],
    correctAnswer: "const x = 5",
    difficulty: "easy",
    category: "Variables",
  },
];

// ---------------------------------------------------------------------------
// 50 MEDIUM QUESTIONS
// ---------------------------------------------------------------------------
const mediumQuestions = [
  {
    question: "What is a closure in JavaScript?",
    options: [
      "A function with no parameters",
      "A function that remembers its outer scope variables",
      "A self-executing function",
      "A function inside a class",
    ],
    correctAnswer: "A function that remembers its outer scope variables",
    difficulty: "medium",
    category: "Closures",
  },
  {
    question: "What is the output of: [1, 2, 3].map(x => x * 2)?",
    options: ["[1, 2, 3]", "[2, 4, 6]", "[1, 4, 9]", "[3, 6, 9]"],
    correctAnswer: "[2, 4, 6]",
    difficulty: "medium",
    category: "Array Methods",
  },
  {
    question: "What is the difference between 'let' and 'var'?",
    options: [
      "No difference",
      "let is block-scoped, var is function-scoped",
      "var is block-scoped, let is function-scoped",
      "let cannot be reassigned",
    ],
    correctAnswer: "let is block-scoped, var is function-scoped",
    difficulty: "medium",
    category: "Scope",
  },
  {
    question: "What does the spread operator (...) do with arrays?",
    options: [
      "Removes duplicates",
      "Spreads elements into individual values",
      "Reverses the array",
      "Flattens nested arrays",
    ],
    correctAnswer: "Spreads elements into individual values",
    difficulty: "medium",
    category: "Spread/Rest",
  },
  {
    question: "What is destructuring in JavaScript?",
    options: [
      "Deleting properties from objects",
      "Extracting values from arrays or objects into variables",
      "Destroying object references",
      "Converting objects to arrays",
    ],
    correctAnswer: "Extracting values from arrays or objects into variables",
    difficulty: "medium",
    category: "Destructuring",
  },
  {
    question: "What does Promise.all() do?",
    options: [
      "Runs promises sequentially",
      "Resolves when ALL promises resolve, rejects if ANY rejects",
      "Resolves when any promise resolves",
      "Cancels all pending promises",
    ],
    correctAnswer: "Resolves when ALL promises resolve, rejects if ANY rejects",
    difficulty: "medium",
    category: "Promises",
  },
  {
    question: "What is the output of: typeof NaN?",
    options: ["'NaN'", "'undefined'", "'number'", "'object'"],
    correctAnswer: "'number'",
    difficulty: "medium",
    category: "Data Types",
  },
  {
    question: "Which array method executes a function for each element without returning a new array?",
    options: ["map()", "forEach()", "filter()", "reduce()"],
    correctAnswer: "forEach()",
    difficulty: "medium",
    category: "Array Methods",
  },
  {
    question: "What is hoisting in JavaScript?",
    options: [
      "Moving code to another file",
      "Declarations are moved to the top of their scope before execution",
      "Increasing variable values",
      "Importing modules",
    ],
    correctAnswer: "Declarations are moved to the top of their scope before execution",
    difficulty: "medium",
    category: "Scope",
  },
  {
    question: "What is the output of: [1,2,3].reduce((acc, val) => acc + val, 0)?",
    options: ["[1, 2, 3]", "6", "123", "0"],
    correctAnswer: "6",
    difficulty: "medium",
    category: "Array Methods",
  },
  {
    question: "What is the purpose of the 'rest' parameter (...args)?",
    options: [
      "To pause function execution",
      "To collect remaining arguments into an array",
      "To spread array elements",
      "To define default values",
    ],
    correctAnswer: "To collect remaining arguments into an array",
    difficulty: "medium",
    category: "Spread/Rest",
  },
  {
    question: "What does Object.keys() return?",
    options: [
      "An array of values",
      "An array of key-value pairs",
      "An array of property names",
      "The object itself",
    ],
    correctAnswer: "An array of property names",
    difficulty: "medium",
    category: "Object Methods",
  },
  {
    question: "What is the temporal dead zone (TDZ)?",
    options: [
      "Time between midnight and 6am in server time",
      "Period between variable declaration and initialization for let/const",
      "A JavaScript garbage collection phase",
      "The time a promise is pending",
    ],
    correctAnswer: "Period between variable declaration and initialization for let/const",
    difficulty: "medium",
    category: "Scope",
  },
  {
    question: "What is the output of: { ...{a: 1, b: 2}, b: 3 }?",
    options: ["{a: 1, b: 2}", "{a: 1, b: 3}", "{a: 1, b: 2, b: 3}", "Error"],
    correctAnswer: "{a: 1, b: 3}",
    difficulty: "medium",
    category: "Spread/Rest",
  },
  {
    question: "How does the 'try...catch' block work?",
    options: [
      "try runs first, catch runs if an error occurs",
      "Both run simultaneously",
      "catch runs first, try runs if no error",
      "Only one of them runs randomly",
    ],
    correctAnswer: "try runs first, catch runs if an error occurs",
    difficulty: "medium",
    category: "Error Handling",
  },
  {
    question: "What is the 'finally' block used for?",
    options: [
      "Runs only on success",
      "Runs only on error",
      "Always runs regardless of try/catch result",
      "Prevents code from running",
    ],
    correctAnswer: "Always runs regardless of try/catch result",
    difficulty: "medium",
    category: "Error Handling",
  },
  {
    question: "What is the output of: [...'hello']?",
    options: ["'hello'", "['h','e','l','l','o']", "['hello']", "Error"],
    correctAnswer: "['h','e','l','l','o']",
    difficulty: "medium",
    category: "Spread/Rest",
  },
  {
    question: "What does Object.freeze() do?",
    options: [
      "Deletes all properties",
      "Makes object immutable (no add/modify/delete)",
      "Deep copies the object",
      "Converts to JSON",
    ],
    correctAnswer: "Makes object immutable (no add/modify/delete)",
    difficulty: "medium",
    category: "Object Methods",
  },
  {
    question: "What is the difference between null and undefined?",
    options: [
      "No difference",
      "null is intentional absence, undefined means not assigned",
      "undefined is intentional absence, null means not assigned",
      "Both mean zero",
    ],
    correctAnswer: "null is intentional absence, undefined means not assigned",
    difficulty: "medium",
    category: "Data Types",
  },
  {
    question: "How do you create a Promise?",
    options: [
      "new Promise(callback)",
      "new Promise((resolve, reject) => {})",
      "Promise.create()",
      "Promise.new()",
    ],
    correctAnswer: "new Promise((resolve, reject) => {})",
    difficulty: "medium",
    category: "Promises",
  },
  {
    question: "What does Array.from() do?",
    options: [
      "Creates array from another array",
      "Creates an array from array-like or iterable objects",
      "Converts array to object",
      "Removes elements from array",
    ],
    correctAnswer: "Creates an array from array-like or iterable objects",
    difficulty: "medium",
    category: "Array Methods",
  },
  {
    question: "What is the output of: 0.1 + 0.2 === 0.3?",
    options: ["true", "false", "undefined", "NaN"],
    correctAnswer: "false",
    difficulty: "medium",
    category: "Data Types",
  },
  {
    question: "What is the 'prototype chain' in JavaScript?",
    options: [
      "A way to chain function calls",
      "Objects inherit properties from their prototype objects",
      "A linked list structure",
      "A method for creating arrays",
    ],
    correctAnswer: "Objects inherit properties from their prototype objects",
    difficulty: "medium",
    category: "Prototypes",
  },
  {
    question: "What is the output of: (function() { return typeof arguments; })()?",
    options: ["'array'", "'object'", "'arguments'", "'undefined'"],
    correctAnswer: "'object'",
    difficulty: "medium",
    category: "Functions",
  },
  {
    question: "What does the 'new' keyword do?",
    options: [
      "Creates a new variable",
      "Creates a new object, sets prototype, and calls constructor",
      "Just calls the function",
      "Creates a copy of an object",
    ],
    correctAnswer: "Creates a new object, sets prototype, and calls constructor",
    difficulty: "medium",
    category: "Prototypes",
  },
  {
    question: "What is the output of: [1,2,3].find(x => x > 1)?",
    options: ["[2, 3]", "2", "true", "1"],
    correctAnswer: "2",
    difficulty: "medium",
    category: "Array Methods",
  },
  {
    question: "What is optional chaining (?.) used for?",
    options: [
      "Creating optional parameters",
      "Safely accessing nested properties that might be null/undefined",
      "Making variables optional",
      "Chaining promises",
    ],
    correctAnswer: "Safely accessing nested properties that might be null/undefined",
    difficulty: "medium",
    category: "ES6+",
  },
  {
    question: "What does the nullish coalescing operator (??) do?",
    options: [
      "Checks for null only",
      "Returns right operand when left is null or undefined",
      "Same as || operator",
      "Throws an error on null",
    ],
    correctAnswer: "Returns right operand when left is null or undefined",
    difficulty: "medium",
    category: "ES6+",
  },
  {
    question: "What is the difference between .map() and .forEach()?",
    options: [
      "No difference",
      "map returns a new array, forEach returns undefined",
      "forEach returns a new array, map returns undefined",
      "map modifies the original array",
    ],
    correctAnswer: "map returns a new array, forEach returns undefined",
    difficulty: "medium",
    category: "Array Methods",
  },
  {
    question: "What is the output of: Object.assign({}, {a:1}, {b:2})?",
    options: ["{a:1}", "{b:2}", "{a:1, b:2}", "{}"],
    correctAnswer: "{a:1, b:2}",
    difficulty: "medium",
    category: "Object Methods",
  },
  {
    question: "What is a higher-order function?",
    options: [
      "A function that runs faster",
      "A function that takes or returns another function",
      "A function in the global scope",
      "A recursive function",
    ],
    correctAnswer: "A function that takes or returns another function",
    difficulty: "medium",
    category: "Functions",
  },
  {
    question: "What does Symbol() create?",
    options: [
      "A string",
      "A unique and immutable identifier",
      "A number",
      "An object",
    ],
    correctAnswer: "A unique and immutable identifier",
    difficulty: "medium",
    category: "ES6+",
  },
  {
    question: "What is the Set data structure used for?",
    options: [
      "Storing key-value pairs",
      "Storing unique values only",
      "Creating ordered lists",
      "Defining constants",
    ],
    correctAnswer: "Storing unique values only",
    difficulty: "medium",
    category: "ES6+",
  },
  {
    question: "What is the Map data structure in ES6?",
    options: [
      "Same as .map() method",
      "Key-value pairs where keys can be any type",
      "An array mapping function",
      "A layout component",
    ],
    correctAnswer: "Key-value pairs where keys can be any type",
    difficulty: "medium",
    category: "ES6+",
  },
  {
    question: "What is the output of: typeof (() => {})?",
    options: ["'arrow'", "'function'", "'object'", "'undefined'"],
    correctAnswer: "'function'",
    difficulty: "medium",
    category: "Functions",
  },
  {
    question: "How do arrow functions differ from regular functions regarding 'this'?",
    options: [
      "No difference",
      "Arrow functions don't have their own 'this', they inherit from parent scope",
      "Arrow functions create a new 'this'",
      "Arrow functions bind 'this' to window",
    ],
    correctAnswer: "Arrow functions don't have their own 'this', they inherit from parent scope",
    difficulty: "medium",
    category: "Functions",
  },
  {
    question: "What does the 'in' operator check?",
    options: [
      "If value exists in array",
      "If property exists in object",
      "If variable is defined",
      "If number is in range",
    ],
    correctAnswer: "If property exists in object",
    difficulty: "medium",
    category: "Operators",
  },
  {
    question: "What is the output of: [...new Set([1,2,2,3,3])]?",
    options: ["[1,2,2,3,3]", "[1,2,3]", "[2,3]", "Error"],
    correctAnswer: "[1,2,3]",
    difficulty: "medium",
    category: "ES6+",
  },
  {
    question: "What is the purpose of Object.entries()?",
    options: [
      "Returns array of keys",
      "Returns array of values",
      "Returns array of [key, value] pairs",
      "Returns the object length",
    ],
    correctAnswer: "Returns array of [key, value] pairs",
    difficulty: "medium",
    category: "Object Methods",
  },
  {
    question: "What does .flat() do on arrays?",
    options: [
      "Sorts the array",
      "Creates a new array with sub-array elements concatenated",
      "Removes duplicates",
      "Converts to string",
    ],
    correctAnswer: "Creates a new array with sub-array elements concatenated",
    difficulty: "medium",
    category: "Array Methods",
  },
  {
    question: "What is the output of: Promise.resolve(42).then(v => v + 1)?",
    options: ["42", "43", "Promise that resolves to 43", "undefined"],
    correctAnswer: "Promise that resolves to 43",
    difficulty: "medium",
    category: "Promises",
  },
  {
    question: "What is short-circuit evaluation?",
    options: [
      "A type of loop",
      "Logical operators stop evaluating as soon as result is determined",
      "A conditional statement",
      "Error in circuit logic",
    ],
    correctAnswer: "Logical operators stop evaluating as soon as result is determined",
    difficulty: "medium",
    category: "Operators",
  },
  {
    question: "What is the purpose of 'use strict'?",
    options: [
      "Makes code run faster",
      "Enables strict mode with additional error checking",
      "Disallows functions",
      "Makes variables constant",
    ],
    correctAnswer: "Enables strict mode with additional error checking",
    difficulty: "medium",
    category: "Scope",
  },
  {
    question: "What does the 'delete' operator do?",
    options: [
      "Deletes a variable",
      "Removes a property from an object",
      "Clears memory",
      "Removes an array element",
    ],
    correctAnswer: "Removes a property from an object",
    difficulty: "medium",
    category: "Operators",
  },
  {
    question: "What is the output of: [10, 5, 40, 25].sort()?",
    options: ["[5, 10, 25, 40]", "[10, 25, 40, 5]", "[10, 5, 25, 40]", "[40, 25, 10, 5]"],
    correctAnswer: "[10, 25, 40, 5]",
    difficulty: "medium",
    category: "Array Methods",
  },
  {
    question: "What is debouncing?",
    options: [
      "Calling a function immediately",
      "Delaying function execution until after a pause in calls",
      "Running function twice",
      "Canceling all events",
    ],
    correctAnswer: "Delaying function execution until after a pause in calls",
    difficulty: "medium",
    category: "Functions",
  },
  {
    question: "What is the difference between .slice() and .splice()?",
    options: [
      "No difference",
      "slice returns new array without modifying original; splice modifies original",
      "splice returns new array without modifying original",
      "Both modify the original array",
    ],
    correctAnswer: "slice returns new array without modifying original; splice modifies original",
    difficulty: "medium",
    category: "Array Methods",
  },
  {
    question: "What does JSON.stringify() do with functions in objects?",
    options: [
      "Converts them to strings",
      "Omits them from the output",
      "Throws an error",
      "Converts them to null",
    ],
    correctAnswer: "Omits them from the output",
    difficulty: "medium",
    category: "Data Types",
  },
  {
    question: "What is event bubbling?",
    options: [
      "Events start from the target and propagate up to ancestors",
      "Events start from the root and propagate down",
      "Events fire randomly",
      "Events only fire on the target element",
    ],
    correctAnswer: "Events start from the target and propagate up to ancestors",
    difficulty: "medium",
    category: "DOM",
  },
  {
    question: "What is the 'this' keyword in a class method?",
    options: [
      "The global object",
      "The class instance",
      "undefined",
      "The prototype",
    ],
    correctAnswer: "The class instance",
    difficulty: "medium",
    category: "Prototypes",
  },
];

// ---------------------------------------------------------------------------
// 50 HARD QUESTIONS
// ---------------------------------------------------------------------------
const hardQuestions = [
  {
    question: "What is the output of: async function f(){ return 1; } f().then(console.log)?",
    options: ["1", "Promise {1}", "undefined", "Error"],
    correctAnswer: "1",
    difficulty: "hard",
    category: "Async/Await",
  },
  {
    question: "What is the event loop in JavaScript?",
    options: [
      "A loop that handles DOM events",
      "A mechanism that executes callbacks from the task queue when the call stack is empty",
      "A built-in for...of loop",
      "A recursive function pattern",
    ],
    correctAnswer: "A mechanism that executes callbacks from the task queue when the call stack is empty",
    difficulty: "hard",
    category: "Event Loop",
  },
  {
    question: "In which order do these execute: setTimeout, Promise.then, console.log?",
    options: [
      "setTimeout → Promise → console.log",
      "console.log → setTimeout → Promise",
      "console.log → Promise.then → setTimeout",
      "Promise → console.log → setTimeout",
    ],
    correctAnswer: "console.log → Promise.then → setTimeout",
    difficulty: "hard",
    category: "Event Loop",
  },
  {
    question: "What is a generator function?",
    options: [
      "A function that generates random numbers",
      "A function that can pause and resume using yield",
      "A function that creates other functions",
      "A constructor function",
    ],
    correctAnswer: "A function that can pause and resume using yield",
    difficulty: "hard",
    category: "Generators",
  },
  {
    question: "What is the output of: console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3));",
    options: ["1, 2, 3", "1, 3, 2", "3, 1, 2", "2, 1, 3"],
    correctAnswer: "1, 3, 2",
    difficulty: "hard",
    category: "Event Loop",
  },
  {
    question: "What is a Proxy in JavaScript?",
    options: [
      "A design pattern for caching",
      "An object that intercepts and customizes operations on another object",
      "A type of Promise",
      "A web server middleware",
    ],
    correctAnswer: "An object that intercepts and customizes operations on another object",
    difficulty: "hard",
    category: "Proxies",
  },
  {
    question: "What is the difference between WeakMap and Map?",
    options: [
      "No difference",
      "WeakMap keys must be objects and are garbage collected when no other references exist",
      "WeakMap is faster",
      "WeakMap can have string keys",
    ],
    correctAnswer: "WeakMap keys must be objects and are garbage collected when no other references exist",
    difficulty: "hard",
    category: "WeakMap/WeakSet",
  },
  {
    question: "What does 'await' do inside an async function?",
    options: [
      "Blocks the entire thread",
      "Pauses the async function until the promise resolves, without blocking the thread",
      "Creates a new thread",
      "Throws an error",
    ],
    correctAnswer: "Pauses the async function until the promise resolves, without blocking the thread",
    difficulty: "hard",
    category: "Async/Await",
  },
  {
    question: "What is the Reflect API used for?",
    options: [
      "DOM manipulation",
      "Provides methods for interceptable JavaScript operations (mirrors Proxy traps)",
      "Image reflection effects",
      "Code reflection and comments",
    ],
    correctAnswer: "Provides methods for interceptable JavaScript operations (mirrors Proxy traps)",
    difficulty: "hard",
    category: "Proxies",
  },
  {
    question: "What is tail call optimization?",
    options: [
      "Optimizing the last function call",
      "Reusing the current stack frame for the last function call in a function to prevent stack overflow",
      "Removing unused variables",
      "Caching function results",
    ],
    correctAnswer: "Reusing the current stack frame for the last function call in a function to prevent stack overflow",
    difficulty: "hard",
    category: "Performance",
  },
  {
    question: "What is the output of: typeof class {}?",
    options: ["'class'", "'object'", "'function'", "'undefined'"],
    correctAnswer: "'function'",
    difficulty: "hard",
    category: "ES6+",
  },
  {
    question: "How does garbage collection work in JavaScript?",
    options: [
      "Manual memory management",
      "Mark-and-sweep algorithm removes objects with no references",
      "Objects are deleted after a timeout",
      "Memory is never freed",
    ],
    correctAnswer: "Mark-and-sweep algorithm removes objects with no references",
    difficulty: "hard",
    category: "Memory Management",
  },
  {
    question: "What is the Module pattern in JavaScript?",
    options: [
      "Using import/export statements",
      "Using IIFE to create private scope and expose public API",
      "Creating npm modules",
      "Splitting code into files",
    ],
    correctAnswer: "Using IIFE to create private scope and expose public API",
    difficulty: "hard",
    category: "Design Patterns",
  },
  {
    question: "What is the Observer pattern?",
    options: [
      "Watching file changes",
      "An object maintains a list of dependents and notifies them on state changes",
      "Using try-catch",
      "Monitoring API calls",
    ],
    correctAnswer: "An object maintains a list of dependents and notifies them on state changes",
    difficulty: "hard",
    category: "Design Patterns",
  },
  {
    question: "What is the output of: for(var i=0; i<3; i++){ setTimeout(()=>console.log(i), 0); }?",
    options: ["0, 1, 2", "3, 3, 3", "undefined x3", "0, 0, 0"],
    correctAnswer: "3, 3, 3",
    difficulty: "hard",
    category: "Closures",
  },
  {
    question: "How would you fix the above code to print 0, 1, 2?",
    options: [
      "Use 'let' instead of 'var'",
      "Use 'const' instead of 'var'",
      "Remove setTimeout",
      "Use setInterval instead",
    ],
    correctAnswer: "Use 'let' instead of 'var'",
    difficulty: "hard",
    category: "Closures",
  },
  {
    question: "What is the purpose of Web Workers?",
    options: [
      "To style web pages",
      "To run JavaScript in background threads without blocking the UI",
      "To handle HTTP requests",
      "To manage cookies",
    ],
    correctAnswer: "To run JavaScript in background threads without blocking the UI",
    difficulty: "hard",
    category: "Performance",
  },
  {
    question: "What is memoization?",
    options: [
      "Adding comments to code",
      "Caching function results based on inputs to avoid repeated computation",
      "Creating memo notes in code",
      "A type of recursion",
    ],
    correctAnswer: "Caching function results based on inputs to avoid repeated computation",
    difficulty: "hard",
    category: "Performance",
  },
  {
    question: "What is the output of: Object.create(null)?",
    options: [
      "{}",
      "An object with no prototype chain",
      "null",
      "Error",
    ],
    correctAnswer: "An object with no prototype chain",
    difficulty: "hard",
    category: "Prototypes",
  },
  {
    question: "What is currying in JavaScript?",
    options: [
      "A cooking function",
      "Transforming a function with multiple args into a sequence of functions each taking one arg",
      "A loop pattern",
      "Error handling pattern",
    ],
    correctAnswer: "Transforming a function with multiple args into a sequence of functions each taking one arg",
    difficulty: "hard",
    category: "Functions",
  },
  {
    question: "What is the difference between microtasks and macrotasks?",
    options: [
      "No difference",
      "Microtasks (Promises) execute before macrotasks (setTimeout) in each event loop tick",
      "Macrotasks execute first",
      "They execute simultaneously",
    ],
    correctAnswer: "Microtasks (Promises) execute before macrotasks (setTimeout) in each event loop tick",
    difficulty: "hard",
    category: "Event Loop",
  },
  {
    question: "What does Symbol.iterator do?",
    options: [
      "Creates a loop",
      "Defines the default iteration behavior for an object",
      "Counts array elements",
      "Iterates over strings",
    ],
    correctAnswer: "Defines the default iteration behavior for an object",
    difficulty: "hard",
    category: "Generators",
  },
  {
    question: "What is the Singleton pattern?",
    options: [
      "Creating a single variable",
      "A pattern that restricts a class to a single instance",
      "Using only one function",
      "A single-page application",
    ],
    correctAnswer: "A pattern that restricts a class to a single instance",
    difficulty: "hard",
    category: "Design Patterns",
  },
  {
    question: "What is tree shaking in JavaScript bundlers?",
    options: [
      "Randomly removing code",
      "Eliminating unused/dead code from the final bundle",
      "Restructuring code",
      "Creating DOM trees",
    ],
    correctAnswer: "Eliminating unused/dead code from the final bundle",
    difficulty: "hard",
    category: "Modules",
  },
  {
    question: "What is the output of: async function f() { throw 1; } f().catch(console.log);",
    options: ["undefined", "1", "Error object", "Unhandled rejection"],
    correctAnswer: "1",
    difficulty: "hard",
    category: "Async/Await",
  },
  {
    question: "What is the purpose of structuredClone()?",
    options: [
      "Shallow copies an object",
      "Deep clones an object including nested structures",
      "Copies CSS styles",
      "Creates a new class instance",
    ],
    correctAnswer: "Deep clones an object including nested structures",
    difficulty: "hard",
    category: "Objects",
  },
  {
    question: "What is the difference between import and require?",
    options: [
      "No difference",
      "import is ES Modules (static), require is CommonJS (dynamic)",
      "require is newer",
      "import only works in Node.js",
    ],
    correctAnswer: "import is ES Modules (static), require is CommonJS (dynamic)",
    difficulty: "hard",
    category: "Modules",
  },
  {
    question: "What is the AbortController used for?",
    options: [
      "Stopping JavaScript execution",
      "Canceling fetch requests and other asynchronous operations",
      "Closing the browser",
      "Preventing errors",
    ],
    correctAnswer: "Canceling fetch requests and other asynchronous operations",
    difficulty: "hard",
    category: "Async/Await",
  },
  {
    question: "What is XSS (Cross-Site Scripting)?",
    options: [
      "A CSS framework",
      "Injecting malicious scripts into web pages viewed by other users",
      "A cross-browser API",
      "A JavaScript testing tool",
    ],
    correctAnswer: "Injecting malicious scripts into web pages viewed by other users",
    difficulty: "hard",
    category: "Security",
  },
  {
    question: "How do you prevent XSS attacks?",
    options: [
      "Using more CSS",
      "Sanitizing/escaping user input and using Content Security Policy",
      "Using stronger passwords",
      "Enabling CORS",
    ],
    correctAnswer: "Sanitizing/escaping user input and using Content Security Policy",
    difficulty: "hard",
    category: "Security",
  },
  {
    question: "What is the output of: Promise.race([new Promise(r => setTimeout(()=>r('a'), 100)), Promise.resolve('b')])?",
    options: ["'a'", "'b'", "['a','b']", "Promise that resolves to 'b'"],
    correctAnswer: "Promise that resolves to 'b'",
    difficulty: "hard",
    category: "Promises",
  },
  {
    question: "What is the Iterable protocol?",
    options: [
      "A network protocol",
      "An object must implement [Symbol.iterator] to be iterable in for...of loops",
      "A promise protocol",
      "An HTTP method",
    ],
    correctAnswer: "An object must implement [Symbol.iterator] to be iterable in for...of loops",
    difficulty: "hard",
    category: "Generators",
  },
  {
    question: "What is the output of: function* gen() { yield 1; yield 2; } const g = gen(); g.next(); g.next(); g.next();",
    options: [
      "{value: 3, done: false}",
      "{value: undefined, done: true}",
      "{value: 2, done: true}",
      "Error",
    ],
    correctAnswer: "{value: undefined, done: true}",
    difficulty: "hard",
    category: "Generators",
  },
  {
    question: "What is CORS and why does it exist?",
    options: [
      "A JavaScript library",
      "Cross-Origin Resource Sharing — a security mechanism to control cross-domain requests",
      "A CSS framework",
      "A Node.js module",
    ],
    correctAnswer: "Cross-Origin Resource Sharing — a security mechanism to control cross-domain requests",
    difficulty: "hard",
    category: "Security",
  },
  {
    question: "What is lazy loading in JavaScript?",
    options: [
      "Slow code execution",
      "Deferring loading of non-critical resources until they are needed",
      "Loading all resources at once",
      "A debugging technique",
    ],
    correctAnswer: "Deferring loading of non-critical resources until they are needed",
    difficulty: "hard",
    category: "Performance",
  },
  {
    question: "What is the purpose of the Intl API?",
    options: [
      "Internet connectivity",
      "Internationalization — formatting dates, numbers, and strings for different locales",
      "Integer operations",
      "Internal JavaScript operations",
    ],
    correctAnswer: "Internationalization — formatting dates, numbers, and strings for different locales",
    difficulty: "hard",
    category: "ES6+",
  },
  {
    question: "What is the output of: new Promise(r => r(1)).then(v => { throw v + 1; }).catch(console.log)?",
    options: ["1", "2", "Error object", "undefined"],
    correctAnswer: "2",
    difficulty: "hard",
    category: "Promises",
  },
  {
    question: "What is a memory leak in JavaScript?",
    options: [
      "Using too many variables",
      "Memory that is no longer needed but not released due to lingering references",
      "Running out of disk space",
      "A security vulnerability",
    ],
    correctAnswer: "Memory that is no longer needed but not released due to lingering references",
    difficulty: "hard",
    category: "Memory Management",
  },
  {
    question: "What common patterns cause memory leaks?",
    options: [
      "Using functions",
      "Forgotten timers, detached DOM refs, and closures holding large objects",
      "Using arrays",
      "Writing comments",
    ],
    correctAnswer: "Forgotten timers, detached DOM refs, and closures holding large objects",
    difficulty: "hard",
    category: "Memory Management",
  },
  {
    question: "What is the difference between Object.seal() and Object.freeze()?",
    options: [
      "No difference",
      "seal prevents add/delete but allows modification; freeze prevents all changes",
      "freeze allows adding properties",
      "seal makes deep immutability",
    ],
    correctAnswer: "seal prevents add/delete but allows modification; freeze prevents all changes",
    difficulty: "hard",
    category: "Objects",
  },
  {
    question: "What is the output of: (async () => { return await Promise.reject('error'); })().catch(console.log)?",
    options: ["undefined", "'error'", "Error object", "Unhandled rejection"],
    correctAnswer: "'error'",
    difficulty: "hard",
    category: "Async/Await",
  },
  {
    question: "What is the Factory pattern?",
    options: [
      "A manufacturing process",
      "A function that creates and returns objects without using 'new' keyword",
      "A singleton variant",
      "Building HTML elements",
    ],
    correctAnswer: "A function that creates and returns objects without using 'new' keyword",
    difficulty: "hard",
    category: "Design Patterns",
  },
  {
    question: "What is the purpose of requestAnimationFrame()?",
    options: [
      "Creating animations in CSS",
      "Scheduling code to run before the next browser repaint for smooth animations",
      "Loading animation files",
      "Pausing animations",
    ],
    correctAnswer: "Scheduling code to run before the next browser repaint for smooth animations",
    difficulty: "hard",
    category: "Performance",
  },
  {
    question: "What is the Temporal API in modern JavaScript?",
    options: [
      "A timing function",
      "A modern replacement for the Date object with better date/time handling",
      "A temporary variable store",
      "An event scheduling API",
    ],
    correctAnswer: "A modern replacement for the Date object with better date/time handling",
    difficulty: "hard",
    category: "ES6+",
  },
  {
    question: "What is the difference between for...in and for...of?",
    options: [
      "No difference",
      "for...in iterates over enumerable property keys; for...of iterates over iterable values",
      "for...of is for objects only",
      "for...in is for arrays only",
    ],
    correctAnswer: "for...in iterates over enumerable property keys; for...of iterates over iterable values",
    difficulty: "hard",
    category: "ES6+",
  },
  {
    question: "What is the Service Worker API?",
    options: [
      "A server-side worker thread",
      "A script that runs in the background enabling offline features and push notifications",
      "A database worker",
      "A CSS service",
    ],
    correctAnswer: "A script that runs in the background enabling offline features and push notifications",
    difficulty: "hard",
    category: "Performance",
  },
  {
    question: "What is the output of: typeof Symbol('id')?",
    options: ["'string'", "'object'", "'symbol'", "'number'"],
    correctAnswer: "'symbol'",
    difficulty: "hard",
    category: "ES6+",
  },
  {
    question: "What is dynamic import()?",
    options: [
      "Importing with variables in the path",
      "Loading modules on demand at runtime returning a promise",
      "Importing all modules at once",
      "Importing CSS files",
    ],
    correctAnswer: "Loading modules on demand at runtime returning a promise",
    difficulty: "hard",
    category: "Modules",
  },
  {
    question: "What is the purpose of Proxy handler traps?",
    options: [
      "Debugging code",
      "Functions that intercept operations like get, set, has, and deleteProperty on objects",
      "Catching errors",
      "Network proxying",
    ],
    correctAnswer: "Functions that intercept operations like get, set, has, and deleteProperty on objects",
    difficulty: "hard",
    category: "Proxies",
  },
  {
    question: "What is the output of: Promise.allSettled([Promise.resolve(1), Promise.reject(2)])?",
    options: [
      "Error",
      "[1, 2]",
      "[{status:'fulfilled',value:1}, {status:'rejected',reason:2}]",
      "Promise that rejects with 2",
    ],
    correctAnswer: "[{status:'fulfilled',value:1}, {status:'rejected',reason:2}]",
    difficulty: "hard",
    category: "Promises",
  },
];

// =============================================================================
// SEED FUNCTION
// =============================================================================
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB for seeding");

    // Clear existing questions
    await Question.deleteMany({});
    console.log("🗑️  Cleared existing questions");

    // Combine all questions
    const allQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];

    // Insert all questions
    const inserted = await Question.insertMany(allQuestions);
    console.log(`\n🎮 Successfully seeded ${inserted.length} questions!`);
    console.log(`   📗 Easy:   ${easyQuestions.length} questions`);
    console.log(`   📙 Medium: ${mediumQuestions.length} questions`);
    console.log(`   📕 Hard:   ${hardQuestions.length} questions`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB. Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
