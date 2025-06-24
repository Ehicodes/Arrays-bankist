'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
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
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
             <div class="movements__row">
                <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
                <div class="movements__value">${mov}€</div>
        </div>
           `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//CALCULATING THE BALANCE OF MOVEMENTS
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance} €`;
};

//CHAINING METHODS IMPLEMENTATION
const caclDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

//COMPUTING USERNAMES
const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsername(accounts);

//update UI function
const updateUI = function (acc) {
  //display movements
  displayMovements(acc.movements);

  //display balance
  calcDisplayBalance(acc);

  //display summary
  caclDisplaySummary(acc);
};

//EVENT HANDLER
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting
  e.preventDefault();

  //IMPLEMENTING THE LOG IN
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //if account exists and pin is correct:
    // display UI
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    //display message
    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';

    //remove the focus on the 2nd input field
    inputLoginPin.blur();

    //update UI
    updateUI(currentAccount);
  }
});

//IMPLEMENTING TRANSFERS
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcct = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcct &&
    currentAccount.balance >= amount &&
    receiverAcct?.username !== currentAccount.username
  ) {
    //doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcct.movements.push(amount);

    //update UI
    updateUI(currentAccount);
  }
});

//LOAN OPERATION
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => amount / 10)) {
    //add the movement
    currentAccount.movements.push(amount);
    //update UI
    updateUI(currentAccount);

    inputLoanAmount.value = '';
  }
});

//CLOSE ACCOUNT OPERATION
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    //index calculation
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    //To delete the current account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;

    inputCloseUsername.value = inputClosePin.value = '';
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/*
//ARRAY METHODS
let arr = ['a', 'b', 'c', 'd', 'e'];
//SLICE METHOD
console.log(arr.slice(2));
console.log(arr);
console.log(arr.slice(2, 4));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice()); //creates a shallow copy of the arr
console.log([...arr]); //spread operator

//SPLICE METHOD
// console.log(arr.splice(2))
arr.splice(-1);
arr.splice(1, 2);
console.log(arr);

//REVERSE
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

//CONCAT
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

//JOIN
console.log(letters.join('- '));



//LOOPING ARRAYS: FOR EACH
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [i, movement] of movements.entries()){
  if (movement > 0) {
    console.log(`Movement ${i + 1} You deposited ${movement}`)
  } else{
    console.log(`Movement ${i + 1} You withdrew ${Math.abs(movement)}`)
  }
}

console.log('------FOR EACH-------------')
movements.forEach(function(mov, i, arr) {
   if (mov > 0) {
    console.log(`Movement ${i + 1} You deposited ${mov}`)
  } else{
    console.log(`Movement ${i + 1} You withdrew ${Math.abs(mov)}`)
  }
})


//FOREACH WITH MAPS AND SETS
console.log('------FOREACH WITH MAPS-------------')
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function(value, key, map) {
   console.log(`${key}: ${value}`)
})


console.log('------FOREACH WITH SET-------------')
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR'])
console.log(currenciesUnique)

currenciesUnique.forEach(function(value, _, set) {
 console.log(`${value}`)
})
 */
/*
//THE MAP METHOD

// const eurToUsd = 1.1;
// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
// });
// const movementsUSD = movements.map(mov => mov * eurToUsd);

console.log(movements);
console.log(movementsUSD);

//since the map method returns a brand new array, let's store it to a variable

// using a for of loop// w had to create an array seperately and also push the result in it.
const movementsUSDfor = [];
for (const mov of movements) {
  movementsUSDfor.push(mov * eurToUsd);
}
console.log(movementsUSDfor);

//MORE MAP PRACTICES
// movements.forEach(function(mov, i, arr) {
//    if (mov > 0) {
//     console.log(`Movement ${i + 1} You deposited ${mov}`)
//   } else{
//     console.log(`Movement ${i + 1} You withdrew ${Math.abs(mov)}`)
//   }
// })
const movementDescriptions = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);
console.log(movementDescriptions);

//FILTER METHOD
const deposits = movements.filter(function (mov) {
  return mov > 0;
});

console.log(movements);
console.log(deposits);

//look at the difference
const depositFor = [];
for (const mov of movements) {
  if (mov > 0) {
    depositFor.push(mov);
  }
}
console.log(depositFor);

//FILTER METHOD(little challenge)
const withdrawal = movements.filter(mov => mov < 0);
//FOR OF LOOP
const withdrawalFor = [];
for (const mov of movements) if (mov < 0) withdrawalFor.push(mov);
console.log(withdrawal);
console.log(withdrawalFor);

//THE  REDUCE METHOD
console.log(movements);
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);
const balance = movements.reduce((acc, cur, i) => acc + cur);
console.log(balance);

let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2);

//MAXIMUM VALUE OF THE MOVEMENTS ARRAY
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(max);
*/

/*
//CHAINING METHODS
//PIPELINE
const eurToUsd = 1.1;
const totalDepositsinUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsinUSD);

*/
/*
//THE FIND METHOD
const firstWithdrawal = movements.find(mov => mov < 0);

console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);
const desiredAccount = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(desiredAccount);

//using a for of loop
for (const account of accounts) {
  if (account.owner === 'Jessica Davis') console.log(account);
}
*/

// console.log(movements);
// //INCLUDE METHOD
// console.log(movements.includes(-130));

// //SOME METHOD (CONDITION)
// console.log(movements.some(mov => mov === -130));
// const anyDeposits = movements.some(mov => mov > 500);
// console.log(anyDeposits);

// //EVERY METHOD
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// //seperate callback
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

/*
//FLAT AND FLATMAPS
//flat
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

const averageBalance = accounts
  .map(arr => arr.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(averageBalance);

//flatMap
const averageBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(averageBalance2);
*/
/*
//SORTING ARRAYS
//strings
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());
console.log(owners);

//numbers
console.log(movements);

//return < 0, A will be before B (keep order)
//return > 0, B will before A(switch order)

//Ascending order
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
movements.sort((a, b) => a - b);
console.group(movements);

//Descending
movements.sort((a, b) => b - a);
console.log(movements);

//MORE WAYS OF CREATING AND FILLING ARRAYS
const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

//Empty arrays + fill method
const x = new Array(7);
console.log(x);

x.fill(1, 3, 5);
x.fill(1);
console.log(x);

console.log(arr);

arr.fill(23, 2, 6);

console.log(arr);

//Array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => el.textContent.replace('€', '')
  );

  console.log(movementsUI);
});

*/

//ARRAY METHODS PRACTICE
//  EXERCISE 1 (sum of deposits)
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);

console.log(bankDepositSum);

//EXERCISE 2 (number of deposits above 1k)
const numDepositsAbove1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);

console.log(numDepositsAbove1000);

//Prefixed  ++ operator
let a = 10;
console.log(++a);
console.log(a);

//EXERCISE 3(Create a new object that will contain the sum of the deposits and of the withdrawals)

const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals);

//EXERCISE 4. (A FUNCTION TO CONVERT ANY STRING TO A TITLE CASE)
//this is a nice title => This is a Nice Title
const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');

  return capitalize(titleCase);
};
console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is anothet title with an EXAMPLE'));
