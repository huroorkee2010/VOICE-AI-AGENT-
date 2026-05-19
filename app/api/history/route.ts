import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface HistoryRequest {
  action: 'list' | 'get' | 'save' | 'delete' | 'clear';
  conversationId?: string;
  conversation?: any;
}

// In-memory storage for demo (replace with database in production)
const conversations = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const body: HistoryRequest = await request.json();
    const { action, conversationId, conversation } = body;

    switch (action) {
      case 'list': {
        const list = Array.from(conversations.values());
        return NextResponse.json(
          {
            success: true,
            data: { conversations: list },
          },
          { status: 200 }
        );
      }

      case 'get': {
        if (!conversationId) {
          return NextResponse.json(
            { success: false, error: 'Conversation ID is required' },
            { status: 400 }
          );
        }

        const conv = conversations.get(conversationId);
        if (!conv) {
          return NextResponse.json(
            { success: false, error: 'Conversation not found' },
            { status: 404 }
          );
        }

        return NextResponse.json(
          {
            success: true,
            data: { conversation: conv },
          },
          { status: 200 }
        );
      }

      case 'save': {
        if (!conversation || !conversation.id) {
          return NextResponse.json(
            { success: false, error: 'Invalid conversation data' },
            { status: 400 }
          );
        }

        conversations.set(conversation.id, {
          ...conversation,
          updatedAt: Date.now(),
        });

        return NextResponse.json(
          {
            success: true,
            data: { conversation: conversations.get(conversation.id) },
          },
          { status: 200 }
        );
      }

      case 'delete': {
        if (!conversationId) {
          return NextResponse.json(
            { success: false, error: 'Conversation ID is required' },
            { status: 400 }
          );
        }

        conversations.delete(conversationId);

        return NextResponse.json(
          {
            success: true,
            data: { deletedId: conversationId },
          },
          { status: 200 }
        );
      }

      case 'clear': {
        conversations.clear();

        return NextResponse.json(
          {
            success: true,
            data: { message: 'All conversations cleared' },
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
    console.error('History error:', error);

    let errorMessage = 'Failed to process history request';
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
