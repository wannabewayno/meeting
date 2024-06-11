
export const capitalize = (string: string) => {
    return string.replace(/^\w/, v => v.toUpperCase());
}

export const unCamelCase = (string: string) => {
    return capitalize(string).replace(/(?<=[a-z])[A-Z]/g, (match) => ` ${match}`);
}