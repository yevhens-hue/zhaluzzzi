/**
 * Ukrainian Mobile and Landline Phone Validator & Normalizer
 * Validates digit count, Ukrainian country code, and authorized mobile/regional operator prefixes.
 */

export interface PhoneValidationResult {
  isValid: boolean;
  normalizedPhone?: string; // Standard E.164 (+380XXXXXXXXX)
  formattedPhone?: string;  // Readable format (+38 (0XX) XXX-XX-XX)
  nationalPhone?: string;   // National format (0XXXXXXXXX)
  operator?: string;        // Kyivstar, Vodafone, Lifecell, etc.
  error?: string;
}

// Map of Ukrainian phone operator / regional area codes
const UA_OPERATOR_CODES: Record<string, string> = {
  // Kyivstar
  '67': 'Київстар',
  '68': 'Київстар',
  '96': 'Київстар',
  '97': 'Київстар',
  '98': 'Київстар',
  '77': 'Київстар (новий код)',
  '39': 'Київстар (Голден Телеком)',

  // Vodafone (Vodafone Ukraine / MTS)
  '50': 'Vodafone',
  '66': 'Vodafone',
  '95': 'Vodafone',
  '99': 'Vodafone',
  '75': 'Vodafone (новий код)',

  // Lifecell
  '63': 'Lifecell',
  '73': 'Lifecell',
  '93': 'Lifecell',

  // Intertelecom / 3Mob
  '91': '3Mob (Utel)',
  '92': 'People.net',
  '94': 'Інтертелеком',

  // Major Regional Landline Codes
  '44': 'Міський (Київ)',
  '56': 'Міський (Дніпро)',
  '32': 'Міський (Львів)',
  '48': 'Міський (Одеса)',
  '57': 'Міський (Харків)',
  '61': 'Міський (Запоріжжя)',
  '51': 'Міський (Миколаїв)',
  '52': 'Міський (Кропивницький)',
  '53': 'Міський (Полтава)',
  '54': 'Міський (Суми)',
  '31': 'Міський (Ужгород)',
  '33': 'Міський (Луцьк)',
  '34': 'Міський (Івано-Франківськ)',
  '35': 'Міський (Тернопіль)',
  '36': 'Міський (Рівне)',
  '37': 'Міський (Чернівці)',
  '38': 'Міський (Хмельницький)',
  '41': 'Міський (Житомир)',
  '43': 'Міський (Вінниця)',
  '46': 'Міський (Чернігів)',
  '47': 'Міський (Черкаси)',
  '55': 'Міський (Херсон)',
  '89': 'IP-телефонія (VoIP)',
};

/**
 * Validates and normalizes any user-inputted Ukrainian phone number.
 * Accepts formats: +380931234567, 380931234567, 0931234567, 80931234567, (093) 123-45-67, etc.
 */
export function validateAndNormalizeUaPhone(rawPhone: string): PhoneValidationResult {
  if (!rawPhone || typeof rawPhone !== 'string') {
    return {
      isValid: false,
      error: 'Введіть номер телефону',
    };
  }

  // Strip all non-digit characters
  const digitsOnly = rawPhone.replace(/\D/g, '');

  if (digitsOnly.length < 9) {
    return {
      isValid: false,
      error: 'Номер телефону надто короткий (потрібно 10 цифр)',
    };
  }

  let nationalDigits = '';

  // Case 1: Full international format with 380 (12 digits)
  if (digitsOnly.startsWith('380') && digitsOnly.length === 12) {
    nationalDigits = digitsOnly.slice(2); // '0XXXXXXXXX'
  }
  // Case 2: Started with 80 (11 digits e.g. 80931234567)
  else if (digitsOnly.startsWith('80') && digitsOnly.length === 11) {
    nationalDigits = digitsOnly.slice(1); // '0XXXXXXXXX'
  }
  // Case 3: National 10-digit format starting with 0 (e.g. 0931234567)
  else if (digitsOnly.startsWith('0') && digitsOnly.length === 10) {
    nationalDigits = digitsOnly;
  }
  // Case 4: 9 digits without leading 0 (e.g. 931234567)
  else if (digitsOnly.length === 9) {
    nationalDigits = '0' + digitsOnly;
  } else {
    return {
      isValid: false,
      error: 'Некоректний формат номера телефону України (має бути 10 цифр, напр. 093 123-45-67)',
    };
  }

  // Now nationalDigits must be exactly 10 digits starting with 0
  if (nationalDigits.length !== 10 || !nationalDigits.startsWith('0')) {
    return {
      isValid: false,
      error: 'Номер телефону має містити 10 цифр, починаючи з 0',
    };
  }

  // Extract 2-digit operator code after '0'
  const operatorCode = nationalDigits.slice(1, 3);
  const operatorName = UA_OPERATOR_CODES[operatorCode];

  if (!operatorName) {
    return {
      isValid: false,
      error: `Невідомий код оператора України: (0${operatorCode}). Перевірте правильність введеного номера.`,
    };
  }

  // Format representations
  const normalizedPhone = `+38${nationalDigits}`; // +380931234567
  const part1 = nationalDigits.slice(0, 3); // 093
  const part2 = nationalDigits.slice(3, 6); // 123
  const part3 = nationalDigits.slice(6, 8); // 45
  const part4 = nationalDigits.slice(8, 10); // 67
  const formattedPhone = `+38 (${part1}) ${part2}-${part3}-${part4}`;

  return {
    isValid: true,
    normalizedPhone,
    formattedPhone,
    nationalPhone: nationalDigits,
    operator: operatorName,
  };
}
