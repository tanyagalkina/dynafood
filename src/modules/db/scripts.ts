export const checkInputBeforeSqlQuery = (arg) => {
    if (!arg)
        return;
    arg = arg.replace("'", "''");

    return arg;
}
