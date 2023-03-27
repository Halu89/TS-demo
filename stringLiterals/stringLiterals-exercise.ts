export {}

function firstLetter(str: string) {
    return str.slice(0, 1);
}

/**
 * How do you restrict the type of a depending on the string passed?
 */
const a = firstLetter("acrobatic");

/* ================================================== */

type SnakeCase = string;
type CamelCase = string;

declare function snaketoCamelCase(str: SnakeCase): CamelCase

/**
 * How do you type varName as "myVariable"?
 */
const varName = snaketoCamelCase("MY_VARIABLE")

/* ================================================== */

/**
 * How to add constraints on the event name, and the value in the callback ?
 * @param obj
 */
declare function makeWatchedObject<T extends Record<string, any>>(obj: T): T & {
    on(eventName: any, callback: (newValue: any) => void): void;
}

const person = makeWatchedObject({
    firstName: "Saoirse",
    lastName: "Ronan",
    age: 26,
});
person.on("event", (newValue) => {
    console.log(newValue);
})

/* ================================================== */

interface User {
    firstName: string,
    lastName: string,
}

const users: User[] = [
    {
        firstName: "John",
        lastName: "Cena",
    },
    {
        firstName: "Micheal",
        lastName: "Jordan",
    },
]

/**
 * How do you make this type based on the users array ?
 */
type ValidEmail = "jcena@r-yogi.com" | "mjordan@r-yogi.com"

declare function sendEmail(mail: ValidEmail): Promise<void>

sendEmail("jcena@r-yogi.com");
