const balance = document.getElementById("balance");
const iplus = document.getElementById("money-plus");
const eminus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

//creating transactions array object from the local host and created transaction object
const localstoragetran = JSON.parse(localStorage.getItem("transactions"));
let transactions =
  localStorage.getItem("transactions") != null ? localstoragetran : [];

// add transaction after submitting details and amount
function addtrans(e) {
  e.preventDefault();
  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please enter a details and amount");
  } else {
    const transaction = {
      id: getid(),
      text: text.value,
      amount: +amount.value,
    };
    transactions.push(transaction);
    addinhistory(transaction);
    updatetransactions();
    updatelocalstorage();
    text.value = "";
    amount.value = "";
  }
}

// get random id of transaction
function getid() {
  return Math.floor(Math.random() * 100000000);
}

//adding in history
function addinhistory(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");
  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span> <button class="delete-btn" onclick="removetransaction(${
    transaction.id
  })">x</button>
  `;

  list.appendChild(item);
}

//update balance, income and expenses
function updatetransactions() {
  const amounts = transactions.map((transaction) => transaction.amount);
  //get the balance
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  //get the income
  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  //get the expenses
  const expenses = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  //load the data in the html text
  balance.innerText = `${total}/-`;
  iplus.innerText = `${income}/-`;
  eminus.innerText = `${expenses}/-`;
}

//remove the transaction after deleteing it from history
function removetransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updatelocalstorage();
  init();
}

//updating local storage with previous transactions and keep it as a string
function updatelocalstorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

//init function to refresh the page and initialize it from the start
function init() {
  list.innerHTML = "";
  transactions.forEach(addinhistory);
  updatetransactions();
}

//calling init app
init();

//submitting a details and amount
form.addEventListener("submit", addtrans);
