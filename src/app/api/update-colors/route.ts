// pages/api/update-colors.ts
import { writeFile, readFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  const res = await request.json();
  const filePath = path.resolve(process.cwd(), "./colors.json");
  try {
    await writeFile(filePath, JSON.stringify(res, null, 2));
    return Response.json({ message: "Colors updated successfully!" });
  } catch (err) {
    return new Response(`Webhook error: ${err}`, {
      status: 400,
    });
  }
}

export async function GET() {
    try {
      const fileContent = await readFile(path.resolve(process.cwd(), "colors.json"), "utf-8");
      const colors = JSON.parse(fileContent);
      return Response.json({ ...colors });
    } catch (err) {
      return new Response(`Webhook error: ${err}`, {
        status: 400,
      });
    }
}