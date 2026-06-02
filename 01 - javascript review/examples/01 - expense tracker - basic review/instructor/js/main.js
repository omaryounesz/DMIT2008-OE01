// 1. import the data from the file (in lieu of e.g. a database / REST API)
import expenses from './expense-data.js';

// 2. grab relevant DOM elements
const expenseContainer = document.getElementById('expense-container');
const searchBox = document.getElementById('searchbox');
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

// 5. let's write all our code as inline first, then clean it up later
expenseForm.addEventListener(
  "submit",            // argument 1: the name/type of the event (e.g. submit, change, click -> these are HTML built-ins)
  function (event) {   // argument 2: the logic/function that should fire (with the event being passed to it by default)

    event.preventDefault(); // event built-in; preventing default behaviour on a form basically means "don't post data & reload page"

    // let's grab all our input elements/values
    const title = document.getElementById('title').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    const category = document.getElementById('category').value;

    // make a new expense if all the fields are present & amount is a number
    if (title && date && category && !isNaN(amount)) { // "isNaN": "is Not a Number"
      const newExpense = {
        // if object property name & variable name are the same you can just {value} instead of {property: value}
        id: expenses.length + 1,
        title,
        amount,
        date,
        category,
      };

      // a change in data -> ui should re-render (with vanilla JS, we have to trigger that manually)
      expenses.push(newExpense);
      renderExpenses(expenses);

      // after submitting, we want the form to reset
      expenseForm.reset();
      // you could also write this.reset() since the code scope for this listener is attached to expenseForm
      // as the parent object — "this" just refers to whatever the parent object for a block of code is
    }

});


/* 6. let's handle search filtration! we need:
      - the searchbox DOM element as an object (already done in step 2)
      - attach an event listener on it for change/input events
      - somehow filter the cards (i.e. the expenses array) based on the text in the searchbox
*/
searchBox.addEventListener(
  "input",            // arg 1: event type/name
  function (event) {  // arg 2: callback function that fires when event is emitted
    console.log(event);
    const searchTerm = event.target.value.toLowerCase();
    const filteredExpenses = expenses.filter(
      (expense) => expense.title.toLowerCase().includes(searchTerm)
    );
    renderExpenses(filteredExpenses);
  }
);

// 7. let's handle editing/deleting
// I only need one click listener for the whole card container; I can just narrow down later
// specifically what got clicked.
expenseContainer.addEventListener(
  "click",
  function(event) {
    // event.target will be *exactly* what got clicked within the expense container, not just
    // "always the container itself"
    if (event.target.classList.contains("delete-btn")) {
      // 1. get the ID of the card / data element that got clicked
      const expenseId = parseInt(event.target.id);
      // 2. now, I have to find where in the expenses array this object is.
      //     -> we can never safely assume that e.g. IDs don't have gaps, etc.;
      //        an ID isn't guaranteed to match the position of that object in the array
      const expenseIndex = expenses.findIndex(  // get me the index of the expense
        (expense) => expense.id === expenseId   // where the expense ID matches the ID on the button that got clicked
      );
      // 3. once we have the index, we can delete what's at that index in the array:
      if (expenseIndex !== -1) {          // findIndex returns -1 if it can't find a matching index ^
        expenses.splice(expenseIndex, 1); // "starting at {expenseIndex}, delete 1 thing" (i.e. just that expense)
        renderExpenses(expenses);         // data changed; therefore we re-render
      }

    } else if (event.target.classList.contains("edit-btn")) {
      // populate the form inputs w/ data from the element/card
      // somehow figure out a way to save back to that element/card instead of creating a new one
      // 1+2. get ID of card & find its index
      const expenseId = parseInt(event.target.id);
      const expenseToEdit = expenses.find(     // find the actual object (we need what's in it, as opposed to simply deleting)
        (expense) => expense.id === expenseId  // we still want a matching object based on ID
      );
      // 3. populate the form inputs with data from the expense item
      if (expenseToEdit) {
        document.getElementById("title").value = expenseToEdit.title;
        document.getElementById("amount").value = expenseToEdit.amount;
        document.getElementById("date").value = expenseToEdit.date;
        document.getElementById("category").value = expenseToEdit.category;
        document.getElementById("id").value = expenseToEdit.id;

        // bonus QOL: change button text depending on what we're doing
        document.getElementById("submitter").innerText = "Save";
      }

    }
  }
);