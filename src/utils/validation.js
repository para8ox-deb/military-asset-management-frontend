// Validation utility functions
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

export const validateNumber = (value, min = null, max = null) => {
  const num = Number(value);
  if (isNaN(num)) return false;
  if (min !== null && num < min) return false;
  if (max !== null && num > max) return false;
  return true;
};

export const validateAssetId = (assetId) => {
  // Asset ID should be alphanumeric with hyphens, 3-20 characters
  const assetIdRegex = /^[A-Z0-9-]{3,20}$/;
  return assetIdRegex.test(assetId);
};

export const validateBaseId = (baseId) => {
  // Base ID should be alphanumeric with underscores, 3-15 characters
  const baseIdRegex = /^[A-Z0-9_]{3,15}$/;
  return baseIdRegex.test(baseId);
};

// Form validation schemas
export const loginValidationSchema = {
  email: {
    required: true,
    validate: validateEmail,
    message: 'Please enter a valid email address'
  },
  password: {
    required: true,
    message: 'Password is required'
  }
};

export const registerValidationSchema = {
  username: {
    required: true,
    minLength: 3,
    maxLength: 20,
    message: 'Username must be 3-20 characters'
  },
  email: {
    required: true,
    validate: validateEmail,
    message: 'Please enter a valid email address'
  },
  password: {
    required: true,
    validate: validatePassword,
    message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
  },
  role: {
    required: true,
    message: 'Role is required'
  },
  baseId: {
    required: (formData) => formData.role === 'base_commander',
    validate: validateBaseId,
    message: 'Base ID must be 3-15 characters (A-Z, 0-9, _)'
  }
};

export const purchaseValidationSchema = {
  assetId: {
    required: true,
    validate: validateAssetId,
    message: 'Asset ID must be 3-20 characters (A-Z, 0-9, -)'
  },
  assetName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'Asset name must be 2-100 characters'
  },
  assetType: {
    required: true,
    message: 'Asset type is required'
  },
  baseId: {
    required: true,
    validate: validateBaseId,
    message: 'Base ID must be 3-15 characters (A-Z, 0-9, _)'
  },
  quantity: {
    required: true,
    validate: (value) => validateNumber(value, 1),
    message: 'Quantity must be a positive number'
  },
  unitPrice: {
    required: true,
    validate: (value) => validateNumber(value, 0),
    message: 'Unit price must be a non-negative number'
  },
  vendor: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'Vendor name must be 2-100 characters'
  }
};

// Generic form validator
export const validateForm = (formData, schema) => {
  const errors = {};
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = formData[field];
    
    // Check if field is required
    if (rules.required) {
      const isRequired = typeof rules.required === 'function' 
        ? rules.required(formData) 
        : rules.required;
        
      if (isRequired && !validateRequired(value)) {
        errors[field] = rules.message || `${field} is required`;
        continue;
      }
    }
    
    // Skip validation if field is empty and not required
    if (!validateRequired(value)) continue;
    
    // Check minimum length
    if (rules.minLength && value.length < rules.minLength) {
      errors[field] = rules.message || `${field} must be at least ${rules.minLength} characters`;
      continue;
    }
    
    // Check maximum length
    if (rules.maxLength && value.length > rules.maxLength) {
      errors[field] = rules.message || `${field} must be no more than ${rules.maxLength} characters`;
      continue;
    }
    
    // Custom validation
    if (rules.validate && !rules.validate(value)) {
      errors[field] = rules.message || `${field} is invalid`;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
