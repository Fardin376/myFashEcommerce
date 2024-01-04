import connectToDB from '@/database';
import AuthUser from '@/middleware/AuthUser';
import Order from '@/models/order';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function PUT(req) {
  try {
    await connectToDB();

    const isAuthUser = await AuthUser(req);

    const data = await req.json();

    if (isAuthUser?.role === 'admin') {
      const {
        _id,
        shippingAddress,
        orderItems,
        paymentMethod,
        isPaid,
        paidAt,
        isProcessing,
      } = data;

      const updateOrder = await Order.findOneAndUpdate(
        { _id: _id },
        {
          shippingAddress,
          orderItems,
          paymentMethod,
          isPaid,
          paidAt,
          isProcessing,
        },
        { new: true }
      );

      if (updateOrder) {
        return NextResponse.json({
          success: true,
          message: 'Order status has been updated.',
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Failed to update order status',
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
      message: 'Something went wrong. Please try again.',
    });
  }
}
