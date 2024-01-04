import connectToDB from '@/database';
import AuthUser from '@/middleware/AuthUser';
import Cart from '@/models/cart';
import Joi from 'joi';
import { NextResponse } from 'next/server';

const AddToCart = Joi.object({
  productInfo: Joi.string().required(),
  userID: Joi.string().required(),
});

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    await connectToDB();

    const isAuthUser = await AuthUser(req);

    if (isAuthUser) {
      const data = await req.json();

      const { productInfo, userID } = data;

      const { error } = AddToCart.validate({ userID, productInfo });

      if (error) {
        return NextResponse.json({
          success: false,
          message: error.details[0].message,
        });
      }

      const isCartItemExists = await Cart.find({
        productInfo: productInfo,
        userID: userID,
      });

      if (isCartItemExists?.length > 0) {
        return NextResponse.json({
          success: false,
          message: 'This Product is already added to cart',
        });
      }

      const saveProductToCart = await Cart.create(data);

      if (saveProductToCart) {
        return NextResponse.json({
          success: true,
          message: 'Product added to cart',
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Failed to add product. Please try again',
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: 'You are not authenticated',
      });
    }
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message: 'Something went wrong! Please try again.',
    });
  }
}
