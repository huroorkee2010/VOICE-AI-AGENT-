import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface SessionRequest {
  action: 'create' | 'get' | 'update' | 'delete';
  sessionId?: string;
  data?: any;
}

// In-memory session storage (replace with database/Redis in production)
const sessions = new Map<
  string,
  {
    id: string;
    createdAt: number;
    updatedAt: number;
    data: any;
  }
>();

export async function POST(request: NextRequest) {
  try {
    const body: SessionRequest = await request.json();
    const { action, sessionId, data } = body;

    switch (action) {
      case 'create': {
        const newSessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
        const session = {
          id: newSessionId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          data: data || {},
        };

        sessions.set(newSessionId, session);

        return NextResponse.json(
          {
            success: true,
            data: session,
          },
          { status: 200 }
        );
      }

      case 'get': {
        if (!sessionId) {
          return NextResponse.json(
            { success: false, error: 'Session ID is required' },
            { status: 400 }
          );
        }

        const session = sessions.get(sessionId);
        if (!session) {
          return NextResponse.json(
            { success: false, error: 'Session not found' },
            { status: 404 }
          );
        }

        return NextResponse.json(
          {
            success: true,
            data: session,
          },
          { status: 200 }
        );
      }

      case 'update': {
        if (!sessionId) {
          return NextResponse.json(
            { success: false, error: 'Session ID is required' },
            { status: 400 }
          );
        }

        const session = sessions.get(sessionId);
        if (!session) {
          return NextResponse.json(
            { success: false, error: 'Session not found' },
            { status: 404 }
          );
        }

        const updatedSession = {
          ...session,
          updatedAt: Date.now(),
          data: { ...session.data, ...data },
        };

        sessions.set(sessionId, updatedSession);

        return NextResponse.json(
          {
            success: true,
            data: updatedSession,
          },
          { status: 200 }
        );
      }

      case 'delete': {
        if (!sessionId) {
          return NextResponse.json(
            { success: false, error: 'Session ID is required' },
            { status: 400 }
          );
        }

        sessions.delete(sessionId);

        return NextResponse.json(
          {
            success: true,
            data: { deletedId: sessionId },
          },
          { status: 200 }
        );
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Session error:', error);

    let errorMessage = 'Failed to process session request';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
