'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Kristijan Salijević',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300, 296600],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Karlo Cicko',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Valentina Cicko',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Jef Suurling',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ''; // ispraznili smo movements container

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov.toFixed(2)}€</div>
        </div>
        `;
    containerMovements.insertAdjacentHTML('afterbegin', html); //dodajemo kod koji smo stvorili sa html varijablom
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (accs) {
  const income = accs.movements
    .filter(inc => inc > 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumIn.textContent = `${income.toFixed(2)}€`;

  const out = accs.movements
    .filter(out => out < 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  const interest = accs.movements
    .filter(inc => inc > 0)
    .map(deposit => (deposit * accs.interestRate) / 100)
    .filter((deposit, i, arr) => {
      console.log(arr);
      return deposit >= 1;
    })
    .reduce((acc, sum) => acc + sum, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const updateUI = function (acc) {
  // display movements
  displayMovements(acc.movements);

  // display balance
  calcDisplayBalance(acc);

  // display summary
  calcDisplaySummary(acc);
};

// Event handler
let currentAccount;

//Login
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // prevent form from submiting

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //(?.)= optional chaining returns
    //undefined instead of throwing an error

    // Clear input fields
    inputLoginPin.value = '';
    inputLoginUsername.value = '';
    inputLoginPin.blur(); // cursos losses focus on pin input field

    // display UI and a welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    updateUI(currentAccount);

    console.log('LOGIN');
  } else if (
    currentAccount?.pin !== Number(inputLoginPin.value) ||
    currentAccount !== inputLoginUsername.value
  ) {
    alert('Wrong pin or username');
  }
});

// Transfer
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault(); // preventing refresh page

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  // clear input fields
  inputTransferAmount.value = inputTransferTo.value = '';
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

    // update UI
    updateUI(currentAccount);

    console.log(currentAccount.movements);
    console.log(receiverAcc.movements);
  } else if (amount <= 0) {
    alert('Not valid transfer amount!');
  } else if (!receiverAcc) {
    alert('There is no account with this username.');
  } else if (currentAccount.balance < amount) {
    alert('Balance too low');
  }
});

// Request a lona
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // add movement and
    // update UI with a timer
    setTimeout(() => {
      currentAccount.movements.push(amount);
      updateUI(currentAccount);
    }, 2000);

    // clear input field
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  } else alert('The requested amount has to be at least 10% of the deposit');
});

// Close/delete account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  // Check username and pin
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    inputCloseUsername.value = inputClosePin.value = '';
    inputClosePin.blur();
    console.log('Closed account');

    //delete account
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    accounts.splice(index, 1);
    console.log(accounts);

    //hide UI
    containerApp.style.opacity = 0;

    // error message
  } else alert('Incorrect user information');
});

// Sort
let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

//console.log(containerMovements.innerHTML);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

/////////////////////////////////////////////////
//
// Computing username
const createUsername = function (accs) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsername(accounts);
console.log(account4.username);

const user = 'Steven Thomas Williams';
const username = user
  .toLowerCase()
  .split(' ')
  .map(name => name[0])
  .join('');

console.log(username);

/*
// SIMPLE ARRAY METHODS
// SLICE METHOD
let arr = ['a', 'b', 'c', 'd', 'e'];

console.log(arr.slice(2)); // it dosent mutate the base array, it returns a copy
console.log(arr.slice(2, 4)); // slice starting point and ending point
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice()); // copy of the whole array
console.log([...arr]); // its the same like slice()

// SPLICE METHOD
//console.log(arr.splice(2)); // it returns the removed elements from the array
arr.splice(-1);
arr.splice(1, 2);
console.log(arr); // splice mutates the main array

// REVERSE
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse()); // reverse changes the positions and mutates the array
console.log(arr2);

// CONCAT
const letters = arr.concat(arr2); // meergin 2 arrays into one
console.log(letters);
console.log([...arr, ...arr2]); // gives same result like spread

// JOIN
console.log(letters.join(' - ')); // meergin elements togheder

//
// THE NEW AT METHOD
const arr3 = [23, 11, 64];
console.log(arr3[0]); // old way
console.log(arr3.at(0)); // new way with at method

console.log(arr3[arr3.length - 1]);
console.log(arr3.slice(-1)[0]);
console.log(arr3.at(-1));

console.log('Jonas'.at(0)); // it also works with strings

//
// FOREACH LOOP
const movementsCopy = [200, 450, -400, 3000, -650, -130, 70, 1300];

//for (const movement of movementsCopy) {
for (const [i, movement] of movementsCopy.entries()) {
  // usporedba sa forEach
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`); // Math.abs removes the minus(-) on a number
}
// for of loop entries order: 1 current index, 2 current value ❗️
// for of loop you can break the loop while forEach you cant

console.log(' forEACH '.padStart(20, '-').padEnd(35, '-'));
// forEach
movementsCopy.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Movement ${i + 1}: You deposited ${mov}`);
  } else console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
});

// forEach entries order : 1 current element, 2 current index, 3 entire array ❗️
// forEach loops always the entire array

// background example of the forEach loop:
// 0: function(200)
// 1: function(450)
// 2: function(400)

//
// FOR EACH WITH MAPS AND SETS
//MAP
const currenciesCopy = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currenciesCopy.forEach(function (value, key, array) {
  console.log(`${key}: ${value}`);
});

//SET
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, key, map) {
  // set has only value
  console.log(`${key}: ${value}`); // u set je key i value isti jer nema key ni index
});
*/
//console.log('CHALLENGE #1'.padStart(20, '-').padEnd(30, '-'));

// CODING CHALLENGE #1

/*
Julia and Kate are doing a study on dogs. So each of them asked 5 dog
owners about their dog's age, and stored the data into an array (one array for each).
For now, they are just interested in knowing wether
a dog is an adult or a puppy. A dog is an adult if it
is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages
('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs 
actually have cats, not dogs!
So create a shallow copy of Julia's array, and remove the cat ages from that copied array
(because it's a bad pratice to mutate function parameters)

2. Create an array with both Julia's (corrected) and 
Kate's data

3. For each remaining dog, log to the console wether
it's an adult ("Dog number 1 is an adult, and is 5 years old")
or a puppy ("Dog number 2 is still a puppy 🐶")

4. run the function for both test datasets

TEST DATA 1: Julia's data [3, 5, 2, 12, 7],
             Kate's data: [4, 1, 15, 8, 3]

TEST DATA 2: Julia's data [9, 16, 6, 8, 3],
             Kate's data: [10, 5, 6, 1, 4]             
*/
/*
const dogsJulia = [3, 5, 2, 12, 7];
const dogsKate = [4, 1, 15, 8, 3];

const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaOnly = dogsJulia.slice(1, -2);
  const allDogs = [...dogsJuliaOnly, ...dogsKate];

  allDogs.forEach(function (dog, i) {
    const age =
      dog >= 3 ? `an adult, and is ${dog} years old` : 'still a puppy 🐶';
    console.log(`Dog number ${i + 1} is ${age}`);
  });
};

checkDogs(dogsJulia, dogsKate);
//console.log(dogsJulia);

// Data transformations : .map .filter .reduce, all 3 methods returning a new array
// .map
const arr = [2, 1, 5, 12];
arr.map(function (num) {
  console.log(num * 2);
});

// .filter
const arr2 = [3, 1, 4, 3, 2];
console.log(
  // returning an array only with numbers above 2
  arr2.filter(function (arr) {
    return arr > 2;
  })
);

// .reduce
console.log(
  // sum of all elements in the array into one value = total sum of all numbers in array
  arr.reduce(function (acc, val) {
    return acc + val;
  })
);

//
// .map method

const euroToUsd = 1.1;
const movementsNew = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const movementsUSD = movementsNew.map(function (mov) { //ovo je moderniji naćin i bolji naćin ❗️
//   return Math.trunc(mov * euroToUsd);
// });
// arrow function:
const movementsUSD = movementsNew.map(mov => Math.trunc(mov * euroToUsd));

console.log(movementsNew);
console.log(movementsUSD);

// primjer sa for of loop - na ovaj naćin moramo ručno kreirati array prazan
const arrUSD = [];
for (const mov of movementsNew) {
  arrUSD.push(Math.trunc(mov * euroToUsd));
}
console.log(arrUSD);

const movementsDescriptions = movementsNew.map(function (mov, i) {
  return `Movement ${
    i + 1
  }: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`;
});
console.log(movementsDescriptions); // dobili smo novi array sa ovim returnom
*/

// vjezba
const accInfo1 = {
  name: 'Valentina Cicko',
  pin: 1111,
};

const accInfo2 = {
  name: 'Karlo Cicko',
  pin: 1212,
};

const allAccs = [accInfo1, accInfo2];

const usernameGenerator2 = function (accounts) {
  accounts.forEach(function (acount) {
    acount.username = acount.name
      .toLowerCase()
      .split(' ')
      .map(userName => userName[0])
      .join('');
  });
};
usernameGenerator2(allAccs);
console.log(accInfo1.username, accInfo2.username);

//
// The filer Method
const movements0 = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movements0.filter(function (mov, i, arr) {
  // returns new arr numbers above 0
  return mov > 0;
});

console.log(deposits);

// primjer sa for of metodom
const deposits2 = [];
for (const mov of movements0) {
  if (mov > 0) {
    deposits2.push(mov);
  }
}
console.log(deposits2);

// small challenge - create an array with withdrawals
const withdrawal = movements0.filter(
  value => value < 0
  // ako je true onda returna value manje od 0
);
console.log(withdrawal);

//
// The reduce Method

// accumulator is like a SNOWBALL
// const balance = movements0.reduce(function (acc, cur, i, arr) {
// console.log(`Iteration ${i}: ${acc}`);
// with arrow function:
const balance = movements0.reduce((acc, val) => acc + val, 0);

// return acc + cur; // dobimo ukupno zbroj
console.log(balance);

// primjer sa for of loopom
let sum = 0;
for (const mov of movements0) {
  sum += mov;
}
console.log(sum);

// Maximum value
const maxValue = movements0.reduce(function (acc, val) {
  if (acc > val) {
    return acc;
  } else return val;
}, movements0[0]);

console.log(maxValue);

// arrow function + ternary
const maxValue2 = movements0.reduce(
  (acc, val) => (acc > val ? acc : val),
  movements0[0]
);
console.log(maxValue2);

//
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
// my results:

const juliasDogs = [5, 2, 4, 1, 15, 8, 3];
const katesDogs = [16, 6, 10, 5, 6, 1, 4];

const calcAge = function (ages) {
  console.log(
    ages
      .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
      .filter(age => age >= 18)
      .reduce((acc, age, i, arr) => acc + age / arr.length, 0)
  );
};

calcAge(juliasDogs);

const calcAverageHumanAge = function (dogAges) {
  return dogAges
    .map(dogAge => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
    .filter(humanAge => humanAge >= 18)
    .reduce((acc, val, i, arr) => acc + val / arr.length, 0);
};

console.log(calcAverageHumanAge(juliasDogs));
console.log(calcAverageHumanAge(katesDogs));

// Jonas results:
const calcAverageHumanAge0 = function (ages) {
  const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  const adults = humanAges.filter(age => age >= 18);
  const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;
  return average;
};

console.log(calcAverageHumanAge0(juliasDogs));
console.log(calcAverageHumanAge0(katesDogs));

// repeat

const acc1 = {
  name: 'Jony Wright',
  pin: 1313,
};
const acc2 = {
  name: 'Eddie Mc Hall',
  pin: 1315,
};
const accs = [acc1, acc2];

const loginGenerator = function (accs) {
  accs.forEach(
    acc =>
      (acc.username = acc.name
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join(''))
  );
};

loginGenerator(accs);
console.log(acc1.username);
console.log(acc2.username);

function getAge(inputString) {
  return parseInt(inputString);
  // return the girl's correct age as an integer. Happy coding :)
}

//
// The Chaining Methods
//movements0 = [200, 450, -400, 3000, -650, -130, 70, 1300];

// pipeline
const totalDepositsUSD = Math.trunc(
  movements0
    .filter(mov => mov > 0)
    .map((mov, i, arr) => {
      //console.log(arr); // checking array after filter method
      return mov * 1.1;
    })
    .reduce((acc, val) => acc + val, 0)
);

console.log(totalDepositsUSD);

//
// Coding Challenge #3
// revrite the calcAverageHumanAge function by using chaining

// 1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
// 2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
// 3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
// 4. Run the function for both test datasets

const juliasDogs0 = [5, 2, 4, 1, 15, 8, 3];
const katesDogs0 = [16, 6, 10, 5, 6, 1, 4];
const calcAverageHumanAge1 = function (dogAges) {
  return dogAges
    .map(dogAge => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
    .filter(humanAge => humanAge > 18)
    .reduce((acc, avg, i, arr) => acc + avg / arr.length, 0);
};
console.log(calcAverageHumanAge1(juliasDogs0));
console.log(calcAverageHumanAge1(katesDogs0));

//
// The Find Method
const firstWithdrawal = movements0.find(function (mov) {
  return mov < 0;
});
console.log(movements0);
console.log(firstWithdrawal);

console.log(accounts);
const account = accounts.find(acc => acc.owner === 'Kristijan Salijević');
console.log(account);

// for of example which does the same like find method
const accountOwner = [];
for (const acc of accounts) {
  if (acc.owner === 'Kristijan Salijević') {
    accountOwner.push(acc);
  }
}
console.log(...accountOwner);

console.log(
  account3.movements
    .filter(value => value > 0)
    .reduce((acc, sum) => acc + sum, 0)
);

console.log(account3.movements.reduce((acc, val) => acc + val));

console.log(calcDisplaySummary(account2));
console.log(account2.movements);

//
// some and every method
console.log(movements0);
console.log(movements0.includes(-130));
//primjer sa .some
console.log(movements0.some(mov => mov === -130));

const anyDeposits = movements0.some(mov => mov > 1500);
console.log(anyDeposits);

//
// EVERY method
console.log(movements0.every(mov => mov > 0));

// Separate callback
const deposit = mov => mov > 0;
console.log(movements0.some(deposit));
console.log(movements0.every(deposit));
console.log(movements0.filter(deposit));

//
// flat and flatMap method

// flat
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

// arrays in arrays
const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

// connecting all arrays from multiple objects
const accountMovements = accounts
  .map(mov => mov.movements)
  .flat()
  .reduce((acc, val) => acc + val, 0);
console.log(accountMovements);

// flatmap

const accountMovements2 = accounts
  .flatMap(mov => mov.movements) // flat method ide samo 1 level deep i ne moze se promjeniti
  .reduce((acc, val) => acc + val, 0);
console.log(accountMovements);

//
// Sorting arrays
const randomNumbers = [5, 2, 3, 1, 6];
const owners = ['Jonas', 'Zack', 'Adam', 'Martha'];
console.log(owners.sort()); // mutira orginalni array

//if we return < 0 then A will be before B keep order
// if we return > 0 then B will be before A switch order
console.log(movements0.sort());

// console.log(
//   movements0.sort((a, b) => {
//     if (a > b) return 1;
//     if (a > b) return -1;
//   })
// );
// skraćeni kod sa istim značenjem
console.log(movements0.sort((a, b) => a - b));
