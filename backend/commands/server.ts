import express, { Request, Response } from 'express';
import { events, db, OrderFields } from "backend/schema"
import cors from 'cors';
import { eq } from 'drizzle-orm';
import { renderPdf } from 'backend/services/pdf/render';
import { sendmail } from './sendmail';
import { ctx } from 'backend/Context';

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

app.post('/buy', async (req: Request, res: Response) => {
  const data = req.body;

  console.log("BYING", data)

  const event = (await db.select().from(events).where(eq(events.id, data.id)))[0];

  ctx.mailQueue.send({
    mail: data.mail,
    fullName: `${data.firstName} ${data.lastName}`,
    eventId: data.id,
  })

  console.log("Message send to queue...")

  res.json({ status: "sucess" });
});

const port = 8080;

export const server = async () => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};
