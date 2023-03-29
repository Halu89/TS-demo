/**
 * Creates a module to avoid polluting the namespace with types and interface
 */
export {}

/**
 * We create a base interface
 */
interface ID {
    id: string;
}

/**
 * Allows extra properties: Read more https://basarat.gitbook.io/typescript/type-system/freshness#freshness
 */
interface ExtendedId  extends ID{
    [otherProperty: string]:unknown
}

/**
 * A user extends the base id interface: A user has an id.
 */
interface User extends ID {
    username: string;
    email?: string;
    profilePic?: string;
    role: "admin" | "user" | "guest" | "sysadmin";
}

/**
 * The post also has an id.
 *
 * How to restrict the type of author to objects with an id?
 * The author field can be just the user id, or the entire user details.
 *
 * => We use generics. extends allows us to restrict the type.
 * TAuthor = ID means that by default, the Post author only has an id.
 * Passing a more specific type further restricts the type of author.
 */
type Post<TAuthor extends ID = ExtendedId> = {
    title: string;
    body: string;
    author: TAuthor
} & ID;

/**
 * By default, Post can take anything with an id (TAuthor is ExtendedId)
 */
const post: Post = {
    id: "uuid",
    author: {id: "uuid", foo: true},
    body: "",
    title: "My title"
}

/**
 * If we specify the type of Post, it is more restrictive.
 */
const post2: Post<ID> = {
    id: "uuid",
    author: {id: "uuid", foo: true},
    body: "",
    title: "My title"
}

/**
 * declare is a way to have a typed interface, without worrying about the implementation, for quick prototyping
 * More on declare here: https://basarat.gitbook.io/typescript/type-system/intro/d.ts
 * How to avoid the duplication of the id type ?
 * Use an indexed type
 */
declare function getUserDetails(userId: User["id"]): User

/**
 * How do you let typescript know the type of user?
 * Type predicate: Allows typescript to know which type is the variable in the branch.
 * https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#inference-with-template-literals
 */
function isUserDetailed(user: User | ID): user is User {
    return "username" in user;
}

/**
 * We can also use the asserts keyword
 */
function assertUser(unknownObjectWithId: unknown ): asserts unknownObjectWithId is User {
    // https://fettblog.eu/typescript-hasownproperty/
    function hasOwnProperty<X extends {}, Y extends PropertyKey>
    (obj: X, prop: Y): obj is X & Record<Y, unknown> {
        return obj.hasOwnProperty(prop)
    }

    if (!(typeof unknownObjectWithId === "object")) {
        throw new Error("User must be an object")
    }
    if (unknownObjectWithId === null) {
        throw new Error("User cannot be null")
    }
    if (!hasOwnProperty(unknownObjectWithId, "username")) {
        throw new Error("A user has a username");
    }
    if (typeof unknownObjectWithId["username"] !== "string") {
        throw new Error("The username must be a string");
    }

    // ...
}

function workWithUnknownObject(variable: unknown) {
    assertUser(variable);
    // variable is then typed as user
    return variable.username
}

/**
 * Overload => allow us to get accurate type back
 * https://learntypescript.dev/05/l3-overloading
 */
declare function getPost(id: string, fetchUserDetails: true): Post<User>
declare function getPost(id: string, fetchUserDetails: false): Post
declare function getPost(id: string, fetchUserDetails?: boolean): Post<User | ID>

/**
 * We take a post id, and would like to return the post's author username.
 * How to make sure that the username returned is properly typed ?
 */
const getPostAuthorUsername = (postId: Post["id"]) => {
    const post = getPost(postId, false);
    const postWithDetails = getPost(postId, true);
    // Type guard
    if (isUserDetailed(post.author)) {
        // Author is typed as User
        return post.author.username;
    }
    if (isUserDetailed(postWithDetails.author)) {
        return postWithDetails.author.username;
    }
    // author is never here. We never reach this part of the code.
    const author = postWithDetails.author.username;

    return getUserDetails(post.author.id).username;
}

declare function getAllPosts(): Post[]

declare function getPublicPosts(): Post[]

declare function getOwnPosts(userId: User["id"]): Post[]

/**
 * How can you verify that all the user roles have been implemented at compile time?
 * You can use the never type
 */
function getUserPosts(user: User) {
    switch (user.role) {
        case "admin":
            return getAllPosts();
        case "guest":
            return getPublicPosts();
        case "user":
            return [...getOwnPosts(user.id), ...getPublicPosts()];
        default:
            const _exhaustiveCheck: never = user.role;
            throw new Error("Not implemented");
    }
}
