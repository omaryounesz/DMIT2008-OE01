// 1. import the data from the file (in lieu of e.g. a database / REST API)
import expenses from './expense-data.js';

// 2. grab relevant DOM elements
const expenseContainer = document.getElementById('expense-container');
const searchBox = document.getElementById('searchbox');
const expenseForm = document.getElementById('expense-form-add');
const submitButton = document.getElementById('submitter');

// FUNCTIONS: HTML rendering --------------------------------------------------
// 3. render out data into a grid of cards
function renderExpenses(expenseData) {
  // first, clear out existing HTML for the container (because we're about to re-render it)
  expenseContainer.innerHTML = "";

  // then, take our array of data, and render out a card for each one
  // for a given expense, add a new card containing that data to the expenseContainer's inner HTML
  expenseData.forEach(
    (expense) => {
      /* We can fix a pretty rookie mistake here: any HTML element's id attribute should be
         completely unique *across the whole DOM, regardless of element type*. Here, we have:
           a) plain integer numbers (what if some other element somewhere else does that too? welp)
           b) using that value three times in the card (each id should be unique), and
           c) the card div doesn't even need an ID, because we never use it.

        We *could* just use more specific strings for the id, like "card-${expense.id}", instead of just the id.

        But the smart, magic-knowledge choice here is to use data-* attributes, which is something HTML
        lets us do for exactly this kind of scenario.
          (you don't need to go read this, but: https://developer.mozilla.org/en-US/docs/Web/HTML/How_to/Use_data_attributes)

        Basically, we can add new attributes that start with data- (followed by whatever else we want to name it),
        e.g. data-make, data-model, data-year for a car. We can still select DOM elements & get values using those,
        and they don't need to be unique.
        
        As an added bonus, JavaScript puts those all in a .dataset attribute on the DOM object (just like someDiv.id, someDiv.classList, etc.)
        e.g. in the car example, car.dataset.make, car.dataset.model, car.dataset.year
        (see handleExpenseContainerClick below for an example)

        Unrelatedly, we may as well remove the id entirely from the card div, since it's never used.
      */
      expenseContainer.innerHTML += `
      <div class="card">
        <div class="header">
          <div>
            <div class="title">${expense.title}</div>
            <div class="meta category">${expense.category}</div>
          </div>
          <div class="amount">$${expense.amount}</div>
        </div>
        <div class="meta date">${expense.date}</div>
        <div class="actions">
          <button class="edit-btn" data-id="${expense.id}">Edit</button>
          <button class="delete-btn" data-id="${expense.id}">Delete</button>
        </div>
      </div>
    `
    }
  );
}


// FUNCTIONS: expenses array logic -----------------------------------------
// 5 + 7. handle adding, editing, and deleting expenses
function addExpense({title, category, date, amount}) {
  expenses.push({
    id: expenses.length + 1,
    // ^ still objectively bad, because we can end up with duplicate IDs
    title,
    category,
    date,
    amount
  });
}

function updateExpense(id, fields) {
  const expense = expenses.find((expense) => expense.id === id);
  if (expense) Object.assign(expense, fields); 
  // Object.assign(target, source) overwrites target object with properties from source
}

function deleteExpense(id) {
  const index = expenses.findIndex((expense) => expense.id === id);
  if (index !== -1) expenses.splice(index, 1) 
  // if no index is found, findIndex returns -1
}

function searchExpenses(query) {
  const q = query.toLowerCase();
  return expenses.filter(
    (expense) => expense.title.toLowerCase().includes(q)
  );
}

// FUNCTIONS: form ------------------------------------------------------------
function readFormData() {
  return {
    title: document.getElementById("title").value,
    category: document.getElementById("category").value,
    date: document.getElementById("date").value,
    amount: parseFloat(document.getElementById("amount").value),
  };
}

function populateForm(expense) {
  document.getElementById("title").value = expense.title;
  document.getElementById("amount").value = expense.amount;
  document.getElementById("date").value = expense.date;
  document.getElementById("category").value = expense.category;
  document.getElementById("expense-id").value = expense.id;

  submitButton.innerText = "Save";
}

function validateFormData ({ title, category, date, amount }) {
  return title && category && date && !isNaN(amount);
}

function resetForm() {
  expenseForm.reset();
  submitButton.innerText = "Add Expense";
}

function handleFormSubmit(event) {
  event.preventDefault();
  const formFields = readFormData();

  if (!validateFormData(formFields)) {
    alert("Please fill in all fields correctly.");
    return; // we can use "if-return" rather than "if-else" to immediately exit this block of logic
  }

  if (submitButton.innerText === "Add Expense") {
    addExpense(formFields);
  } else {
    const id = parseInt(document.getElementById("expense-id").value);
    updateExpense(id, formFields);
  }

  // we can re-render/reset at the end here, cleanly,
  // because we only reach this point in the code if the inputs were valid!
  renderExpenses(expenses);
  resetForm();
}

// FUNCTIONS: user input/interaction ------------------------------------------
// 6 + 7. (ha ha) handle searching + edit/delete button clicks
function handleSearch(event) {
  const filteredExpenses = searchExpenses(event.target.value);
  renderExpenses(filteredExpenses);
}

function handleExpenseContainerClick(event) {
  // if there's no ID attribute for the click, this would just be undefined
  const id = parseInt(event.target.dataset.id); // and voila! data-* in the HTML just becomes dataset.* here.

  if (event.target.classList.contains("delete-btn")) {
    deleteExpense(id);
    renderExpenses(expenses);
  } else if (event.target.classList.contains("edit-btn")) {
    const expense = expenses.find((e) => e.id === id);
    if (expense) populateForm(expense);
  }
}


// LISTENERS ------------------------------------------------------------------
expenseForm.addEventListener("submit", handleFormSubmit);
searchBox.addEventListener("input", handleSearch);
expenseContainer.addEventListener("click", handleExpenseContainerClick);

document.addEventListener("DOMContentLoaded", (event) => { 
  renderExpenses(expenses);
});
// wrapping renderExpenses in this listener guarantees that the whole DOM is loaded
// before we start trying to inject into the UI — otherwise, we haven no guarantee of that!
