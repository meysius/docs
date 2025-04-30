## Instructions

Your task is to implement a simplified version of a banking system. All operations that should be supported are listed below.

Solving this task consists of several levels. Subsequent levels are opened when the current level is correctly solved. You always have access to the data for the current and all previous levels.

You can execute a single test case by running the following command in the terminal: `bash run_single_test.sh "<test_case_name>"`.

## Requirements

Your task is to implement a simplified version of a banking system. Plan your design according to the level specifications below:

*   **Level 1:** The banking system should support creating new accounts, depositing money into accounts, and transferring money between two accounts.
*   **Level 2:** The banking system should support ranking accounts based on outgoing transactions.
*   **Level 3:** The banking system should allow scheduling payments with cashback and checking the status of scheduled payments.
*   **Level 4:** The banking system should support merging two accounts while retaining both accounts’ balance and transaction histories.

To move to the next level, you should pass all the tests at this level.

## Note

All operations will have a `timestamp` parameter — a stringified timestamp in milliseconds. It is guaranteed that all timestamps are unique and are in a range from `1` to `10^9`. Operations will be given in order of strictly increasing timestamps.

## Level 1

Initially, the banking system does not contain any accounts, so implement operations to allow account creation, deposits, and transfers between 2 different accounts.

*   `create_account(self, timestamp: int, account_id: str) -> bool` — should create a new account with the given identifier if it doesn’t already exist. Returns `True` if the account was successfully created or `False` if an account with `account_id` already exists.
*   `deposit(self, timestamp: int, account_id: str, amount: int) -> int | None` — should deposit the given `amount` of money to the specified account `account_id`. Returns the balance of the account after the operation has been processed. If the specified account doesn’t exist, should return `None`.
*   `transfer(self, timestamp: int, source_account_id: str, target_account_id: str, amount: int) -> int | None` — should transfer the given amount of money from account `source_account_id` to account `target_account_id`. Returns the balance of `source_account_id` if the transfer was successful or `None` otherwise.
    *   Returns `None` if `source_account_id` or `target_account_id` doesn’t exist.
    *   Returns `None` if `source_account_id` and `target_account_id` are the same.
    *   Returns `None` if account `source_account_id` has insufficient funds to perform the transfer.

## Examples

The example below shows how these operations should work:

| Queries | Explanations |
| --- | --- |
| create\_account(1, "account1") | returns True |
| create\_account(2, "account1") | returns False; this account already exists |
| create\_account(3, "account2") | returns True |
| deposit(4, "non-existing", 2700) | returns None |
| deposit(5, "account1", 2700) | returns 2700 |
| transfer(6, "account1", "account2", 2701) | returns None; this account has insufficient funds for the transfer |
| transfer(7, "account1", "account2", 200) | returns 2500 |

*   **\[execution time limit\]** 3 seconds
*   **\[memory limit\]** 1 GB

## Level 2

The bank wants to identify people who are not keeping money in their accounts, so implement operations to support ranking accounts based on outgoing transactions.

*   `top_spenders(self, timestamp: int, n: int) -> list[str]` — should return the identifiers of the top `n` accounts with the highest outgoing transactions - the total amount of money either transferred out of or paid/withdrawn (the `pay` operation will be introduced in level 3) - sorted in descending order, or in case of a tie, sorted alphabetically by `account_id` in ascending order. The result should be a list of strings in the following format: `["<account_id_1>(<total_outgoing_1>)", "<account_id_2>(<total_outgoing_2>)", ..., "<account_id_n>(<total_outgoing_n>)"]`.
    *   If less than `n` accounts exist in the system, then return all their identifiers (in the described format).
    *   Cashback (an operation that will be introduced in level 3) should not be reflected in the calculations for total outgoing transactions.

## Examples

The example below shows how these operations should work:

| Queries | Explanations |
| --- | --- |
| create\_account(1, "account3") | returns True |
| create\_account(2, "account2") | returns True |
| create\_account(3, "account1") | returns True |
| deposit(4, "account3", 2000) | returns 2000 |
| deposit(5, "account2", 3000) | returns 3000 |
| deposit(6, "account3", 4000) | returns 6000 |
| top\_spenders(7, 3) | returns \['account1(0)', 'account2(0)', 'account3(0)'\]; none of the accounts have any outgoing transactions, so they are sorted alphabetically |
| transfer(8, "account3", "account2", 500) | returns 5500 |
| transfer(9, "account3", "account1", 1000) | returns 4500 |
| transfer(10, "account1", "account2", 2500) | returns 500 |
| top\_spenders(11, 3) | returns \['account1(2500)', 'account3(1500)', 'account2(0)'\] |

*   **\[execution time limit\]** 3 seconds
*   **\[memory limit\]** 1 GB

## Level 3

The banking system should allow scheduling payments with some cashback and checking the status of scheduled payments.

*   `pay(self, timestamp: int, account_id: str, amount: int) -> str | None` — should withdraw the given amount of money from the specified account. All withdraw transactions provide a 2% cashback – 2% of the withdrawn amount (rounded down to the nearest integer) will be refunded to the account 24 hours after the withdrawal. If the withdrawal is successful (i.e., the account holds sufficient funds to withdraw the given amount), returns a string with a unique identifier for the payment transaction in this format: `"payment[ordinal number of withdraws from all accounts]"` — e.g., `"payment1"`, `"payment2"`, etc. Additional conditions:
    *   Returns `None` if `account_id` doesn’t exist.
    *   Returns `None` if `account_id` has insufficient funds to perform the payment.
    *   `top_spenders` should now also account for the total amount of money withdrawn from accounts.
    *   The waiting period for cashback is 24 hours, equal to `24 * 60 * 60 * 1000 = 86400000` milliseconds (the unit for timestamps). So, cashback will be processed at timestamp `timestamp + 86400000`.
    *   When it's time to process cashback for a withdrawal, the amount must be refunded to the account before any other transactions are performed at the relevant timestamp.
*   `get_payment_status(self, timestamp: int, account_id: str, payment: str) -> str | None` — should return the status of the payment transaction for the given `payment`. Specifically:
    *   Returns `None` if `account_id` doesn’t exist.
    *   Returns `None` if the given `payment` doesn’t exist for the specified account.
    *   Returns `None` if the payment transaction was for an account with a different identifier from `account_id`.
    *   Returns a string representing the payment status: `"IN_PROGRESS"` or `"CASHBACK_RECEIVED"`.

## Examples

The example below shows how these operations should work:

| Queries | Explanations |
| --- | --- |
| create\_account(1, "account1") | returns True |
| create\_account(2, "account2") | returns True |
| deposit(3, "account1", 2000) | returns 2000 |
| pay(4, "account1", 1000) | returns "payment1" |
| pay(100, "account1", 1000) | returns "payment2" |
| get\_payment\_status(101, "non-existing", "payment1") | returns None; this account does not exist |
| get\_payment\_status(102, "account2", "payment1") | returns None; this payment was from another account |
| get\_payment\_status(103, "account1", "payment1") | returns "IN\_PROGRESS" |
| top\_spenders(104, 2) | returns \['account1(2000)', 'account2(0)'\] |
| deposit(3 + MILLISECONDS\_IN\_1\_DAY, "account1", 100) | returns 100; cashback for "payment1" was not refunded yet |
| get\_payment\_status(4 + MILLISECONDS\_IN\_1\_DAY, "account1", "payment1") | returns "CASHBACK\_RECEIVED" |
| deposit(5 + MILLISECONDS\_IN\_1\_DAY, "account1", 100) | returns 220; cashback of `20` from "payment1" was refunded |
| deposit(99 + MILLISECONDS\_IN\_1\_DAY, "account1", 100) | returns 320; cashback for "payment2" was not refunded yet |
| deposit(100 + MILLISECONDS\_IN\_1\_DAY, "account1", 100) | returns 440; cashback of `20` from "payment2" was refunded |

*   **\[execution time limit\]** 3 seconds
*   **\[memory limit\]** 1 GB

## Level 4

The banking system should support merging two accounts while retaining both accounts’ balance and transaction histories.

*   `merge_accounts(self, timestamp: int, account_id_1: str, account_id_2: str) -> bool` — should merge `account_id_2` into the `account_id_1`. Returns `True` if accounts were successfully merged, or `False` otherwise. Specifically:
    *   Returns `False` if `account_id_1` is equal to `account_id_2`.
    *   Returns `False` if `account_id_1` or `account_id_2` doesn’t exist.
    *   All pending cashback refunds for `account_id_2` should still be processed, but refunded to `account_id_1` instead.
    *   After the merge, it must be possible to check the status of payment transactions for `account_id_2` with payment identifiers by replacing `account_id_2` with `account_id_1`.
    *   The balance of `account_id_2` should be added to the balance of `account_id_1`.
    *   `top_spenders` operations should recognize merged accounts – the total outgoing transactions for merged accounts should be the sum of all money transferred and/or withdrawn in both accounts.
    *   `account_id_2` should be removed from the system after the merge.
*   `get_balance(self, timestamp: int, account_id: str, time_at: int) -> int | None` — should return the total amount of money in the account `account_id` at the given timestamp `time_at`. If the specified account did not exist at a given time `time_at`, returns `None`.
    *   If queries have been processed at timestamp `time_at`, `get_balance` must reflect the account balance **after** the query has been processed.
    *   If the account was merged into another account, the merged account should inherit its balance history.

## Examples

The examples below show how these operations should work:

| Queries | Explanations |
| --- | --- |
| create\_account(1, "account1") | returns True |
| create\_account(2, "account2") | returns True |
| deposit(3, "account1", 2000) | returns 2000 |
| deposit(4, "account2", 2000) | returns 2000 |
| pay(5, "account1", 500) | returns "payment1" |
| transfer(6, "account1", "account2", 500) | returns 1500 |
| merge\_accounts(7, "account1", "non-existing") | returns False; account "non-existing" does not exist |
| merge\_accounts(8, "account1", "account1") | returns False; account "account1" cannot be merged into itself |
| merge\_accounts(9, "account1", "account2") | returns True |
| get\_balance(10, "account1", 10) | returns 3000 |
| get\_balance(11, "account2", 10) | returns None; account "account2" doesn’t exist anymore |
| get\_payment\_status(12, "account1", "payment1") | returns "IN\_PROGRESS" |
| get\_payment\_status(13, "account2", "payment1") | returns None; "account2" doesn’t exist anymore |
| get\_balance(14, "account2", 1) | returns None; "account2" was not created yet |
| get\_balance(15, "account2", 9) | returns None; "account2" was already merged and doesn’t exist |
| get\_balance(16, "account1", 11) | returns 3000 |
| deposit(5 + MILLISECONDS\_IN\_1\_DAY, "account1", 100) | returns 3906 |

### Another example:

| Queries | Explanations |
| --- | --- |
| create\_account(1, "account1") | returns True |
| deposit(2, "account1", 1000) | returns 1000 |
| pay(3, "account1", 300) | returns "payment1" |
| get\_balance(4, "account1", 3) | returns 700 |
| get\_balance(5 + MILLISECONDS\_IN\_1\_DAY, "account1", 2 + MILLISECONDS\_IN\_1\_DAY) | returns 700 |
| get\_balance(6 + MILLISECONDS\_IN\_1\_DAY, "account1", 3 + MILLISECONDS\_IN\_1\_DAY) | returns 706; cashback for "payment1" was refunded |