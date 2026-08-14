const { z } = require('zod');

// Schema for Citizen Registration
const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(100, { message: 'Name cannot exceed 100 characters' }),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email({ message: 'Please provide a valid email format' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(128, { message: 'Password cannot exceed 128 characters' })
});

// Schema for User Login
const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email({ message: 'Please provide a valid email format' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, { message: 'Password is required' })
});

// Schema for Issue Creation
const createIssueSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(5, { message: 'Title must be at least 5 characters long' })
    .max(150, { message: 'Title cannot exceed 150 characters' }),
  description: z
    .string({ required_error: 'Description is required' })
    .trim()
    .min(10, { message: 'Description must be at least 10 characters long' })
    .max(2000, { message: 'Description cannot exceed 2000 characters' }),
  category: z.enum(
    [
      'ROADS',
      'SANITATION',
      'ELECTRICITY',
      'WATER',
      'PUBLIC_PROPERTY',
      'DRAINAGE',
      'OTHER'
    ],
    {
      errorMap: () => ({ message: 'Invalid category provided' })
    }
  ),
  location: z.object(
    {
      latitude: z
        .number({ required_error: 'Latitude is required' })
        .min(-90, { message: 'Latitude must be between -90 and 90' })
        .max(90, { message: 'Latitude must be between -90 and 90' }),
      longitude: z
        .number({ required_error: 'Longitude is required' })
        .min(-180, { message: 'Longitude must be between -180 and 180' })
        .max(180, { message: 'Longitude must be between -180 and 180' }),
      address: z.string().trim().optional()
    },
    { required_error: 'Location is required' }
  )
});

// Schema for Admin Status Update
const updateStatusSchema = z.object({
  status: z.enum(
    [
      'REPORTED',
      'ACKNOWLEDGED',
      'IN_PROGRESS',
      'RESOLVED',
      'CLOSED'
    ],
    {
      errorMap: () => ({ message: 'Invalid status provided' })
    }
  ),
  note: z.string().trim().max(1000).optional()
});

// Schema for Admin Issue Resolution
const resolveIssueSchema = z.object({
  notes: z
    .string({ required_error: 'Resolution notes are required' })
    .trim()
    .min(1, { message: 'Resolution notes cannot be empty' })
    .max(2000, { message: 'Resolution notes cannot exceed 2000 characters' })
});

module.exports = {
  registerSchema,
  loginSchema,
  createIssueSchema,
  updateStatusSchema,
  resolveIssueSchema
};

