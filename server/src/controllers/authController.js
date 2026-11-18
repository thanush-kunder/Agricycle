import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Generate JSON Web Token
 * @param {string} id User MongoDB _id
 * @returns {string} JWT Token
 */
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'agricycle_default_secret_dev',
    { expiresIn: '30d' }
  );
};

/**
 * @desc    Register a new user (generator / utilizer / admin)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    let { name, email, password, role, phone, organization, location } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email/phone, and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Normalize phone / email
    const trimmedInput = email.trim();
    let normalizedEmail = trimmedInput.toLowerCase();
    if (!normalizedEmail.includes('@')) {
      const cleanDigits = trimmedInput.replace(/[^0-9]/g, '');
      normalizedEmail = `${cleanDigits}@agricycle.in`;
      if (!phone) phone = trimmedInput;
    }

    // Check if user already exists
    const userExists = await User.findOne({
      $or: [
        { email: normalizedEmail },
        ...(phone ? [{ phone: phone }] : [])
      ]
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email or phone already exists',
      });
    }

    // Create user in database
    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: role || 'generator',
      phone: phone || '',
      organization: organization || '',
      location: location || { address: '', lat: 0, lng: 0 },
    });

    // Generate JWT token
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        organization: user.organization,
        location: user.location,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

/**
 * @desc    Authenticate user & get JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email/phone and password',
      });
    }

    const trimmedInput = email.trim();
    const cleanDigits = trimmedInput.replace(/[^0-9]/g, '');
    const lookupQueries = [
      { email: trimmedInput.toLowerCase() },
      { email: `${cleanDigits}@agricycle.in` },
      { phone: trimmedInput }
    ];
    if (cleanDigits.length >= 10) {
      lookupQueries.push({ phone: cleanDigits });
      lookupQueries.push({ phone: `+91 ${cleanDigits}` });
    }

    // Find user by email or phone and explicitly select password field
    const user = await User.findOne({ $or: lookupQueries }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Verify password match using bcrypt
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        organization: user.organization,
        location: user.location,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/auth/me
 * @access  Private (Requires valid Bearer token)
 */
export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving user profile',
    });
  }
};
