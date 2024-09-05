import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "2MB" } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("File uploaded:", file);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;