import { getMyAssets } from '@/features/student/assets/queries';
import { NextResponse } from 'next/server';

/**
 * Test endpoint for the assets API
 * GET /api/test-assets
 * 
 * This endpoint tests the /api/assets/my Strapi endpoint
 * and returns the result for debugging.
 */
export async function GET() {
  try {
    const assetsData = await getMyAssets();
    
    return NextResponse.json({
      success: true,
      data: assetsData,
      message: 'Assets API test successful',
    });
  } catch (error) {
    console.error('Test assets error:', error);
    
    if (error && typeof error === 'object' && 'status' in error) {
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          status: error.status,
          message: `Assets API test failed with status ${error.status}`,
        },
        { status: error.status as number }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Assets API test failed',
      },
      { status: 500 }
    );
  }
}



