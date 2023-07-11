// @ts-nocheck
import { APIErrorCode, Client } from '@notionhq/client';
import { BlockObjectRequest } from '@notionhq/client/build/src/api-endpoints';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const notion = new Client({ auth: process.env.NOTION_API_TOKEN });

// Define the schema for the request body
const schema = z.object({
  comment: z.string().optional(),
  vote: z.boolean().optional().default(false),
  page_id: z.string()
});

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const req_body = await req.json();
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

    const currentPage = await notion.pages.retrieve({
      page_id: validation.data.page_id
    });

    if (!currentPage.id) {
      return NextResponse.json(
        {
          error: 'page not exisst',
          data: currentPage
        },
        { status: 404 }
      );
    }

    let feedbackContent: BlockObjectRequest[] = [];

    if (validation.data.comment) {
      feedbackContent.push({
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `Comment:${validation.data.comment}`
              }
            }
          ]
        }
      });
      const response_block = await notion.blocks.children.append({
        block_id: currentPage.id,
        children: feedbackContent
      });
      return NextResponse.json({ data: { message: 'Comment was added' } });
    }

    if (validation.data.vote) {
      const response = await notion.pages.update({
        page_id: currentPage.id,
        properties: {
          Vote: {
            number: currentPage.properties.Vote.number + 1
          }
        }
      });
      return NextResponse.json({ data: { message: 'Vote was updated' } });
    }

    return NextResponse.json({ data: { message: 'Nothing to update' } });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message
      },
      { status: 500 }
    );
  }
}
