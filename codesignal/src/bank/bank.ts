// Level 1
// Account: id, balance(init 0)
// Bank has a map of accountId > Account
// ---- Level 2
// track spentAmount per account and apply in transfer
// ---- Level 3
// bank has a payment counter => increment per each successful pay(...)
// should use the same logic for pay and transfer for deducting money so spentAmount is tracked
// paymentcashbacks should be kept per account in a queue
// payments stored in account map id => payment details: status, completion time, amount
// ---- Level 4
// you should be able to store timeline of changes ot balance: need a Transaction: t, diff on accounts

type Transaction = {
  timestamp: number;
  diff: number;
}

type Payment = {
  id: string;
  cashbackAmount: number;
  completionTimestamp: number;
  status: "IN_PROGRESS" | "CASHBACK_RECEIVED";
}

const MILLISECONDS_IN_1_DAY = 86400000;

class Account {
  public id: string;
  public openedAt: number;
  public balance: number = 0;
  public transactions: Transaction[] = [];
  public spentAmount: number = 0;
  public pendingPaymentIds: string[] = [];
  public payments: Map<string, Payment> = new Map();
  public closedAt: number | undefined;

  constructor(id: string, timestamp: number) {
    this.id = id;
    this.openedAt = timestamp;
  }

  public transaction(timestamp: number, amount: number): number {
    this.balance += amount;

    this.applyPendingPayments(timestamp);
    this.transactions.push({ timestamp, diff: amount });

    if (amount < 0) {
      this.spentAmount += Math.abs(amount);
    }

    return this.balance;
  }

  public addPendingPayment(payment: Payment) {
    this.payments.set(payment.id, payment);
    this.pendingPaymentIds.push(payment.id);
  }

  public applyPendingPayments(upToTimestamp: number) {
    while (this.pendingPaymentIds.length > 0) {
      const headPaymentId = this.pendingPaymentIds[0];
      const payment = this.payments.get(headPaymentId);
      if (!payment) {
        throw "ERROR!"
      }
      if (payment.completionTimestamp <= upToTimestamp) {
        payment.status = "CASHBACK_RECEIVED";
        this.pendingPaymentIds.shift();
        this.balance += payment.cashbackAmount;
        this.transactions.push({ timestamp: payment.completionTimestamp, diff: payment.cashbackAmount });
      } else {
        break;
      }
    }
  }

  public mergeIn(account: Account) {
    this.balance += account.balance;

    account.payments.forEach(p => {
      this.payments.set(p.id, p);
    });

    this.pendingPaymentIds = Array.from(this.payments.values())
      .filter(p => p.status === "IN_PROGRESS")
      .sort((a, b) => a.completionTimestamp - b.completionTimestamp)
      .map(a => a.id);

    account.transactions.forEach(t => this.transactions.push(t));
    this.transactions = this.transactions.sort((a, b) => a.timestamp - b.timestamp);
  }
}

class Bank {
  public paymentCounter = 1;
  public accounts: Map<string, Account> = new Map();

  constructor() {}

  public createAccount(timestamp: number, accountId: string): boolean {
    if (this.accounts.has(accountId)) {
      return false; // Account already exists
    }

    const account = new Account(accountId, timestamp);
    this.accounts.set(accountId, account);
    return true;
  }

  public deposit(timestamp: number, accountId: string, amount: number): number | null {
    const account = this.accounts.get(accountId);
    if (!account) {
      return null; // Account does not exist
    }
    account.transaction(timestamp, amount);
    return account.balance;
  }

  public transfer(timestamp: number, sourceAccountId: string, targetAccountId: string, amount: number): number | null {
    if (sourceAccountId === targetAccountId) {
      return null; // Cannot transfer to the same account
    }

    const sourceAccount = this.accounts.get(sourceAccountId);
    const targetAccount = this.accounts.get(targetAccountId);

    if (!sourceAccount || !targetAccount) {
      return null; // One of the accounts does not exist
    }

    if (sourceAccount.balance < amount) {
      return null; // Insufficient funds
    }

    sourceAccount.transaction(timestamp, -amount);
    targetAccount.transaction(timestamp, amount);

    return sourceAccount.balance;
  }

  public topSenders(timestamp: number, n: number): string[] {
    const accounts = Array.from(this.accounts.values());
    return accounts
      .sort((a, b) => b.spentAmount - a.spentAmount || a.id.localeCompare(b.id))
      .slice(0, n)
      .map(e => `${e.id}(${e.spentAmount})`);
  }

  public pay(timestamp: number, accountId: string, amount: number): string | null {
    const account = this.accounts.get(accountId);
    if (!account) {
      return null;
    }

    if (account.balance < amount) {
      return null;
    }

    account.transaction(timestamp, -amount);
    const paymentId = `payment${this.paymentCounter}`;
    this.paymentCounter += 1;

    account.addPendingPayment({
      id: paymentId,
      cashbackAmount: Math.floor(0.02 * amount),
      completionTimestamp: timestamp + MILLISECONDS_IN_1_DAY,
      status: "IN_PROGRESS",
    });

    return paymentId;
  }

  public getPaymentStatus(timestamp: number, accountId: string, payment: string): string | null {
    const account = this.accounts.get(accountId);
    if (!account) {
      return null;
    }
    account.applyPendingPayments(timestamp);

    const p = account.payments.get(payment);
    if (!p) {
      return null;
    }

    return p.status;
  }

  public mergeAccounts(timestamp: number, accountId1: string, accountId2: string): boolean {
    if (accountId1 === accountId2) {
      return false;
    }

    const account1 = this.accounts.get(accountId1);
    const account2 = this.accounts.get(accountId2);

    if (!account1 || !account2) {
      return false;
    }

    account1.mergeIn(account2);
    account2.closedAt = timestamp;
    return true;
  }

  public getBalance(timestamp: number, accountId: string, timeAt: number): number | null {
    const account = this.accounts.get(accountId);
    if (!account) {
      return null;
    }

    if (account.openedAt > timeAt) {
      return null;
    }

    if (account.closedAt && account.closedAt <= timeAt) {
      return null;
    }
    account.applyPendingPayments(timestamp);

    let sum = 0;
    for (let i = 0; i < account.transactions.length; i++) {
      if (account.transactions[i].timestamp <= timeAt) {
        sum += account.transactions[i].diff;
      }
    }
    return sum;
  }
}


function test(id: number, value: any, expected: any) {
  if (JSON.stringify(value) === JSON.stringify(expected)) {
    console.log(`Test ${id} passed`);
  }
  else {
    console.log(`Test ${id} failed! expected ${expected} got ${value}`);
  }
}

const bank = new Bank();

console.log("Level 1 Tests:");
test(1, bank.createAccount(1, "account1"), true);
test(2, bank.createAccount(2, "account1"), false);
test(3, bank.createAccount(3, "account2"), true);
test(4, bank.deposit(4, "non-existing", 2700), null);
test(5, bank.deposit(5, "account1", 2700), 2700);
test(6, bank.transfer(6, "account1", "account2", 2701), null);
test(7, bank.transfer(7, "account1", "account2", 200), 2500);


console.log("Level 2 Tests:");
const bank2 = new Bank();
test(8, bank2.createAccount(1, "account3"), true);
test(9, bank2.createAccount(2, "account2"), true);
test(10, bank2.createAccount(3, "account1"), true);
test(11, bank2.deposit(4, "account3", 2000), 2000);
test(12, bank2.deposit(5, "account1", 2000), 2000);
test(13, bank2.deposit(6, "account3", 4000), 6000);
test(14, bank2.topSenders(7, 3), ['account1(0)', 'account2(0)', 'account3(0)']);
test(15, bank2.transfer(8, "account3", "account2", 500), 5500);
test(16, bank2.transfer(9, "account3", "account1", 1000), 4500);
test(17, bank2.transfer(10, "account1", "account2", 2500), 500);
test(18, bank2.topSenders(11, 3), ['account1(2500)', 'account3(1500)', 'account2(0)']);


console.log("Level 3 Tests:");
const bank3 = new Bank();
test(19, bank3.createAccount(1, "account1"), true);
test(20, bank3.createAccount(2, "account2"), true);
test(21, bank3.deposit(3, "account1", 2000), 2000);
test(22, bank3.pay(4, "account1", 1000), "payment1");
test(23, bank3.pay(100, "account1", 1000), "payment2");
test(24, bank3.getPaymentStatus(101, "non-existing", "payment1"), null);
test(25, bank3.getPaymentStatus(102, "account2", "payment1"), null);
test(26, bank3.getPaymentStatus(103, "account1", "payment1"), "IN_PROGRESS");
test(27, bank3.topSenders(104, 2), ['account1(2000)', 'account2(0)']);
test(28, bank3.deposit(3 + MILLISECONDS_IN_1_DAY, "account1", 100), 100);
test(29, bank3.getPaymentStatus(4 + MILLISECONDS_IN_1_DAY, "account1", "payment1"), "CASHBACK_RECEIVED");
test(30, bank3.deposit(5 + MILLISECONDS_IN_1_DAY, "account1", 100), 220);
test(31, bank3.deposit(99 + MILLISECONDS_IN_1_DAY, "account1", 100), 320);
test(32, bank3.deposit(100 + MILLISECONDS_IN_1_DAY, "account1", 100), 440);


console.log("Level 4 Tests:");
let bank4 = new Bank();
test(33, bank4.createAccount(1, "account1"), true);
test(34, bank4.createAccount(2, "account2"), true);
test(35, bank4.deposit(3, "account1", 2000), 2000);
test(36, bank4.deposit(4, "account2", 2000), 2000);
test(37, bank4.pay(5, "account1", 500), "payment1");
test(38, bank4.transfer(6, "account1", "account2", 500), 1000);
test(39, bank4.mergeAccounts(7, "account1", "non-existing"), false);
test(40, bank4.mergeAccounts(8, "account1", "account1"), false);
test(41, bank4.mergeAccounts(9, "account1", "account2"), true);
test(42, bank4.getBalance(10, "account1", 10), 3500);
test(43, bank4.getBalance(11, "account2", 10), null);
test(44, bank4.getPaymentStatus(12, "account1", "payment1"), "IN_PROGRESS");
test(45, bank4.getPaymentStatus(13, "account2", "payment1"), null);
test(46, bank4.getBalance(14, "account2", 1), null);
test(47, bank4.getBalance(15, "account2", 9), null);
test(48, bank4.getBalance(16, "account1", 11), 3500);
test(49, bank4.deposit(5 + MILLISECONDS_IN_1_DAY, "account1", 100), 3610);


bank4 = new Bank();
test(50, bank4.createAccount(1, "account1"), true);
test(51, bank4.deposit(2, "account1", 1000), 1000);
test(52, bank4.pay(3, "account1", 300), "payment1");
test(53, bank4.getBalance(4, "account1", 3), 700);
test(54, bank4.getBalance(5 + MILLISECONDS_IN_1_DAY, "account1", 2 + MILLISECONDS_IN_1_DAY), 700);
test(55, bank4.getBalance(6 + MILLISECONDS_IN_1_DAY, "account1", 3 + MILLISECONDS_IN_1_DAY), 706);
