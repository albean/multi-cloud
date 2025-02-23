import { ctx } from "backend/Context";
import { renderPdf } from 'backend/services/pdf/render';
import { events, db, OrderFields } from "backend/schema"
import { sendmail } from "./sendmail";
import { eq } from 'drizzle-orm';

export const consume = async (queueName: string) => {
  console.log("Consuming mail...")
  consumeMail();
};

export const consumeMail = () => ctx.mailQueue.consume(async msg => {
  const event = (await db.select().from(events).where(eq(events.id, msg.eventId)))[0];

  const pdf = await renderPdf({
    EVENT_NAME: event.name,
    USER_NAME: msg.fullName.toUpperCase(),
    DATE: event.date.toUpperCase(),
    IMAGE: event.image,
  });

  await sendmail(
    msg.mail,
    pdf,
    `Bilet na wydarzenie "${event.name}"`
  );
})


