export interface GrammarCheckResponseInterface {
  matches: GrammarCheckMatchesInterface[]
}

interface GrammarCheckMatchesInterface {
  message: string,
  shortMessage: string,
  replacements: GrammarCheckReplacementsInterface[]
}

interface GrammarCheckReplacementsInterface {
  value: string,
  shortDescription?: string
}
