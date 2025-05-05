//Code for hw4
//Start of code get all modules in order
//readline, file, calendar, holidays
const readlineSync = require('readline-sync');
const fs = require('fs');
const ical = require('node-ical');

let filename = 'calendarTest.txt'                                              //IMPORTANT: Keep this file 'calendarTest.txt' when using Jasmine
let events = ical.sync.parseFile(filename);                                    //othersie change for other calendars
const confirmationCodesList = new Set();
const fixedHolidays = [
    new Date("2024-01-01"), //New Year's Day
    new Date("2024-07-04"), //Indpendence Day
    new Date("2024-12-25"), //Christmas Day
    new Date("2024-11-11"), //Veterans Day
    new Date("2024-06-19") //Juneteenth
  ];
for(const event of Object.values(events)) {                                    //Get the codes in the events right now
    confirmationCodesList.add(event.confirmation);
}

//The main function where all other functions are called from 
function startProgram() {
    var userInput = readlineSync.question(                                     //Prompt user to pick one of the main functions or exit
        "\nWelcome to Patient Visit Scheduler\n" +
        "What would you like to do:\n" +
        "Press 1 to find next N available dates to schedule an appointment\n" +
        "Press 2 to reserve a date\n" +
        "Press 3 to lookup your upcoming reservations\n" +
        "Press 4 to cancel a reservation\n" +
        "Press 5 to exit the application\n"
      );

    if(userInput == "1") {
        findNextDate();
    }
    else if(userInput == "2") {
        reserveDate();
    }
    else if(userInput == "3") {
        searchReservations();
    }
    else if(userInput == "4") {
        cancelReservation();
    }
    else if(userInput == "5") {
        console.debug("Goodbye");
        return; 
    }
    else {
        console.debug("Not a valid input, try again");
        startProgram();
    }

}

//This function finds the next available dates the user requests
function findNextDate() {
    events = ical.sync.parseFile(filename);                                   
    var rangeFind = readlineSync.question(
        "How many avaible dates do you want to search for (1-4)?\n"
    );
    var numOfDays = readlineSync.question(
        "Within what range of days (1-100)?\n"
    );
    let datesFound = findNextDateHelper(events, rangeFind, numOfDays);

    if(!(datesFound === undefined || datesFound.length == 0)) {                //If dates were found, prints them out in a list for user to select which one to reserve
        let resultOutput = "";
        for(let i = 0; i < datesFound.length; i++) {
            if(datesFound[i] != undefined) {
                resultOutput = resultOutput + i + " Available Date: " + (datesFound[i]) + "\n";
            }
        }
        var reserveChoice = readlineSync.question(
            "Would you like to reserve an available date:\n" +
            resultOutput

        );
        if(reserveChoice >= 0 && reserveChoice < datesFound.length) {
            var attendeeToReserve = readlineSync.question(
                "Enter attendee to reserve (email/phone number):\n"
            );
            if(attendeeChecker(attendeeToReserve)) {
                const isoString = datesFound[reserveChoice].toISOString();
                const customFormat = isoString.replace(/[-:]/g, '').replace(/\.\d+Z$/, '');
                if(reserveDateHelper(events, customFormat, attendeeToReserve)) {                   //Calls reserve function from finder function
                    console.debug("Successfully added reservation.");
                    startProgram();
                }
            }
            else {
                console.debug("Invalid attendee entered.")
                startProgram();
            }
        }
        else {
            console.debug("None of the choices selected, back to menu");
            startProgram();
        }
    }
    else {
        console.debug("No available dates found.");
        startProgram();                                                        //Callback to main function
    }
}

//The helper function to find next available date
function findNextDateHelper(events, rangeFind, numOfDays) {
    events = ical.sync.parseFile(filename);
    let datesFound = [];
    const currentDate = new Date("Thu Feb 15 2024 00:00:00 GMT-0500 (Eastern Standard Time)");     //Instead of using now, to set a perma date so doesn't mess up testing
    if(rangeFind < 1 || rangeFind > 4) {
        console.debug("Invalid number for number of dates, try again.\n");
        return datesFound;
    }
    if(numOfDays < 1 || numOfDays > 100) {
        console.debug("Invalid number for range, try again.\n");
        return datesFound;
    }
    for(let i = 0; i < numOfDays; i++) {
        const dateToCheck = new Date(currentDate);
        dateToCheck.setDate(currentDate.getDate() + i);
        if(!isEventOnDay(events,dateToCheck) && isHolidayWeekend(dateToCheck)) {
            datesFound.push(dateToCheck);
        }
        if(datesFound.length == rangeFind) {
            return datesFound;
        }
    }
    return datesFound;
}

//Function to check if a date is booked in the events already
function isEventOnDay(events, dateToCheck) {
    events = ical.sync.parseFile(filename);
    for (const event of Object.values(events)) {
        if (!(event.start === undefined)) {;
            if (event.start.getFullYear() === dateToCheck.getFullYear() && event.start.getMonth() === dateToCheck.getMonth() && event.start.getDate() === dateToCheck.getDate()) {
                return true;
            }
        }
    }
    return false;
}

//Function to reserve a date, and add event to calendar 
function reserveDate() {
    events = ical.sync.parseFile(filename);
    var dateToReserve = readlineSync.question(
        "Enter date you want to reserve (YYYYMMDDTHHMMSS):\n"
    );
    if(dateChecker(events, dateToReserve) && isHolidayWeekend(dateToReserve)) {
        var attendeeToReserve = readlineSync.question(
            "Enter attendee to reserve (email/phone number):\n"
        );
        if(attendeeChecker(attendeeToReserve)) {
            if(reserveDateHelper(events, dateToReserve, attendeeToReserve)) {
                console.debug("Successfully added reservation.");
                startProgram();
            }
        }
        else {
            console.debug("Invalid attendee entered.")
            startProgram();
        }
    }
    else {
        console.debug("Couldn't reserve, event already exists on day.");
        startProgram();
    }
}

//Function to check if attendee entered is valid for ical
function attendeeChecker(attendeeToReserve) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    if (!(emailRegex.test(attendeeToReserve))) {
        if(!(phoneRegex.test(attendeeToReserve))) {
            return false;
        }
    }
    return true;
}

//Function to check if date is valid in ical
function dateChecker(events, dateToReserve) {
    events = ical.sync.parseFile(filename);
    let newInputArg = dateToReserve.slice(0,4) + '-' + dateToReserve.slice(4,6) + "-" + dateToReserve.slice(6,11) + ":" + dateToReserve.slice(11,13) + ":" +  dateToReserve.slice(13,15);
    let outputDate = new Date(newInputArg);
    let today = new Date("Thu Feb 15 2024 00:00:00 GMT-0500 (Eastern Standard Time)");
    today.setHours(0, 0, 0, 0);
    if(outputDate.toString() === "Invalid Date") {
        return false;
    }
    if (outputDate < today) {
        console.debug("Selected date must be today or a future date.");
        return false;
    }
    for(const event of Object.values(events)) {
        if(!(event.start === undefined) && event.start.getDate() == outputDate.getDate() && event.start.getMonth() == outputDate.getMonth() && event.start.getFullYear() == outputDate.getFullYear()) {
            return false;
        }
    }
    return true;
}

//Function to check if date is a weekend or holiday
function isHolidayWeekend(dateToCheck) {
    if(!(dateToCheck instanceof Date)) {
        let newInputArg = dateToCheck.slice(0,4) + '-' + dateToCheck.slice(4,6) + "-" + dateToCheck.slice(6,11) + ":" + dateToCheck.slice(11,13) + ":" +  dateToCheck.slice(13,15);
        let outputDate = new Date(newInputArg);
        var dayOfTheWeek = outputDate.getDay();
        if(isDateInFixedHolidays(outputDate)) {
            console.debug("Date to reserve is a US holiday.");
            return false;
        }
    }
    else {
        dateToCheck.setHours(0, 0, 0, 0); // Set time to midnight
        if(isDateInFixedHolidays(dateToCheck)) {
            console.debug("Date to reserve is a US holiday.");
            return false;
        }
        var dayOfTheWeek = dateToCheck.getDay();
    }
    if(dayOfTheWeek == 6 || dayOfTheWeek == 0) {
        console.debug("Date to reserve is a weekend.");
        return false;
    } 
    return true;
}

//Helper function to check holiday in fixed array
function isDateInFixedHolidays(dateToCheck) {
    for(const holidays of fixedHolidays) {
        holidayDay = holidays.getDate() + 1;
        holidayMonth = holidays.getMonth();
        if(holidayDay == 32) {
            holidayDay = 1;
            holidayMonth = 0;
        }
        if(dateToCheck.getDate() == holidayDay && dateToCheck.getMonth() == holidayMonth) {
            return true;
        }
    }
    return false;
}

//Function to actually reserve the date into the file 
function reserveDateHelper(events, dateToReserve, attendeeToReserve) {
    events = ical.sync.parseFile(filename);
    let generatedCode = generateConfirmationCode();
    const newEventString = `
BEGIN:VEVENT
ATTENDEE:${attendeeToReserve}
DTSTART:${dateToReserve}
METHOD:REQUEST
STATUS:CONFIRMED
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, '')}
CONFIRMATION:${generatedCode}
END:VEVENT`;
    const fileContents = fs.readFileSync(filename, 'utf-8');
    const lastEndVEventIndex = fileContents.lastIndexOf('END:VEVENT');
    const updatedEvents = fileContents.slice(0, lastEndVEventIndex + 'END:VEVENT'.length) + newEventString + fileContents.slice(lastEndVEventIndex + 'END:VEVENT'.length);
    fs.writeFileSync(filename, updatedEvents);
    events = ical.sync.parseFile(filename);
    console.debug(generatedCode);
    return true;
}

//Function that searches for reservations based on attendee
function searchReservations() {
    events = ical.sync.parseFile(filename);
    var patient = readlineSync.question(
        "Enter your email or phone number:\n"
      );
    let result = searchReservationsHelper(events, patient);
    if(!(result === undefined || result.length == 0)) {
        let resultOutput = "";
        for(let i = 0; i < result.length; i++) {
            if(result[i].start != undefined) {
                resultOutput = resultOutput + i + " Date Start: " + (result[i].start) + "\n  Confirmation Code: " + (result[i].confirmation) + "\n";
            }
        }
        var cancelChoice = readlineSync.question(
            "Would you like to cancel an upcoming reservation:\n" +
            resultOutput

        );
        if(cancelChoice >= 0 && cancelChoice < result.length) {
            if(cancelReservationHelper(events, result[cancelChoice].confirmation)) {
                startProgram();
            }
        }
        else {
            console.debug("None of the choices selected, back to menu");
            startProgram();
        }
    }
    else {
        console.debug("No matching events to attendee provided.");
        startProgram();
    }
}

//Function to help search for reservations, by checking attendee and events 
function searchReservationsHelper(events, patient) {
    events = ical.sync.parseFile(filename);
    let reservationsFound = [];
    for(const event of Object.values(events)) {
        if(patient == event.attendee) {
            reservationsFound.push(event);
        }
    }
    return reservationsFound;
}

//Function to cancel reservations based on confirmation number
function cancelReservation() {
    events = ical.sync.parseFile(filename);
    var cancelDate = readlineSync.question(
        "Enter confirmation code to cancel reservation:\n"
    );

    if(cancelReservationHelper(events, cancelDate)) {
        startProgram();
    }
    else {
        startProgram();
    }
}

//Function to help cancel and delete event from ical file
function cancelReservationHelper(events, cancelCode) {
    events = ical.sync.parseFile(filename);
    if (!cancelCode) {
        console.debug("Invalid input. Confirmation code is required for cancellation.");
        return false;
    }
    const fileContents = fs.readFileSync(filename, 'utf-8');
    const startIndex = fileContents.indexOf(`CONFIRMATION:${cancelCode}`);
    if (startIndex === -1) {
        console.debug("Confirmation code not found. Unsuccessful Cancellation.");
        return false;
    }
    const startOfEvent = fileContents.lastIndexOf('BEGIN:VEVENT', startIndex);
    const endOfEvent = fileContents.indexOf('END:VEVENT', startIndex) + 'END:VEVENT'.length;
    const beforeEvent = fileContents.slice(0, startOfEvent);
    const afterEvent = fileContents.slice(endOfEvent);
    const updatedEvents = beforeEvent + afterEvent.trimStart();

    fs.writeFileSync(filename, updatedEvents);
    events = ical.sync.parseFile(filename);
    console.debug("Successful Cancellation.");
    return true;
}

//Function to generate unique confirmation code 
function generateConfirmationCode() {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code;
    do {
        code = '';
        for(let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            code += charset[randomIndex];
        }
    } while (confirmationCodesList.has(code));
    confirmationCodesList.add(code);
    return code;
}

//Main start only for this file not jasmine
if (require.main === module) {
    // If the script is run directly, execute startProgram
    startProgram();
}
module.exports = { findNextDateHelper, isEventOnDay, attendeeChecker, dateChecker, isHolidayWeekend, reserveDateHelper, searchReservationsHelper, cancelReservationHelper, generateConfirmationCode };