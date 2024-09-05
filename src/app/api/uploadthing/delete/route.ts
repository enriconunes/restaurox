import { createNextRouteHandler } from "uploadthing/next";
import { UTApi } from "uploadthing/server";
import { ourFileRouter } from "../core";

const utapi = new UTApi();

const handler = createNextRouteHandler({
  router: ourFileRouter,
  config: {
    uploadthingId: process.env.UPLOADTHING_APP_ID,
    uploadthingSecret: process.env.UPLOADTHING_SECRET,
  },
});

export async function POST(req: Request) {
  const { fileKey } = await req.json();
  
  if (!fileKey || typeof fileKey !== 'string') {
    return new Response(JSON.stringify({ success: false, error: "Invalid file key" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await utapi.deleteFiles(fileKey);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return new Response(JSON.stringify({ success: false, error: "Failed to delete file" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const GET = handler.GET;