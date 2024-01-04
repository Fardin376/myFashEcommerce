import connectToDB from '@/database';
import User from '@/models/user';
import { hash } from 'bcryptjs';
import Joi from 'joi';
import { NextResponse } from 'next/server';

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().required(),
});

export const dynamic = 'force-dynamic';

export async function POST(req) {
  await connectToDB();

  const { name, email, password, role } = await req.json();

  //validate schema
  const { error } = schema.validate({ name, email, password, role });

  if (error && error.details && error.details.length > 0) {
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    //check if user exists

    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
      return NextResponse.json({
        success: false,
        message: 'User already exists. Please try with a different email.',
      });
    } else {
      const hashPassword = await hash(password, 12);

      const createNewUser = await User.create({
        name,
        email,
        password: hashPassword,
        role,
      });

      if (createNewUser) {
        return NextResponse.json({
          success: true,
          message: 'Account created successfully.',
        });
      }
    }
  } catch (error) {
    console.log('Error in user registration');

    return NextResponse.json({
      success: false,
      message: 'Something went wrong! Please try again later.',
    });
  }
}
