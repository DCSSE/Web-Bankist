'use strict';
const account1 = {
  owner: 'Almira Burkutbayeva',
  movements: [1000, -500, -207.5, 14000, -5231.48],
  interestRate: 1.2,
  pin: 1111,
  currency: 'USD',
  locale: 'en-GB',
};
const account2 = {
  owner: 'Adel Rakhimzhanova',
  movements: [5000, 1700.59, -270, 850, -3674.41],
  interestRate: 1.5,
  pin: 2222,
  currency: 'EUR',
  locale: 'en-US',
};
const accounts = [account1, account2];

const labelWelcome = document.querySelector('.welcome');
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

const btnNewAcc = document.querySelector('#btn_new_acc');
const newPass = document.querySelector('#new_pass');
const accName = document.querySelector('#acc_name');
const btnCreate = document.querySelector('.btncreate');
const containerSignIn = document.querySelector('.signIn');
const confirmPass = document.querySelector('#new_pass_confirm');

let sorted = false;
let currentAccount, timer;

const allowsign = function (b) {
  if (containerSignIn.style.display == `flex`)
    containerSignIn.style.display = `none`;

  if (b === true) {
    btnCreate.style.display = `block`;
  }
  if (b === false) {
    btnCreate.style.display = `none`;
  }
};

const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Function for displaying operations
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  let movs = acc.movements.slice();
  let list = [];

  // sort is false when the button Sort isn't clicked
  for (let j = 0; j < movs.length; j++)
    list.push({ mov: movs[j] });
  sort ? list.sort((a, b) => a.mov - b.mov) : '';
  for (let k = 0; k < list.length; k++) {
    movs[k] = list[k].mov;
  }
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? `deposit` : `withdrawal`;
    const formattedMov = formatCurrency(mov, acc.locale, acc.currency);

    const html = `
    <div class="movements">
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>`;
    containerMovements.insertAdjacentHTML(`afterbegin`, html);
  });

  [...document.querySelectorAll(`.movements__row`)].forEach((row, i) => {
    if (!(i % 2 === 0)) {
      row.style.backgroundColor = '	#f9f9f1';
    }
  });
};


// display balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  )}`;
};

// display in, out, interest
const calcDisplaySummary = function (account) {
  const incms = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${formatCurrency(    
    incms,
    account.locale,
    account.currency
  )}`;

  const exps = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${formatCurrency(
    Math.abs(exps),
    account.locale,
    account.currency
  )}`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${formatCurrency(
    interest,
    account.locale,
    account.currency
  )}`;
};

/// Account username consist of the first letter of two names and make it uppercase
const createUserNames = function (accs = accounts) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLocaleUpperCase()
      .split(' ')
      .map(name => name.at(0))
      .join('');
  });
};
createUserNames();

const updateUI = function (acc = currentAccount) {
  displayMovements(acc, sorted);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  let time = 360;
  (function () {
    const min = String(Math.trunc(time / 60)).padStart(2, '0');
    const sec = String(time % 60).padStart(2, '0');
    //print the remaining to UI
    labelTimer.textContent = `${min}:${sec}`;
    time--;
  })();
  //every second
  const timer = setInterval(function () {
    const min = String(Math.trunc(time / 60)).padStart(2, '0');
    const sec = String(time % 60).padStart(2, '0');
    //print the remaining to UI
    labelTimer.textContent = `${min}:${sec}`;

    //logout user
    if (time == 0) {
      clearInterval(timer);
      currentAccount = '';
      allowsign(true);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
    time--;
  }, 1000);
  return timer;
};

// Login, username add to account
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome, ${currentAccount.owner.split(` `)[0]}`;
    containerApp.style.opacity = 100;
    
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    allowsign(false);

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI();
    const htmlARR = [];
    for (const x of accounts) {
      if (x !== currentAccount) htmlARR.push(`<option value="${x.username}">`);
    }
    const html = `${htmlARR.join('\n')}`;
    document
      .querySelector('#accountNames')
      .insertAdjacentHTML('afterbegin', html);
  }
});


// TRansfering money to other account
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amnt = Number(inputTransferAmount.value);
  const recieverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    amnt > 0 && recieverAccount && currentAccount.balance >= amnt &&
    recieverAccount?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amnt);
    recieverAccount.movements.push(amnt);
    updateUI();
  }
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferTo.blur();
  clearInterval(timer);
  timer = startLogOutTimer();
});

// borrowing money
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const request = Math.floor(inputLoanAmount.value);
  if (currentAccount.movements.some(mov => mov > 0.1 * request) && request > 0)
    setTimeout(function () {
      currentAccount.movements.push(request);
      updateUI();
    }, 2500);
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
  clearInterval(timer);
  timer = startLogOutTimer();
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const accUserName = inputCloseUsername.value;
  const accPin = Number(inputClosePin.value);
  if (
    accUserName === currentAccount.username &&
    accPin === currentAccount.pin
  ) {
    accounts.splice(
      accounts.findIndex(acc => acc === currentAccount),
      1
    );
    currentAccount = '';
    allowsign(true);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// Sort button, the operations are moving using position 'afterbegin'
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  if (sorted == false) {
    btnSort.textContent = '';
    btnSort.insertAdjacentHTML(`afterbegin`, 'SORT &#128176;');
  }
  if (sorted == true) {
    btnSort.textContent = '';
    btnSort.insertAdjacentHTML(`afterbegin`, `SORT  &#128337`);
  }
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
  clearInterval(timer);
  timer = startLogOutTimer();
});


btnCreate.addEventListener('click', function (e) {
  e.preventDefault();
  containerSignIn.style.display = `flex`;
  btnCreate.style.display = `none`;
});
btnNewAcc.addEventListener('click', function (e) {
  e.preventDefault();
  const newUser = accName.value;
  const newUserPass = +newPass.value;
  const confirm = +confirmPass.value;
  if (newUserPass !== confirm) {
    alert(`Password doesn\`t match!`);
  } else {
    const accountNew = {
      owner: newUser,
      movements: [1000],
      interestRate: 1.5,
      pin: newUserPass,
      currency: 'USD',
      locale: navigator.language,
    };
    accounts.push(accountNew);
    currentAccount = accountNew;
    createUserNames();
    allowsign(false);
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
    containerApp.style.opacity = `100`;

    labelWelcome.textContent = `Welcome, ${
      currentAccount.owner.split(` `)[0]
    }`;
  }
});
