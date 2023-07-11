import { APIErrorCode, Client } from '@notionhq/client';
import { PageObjectResponse, PartialPageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const notion = new Client({ auth: process.env.NOTION_API_TOKEN });

// Define the schema for the request body
const schema = z.object({
  type: z.enum(['Idea', 'Issue', 'Feedback', 'Not Set']).optional(),
  status: z.enum(['In Process', 'Backlog', 'Planned']).optional()
});

export async function POST(req: NextRequest, res: NextResponse) {
  const req_body = await req.json();

  const validation = schema.safeParse(req_body);

  if (!validation.success) {
    const { errors } = validation.error;

    return NextResponse.json(
      {
        error: { message: 'Invalid request', errors }
      },
      { status: 500 }
    );
  }

  try {
    const validated_params = validation.data;
    const filter = {
      and: [
        {
          property: 'IsActive',
          checkbox: {
            equals: true
          }
        },
        validated_params.status
          ? {
              property: 'Status',
              select: {
                equals: validated_params.status
              }
            }
          : undefined,
        validated_params.type
          ? {
              property: 'Type',
              select: {
                equals: validated_params.type
              }
            }
          : undefined
      ].filter(Boolean) as any
    };
    const databaseId = process.env.NOTION_IC_FEATURES_DB as string;

    const notion_response = await notion.databases.query({
      database_id: databaseId,
      filter: filter
    });

    const pages = notion_response.results.map((page) => {
      if (!isPageObjectResponse(page)) throw new Error('"page" should be a PageObjectResponse')
      
      return {
        id: page.id,
        name: getTitle(page),
        description: extractContentFromNotionText(page),
        type: getSelect(page, "Type"),
        status: getSelect(page, "Status") || 'Backlog',
        importance: getSelect(page, "Importance") || 'Low',
        vote: getNumber(page, "Vote"),
        initiator: getRichText(page, 'Initiator')
      };
    });
    
    return NextResponse.json({ data: pages.filter((r) => !!r.name) });
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message
      },
      { status: 500 }
    );
  }
}


const getRichText = (page: PageObjectResponse, key: string): string => {
  const prop = page.properties[key];
  if (prop?.type === 'rich_text' && prop?.rich_text.length > 0) {
    return prop.rich_text[0]?.plain_text ?? "";
  }
  return '';
};


const extractContentFromNotionText = (page: PageObjectResponse) => {
  const descriptionProperty = page?.properties?.Description;

  if (descriptionProperty?.type === 'rich_text') {
    return descriptionProperty.rich_text.map((item) => item.plain_text).join(' ');
  }
  return '';
};


const isPageObjectResponse = (
	page: PageObjectResponse | PartialPageObjectResponse
): page is PageObjectResponse => page.object === 'page'

const getTitle = (page: PageObjectResponse): string => {
  const prop = page.properties.Name;
  if (prop?.type === 'title' && prop?.title.length > 0) {
    return prop?.title.reduce((acc, text) => {
      if (text?.type === 'text') {
        return acc + text?.plain_text;
      }
      return acc;
    }, '');
  }
  return '';
};


const getSelect = (page: PageObjectResponse, key: string): string => {
  const prop = page.properties[key];
  if (prop?.type === 'select') {
    return prop?.select?.name ?? '';
  }
  return "";
};

const getNumber = (page: PageObjectResponse, key: string): number => {
  const prop = page.properties[key];
  if (prop?.type === 'number') {
    return prop?.number ?? 0;
  }
  return 0;
};
