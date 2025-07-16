import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Log the environment variable for debugging
console.log('CLOUDINARY_URL:', process.env.CLOUDINARY_URL);

// Configure Cloudinary using the environment variable (official quick start)
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image uploads are supported' },
        { status: 400 }
      );
    }

    // Convert file to base64 data URI
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64String}`;

    // Upload to Cloudinary using the Node.js SDK
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'bilingual-stories',
      resource_type: 'image',
    });

    return NextResponse.json({
      url: result.secure_url,
      message: 'Image uploaded successfully'
    });
  } catch (error: any) {
    console.error('Image upload error:', error?.message, error);
    return NextResponse.json(
      { error: 'Failed to upload image', details: error?.message },
      { status: 500 }
    );
  }
} 