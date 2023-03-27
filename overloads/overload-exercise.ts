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
 * A user extends the base id interface: A user has an id.
 */
interface User extends ID {
    username: string;
    email: string;
    profilePic: string;
    role: "admin" | "user" | "guest";
}

/**
 * The post also has an id.
 *
 * How to restrict the type of author to objects with an id?
 * The author field can be just the user id, or the entire user details.
 */
type Post = {
    title: string;
    body: string;
    author: any
} & ID;

/**
 * declare is a way to have a typed interface, without worrying about the implementation, for quick prototyping
 * How to avoid the duplication of the id type ?
 */
declare function getUserDetails(userId: string): User

/**
 * getPost takes an id and returns a Post.
 * The author field is populated depending on fetchUserDetails
 *
 * How to make sure the return value is correctly typed?
 */
declare function getPost(id: string, fetchUserDetails?: boolean): Post

/**
 * How do you let typescript know the type of user?
 */
function isUserDetailed(user: User | ID) {
    return "username" in user;
}

/**
 * We take a post id, and would like to return the post's author username.
 * How to make sure that the username returned is properly typed ?
 */
const getPostAuthorUsername = (postId: string) => {
    const post = getPost(postId);
    if (isUserDetailed(post.author)) {
        return post.author.username;
    }
    return getUserDetails(post.author.id).username;
}

declare function getAllPosts(): Post[]

declare function getPublicPosts(): Post[]

declare function getOwnPosts(userId: string): Post[]

/**
 * How can you verify that all the user roles have been implemented at compile time?
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
            throw new Error("Not implemented");
    }
}
