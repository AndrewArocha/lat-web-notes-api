import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/user';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, name } = req.body || {};

  // 1. Validate that all required fields are present (triggers 400)
  if (!email || !password || !name) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'Los campos email, password y name son obligatorios' },
    });
    return;
  }

  try {
    // 2. Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 3. Create the user in MongoDB
    const newUser = await User.create({ email, password: hashedPassword, name });

    // 4. Return success response (201) without exposing the password
    res.status(201).json({
      success: true,
      data: { userId: newUser._id, email: newUser.email, name: newUser.name },
      error: null,
    });
  } catch (err: unknown) {
    // Handle duplicate email error (MongoDB error code 11000)
    if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
      res.status(409).json({
        success: false,
        data: null,
        error: { message: 'Ese email ya está en uso' },
      });
      return;
    }

    res.status(500).json({
      success: false,
      data: null,
      error: { message: 'Error interno del servidor' },
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({
    success: false,
    data: null,
    error: { message: 'Todavía no implementado' },
  });
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({
    success: false,
    data: null,
    error: { message: 'Todavía no implementado' },
  });
};