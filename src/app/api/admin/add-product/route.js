import connectToDB from '@/database';
import AuthUser from '@/middleware/AuthUser';
import Product from '@/models/product';
import Joi from 'joi';
import { NextResponse } from 'next/server';

const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  sizes: Joi.array().required(),
  onSale: Joi.string().required(),
  price: Joi.number().required(),
  priceDrop: Joi.number().required(),
  deliveryInfo: Joi.string().required(),
  imageUrl: Joi.string().required(),
});

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    await connectToDB();

    const isAuthUser = await AuthUser(req);

    console.log(isAuthUser, 'Fardin');

    if (isAuthUser?.role === 'admin') {
      const extractData = await req.json();

      const {
        name,
        description,
        category,
        sizes,
        onSale,
        price,
        priceDrop,
        deliveryInfo,
        imageUrl,
      } = extractData;

      const { error } = productSchema.validate({
        name,
        description,
        category,
        sizes,
        onSale,
        price,
        priceDrop,
        deliveryInfo,
        imageUrl,
      });

      if (error) {
        return NextResponse.json({
          success: false,
          message: error.details[0].message,
        });
      }

      const createNewProduct = await Product.create(extractData);

      if (createNewProduct) {
        return NextResponse.json({
          success: true,
          message: 'Product added successfully',
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Failed to add product',
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: 'You are not authorized.',
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
