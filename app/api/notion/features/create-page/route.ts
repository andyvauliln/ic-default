import { APIErrorCode, Client } from '@notionhq/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  name: z.string(),
  description: z.string().optional().default(''),
  type: z.enum(['Idea', 'Issue', 'Feedback']),
  importance: z.enum(['Critical', 'Medium', 'Low']).optional().default('Low'),
  initiator: z.string().optional().default(''),
  files: z.string().optional().default('')
});

// Initialize Notion Client
const notion = new Client({ auth: process.env.NOTION_API_TOKEN });

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const req_body = await req.json();

    console.log(req_body, 'data');

    const validation = schema.safeParse(req_body);

    console.log(validation, 'validation');

    if (!validation.success) {
      const { errors } = validation.error;

      return NextResponse.json(
        {
          error: { message: 'Invalid request', errors }
        },
        { status: 500 }
      );
    }
    console.log(validation, 'validation');

    const validated_params = validation.data;
    const response = await notion.pages.create({
      parent: { database_id: process.env.NOTION_IC_FEATURES_DB as string },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: validated_params.name
              }
            }
          ]
        },
        Description: {
          rich_text: [
            {
              text: {
                content: validated_params.description
              }
            }
          ]
        },
        Type: {
          select: {
            name: validated_params.type
          }
        },
        Status: {
          select: {
            name: 'Backlog'
          }
        },
        Importance: {
          select: {
            name: validated_params.importance
          }
        },
        Vote: {
          number: 1
        },
        IsActive: {
          checkbox: false
        },
        Initiator: {
          rich_text: [
            {
              text: {
                content: validated_params.initiator
              }
            }
          ]
        },
        Files: {
          rich_text: [
            {
              text: {
                content: validated_params.files
              }
            }
          ]
        }
      }
    });

    return NextResponse.json({ data: response });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message
      },
      { status: 500 }
    );
  }
}
