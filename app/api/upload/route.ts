import { NextRequest, NextResponse } from 'next/server';

// This function can run for a maximum of 60 seconds
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        error: 'Unsupported file type. Please upload PDF, DOCX, or TXT files.'
      }, { status: 400 });
    }

    // Validate file size (5MB limit for now)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({
        error: 'File too large. Maximum size is 5MB.'
      }, { status: 400 });
    }

    // Extract text based on file type
    let extractedText = '';

    try {
      if (file.type === 'text/plain') {
        // For text files, read directly
        const text = await file.text();
        extractedText = text;
      } else {
        // For PDF and DOCX, we'll return a placeholder for now
        // In a real implementation, you'd use PDF parsing libraries
        extractedText = `Document content from ${file.name}. This is a placeholder since PDF/DOCX parsing requires additional server-side libraries.`;
      }

      // Clean up the extracted text
      extractedText = extractedText
        .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
        .replace(/\n\s*\n/g, '\n\n')  // Replace multiple newlines with double newline
        .trim();

      // Extract claims using the existing API
      const claimsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/extractclaims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: extractedText })
      });

      const claimsData = await claimsResponse.json();

      if (claimsData.error) {
        throw new Error(claimsData.error);
      }

      return NextResponse.json({
        success: true,
        filename: file.name,
        fileSize: file.size,
        fileType: file.type,
        extractedText: extractedText.substring(0, 1000) + (extractedText.length > 1000 ? '...' : ''),
        claims: claimsData.claims || [],
        claimCount: claimsData.claims?.length || 0
      });

    } catch (extractionError) {
      throw new Error(`Text extraction failed: ${extractionError instanceof Error ? extractionError.message : 'Unknown error'}`);
    }

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}