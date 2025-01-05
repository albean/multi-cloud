import express, { Request, Response } from 'express';
import { events, db } from "backend/schema"
import cors from 'cors';
import { pdfrender } from 'backend/routes/renderpdf';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(`${process.cwd()}/public`));

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World v1237' });
});

app.get('/events', async (req: Request, res: Response) => {
  const eventsRes = await db.select().from(events)

  res.json(eventsRes);
});

app.post('/order', async (req: Request, res: Response) => {
  const data = req.body;


  res.json({ status: "sucess" });
});

app.get('/pdf', async (req: Request, res: Response) => {
  const data = req.body;

  pdfrender();

  res.json({ status: "rendered!" });
});

const port = 8080;

export const server = () => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};
