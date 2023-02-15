export function checkEnv() : boolean {
    if (process.env.URL_POSTGRES == undefined) {
        console.log("URL_POSTGRES doesn't defined in env");
        return false;
    }

    if (process.env.PORT_POSTGRES == undefined) {
        console.log("PORT_POSTGRES doesn't defined in env");
        return false;
    }

    if (process.env.DB_POSTGRES == undefined) {
        console.log("DB_POSTGRES doesn't defined in env");
        return false;
    }

    if (process.env.USER_POSTGRES == undefined) {
        console.log("USER_POSTGRES doesn't defined in env");
        return false;
    }

    if (process.env.PASSWORD_POSTGRES == undefined) {
        console.log("PASSWORD_POSTGRES doesn't defined in env");
        return false;
    }

    if (process.env.URL_NEO4J == undefined) {
        console.log("URL_NEO4J doesn't defined in env");
        return false;
    }

    if (process.env.PORT_NEO4J == undefined) {
        console.log("PORT_NEO4J doesn't defined in env");
        return false;
    }

    if (process.env.USER_NEO4J == undefined) {
        console.log("USER_NEO4J doesn't defined in env");
        return false;
    }

    if (process.env.PASSWORD_NEO4J == undefined) {
        console.log("PASSWORD_NEO4J doesn't defined in env");
        return false;
    }

    return true;
}