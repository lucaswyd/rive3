import { NextApiRequest, NextApiResponse } from "next";
import corsMiddleware from "../../components/lib/corsMiddleware";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await corsMiddleware(req, res);

    const { server } = req.query;
    let streamUrl: string | undefined;

    console.log(`Server requested: ${server}`);

    switch (server) {
      case "STV1":
        streamUrl = process.env.NEXT_PUBLIC_STREAM_URL_STV1;
        break;
      case "STV2":
        streamUrl = process.env.NEXT_PUBLIC_STREAM_URL_STV2;
        break;
      case "STV3":
        streamUrl = process.env.NEXT_PUBLIC_STREAM_URL_STV3;
        break;
      case "STV4":
        streamUrl = process.env.NEXT_PUBLIC_STREAM_URL_STV4;
        break;
      case "STV5":
        streamUrl = process.env.NEXT_PUBLIC_STREAM_URL_STV5;
        break;
      case "ELS1":
        streamUrl = process.env.NEXT_PUBLIC_STREAM_URL_ELS1;
        break;
      case "ELS2":
        streamUrl = process.env.NEXT_PUBLIC_STREAM_URL_ELS2;
        break;
      case "ELS3":
        streamUrl = process.env.NEXT_PUBLIC_STREAM_URL_ELS3;
        break;
      case "BFTV":
        streamUrl = process.env.NEXT_PUBLIC_STREAM_URL_BFTV;
        break;
      default:
        streamUrl = process.env.NEXT_PUBLIC_STREAM_URL_SUP;
        break;
    }

    console.log(`Stream URL resolved: ${streamUrl}`);

    if (!streamUrl) {
      return res.status(400).json({ error: "Stream URL not found" });
    }

    res.status(200).json({ url: streamUrl });
  } catch (error) {
    console.error("Error in handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
