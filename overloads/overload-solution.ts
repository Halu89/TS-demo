export {}

interface ID {
    id: string;
}

interface User extends ID {
    username: string;
    email: string;
    profilePic: string;
    role: "admin" | "user" | "guest";
}

type Post<TAuthor extends ID> = {
    title: string;
    body: string;
    author: TAuthor
} & ID;

/**
 * Overload => allow us to get accurate type back
 */
declare function getPost(id: string, fetchUserDetails: true): Post<User>
declare function getPost(id: string, fetchUserDetails: false): Post<ID>
declare function getPost(id: string, fetchUserDetails?: boolean): Post<User | ID>

declare function getUserDetails(id: string): User

const getPostAuthorUsername = (id: Post<User | ID>["id"]) => {
    const post = getPost(id); // if force details, post.author is never
    // Type guard
    if (isUserDetailed(post.author)) {
        return post.author.username;
    }
    return getUserDetails(post.author.id).username;
}

const getPostAuthor = (id: Post<User | ID>["id"]) => {
    return getPost(id, false).author;
}

/**
 * Type guard: Allows typescript to know which type is the variable in the branch.
 */
function isUserDetailed(user: User | ID): user is User {
    return "username" in user;
}

/**
 * Talk about exhaustive switch
 */
declare function getAllPosts(): Post<ID>[]

declare function getPublicPosts(): Post<ID>[]

declare function getOwnPosts(userId: User["id"]): Post<ID>[]

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



