export {}


type FirstLetter<S extends string> = S extends `${infer T}${infer U}` ? T : S // Could also be never

function firstLetter<T extends string>(str: T) {
    return str.slice(0, 1) as FirstLetter<T>;
}

/**
 * How do you restrict the type of a depending on the string passed?
 */
const a = firstLetter("acrobatic");
const b = firstLetter("");

type SnakeCase = string;
type CamelCase = string;

/**
 * Note the recursive call.
 */
type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}` ?
    `${Lowercase<T>}${Capitalize<Lowercase<SnakeToCamelCase<U>>>}` : S

declare function snaketoCamelCase<T extends SnakeCase>(str: T): SnakeToCamelCase<T>

/**
 * How do you type varName as "myVariable"?
 */
const varName = snaketoCamelCase("MY_VARIABLE")


interface User {
    firstName: string,
    lastName: string,
}

const users = [
    {
        firstName: "John",
        lastName: "Cena",
    },
    {
        firstName: "Micheal",
        lastName: "Jordan",
    },
] as const

type Initial<T extends User> = Lowercase<FirstLetter<T["firstName"]>>;

type MailFromUser<T extends readonly User[]> =
    `${Initial<T[number]>}${Lowercase<T[number]["lastName"]>}@r-yogi.com`

/**
 * How do you make this type based on the users array ?
 */
type ValidEmail = MailFromUser<typeof users>;

declare function sendEmail(mail: ValidEmail): Promise<void>

sendEmail("mjordan@r-yogi.com");
