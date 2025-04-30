Instructions
============

Your task is to implement a simplified version of a program registering the working hours of contract workers at a facility. All operations that should be supported by this program are described below.

Solving this task consists of several levels. Subsequent levels are opened when the current level is correctly solved. You always have access to the data for the current and all previous levels.

Requirements
------------

Your task is to implement a simplified version of a program registering the working hours of contract workers at a facility. Plan your design according to the level specifications below:

*   **Level 1**: The working hours register program should support adding workers to the system, registering the time when workers enter or leave the office and retrieving information about the time spent in the office.
*   **Level 2**: The working hours register program should support retrieving statistics about the amount of time that workers spent in the office.
*   **Level 3**: The working hours register program should support promoting workers, assigning them new positions and new compensation. The program should also support calculating a worker's salary for a given period.
*   **Level 4**: The working hours register program should support setting time periods to be double-paid.

To move to the next level, you need to pass all the tests at this level.

Level 1
=======

Introduce operations for adding workers, registering their entering or leaving the office and retrieving information about the amount of time that they have worked.

*   `ADD_WORKER <workerId> <position> <compensation>` — should add the workerId to the system and save additional information about them: their position and compensation. If the workerId already exists, nothing happens and this operation should return "false". If the workerId was successfully added, return "true". workerId and position are guaranteed to contain only English letters and spaces.
*   `REGISTER <workerId> <timestamp>` — should register the time when the workerId entered or left the office. The time is represented by the timestamp. Note that REGISTER operation calls are given in the increasing order of the timestamp parameter. If the workerId doesn't exist within the system, nothing happens and this operation should return "invalid\_request". If the workerId is not in the office, this operation registers the time when the workerId entered the office. If the workerId is already in the office, this operation registers the time when the workerId left the office. If the workerId's entering or leaving time was successfully registered, return "registered".
*   `GET <workerId>` — should return a string representing the total calculated amount of time that the workerId spent in the office. The amount of time is calculated using finished working sessions only. It means that if the worker has entered the office but hasn't left yet, this visit is not considered in the calculation. If the workerId doesn't exist within the system, return an empty string.

Examples

The example below shows how these operations should work (the section is scrollable to the right):

| Queries | Explanations |
| --- | --- |
| `["ADD_WORKER", "Ashley", "Middle Developer", "150"]` | returns "true" |
| `["ADD_WORKER", "Ashley", "Junior Developer", "100"]` | returns "false"; the same workerId already exists within the system |
| `["REGISTER", "Ashley", "10"]` | returns "registered"; "Ashley" entered the office at timestamp 10 |
| `["REGISTER", "Ashley", "25"]` | returns "registered"; "Ashley" left the office at timestamp 25 |
| `["GET", "Ashley"]` | returns "15"; "Ashley" spent 25 - 10 = 15 time units in the office |
| `["REGISTER", "Ashley", "40"]` | returns "registered" |
| `["REGISTER", "Ashley", "67"]` | returns "registered" |
| `["REGISTER", "Ashley", "100"]` | returns "42"; "Ashley" spent (25 - 10) + (67 - 40) = 42 time units in the office |
| `["GET", "Ashley"]` | returns "42" |
| `["GET", "Walter"]` | returns ""; id "Walter" was never added to the system |
| `["REGISTER", "Walter", "120"]` | returns "invalid_request"; "Walter" was never added to the system |

the output should be `["true", "false", "registered", "registered", "15", "registered", "registered", "registered", "42", "", "invalid_request"]`.

Input/Output
------------

*   **\[execution time limit\]** 4 seconds (py3)
*   **\[memory limit\]** 1 GB
*   **\[input\]** array.array.string queriesAn array of queries to the system. It is guaranteed that all the queries parameters are valid: each query calls one of the operations described in the description, all operation parameters are given in the correct format, and all conditions required for each operation are satisfied.Guaranteed constraints:1 ≤ queries.length ≤ 500.
*   **\[output\]** array.stringAn array of strings representing the returned values of queries.


Level 2
=======

Introduce an operation to retrieve ordered statistics about the workers.

*   `TOP_N_WORKERS <n> <position>` — should return the string representing ids of the top n workers with the given position sorted in descending order by the total time spent in the office. The amount of time is calculated using finished working sessions only. In the case of a tie, workers must be sorted in alphabetical order of their ids. The returned string should be in the following format: "workerId1(timeSpentInOffice1), workerId2(timeSpentInOffice2), ..., workerIdN(timeSpentInOfficeN)". If less than n workers with the given position exist within the system, then return all ids in the described format. If there are no workers with the given position within the system, return an empty string. Note that if a worker exists within the system and doesn't have any finished periods of being in the office, their time spent in the office is considered to be 0.

Examples

The example below shows how this operation should work (the section is scrollable to the right):

| Queries | Explanations |
| --- | --- |
| `["ADD_WORKER", "John", "Junior Developer", "120"]` | returns "true" |
| `["ADD_WORKER", "Jason", "Junior Developer", "120"]` | returns "true" |
| `["ADD_WORKER", "Ashley", "Junior Developer", "120"]` | returns "true" |
| `["REGISTER", "John", "100"]` | returns "registered" |
| `["REGISTER", "John", "150"]` | returns "registered"; now "John" has 50 time units spent in the office |
| `["REGISTER", "Jason", "200"]` | returns "registered" |
| `["REGISTER", "Jason", "250"]` | returns "registered"; now "Jason" has 50 time units spent in the office |
| `["REGISTER", "Jason", "275"]` | returns "registered"; "Jason" entered the office at timestamp 275 |
| `["TOP_N_WORKERS", "5", "Junior Developer"]` | returns "Jason(50), John(50), Ashley(0)"; "Jason" goes before "John" alphabetically |
| `["TOP_N_WORKERS", "1", "Junior Developer"]` | returns "Jason(50)" |
| `["REGISTER", "Ashley", "400"]` | returns "registered" |
| `["REGISTER", "Ashley", "500"]` | returns "registered"; now "Ashley" has 100 time units spent in the office |
| `["REGISTER", "Jason", "575"]` | returns "registered"; "Jason" left the office and now has 50 + (575 - 275) = 350 time units spent in the office |
| `["TOP_N_WORKERS", "3", "Junior Developer"]` | returns "Jason(350), Ashley(100), John(50)" |
| `["TOP_N_WORKERS", "3", "Middle Developer"]` | returns ""; there are no workers with position "Middle Developer" |


the output should be `["true", "true", "true", "registered", "registered", "registered", "registered", "registered", "Jason(50), John(50), Ashley(0)", "Jason(50)", "registered", "registered", "registered", "Jason(350), Ashley(100), John(50)", ""]`.

Input/Output
------------

*   **\[execution time limit\]** 4 seconds (py3)
*   **\[memory limit\]** 1 GB
*   **\[input\]** array.array.string queriesAn array of queries to the system. It is guaranteed that all the queries parameters are valid: each query calls one of the operations described in the description, all operation parameters are given in the correct format, and all conditions required for each operation are satisfied.Guaranteed constraints:1 ≤ queries.length ≤ 500.
*   **\[output\]** array.stringAn array of strings representing the returned values of queries.


Level 3
=======

Introduce operations for worker promotion and salary calculation.

*   `PROMOTE <workerId> <newPosition> <newCompensation> <startTimestamp>` — should register a new position and new compensation for the workerId. newPosition is guaranteed to be different from the current worker's position. New position and new compensation are active from the moment of the first entering the office after or at startTimestamp. In other words, the first time period of being in office for the newPosition is the first time period that starts after or at startTimestamp. startTimestamp is guaranteed to be greater than timestamp parameter of the last REGISTER call for any worker. If the PROMOTE operation is called repeatedly for the same workerId before they entered the office with the newPosition, nothing happens, and this operation should return "invalid\_request". If workerId doesn't exist within the system, nothing happens, and this operation should return "invalid\_request". If the worker's promotion was successfully registered, return "success". Note: TOP\_N\_WORKERS operation should take only the worker's current position into account. GET operation should return the total amount of time across all the worker's past and current positions.
*   `CALC_SALARY <workerId> <startTimestamp> <endTimestamp>` — should calculate net salary that workerId has earned for the time period between startTimestamp and endTimestamp. No restrictions are applied to startTimestamp and endTimestamp, except that it is guaranteed that endTimestamp > startTimestamp >= 0. Note that workers are only paid for the time they were present in the office. The amount of time is calculated using finished working sessions only. For any finished working session "sessionStartTimestamp, sessionEndTimestamp" salary is calculated as salary = (sessionEndTimestamp - sessionStartTimestamp) \* compensationDuringPeriod. Note, that compensationDuringPeriod may differ for different periods, because workers may be promoted. If workerId doesn't exist within the system, nothing happens and this operation should return an empty string.

Examples

The example below shows how these operations should work (the section is scrollable to the right):

| Queries | Explanations |
| --- | --- |
| `["ADD_WORKER", "John", "Middle Developer", "200"]` | returns "true" |
| `["REGISTER", "John", "100"]` | returns "registered" |
| `["REGISTER", "John", "125"]` | returns "registered"; now "John" has 25 time units spent in the office |
| `["PROMOTE", "John", "Senior Developer", "500", "200"]` | returns "success"; at timestamp 200, new position and compensation granted to "John" |
| `["REGISTER", "John", "150"]` | returns "registered"; "John" enters the office |
| `["PROMOTE", "John", "Senior Developer", "350", "250"]` | returns "invalid_request"; "John" has an active new position registered, not applied yet |
| `["REGISTER", "John", "300"]` | returns "registered"; "John" leaves the office; total 175 time units spent (25 + (300-150)) |
| `["REGISTER", "John", "325"]` | returns "registered"; "John" enters the office at timestamp 325 (new position starts from timestamp 200) |
| `["CALC_SALARY", "John", "0", "500"]` | returns "35000"; salary calculated for two periods under "Middle Developer" with compensation = 200 |
| `["TOP_N_WORKERS", "3", "Senior Developer"]` | John(0) |
| `["REGISTER", "John", "400"]` | registered |
| `["GET", "John"]` | 250 |
| `["TOP_N_WORKERS", "10", "Senior Developer"]` | returns "John(75)" |
| `["TOP_N_WORKERS", "10", "Middle Developer"]` | returns "" |
| `["CALC_SALARY", "John", "110", "350"]` | returns "45500"; salary calculated across periods and positions with compensations 200 and 500 |
| `["CALC_SALARY", "John", "900", "1400"]` | returns "0" |


the output should be `["true", "registered", "registered", "success", "registered", "invalid_request", "registered", "registered", "35000", "John(0)", "registered", "250", "John(75)", "", "45500", "0"]`.

Input/Output
------------

*   **\[execution time limit\]** 4 seconds (py3)
*   **\[memory limit\]** 1 GB
*   **\[input\]** array.array.string queriesAn array of queries to the system. It is guaranteed that all the queries parameters are valid: each query calls one of the operations described in the description, all operation parameters are given in the correct format, and all conditions required for each operation are satisfied.Guaranteed constraints:1 ≤ queries.length ≤ 500.
*   **\[output\]** array.stringAn array of strings representing the returned values of queries.