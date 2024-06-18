import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";

// Inicializa o middleware CORS
const cors = Cors({
  methods: ["GET", "HEAD"],
  origin: "*", // Substitua pelo seu domínio de produção se necessário
});

// Helper para rodar o middleware
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function,
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function corsMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await runMiddleware(req, res, cors);
}
