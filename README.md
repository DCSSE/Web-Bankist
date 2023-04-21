# Web-Bankist
JavaScript Web-Bankist Application

<img width="958" alt="Bankist" src="https://user-images.githubusercontent.com/99336969/233546618-c001c137-ae3e-4265-ae8e-7e73cf27f14c.png">
<img width="958" alt="Bankist1" src="https://user-images.githubusercontent.com/99336969/233546633-75eb77ff-9df5-4b29-8a5b-a103bedcf52b.png">
<img width="933" alt="BanKist2" src="https://user-images.githubusercontent.com/99336969/233546637-f28cb248-0943-44f2-b8de-614a95160755.png">

A simple banking application created using JavaScript for learning and practice purposes (arrays, numbers, dates, timers) in JS.<br />
The project is a simulation of a banking application. The project have the following actions:<br />
•	Can login be using username and pin;<br />
•	Automatically logout after certain time;<br />
•	Can transfer balance from one user to another;<br />
•	Can request for loan;<br />
•	Can close account;<br />
•	Can sort balance movements;<br />
<br />
A general step-by-step guide: <br />
1.	Make a login form, which should have two inputs (username and pin-code) <br />
2.	Then create users. The username will consist of the user's initials.<br />
3.	Enable the customer movements to be displayed on the current balance sheet (display balance). This is done by constructing the displayMovements() function which uses the forEach() method to loop over each of the movements inside the array. There should also be a button “SORT” that sorts these records.<br />
4.	Constructed the calcDisplaySummary() function which calculates and displays the IN, OUT, and INTEREST values. They all three are each calculated the same, excepting interest, which has added steps to meet the extra parameters which are an interest rate of 1.1% on all deposits if the interest is => 1. The array of movements is filtered to create a new array containing only deposits. That new array is mapped over with each value being multipilied by the interest rate. Those new calculated values are then added to the new array which the .map() method creates. Another filter() method is run to remove any interest rate calculations that are less than 1. Finally reduce() is called to add the sum of each deposits interest payout into a total, which is inserted into the HTML via a template literal to to fixed decimal places.<br />
5.	Display the user's current balance<br />
6.	Create a function that makes money transfers. To make a transfer, you need an amount and a username. Checks are done to ensure that recipient and amounts to be transferred are valid. Then the recipient account needs to have the transfer added and the sender account needs to be detected from. Finally the UI has to be updated to account for the changes.<br />
7.	The project should be able to close the account. To close the account, you need to enter your username and password and a confirmation button.<br />
8.	To add in the loan button functionality an event listener was added to the btnLoan which registerred the amount input and if the input amount is above 0 and at least one of the movements inside the current account has a deposit which is at least 10% of the total amount requested. If these requirements are satisfied the current movements will have the requested loan amount added to its array, the UI is updated to reflect the changes and input values reset.<br />
9.	You need to display information about the end of the session. The app automatically logout the user after 10 minutes if there is no activity in the app. The timer resets if there is an activity in the app.<br />

