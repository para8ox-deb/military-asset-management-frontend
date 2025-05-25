import { useState, useCallback } from 'react';
import { validateForm } from '../utils/validation';

export const useFormValidation = (initialData, validationSchema) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate single field on blur
    if (validationSchema[name]) {
      const { errors: fieldErrors } = validateForm(formData, { [name]: validationSchema[name] });
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors[name] || ''
      }));
    }
  }, [formData, validationSchema]);

  const validateAllFields = useCallback(() => {
    const { isValid, errors: validationErrors } = validateForm(formData, validationSchema);
    setErrors(validationErrors);
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(validationSchema).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);
    
    return isValid;
  }, [formData, validationSchema]);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAllFields,
    resetForm,
    setFormData
  };
};
