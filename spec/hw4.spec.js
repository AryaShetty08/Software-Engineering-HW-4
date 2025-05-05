//Test cases for functions here:

const fs = require('fs');
const { findNextDateHelper } = require("../lib/hw4");
const { isEventOnDay } = require("../lib/hw4");
const { attendeeChecker } = require("../lib/hw4");
const { dateChecker } = require("../lib/hw4");
const { isHolidayWeekend } = require("../lib/hw4");
const { reserveDateHelper } = require("../lib/hw4");
const { searchReservationsHelper } = require("../lib/hw4");
const { cancelReservationHelper } = require("../lib/hw4");
const { generateConfirmationCode } = require("../lib/hw4");

const calendarContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:PID
BEGIN:VEVENT
ATTENDEE:hello@sup.com
DTSTART:20240215T070440
METHOD:REQUEST
STATUS:CONFIRMED
DTSTAMP:20240215T070451
CONFIRMATION:7U3L550LM3
END:VEVENT
BEGIN:VEVENT
ATTENDEE:hello@sup.com
DTSTART:20240219T000000
METHOD:REQUEST
STATUS:CONFIRMED
DTSTAMP:20240215T072305
CONFIRMATION:5F9M1HIW5V
END:VEVENT
BEGIN:VEVENT
ATTENDEE:hello@sup.com
DTSTART:20240216T050000
METHOD:REQUEST
STATUS:CONFIRMED
DTSTAMP:20240216T224604
CONFIRMATION:7Y2GKZVV8C
END:VEVENT
BEGIN:VEVENT
ATTENDEE:bye@sup.com
DTSTART:20240220T050000
METHOD:REQUEST
STATUS:CONFIRMED
DTSTAMP:20240216T225236
CONFIRMATION:O4FOQFUB8F
END:VEVENT
END:VCALENDAR
`;

describe('tests for findNextDateHelper', () => {
    beforeAll(() => {
      fs.writeFileSync("calendarTest.txt", calendarContent);
    });
  
    const mockEvents1 = {
        '2270c5d5-4f98-4c11-8f47-1a733bdf52df': {
          type: 'VEVENT',
          params: [],
          attendee: 'hello@sup.com',
          start: '2024-02-15T12:04:40.000Z',
          datetype: 'date-time',
          method: 'REQUEST',
          status: 'CONFIRMED',
          dtstamp: '2024-02-15T12:04:51.000Z',
          confirmation: '7U3L550LM3',
          end: '2024-02-15T12:04:40.000Z'
        },
        '5d3f6c8e-81a5-456b-9411-987a28147a43': {
          type: 'VEVENT',
          params: [],
          attendee: 'hello@sup.com',
          start: '2024-02-15T12:11:47.000Z',
          datetype: 'date-time',
          method: 'REQUEST',
          status: 'CONFIRMED',
          dtstamp: '2024-02-15T12:12:03.000Z',
          confirmation: 'NPAJ0XA9TW',
          end: '2024-02-15T12:11:47.000Z'
        },
        '5acab5aa-8e65-4e2d-a085-a9257d0a9076': {
          type: 'VEVENT',
          params: [],
          attendee: 'hello@sup.com',
          start: '2024-02-19T05:00:00.000Z',
          datetype: 'date-time',
          method: 'REQUEST',
          status: 'CONFIRMED',
          dtstamp: '2024-02-15T12:23:05.000Z',
          confirmation: '5F9M1HIW5V',
          end: '2024-02-19T05:00:00.000Z'
        },
        'vcalendar': {
          type: 'VCALENDAR',
          version: '2.0',
          prodid: 'PID'
        }
      };

    const rangeFind1 = 1;
    const rangeFind2 = 0;
    const rangeFind3 = 2;
    const rangeFind4 = 10;

    const numOfDays1 = 1;
    const numOfDays2 = 0;
    const numOfDays3 = 10;
    const numOfDays4 = 1000;

    const realResult1 = [];
    const realResult2 = [new Date("Fri Feb 16 2024 17:57:59 GMT-0500 (Eastern Standard Time)")];
    const realResult3 = [new Date("Fri Feb 16 2024 17:57:59 GMT-0500 (Eastern Standard Time)"), new Date("Tue Feb 20 2024 00:12:35 GMT-0500 (Eastern Standard Time)")];

  it("should find nothing, return empty (1)", () => {
    expect(findNextDateHelper(mockEvents1, rangeFind1, numOfDays2)).toEqual(realResult1);
  });

  it("should find nothing since range and num are 0, return empty (2)", () => {
    expect(findNextDateHelper(mockEvents1, rangeFind2, numOfDays2)).toEqual(realResult1);
  });

  it("should find nothing since range is 0, return empty (3)", () => {
    expect(findNextDateHelper(mockEvents1, rangeFind2, numOfDays1)).toEqual(realResult1);
  });
  
  it("should find nothing since num is 0, return empty (4)", () => {
    expect(findNextDateHelper(mockEvents1, rangeFind1, numOfDays2)).toEqual(realResult1);
  });

  it("should find one date (5)", () => {
    const now = new Date("Fri Feb 16 2024 17:57:59 GMT-0500 (Eastern Standard Time)");
    
    realResult2[0].setTime(now.getTime());
    const result = findNextDateHelper(mockEvents1, rangeFind1, numOfDays3);
    result[0].setTime(now.getTime());
    
    expect(result).toEqual(realResult2);
  });

  it("should find one date (6)", () => {
    const now = new Date("Fri Feb 16 2024 17:57:59 GMT-0500 (Eastern Standard Time)");
    
    realResult3[0].setTime(now.getTime());
    realResult3[1].setTime(now.getTime());

    const result = findNextDateHelper(mockEvents1, rangeFind3, numOfDays3);
    
    result[0].setTime(now.getTime());
    result[1].setTime(now.getTime());


    expect(result).toEqual(realResult3);
   });

  it("should find nothing, over range, return empty (7)", () => {
    expect(findNextDateHelper(mockEvents1, rangeFind4, numOfDays2)).toEqual(realResult1);
  });
  
  it("should find nothing, over days, return empty (8)", () => {
    expect(findNextDateHelper(mockEvents1, rangeFind1, numOfDays4)).toEqual(realResult1);
  });
});

describe('tests for isEventOnDay', () => {
    beforeAll(() => {
      fs.writeFileSync("calendarTest.txt", calendarContent);
    });

    const mockEvents1 = {
        '2270c5d5-4f98-4c11-8f47-1a733bdf52df': {
          type: 'VEVENT',
          params: [],
          attendee: 'hello@sup.com',
          start: '2024-02-15T12:04:40.000Z',
          datetype: 'date-time',
          method: 'REQUEST',
          status: 'CONFIRMED',
          dtstamp: '2024-02-15T12:04:51.000Z',
          confirmation: '7U3L550LM3',
          end: '2024-02-15T12:04:40.000Z'
        },
        '5d3f6c8e-81a5-456b-9411-987a28147a43': {
          type: 'VEVENT',
          params: [],
          attendee: 'hello@sup.com',
          start: '2024-02-15T12:11:47.000Z',
          datetype: 'date-time',
          method: 'REQUEST',
          status: 'CONFIRMED',
          dtstamp: '2024-02-15T12:12:03.000Z',
          confirmation: 'NPAJ0XA9TW',
          end: '2024-02-15T12:11:47.000Z'
        },
        '5acab5aa-8e65-4e2d-a085-a9257d0a9076': {
          type: 'VEVENT',
          params: [],
          attendee: 'hello@sup.com',
          start: '2024-02-19T05:00:00.000Z',
          datetype: 'date-time',
          method: 'REQUEST',
          status: 'CONFIRMED',
          dtstamp: '2024-02-15T12:23:05.000Z',
          confirmation: '5F9M1HIW5V',
          end: '2024-02-19T05:00:00.000Z'
        },
        'vcalendar': {
          type: 'VCALENDAR',
          version: '2.0',
          prodid: 'PID'
        }
      };

    const dateToCheck1 = new Date("Fri Feb 11 2024 17:57:59 GMT-0500 (Eastern Standard Time)");
    const dateToCheck2 = new Date("Fri Feb 16 2024 17:57:59 GMT-0500 (Eastern Standard Time)");
    const dateToCheck3 = new Date("");
    const dateToCheck4 = new Date("Fri Feb 19 2024 17:57:59 GMT-0500 (Eastern Standard Time)");
    const dateToCheck5 = new Date("Fri Feb 9 2024 17:57:59 GMT-0500 (Eastern Standard Time)");

    it("should find not on event day (9)", () => {
        expect(isEventOnDay(mockEvents1, dateToCheck1)).toBe(false);
    });

    it("should find on event day (10)", () => {
        expect(isEventOnDay(mockEvents1, dateToCheck2)).toBe(true);
    });
    
    it("should find not on event day (11)", () => {
        expect(isEventOnDay(mockEvents1, dateToCheck3)).toBe(false);
    });

    it("should find event day (12)", () => {
        expect(isEventOnDay(mockEvents1, dateToCheck4)).toBe(true);
    });
    
    it("should find not on event day (13)", () => {
        expect(isEventOnDay(mockEvents1, dateToCheck5)).toBe(false);
    });

});

describe('tests for attendeeChecker', () => {  
    beforeAll(() => {
      fs.writeFileSync("calendarTest.txt", calendarContent);
    });

    const attendeeToReserve1 = "hello@sup.com";
    const attendeeToReserve2 = "7326728902";
    const attendeeToReserve3 = "";
    const attendeeToReserve4 = "hello@sum";
    const attendeeToReserve5 = "13098321903823021912";

    it("should find attendee is good (14)", () => {
        expect(attendeeChecker(attendeeToReserve1)).toBe(true);
    });

    it("should find attendee is good (15)", () => {
        expect(attendeeChecker(attendeeToReserve2)).toBe(true);
    });

    it("should find attendee is not good (16)", () => {
        expect(attendeeChecker(attendeeToReserve3)).toBe(false);
    });

    it("should find attendee is not good (17)", () => {
        expect(attendeeChecker(attendeeToReserve4)).toBe(false);
    });

    it("should find attendee is not good (18)", () => {
        expect(attendeeChecker(attendeeToReserve5)).toBe(false);
    });

});

describe('tests for dateChecker', () => {
    beforeAll(() => {
      fs.writeFileSync("calendarTest.txt", calendarContent);
    });

    const mockEvents1 = {
        '2270c5d5-4f98-4c11-8f47-1a733bdf52df': {
          type: 'VEVENT',
          params: [],
          attendee: 'hello@sup.com',
          start: '2024-02-15T12:04:40.000Z',
          datetype: 'date-time',
          method: 'REQUEST',
          status: 'CONFIRMED',
          dtstamp: '2024-02-15T12:04:51.000Z',
          confirmation: '7U3L550LM3',
          end: '2024-02-15T12:04:40.000Z'
        },
        '5d3f6c8e-81a5-456b-9411-987a28147a43': {
          type: 'VEVENT',
          params: [],
          attendee: 'hello@sup.com',
          start: '2024-02-15T12:11:47.000Z',
          datetype: 'date-time',
          method: 'REQUEST',
          status: 'CONFIRMED',
          dtstamp: '2024-02-15T12:12:03.000Z',
          confirmation: 'NPAJ0XA9TW',
          end: '2024-02-15T12:11:47.000Z'
        },
        '5acab5aa-8e65-4e2d-a085-a9257d0a9076': {
          type: 'VEVENT',
          params: [],
          attendee: 'hello@sup.com',
          start: '2024-02-19T05:00:00.000Z',
          datetype: 'date-time',
          method: 'REQUEST',
          status: 'CONFIRMED',
          dtstamp: '2024-02-15T12:23:05.000Z',
          confirmation: '5F9M1HIW5V',
          end: '2024-02-19T05:00:00.000Z'
        },
        'vcalendar': {
          type: 'VCALENDAR',
          version: '2.0',
          prodid: 'PID'
        }
      };

    const dateToReserve1 = "20250217T000000";
    const dateToReserve2 = "20250219T000000";
    const dateToReserve3 = "20240219T000000";
    const dateToReserve4 = "";
    const dateToReserve5 = "813912921032109382103128932103";

    it("should find date is valid (19)", () => {
        expect(dateChecker(mockEvents1, dateToReserve1)).toBe(true);
    });

    it("should find date is valid (20)", () => {
        expect(dateChecker(mockEvents1, dateToReserve2)).toBe(true);
    });

    it("should not find date valid same as events (21)", () => {
        expect(dateChecker(mockEvents1, dateToReserve3)).toBe(false);
    });

    it("should not find date is valid becasue empty (22)", () => {
        expect(dateChecker(mockEvents1, dateToReserve4)).toBe(false);
    });

    it("should not find date is valid, big number (23)", () => {
        expect(dateChecker(mockEvents1, dateToReserve5)).toBe(false);
    });

});

describe('tests for isHolidayWeekend', () => {  
    beforeAll(() => {
      fs.writeFileSync("calendarTest.txt", calendarContent);
    });

    const dateToCheck1 = "20240909T000000";
    const dateToCheck2 = "20240907T000000";
    const dateToCheck3 = "20240908T000000";
    const dateToCheck4 = "20241225T000000";
    const dateToCheck5 = "20240101T000000";
    const dateToCheck6 = "20240910T000000";
    const dateToCheck7 = new Date("Fri Feb 16 2024 17:57:59 GMT-0500 (Eastern Standard Time)");
    const dateToCheck8 = new Date("Wed Feb 28 2024 17:57:59 GMT-0500 (Eastern Standard Time)");


    it("should find date is valid (24)", () => {
        expect(isHolidayWeekend(dateToCheck1)).toBe(true);
    });

    it("should not find date is valid (weekend) (25)", () => {
        expect(isHolidayWeekend(dateToCheck2)).toBe(false);
    });
    
    it("should not find date is valid (weekend) (26)", () => {
        expect(isHolidayWeekend(dateToCheck3)).toBe(false);
    });

    it("should not find date is valid (holiday) (27)", () => {
        expect(isHolidayWeekend(dateToCheck4)).toBe(false);
    });

    it("should not find date is valid (holiday) (28)", () => {
        expect(isHolidayWeekend(dateToCheck5)).toBe(false);
    });

    it("should find date is valid (29)", () => {
        expect(isHolidayWeekend(dateToCheck6)).toBe(true);
    });

    it("should not find date is valid (weekend) (30)", () => {
        expect(isHolidayWeekend(dateToCheck7)).toBe(true);
    });

    it("should find date is valid (31)", () => {
        expect(isHolidayWeekend(dateToCheck8)).toBe(true);
    });
});

describe('tests for reserveDateHelper', () => {
    beforeAll(() => {
      fs.writeFileSync("calendarTest.txt", calendarContent);
    });

    const mockEvents1 = {
        '2270c5d5-4f98-4c11-8f47-1a733bdf52df': {
          type: 'VEVENT',
          params: [],
          attendee: 'hello@sup.com',
          start: '2024-02-15T12:04:40.000Z',
          datetype: 'date-time',
          method: 'REQUEST',
          status: 'CONFIRMED',
          dtstamp: '2024-02-15T12:04:51.000Z',
          confirmation: '7U3L550LM3',
          end: '2024-02-15T12:04:40.000Z'
        },
        '5d3f6c8e-81a5-456b-9411-987a28147a43': {
          type: 'VEVENT',
          params: [],
          attendee: 'hello@sup.com',
          start: '2024-02-15T12:11:47.000Z',
          datetype: 'date-time',
          method: 'REQUEST',
          status: 'CONFIRMED',
          dtstamp: '2024-02-15T12:12:03.000Z',
          confirmation: 'NPAJ0XA9TW',
          end: '2024-02-15T12:11:47.000Z'
        },
        '5acab5aa-8e65-4e2d-a085-a9257d0a9076': {
          type: 'VEVENT',
          params: [],
          attendee: 'hello@sup.com',
          start: '2024-02-19T05:00:00.000Z',
          datetype: 'date-time',
          method: 'REQUEST',
          status: 'CONFIRMED',
          dtstamp: '2024-02-15T12:23:05.000Z',
          confirmation: '5F9M1HIW5V',
          end: '2024-02-19T05:00:00.000Z'
        },
        'vcalendar': {
          type: 'VCALENDAR',
          version: '2.0',
          prodid: 'PID'
        }
    };

    const dateToReserve1 = "20240227T000000";
    const dateToReserve2 = "20240306T000000";
    const dateToReserve3 = "20240427T000000";
    const dateToReserve4 = "20240606T000000";

    const attendeeToReserve1 = "hello@sup.com";
    const attendeeToReserve2 = "bye@sup.com";

    it("should find added event is valid (32)", () => {
        expect(reserveDateHelper(mockEvents1, dateToReserve1, attendeeToReserve1)).toBe(true);
    });
    
    it("should find added event is valid (33)", () => {
        expect(reserveDateHelper(mockEvents1, dateToReserve2, attendeeToReserve1)).toBe(true);
    });

    it("should find added event is valid (45)", () => {
      expect(reserveDateHelper(mockEvents1, dateToReserve3, attendeeToReserve2)).toBe(true);
    });
  
    it("should find added event is valid (46)", () => {
      expect(reserveDateHelper(mockEvents1, dateToReserve4, attendeeToReserve2)).toBe(true);
    });

});

describe('tests for search reservation helper', () => {
    beforeAll(() => {
      fs.writeFileSync("calendarTest.txt", calendarContent);
    });

    const mockEvents1 = [
        {
            id: '68eadda6-a788-4ea2-8d2f-04328b575705',
            type: 'VEVENT',
            params: [],
            attendee: 'hello@sup.com',
            start: '2201-01-09T14:01:00.000Z',
            datetype: 'date-time',
            method: 'REQUEST',
            status: 'CONFIRMED',
            dtstamp: '2001-01-09T14:01:00.000Z',
            confirmation: '12312312',
            end: '2201-01-09T14:01:00.000Z'
        },
        {
            id: 'bdca5009-961b-461c-bcff-cd75ff51d89c',
            type: 'VEVENT',
            params: [],
            attendee: 'hello@sup.com',
            start: '2001-01-03T14:01:00.000Z',
            datetype: 'date-time',
            method: 'REQUEST',
            status: 'CONFIRMED',
            dtstamp: '2001-01-09T14:01:00.000Z',
            end: '2001-01-03T14:01:00.000Z'
        },
        {
            id: '343e3f27-38c2-444c-a0fa-2d832377197e',
            type: 'VEVENT',
            params: [],
            attendee: 'hello@sup.com',
            start: '2001-01-05T14:01:00.000Z',
            datetype: 'date-time',
            method: 'REQUEST',
            status: 'CONFIRMED',
            dtstamp: '2001-01-09T14:01:00.000Z',
            end: '2001-01-05T14:01:00.000Z'
        },
        {
            type: 'VCALENDAR   ',
            version: '2.0',
            prodid: 'PID'
        }
    ];

    const realResult1 = [
        {
          id: '68eadda6-a788-4ea2-8d2f-04328b575705',
          type: 'VEVENT',
          params: [],
          attendee: 'hello@sup.com',
          start: '2201-01-09T14:01:00.000Z',
          datetype: 'date-time',
          method: 'REQUEST',
          status: 'CONFIRMED',
          dtstamp: '2001-01-09T14:01:00.000Z',
          confirmation: '12312312',
          end: '2201-01-09T14:01:00.000Z'
        },
        {
          id: 'bdca5009-961b-461c-bcff-cd75ff51d89c',
          type: 'VEVENT',
          params: [],
          attendee: 'hello@sup.com',
          start: '2001-01-03T14:01:00.000Z',
          datetype: 'date-time',
          method: 'REQUEST',
          status: 'CONFIRMED',
          dtstamp: '2001-01-09T14:01:00.000Z',
          end: '2001-01-03T14:01:00.000Z'
        },
        {
          id: '343e3f27-38c2-444c-a0fa-2d832377197e',
          type: 'VEVENT',
          params: [],
          attendee: 'hello@sup.com',
          start: '2001-01-05T14:01:00.000Z',
          datetype: 'date-time',
          method: 'REQUEST',
          status: 'CONFIRMED',
          dtstamp: '2001-01-09T14:01:00.000Z',
          end: '2001-01-05T14:01:00.000Z'
        }
      ]; 

      const mockEvents2 = [
        {
            id: '68eadda6-a788-4ea2-8d2f-04328b575705',
            type: 'VEVENT',
            params: [],
            attendee: 'hellwqo@sup.com',
            start: '2201-01-09T14:01:00.000Z',
            datetype: 'date-time',
            method: 'REQUEST',
            status: 'CONFIRMED',
            dtstamp: '2001-01-09T14:01:00.000Z',
            confirmation: '12312312',
            end: '2201-01-09T14:01:00.000Z'
        },
        {
            id: 'bdca5009-961b-461c-bcff-cd75ff51d89c',
            type: 'VEVENT',
            params: [],
            attendee: 'helsdlo@sup.com',
            start: '2001-01-03T14:01:00.000Z',
            datetype: 'date-time',
            method: 'REQUEST',
            status: 'CONFIRMED',
            dtstamp: '2001-01-09T14:01:00.000Z',
            end: '2001-01-03T14:01:00.000Z'
        },
        {
            id: '343e3f27-38c2-444c-a0fa-2d832377197e',
            type: 'VEVENT',
            params: [],
            attendee: 'helldso@sup.com',
            start: '2001-01-05T14:01:00.000Z',
            datetype: 'date-time',
            method: 'REQUEST',
            status: 'CONFIRMED',
            dtstamp: '2001-01-09T14:01:00.000Z',
            end: '2001-01-05T14:01:00.000Z'
        },
        {
            type: 'VCALENDAR   ',
            version: '2.0',
            prodid: 'PID'
        }
    ];

    const mockPatient1 = 'h';
    const mockPatient2 = 'hello@sup.com';
    const mockPatient3 = 'hi@sup.com';
    const mockPatient4 = 'bye@sup.com';

    const realResult2 = []; 

      const mockEvents3 = [
        {
            id: '68eadda6-a788-4ea2-8d2f-04328b575705',
            type: 'VEVENT',
            params: [],
            attendee: 'hello@sup.com',
            start: '2201-01-09T14:01:00.000Z',
            datetype: 'date-time',
            method: 'REQUEST',
            status: 'CONFIRMED',
            dtstamp: '2001-01-09T14:01:00.000Z',
            confirmation: '12312312',
            end: '2201-01-09T14:01:00.000Z'
        },
        {
            id: 'bdca5009-961b-461c-bcff-cd75ff51d89c',
            type: 'VEVENT',
            params: [],
            attendee: 'hellwo@sup.com',
            start: '2001-01-03T14:01:00.000Z',
            datetype: 'date-time',
            method: 'REQUEST',
            status: 'CONFIRMED',
            dtstamp: '2001-01-09T14:01:00.000Z',
            end: '2001-01-03T14:01:00.000Z'
        },
        {
            id: '343e3f27-38c2-444c-a0fa-2d832377197e',
            type: 'VEVENT',
            params: [],
            attendee: 'heasllo@sup.com',
            start: '2001-01-05T14:01:00.000Z',
            datetype: 'date-time',
            method: 'REQUEST',
            status: 'CONFIRMED',
            dtstamp: '2001-01-09T14:01:00.000Z',
            end: '2001-01-05T14:01:00.000Z'
        },
        {
            type: 'VCALENDAR   ',
            version: '2.0',
            prodid: 'PID'
        }
    ];

    const realResult3 = [
      {
        type: 'VEVENT',
        params: [],
        attendee: 'hello@sup.com',
        start: new Date('2024-02-15T07:04:40'),
        datetype: 'date-time',
        method: 'REQUEST',
        status: 'CONFIRMED',
        dtstamp: new Date('2024-02-15T07:04:51'),
        confirmation: '7U3L550LM3',
        end: new Date('2024-02-15T07:04:40')
      },
      {
        type: 'VEVENT',
        params: [],
        attendee: 'hello@sup.com',
        start: new Date('2024-02-19T00:00:00'),
        datetype: 'date-time',
        method: 'REQUEST',
        status: 'CONFIRMED',
        dtstamp: new Date('2024-02-15T07:23:05'),
        confirmation: '5F9M1HIW5V',
        end: new Date('2024-02-19T00:00:00')
      },
      {
        type: 'VEVENT',
        params: [],
        attendee: 'hello@sup.com',
        start: new Date('2024-02-16T05:00:00'),
        datetype: 'date-time',
        method: 'REQUEST',
        status: 'CONFIRMED',
        dtstamp: new Date('2024-02-16T22:46:04'),
        confirmation: '7Y2GKZVV8C',
        end: new Date('2024-02-16T05:00:00')
      }
    ];

    const realResult4 = [
      {
        type: 'VEVENT',
        params: [],
        attendee: 'bye@sup.com',
        start: new Date('2024-02-20T05:00:00'),
        datetype: 'date-time',
        method: 'REQUEST',
        status: 'CONFIRMED',
        dtstamp: new Date('2024-02-16T22:52:36'),
        confirmation: 'O4FOQFUB8F',
        end: new Date('2024-02-20T05:00:00')
      }      
    ];
    
  it("should find no reservations for a patient (34)", () => {
    expect(searchReservationsHelper(mockEvents1, mockPatient1)).toEqual(realResult2);
  });

  it("should find some reservations for a patient (35)", () => {
    expect(searchReservationsHelper(mockEvents2, mockPatient2)).toEqual(realResult3);
  });
  
  it("should find no reservation for a patient (36)", () => {
    expect(searchReservationsHelper(mockEvents3, mockPatient3)).toEqual(realResult2);
  });

  it("should find one reservation for a patient (40)", () => {
    expect(searchReservationsHelper(mockEvents3, mockPatient4)).toEqual(realResult4);
  });

  it("should find no reservation for a patient (47)", () => {
    expect(searchReservationsHelper(mockEvents3, mockPatient1)).toEqual(realResult2);
  });

  it("should find one reservation for a patient (48)", () => {
    expect(searchReservationsHelper(mockEvents2, mockPatient4)).toEqual(realResult4);
  });

});

describe('tests for search generate confirm code', () => {  
    beforeAll(() => {
      fs.writeFileSync("calendarTest.txt", calendarContent);
    });

  let mockCode1 = generateConfirmationCode();
  let mockCode2 = generateConfirmationCode();
  let mockCode3 = generateConfirmationCode();


  it("should find code generated to work (37)", () => {
    expect(mockCode1.length).toEqual(10);
  });
  
  it("should find code generated to work (38)", () => {
    expect(mockCode2.length).toEqual(10);
  });

  it("should find code generated to work but not be greater than length 10 (39)", () => {
    expect(mockCode3.length).not.toEqual(11);
  });

  it("should find code generated to work but not be less than length 10 (49)", () => {
    expect(mockCode3.length).not.toEqual(9);
  });

});

describe('tests for cancelReservationHelper ', () => {
  beforeAll(() => {
    fs.writeFileSync("calendarTest.txt", calendarContent);
  });

  const mockEvents1 = [
    {
        id: '68eadda6-a788-4ea2-8d2f-04328b575705',
        type: 'VEVENT',
        params: [],
        attendee: 'hello@sup.com',
        start: '2201-01-09T14:01:00.000Z',
        datetype: 'date-time',
        method: 'REQUEST',
        status: 'CONFIRMED',
        dtstamp: '2001-01-09T14:01:00.000Z',
        confirmation: '12312312',
        end: '2201-01-09T14:01:00.000Z'
    },
    {
        id: 'bdca5009-961b-461c-bcff-cd75ff51d89c',
        type: 'VEVENT',
        params: [],
        attendee: 'hello@sup.com',
        start: '2001-01-03T14:01:00.000Z',
        datetype: 'date-time',
        method: 'REQUEST',
        status: 'CONFIRMED',
        dtstamp: '2001-01-09T14:01:00.000Z',
        end: '2001-01-03T14:01:00.000Z'
    },
    {
        id: '343e3f27-38c2-444c-a0fa-2d832377197e',
        type: 'VEVENT',
        params: [],
        attendee: 'hello@sup.com',
        start: '2001-01-05T14:01:00.000Z',
        datetype: 'date-time',
        method: 'REQUEST',
        status: 'CONFIRMED',
        dtstamp: '2001-01-09T14:01:00.000Z',
        end: '2001-01-05T14:01:00.000Z'
    },
    {
        type: 'VCALENDAR   ',
        version: '2.0',
        prodid: 'PID'
    }
  ];

  const mockCancel1 = "";
  const mockCancel2 = "fwieuonewijfiwef";
  const mockCancel3 = "7Y2GKZVV8C";
  const mockCancel4 = "O4FOQFUB8F";
  const mockCancel5 = "V3OSCSDBWF";

  it("should not find cancel true (41)", () => {
    expect(cancelReservationHelper(mockEvents1, mockCancel1)).toBe(false);
  });

  it("should not find cancel true (42)", () => {
    expect(cancelReservationHelper(mockEvents1, mockCancel2)).toBe(false);
  });

  it("should find cancel true (43)", () => {
    expect(cancelReservationHelper(mockEvents1, mockCancel3)).toBe(true);
  });

  it("should find cancel true (44)", () => {
    expect(cancelReservationHelper(mockEvents1, mockCancel4)).toBe(true);
  });

  it("should not find cancel true (50)", () => {
    expect(cancelReservationHelper(mockEvents1, mockCancel5)).toBe(false);
  });

});