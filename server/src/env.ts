export type ValuesOf<T extends readonly any[]> = T[number];

export function envEnum<T extends readonly any[]>(
    variable: string,
    acceptable: T,
    ifNotPresent: ValuesOf<T>|undefined = undefined,
): ValuesOf<T>|undefined {
    const value = process.env[variable]
    if (value === undefined) {
        return ifNotPresent
    }
    if (acceptable.includes(value)) {
        return value
    }
    return undefined
}

export function envOrExit(variable: string): string {
    return process.env[variable] || exit(`Environment variable '${variable}' must be specified.`)
}

export function envsOrExit(...variables: string[]): string[] {
    return variables.map(v => envOrExit(v))
}

export function exit(message: string): never {
    console.error(message)
    return process.exit(1)
}
