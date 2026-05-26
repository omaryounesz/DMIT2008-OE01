// 1. import the data from the file (in lieu of e.g. a database / REST API)
import expenses from './expense-data.js';

// 2. grab relevant DOM elements
const expenseContainer = document.getElementById('expense-container');
const searchTerm = document.getElementById('searchbox');
const expenseForm = document.getElementById('expense-form-add');

// 3. render out data into a grid of cards
function renderExpenses(expenseData) {
  // first, clear out existing HTML for the container (because we're about to re-render it)
  expenseContainer.innerHTML = "";

  // then, take our array of data, and render out a card for each one
  // for a given expense, add a new card containing that data to the expenseContainer's inner HTML
  expenseData.forEach(
    (expense) => {
      expenseContainer.innerHTML += ` 

      <div class="card" id="${expense.id}">
        <div class="header">
          <div>
            <div class="title">${expense.title}</div>
            <div class="meta category">${expense.category}</div>
          </div>
          <div class="amount">${expense.amount}</div>
        </div>
        <div class="meta date">${expense.date}</div>
        <div class="actions">
          <button class="edit-btn" id="${expense.id}">Edit</button>
          <button class="delete-btn" id="${expense.id}">Delete</button>
        </div>
      </div>
    `
    }
  );
}

// 4. call the function to actually do the render
renderExpenses(expenses);

expenseForm.addEventListener("change", function (event) { console.log(event.target.value); });

// 5. let's write all our code as inline first, then clean it up later
expenseForm.addEventListener(
  "submit",            // argument 1: the name/type of the event (e.g. submit, change, click -> these are HTML built-ins)
  function (event) {   // argument 2: the logic/function that should fire (with the event being passed to it by default)

    event.preventDefault(); // event built-in; preventing default behaviour on a form basically means "don't post data & reload page"

    // let's grab all our input elements/values
    const title = document.getElementById('title').value;
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;
    const category = document.getElementById('category').value;

    // let's write out our logic 'naively', and beef it up later
    const newExpense = {
      // if object property name & variable name are the same you can just {value} instead of {property: value}
      id: expenses.length + 1,
      title,
      amount,
      date,
      category,
    }

    // a change in data -> ui should re-render (with vanilla JS, we have to trigger that manually)
    expenses.push(newExpense);
    renderExpenses(expenses);

    // after submitting, we want the form to reset
    expenseForm.reset();
    // you could also write this.reset() since the code scope for this listener is attached to expenseForm
    // as the parent object — "this" just refers to whatever the parent object for a block of code is
});
