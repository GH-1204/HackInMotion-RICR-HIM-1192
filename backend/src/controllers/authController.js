const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerSchema, loginSchema } = require('../utils/validators');

/**
 * Controller to register a new citizen.
 * Public endpoint: always assigns role CITIZEN.
 */
const registerUser = async (req, res) => {
  try {
    // 1. Validate Input with Zod
    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]?.message || 'Validation failed';
      return res.status(400).json({ message: firstError });
    }

    const { name, email, password } = validationResult.data;

    // 2. Check for duplicate email
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    // 3. Hash the password with bcrypt (10 rounds)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create new user
    // IMPORTANT: 'role' is hardcoded to 'CITIZEN' to prevent client privilege escalation
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'CITIZEN'
    });

    // 5. Save to MongoDB
    const savedUser = await user.save();

    // 6. Return safe user info (strictly excluding password/hash)
    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        createdAt: savedUser.createdAt
      }
    });
  } catch (error) {
    console.error('Registration Error:', error.message);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * Controller to authenticate an existing user and issue a JWT.
 */
const loginUser = async (req, res) => {
  try {
    // 1. Validate Input with Zod
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]?.message || 'Validation failed';
      return res.status(400).json({ message: firstError });
    }

    const { email, password } = validationResult.data;

    // 2. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Generic error to prevent email enumeration
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3. Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Generic error to prevent timing / enumeration differences
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 4. Validate JWT secret availability
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('Configuration Error: JWT_SECRET is not configured on the server.');
      return res.status(500).json({ message: 'Internal authentication configuration error' });
    }

    // 5. Generate JWT token with explicit HS256 algorithm
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      jwtSecret,
      { expiresIn: '7d', algorithm: 'HS256' }
    );

    // 6. Return safe user info along with the token
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = {
  registerUser,
  loginUser
};
