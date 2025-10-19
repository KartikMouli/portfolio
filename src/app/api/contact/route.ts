import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;
    const accessKey = process.env.WEB3FORMS_PUBLIC_ACCESS_KEY;

    if (!name || !email || !message || !accessKey) {
      return NextResponse.json(
        { error: 'All fields are required and access key must be set' },
        { status: 400 }
      );
    }

    const response = await axios.post(
      'https://api.web3forms.com/submit',
      {
        access_key: accessKey,
        name,
        email,
        message,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    if (response.data.success) {
      return NextResponse.json({
        success: true,
        message: 'Form submitted successfully.',
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Form submission failed.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error submitting the form. Please try again later.',
      },
      { status: 500 }
    );
  }
}
