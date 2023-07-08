import {
  createNextRouteHandler,
  createUploadthing,
  type FileRouter
} from 'uploadthing/next';

const f = createUploadthing();

const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '8MB', maxFileCount: 3 } })
    // .middleware(async (req) => {})
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(
        metadata,
        file,
        '*********************UPLOAD FILE COMPLETE*****************'
      );
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

// Export routes for Next App Router

export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter
});
