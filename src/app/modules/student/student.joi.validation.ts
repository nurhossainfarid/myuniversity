import Joi from 'joi'

// Joi Schema for StudentName
const nameValidationSchema = Joi.object({
    firstName: Joi.string()
      .trim()
      .required()
      .max(20)
      .regex(/^[A-Z][a-z]*$/, 'Valid First Name format')
      .messages({
        'string.pattern.base':
          '{#label} must start with an uppercase letter and contain only alphabets',
      }),
    middleName: Joi.string().trim().optional(),
    lastName: Joi.string().trim().required(),
  })

  // Joi Schema for Guardian
  const guardianValidationSchema = Joi.object({
    fatherName: Joi.string().required(),
    fatherOccupation: Joi.string().required(),
    fatherContactNo: Joi.string().required(),
    motherName: Joi.string().required(),
    motherOccupation: Joi.string().required(),
    motherContactNo: Joi.string().required(),
  })

  // Joi Schema for Local Guardian
  const localGuardianValidationSchema = Joi.object({
    name: Joi.string().required(),
    occupation: Joi.string().required(),
    contactNo: Joi.string().required(),
    address: Joi.string().required(),
    relationship: Joi.string().required(),
  })

  // Joi Schema for Student
  const studentValidationSchema = Joi.object({
    id: Joi.string().required(),
    name: nameValidationSchema.required(),
    gender: Joi.string().valid('male', 'female').required().messages({
      'any.only': '{#label} must be either male or female',
    }),
    dateOfBirth: Joi.date().iso().less('now').optional().messages({
      'date.format': '{#label} must be a valid ISO date',
      'date.less': '{#label} must be a past date',
    }),
    email: Joi.string().email().required(),
    contactNo: Joi.string().required(),
    emergencyContactNo: Joi.string().required(),
    bloodGroup: Joi.string()
      .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
      .optional()
      .messages({
        'any.only': '{#label} must be a valid blood group',
      }),
    presentAddress: Joi.string().required(),
    permanentAddress: Joi.string().required(),
    guardian: guardianValidationSchema.required(),
    localGuardian: localGuardianValidationSchema.required(),
    profileImg: Joi.string(),
    isActive: Joi.string()
      .valid('active', 'blocked')
      .default('active')
      .messages({
        'any.only': '{#label} must be either active or blocked',
      }),
  })

  export default studentValidationSchema;