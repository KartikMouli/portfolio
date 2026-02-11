'use server';

import axios from 'axios';
import { formSchema } from '@/lib/schemas';
import { z } from 'zod';

export async function submitContactForm(
  data: z.infer<typeof formSchema>
): Promise<{ success: boolean; message: string }> {
  try {
    const parsed = formSchema.safeParse(data);

    if (!parsed.success) {
      return {
        success: false,
        message: 'Invalid form data. Please check your inputs.',
      };
    }

    const { name, email, message } = parsed.data;
    const accessKey = process.env.WEB3FORMS_PUBLIC_ACCESS_KEY;

    if (!accessKey) {
      return {
        success: false,
        message: 'Server configuration error. Please try again later.',
      };
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
      return { success: true, message: 'Form submitted successfully.' };
    }

    return { success: false, message: 'Form submission failed.' };
  } catch (error) {
    console.error('Contact form action error:', error);
    return {
      success: false,
      message: 'Error submitting the form. Please try again later.',
    };
  }
}
