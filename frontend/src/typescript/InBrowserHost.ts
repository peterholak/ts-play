import * as ts from 'typescript'

export default class InBrowserHost implements ts.ParseConfigHost {

    useCaseSensitiveFileNames: boolean = true

    readDirectory(rootDir: string, extensions: string[], excludes: string[], includes: string[]): string[] {
        return[]
    }
    
    fileExists(path: string): boolean {
        return false
    }

    readFile(path: string): string {
        return ''
    }
    
}
