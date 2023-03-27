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

/* ================================================== */

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

/* ================================================== */

/**
 * How to add constraints on the event name, and the value in the callback ?
 */
declare function makeWatchedObject<T extends Record<string, unknown>>(obj: T): T & {
    on<Key extends string & keyof T>(eventName: `${Key}Changed`, callback: (newValue: T[Key]) => void): void;
}

const person = makeWatchedObject({
    firstName: "John",
    lastName: "Cena",
    age: 42,
});

person.on("firstNameChanged", (newValue) => {
    const val: number = newValue;
    console.log(newValue);
})

/* ================================================== */

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

type Literal<Type> = {
    [Property in keyof Type]: Type[Property]
}
type UserType = Literal<typeof users[number]>

/**
 * First solution (bugged ❌)
 */
type MailFromUser<T extends readonly User[]> =
    `${Lowercase<FirstLetter<T[number]["firstName"]>>}${Lowercase<T[number]["lastName"]>}@r-yogi.com`
type ValidEmail = MailFromUser<typeof users>;

/**
 * Second solution (bugged ❌)
 */
type MailFromUser2<T extends UserType> =
    T extends ({ firstName: infer U extends string, lastName: infer V extends string }) ?
        `${Lowercase<FirstLetter<U>>}${Lowercase<V>}@r-yogi.com` : never
type ValidEmail2 = MailFromUser2<UserType>;

/**
 * 3rd solution (Works ✅)
 */
type UserWithEmail<T extends UserType> = T extends (
    {
        firstName: infer U extends string,
        lastName: infer V extends string
    }) ?
    User & {
    email: `${Lowercase<FirstLetter<U>>}${Lowercase<V>}@r-yogi.com`
} : T;
type MailFromUser3 = UserWithEmail<UserType>["email"]

/**
 * How do you make this type based on the users array ?
 */
type ValidEmail3 = MailFromUser3;

declare function sendEmail(mail: ValidEmail3): Promise<void>

sendEmail("mcena@r-yogi.com");
