import express, { Request, Response } from 'express';
import { events, db } from "backend/schema"
import cors from 'cors';
import { pdfrender } from 'backend/routes/renderpdf';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static('public'))

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

  try {
    await pdfrender();
  } catch(e) {

    console.error(e)
    res.json({ status: "error!", error: e });
    return;
  }

  res.json({ status: "rendered!" });
});

const port = 8080;

export const server = async () => {
  console.log("Rendering..")
  await pdfrender();
  console.log("Rendered!")

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};
