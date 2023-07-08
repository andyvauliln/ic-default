import { generateReactHelpers } from '@uploadthing/react/hooks';

import type { OurFileRouter } from '@/app/api/uploadthing/route';

export const { uploadFiles } = generateReactHelpers<OurFileRouter>();

export const { useUploadThing } = generateReactHelpers<OurFileRouter>();
