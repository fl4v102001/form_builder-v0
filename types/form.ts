export enum QuestionType {
  SHORT_ANSWER = "SHORT_ANSWER",
  PARAGRAPH = "PARAGRAPH",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  CHECKBOXES = "CHECKBOXES",
  DROPDOWN = "DROPDOWN",
  DATE = "DATE",
  NUMBER = "NUMBER",
}

export enum NumberValidationType {
  NONE = "NONE",
  INTEGER = "INTEGER",
  GREATER_THAN_ZERO = "GREATER_THAN_ZERO",
  LESS_THAN_ZERO = "LESS_THAN_ZERO",
  GREATER_THAN = "GREATER_THAN",
  BETWEEN = "BETWEEN",
  INTEGER_GREATER_THAN_ZERO = "INTEGER_GREATER_THAN_ZERO",
  INTEGER_LESS_THAN_ZERO = "INTEGER_LESS_THAN_ZERO",
  INTEGER_BETWEEN = "INTEGER_BETWEEN",
}

export enum ShortAnswerValidationType {
  NONE = "NONE",
  MAX_LENGTH = "MAX_LENGTH",
}

export interface Option {
  id: string
  value: string
}

export interface NumberValidation {
  type: NumberValidationType
  greaterThan?: number
  min?: number
  max?: number
}

export interface ShortAnswerValidation {
  type: ShortAnswerValidationType
  maxLength?: number
}

export interface Question {
  id: string
  order: number
  title: string
  type: QuestionType
  required?: boolean
  options?: Option[] // Level 2: Options belong to Questions
  numberValidation?: NumberValidation // For NUMBER type questions
  shortAnswerValidation?: ShortAnswerValidation // For SHORT_ANSWER type questions
}

export interface Section {
  id: string
  title: string
  order: number
  questions: Question[] // Level 1: Questions belong to Sections
}

export interface FormData {
  // Top Level: Form metadata
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
  ownerUid: string

  // Top Level: Sections
  sections: Section[]
}
