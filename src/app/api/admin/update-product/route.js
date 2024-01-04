import connectToDB from '@/database';
import Product from '@/models/product';
import { NextResponse } from 'next/server';
import AuthUser from '@/middleware/AuthUser';

export const dynamic = 'force-dynamic';

export async function PUT(req) {
  try {
    await connectToDB();

    const isAuthUser = await AuthUser(req);

    if (isAuthUser?.role === 'admin') {
      const extractData = await req.json();

      const {
        _id,
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

      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: _id,
        },
        {
          name,
          description,
          category,
          sizes,
          onSale,
          price,
          priceDrop,
          deliveryInfo,
          imageUrl,
        },
        { new: true }
      );

      if (updatedProduct) {
        return NextResponse.json({
          success: true,
          message: 'Product updated successsfully',
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Failed to update product! Please try again.',
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
