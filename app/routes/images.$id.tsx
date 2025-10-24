import type { LoaderFunctionArgs } from "react-router";
import axios from "axios";

export async function loader({ params }: LoaderFunctionArgs) {
  const apiEndpoint = process.env.API_ENDPOINT || "http://localhost:3000";

  try {
    const response = await axios.get(`${apiEndpoint}/images/${params.id}`, {
      responseType: "arraybuffer",
    });

    return new Response(response.data, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error fetching image:", error);

    // Return a 404 response or a placeholder image
    return new Response("Image not found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}
