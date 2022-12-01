"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Kristijan Salijević",
  movements: [200, 450, -400, 299000, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2022-03-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2022-11-24T17:01:17.194Z",
    "2022-11-26T23:36:17.929Z",
    "2022-11-30T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "en-GB",
};

const account2 = {
  owner: "Karlo Cicko",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2022-11-24T17:01:17.194Z",
    "2022-11-26T23:36:17.929Z",
    "2022-11-30T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "en-GB",
};

const account3 = {
  owner: "Valentina Cicko",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2022-11-24T17:01:17.194Z",
    "2022-11-26T23:36:17.929Z",
    "2022-11-30T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "en-GB",
};

const account4 = {
  owner: "Jef Suurling",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2022-11-24T17:01:17.194Z",
    "2022-11-26T23:36:17.929Z",
    "2022-11-30T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "en-GB",
};

const accounts = [account1, account2, account3, account4];

// Current date
const now = new Date();

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// Functions

// Current date display parameters
const options = {
  hour: "numeric",
  minute: "numeric",
  day: "numeric",
  month: "long",
  year: "numeric",
  weekday: "long",
};

const formatMovementDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.abs(Math.round((date2 - date1) / (1000 * 60 * 60 * 24)));

  const dayPassed = calcDaysPassed(new Date(), date);
  console.log(dayPassed);

  // Days passed
  if (dayPassed === 0) return "Today";
  if (dayPassed === 1) return "Yesterday";
  if (dayPassed <= 7) return `${dayPassed} days ago`;
  else return new Intl.DateTimeFormat("en-GB").format(date);
};

// Computing username
const createUsername = function (accs) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsername(accounts);

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ""; // ispraznili smo movements container

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date);

    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${mov.toFixed(2)}€</div>
        </div>
        `;
    containerMovements.insertAdjacentHTML("afterbegin", html); //dodajemo kod koji smo stvorili sa html varijablom
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (accs) {
  const income = accs.movements
    .filter((inc) => inc > 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumIn.textContent = `${income.toFixed(2)}€`;

  const out = accs.movements
    .filter((out) => out < 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumOut.textContent = `${Math.abs(out.toFixed(2))}€`;

  const interest = accs.movements
    .filter((inc) => inc > 0)
    .map((deposit) => (deposit * accs.interestRate) / 100)
    .filter((deposit, i, arr) => {
      console.log(arr);
      return deposit >= 1;
    })
    .reduce((acc, sum) => acc + sum, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const updateUI = function (acc) {
  // display movements
  displayMovements(acc);

  // display balance
  calcDisplayBalance(acc);

  // display summary
  calcDisplaySummary(acc);
};

// Event handler
let currentAccount;

//Login
btnLogin.addEventListener("click", function (e) {
  e.preventDefault(); // prevent form from submiting

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //(?.)= optional chaining returns
    //undefined instead of throwing an error

    // Clear input fields
    inputLoginPin.value = "";
    inputLoginUsername.value = "";
    inputLoginPin.blur(); // cursos losses focus on pin input field

    // display UI and a welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;

    containerApp.style.opacity = 100;

    // Display date
    labelDate.textContent = new Intl.DateTimeFormat("en-GB", options).format(
      now
    );

    updateUI(currentAccount);
  } else if (
    currentAccount?.pin !== Number(inputLoginPin.value) ||
    currentAccount !== inputLoginUsername.value
  ) {
    alert("Wrong pin or username");
  }
});

// Transfer
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault(); // preventing refresh page

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  // clear input fields
  inputTransferAmount.value = inputTransferTo.value = "";
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    receiverAcc && // provjera dali postoji acc - ?. - sluzi da umjesto greške baci undefined
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // push dates
    currentAccount.movementsDates.push(now.toISOString());
    receiverAcc.movementsDates.push(now.toISOString());

    // update UI
    updateUI(currentAccount);

    console.log(currentAccount.movements);
    console.log(receiverAcc.movements);
  } else if (amount <= 0) {
    alert("Not valid transfer amount!");
  } else if (!receiverAcc) {
    alert("There is no account with this username.");
  } else if (currentAccount.balance < amount) {
    alert("Balance too low");
  }
});

// Request a lona
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    // add movement and
    // update UI with a timer
    setTimeout(() => {
      currentAccount.movements.push(amount);
      //pushing current date
      currentAccount.movementsDates.push(now.toISOString());
      updateUI(currentAccount);
    }, 1000);

    // clear input field
    inputLoanAmount.value = "";
    inputLoanAmount.blur();
  } else alert("The requested amount has to be at least 10% of the deposit");
});

// Close/delete account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  // Check username and pin
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    inputCloseUsername.value = inputClosePin.value = "";
    inputClosePin.blur();
    console.log("Closed account");

    //delete account
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);

    accounts.splice(index, 1);
    console.log(accounts);

    //hide UI
    containerApp.style.opacity = 0;

    // error message
  } else alert("Incorrect user information");
});

// Sort
let sorted = false;

btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
