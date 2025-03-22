import express, { Request, Response } from 'express';
import { events, db } from "backend/schema"
import cors from 'cors';
import { eq } from 'drizzle-orm';
import { ctx } from 'backend/Context';
import { getEnv } from 'common/utils';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static('public'))

app.get('/events', async (_req: Request, res: Response) => {
  const eventsRes = await db.select().from(events)

  res.json(eventsRes);
});

app.post('/buy', async (req: Request, res: Response) => {
  const data = req.body;

  const event = (await db.select().from(events).where(eq(events.id, data.id)))[0];

  console.log("BYING", data, event)

  await ctx.renderQueue.send({
    mail: data.mail,
    fullName: `${data.firstName} ${data.lastName}`,
    eventId: data.id,
  })

  console.log("Message send to queue...")

  res.json({ status: "sucess" });
});

const port = getEnv("PORT", "8080");

export const server = async () => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};
