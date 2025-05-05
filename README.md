# Software Engineering Homework 5

## Context
- I ran both the code and the jasmine tests through the VScode terminal
- I also made sure node.js, jasmine, supertest, http, and other packages were in order before running

## Setup for hw5.js code 
- To run the actual hw5.js code make sure you are in the lib folder (example:
     " C:\Users\aryas\Desktop\Rutgers 2021-2025\Spring 2024\Software Engineering\Homeworks\Homework 5\lib ")
- Then in the VScode terminal run "node hw5.js"
- You will then be prompted in the terminal to choose a function you want to run
- There are 5 options and you will be reprompted until you hit the exit one 
- The next n available dates and range, will be inputted by user
- To reserve, user must input attendee and dtstart, dtstamp takes date it was made (which will
    - be feb 15 in this case), method is request, and status is confirmed 
- To lookup user enters correct attendee
- To cancel enter correct confirmation code, look at calendartest.txt in lib

## Setup for jasmine test cases
- For the jasmine test cases make sure to go back one folder from lib into homework4 (using cd ..) 
- (example: " C:\Users\aryas\Desktop\Rutgers 2021-2025\Spring 2024\Software Engineering\Homeworks\Homework 4 ")
- Then to run the cases just type in the terminal "npx jasmine"
- It should run 50 specs or test cases and 0 failures

## IMPORTANT Extra setup for extra tests with txt files
- Make sure that the filename in the code is set to "calendarTest.txt" before running the jasmine test 
    - On line 8: " let filename = 'calendarTest.txt' "
- If you want to test other files in the normal terminal, not jasmine tests you can, just make sure to put the file in the lib folder
- Go into the hw4.js file, at line 8, below the IMPORTANT you will see  " let filename = 'calendarTest.txt' "
- If you want your own file you must put it into the lib folder then change the same line
- Another thing to note is the events already prelaoded onto the calendar have a confirmation code, so make sure to have those in your files

# The holidays my program will check, that is accepted by the doctor

    name: "New Year's Day"
    name: "Independence Day"
    name: "Christmas Day" 
    name: "Veterans Day" 
    name: "Juneteenth"