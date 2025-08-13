import { TransactionType, TransactionStatus, AssetCategory, LeadStatus, LeadSource } from '@/types'

// Validation error class
export class ValidationError extends Error {
  constructor(public field: string, public value: any, message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

// Type guards
export function isValidEnum<T extends Record<string, string>>(
  value: any,
  enumObj: T
): value is T[keyof T] {
  return Object.values(enumObj).includes(value)
}

// Validation functions
export function validatePositiveInteger(value: string | null, fieldName: string, defaultValue: number): number {
  if (value === null) return defaultValue
  
  const parsed = parseInt(value, 10)
  
  if (isNaN(parsed)) {
    throw new ValidationError(fieldName, value, `${fieldName} must be a valid number`)
  }
  
  if (parsed < 1) {
    throw new ValidationError(fieldName, value, `${fieldName} must be greater than 0`)
  }
  
  return parsed
}

export function validatePageSize(value: string | null, maxSize: number = 100): number {
  const pageSize = validatePositiveInteger(value, 'pageSize', 10)
  
  if (pageSize > maxSize) {
    throw new ValidationError('pageSize', pageSize, `pageSize cannot exceed ${maxSize}`)
  }
  
  return pageSize
}

export function validateDate(value: string | null, fieldName: string): Date | null {
  if (!value) return null
  
  const date = new Date(value)
  
  if (isNaN(date.getTime())) {
    throw new ValidationError(fieldName, value, `${fieldName} must be a valid date`)
  }
  
  // Prevent dates too far in the past or future
  const minDate = new Date('1900-01-01')
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 10) // 10 years in future
  
  if (date < minDate || date > maxDate) {
    throw new ValidationError(fieldName, value, `${fieldName} must be between 1900 and 10 years from now`)
  }
  
  return date
}

export function validateSortOrder(value: string | null): 'asc' | 'desc' {
  if (!value) return 'desc'
  
  if (value !== 'asc' && value !== 'desc') {
    throw new ValidationError('sortOrder', value, 'sortOrder must be either "asc" or "desc"')
  }
  
  return value
}

export function validateSortBy(value: string | null, allowedFields: string[]): string {
  const defaultField = allowedFields[0]
  if (!value) return defaultField
  
  if (!allowedFields.includes(value)) {
    throw new ValidationError(
      'sortBy', 
      value, 
      `sortBy must be one of: ${allowedFields.join(', ')}`
    )
  }
  
  return value
}

export function validateTransactionType(value: string | null): TransactionType | null {
  if (!value) return null
  
  if (!isValidEnum(value, TransactionType)) {
    throw new ValidationError(
      'type',
      value,
      `Transaction type must be one of: ${Object.values(TransactionType).join(', ')}`
    )
  }
  
  return value as TransactionType
}

export function validateTransactionStatus(value: string | null): TransactionStatus | null {
  if (!value) return null
  
  if (!isValidEnum(value, TransactionStatus)) {
    throw new ValidationError(
      'status',
      value,
      `Transaction status must be one of: ${Object.values(TransactionStatus).join(', ')}`
    )
  }
  
  return value as TransactionStatus
}

export function validateAssetCategory(value: string | null): AssetCategory | null {
  if (!value) return null
  
  if (!isValidEnum(value, AssetCategory)) {
    throw new ValidationError(
      'category',
      value,
      `Asset category must be one of: ${Object.values(AssetCategory).join(', ')}`
    )
  }
  
  return value as AssetCategory
}

export function validateLeadStatus(value: string | null): LeadStatus | null {
  if (!value) return null
  
  if (!isValidEnum(value, LeadStatus)) {
    throw new ValidationError(
      'status',
      value,
      `Lead status must be one of: ${Object.values(LeadStatus).join(', ')}`
    )
  }
  
  return value as LeadStatus
}

export function validateLeadSource(value: string | null): LeadSource | null {
  if (!value) return null
  
  if (!isValidEnum(value, LeadSource)) {
    throw new ValidationError(
      'source',
      value,
      `Lead source must be one of: ${Object.values(LeadSource).join(', ')}`
    )
  }
  
  return value as LeadSource
}

export function validateBoolean(value: string | null, fieldName: string): boolean {
  if (!value) return false
  
  if (value !== 'true' && value !== 'false') {
    throw new ValidationError(fieldName, value, `${fieldName} must be either "true" or "false"`)
  }
  
  return value === 'true'
}

export function sanitizeString(value: string | null, maxLength: number = 255): string | null {
  if (!value) return null
  
  // Remove any HTML/script tags
  const sanitized = value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim()
  
  // Limit length
  if (sanitized.length > maxLength) {
    return sanitized.substring(0, maxLength)
  }
  
  return sanitized
}

export function validateSymbols(value: string | null): string[] | null {
  if (!value) return null
  
  const symbols = value.split(',').map(s => s.trim()).filter(s => s.length > 0)
  
  // Validate each symbol (alphanumeric, dots, hyphens, max 10 chars)
  const symbolRegex = /^[A-Za-z0-9\.\-^]{1,10}$/
  
  for (const symbol of symbols) {
    if (!symbolRegex.test(symbol)) {
      throw new ValidationError('symbols', symbol, `Invalid symbol format: ${symbol}`)
    }
  }
  
  // Limit to reasonable number of symbols
  if (symbols.length > 20) {
    throw new ValidationError('symbols', symbols, 'Cannot query more than 20 symbols at once')
  }
  
  return symbols
}

// Helper to create a validation error response
export function createValidationErrorResponse(error: ValidationError) {
  return {
    success: false,
    message: 'Validation error',
    error: {
      code: 'VALIDATION_ERROR',
      field: error.field,
      value: error.value,
      details: error.message
    }
  }
}
