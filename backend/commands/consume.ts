import { ctx } from "backend/Context";
import { renderPdf } from 'backend/services/pdf/render';
import { events, db, OrderFields } from "backend/schema"
import { sendmail } from "./sendmail";
import { eq } from 'drizzle-orm';

export const consume = async (queueName: string) => {
  if (queueName === "mail") consumeMail();
  else if (queueName === "render") consumeRender();

  else throw new Error(`Not known queue '${queueName}'`)
};

export const consumeMail = () => ctx.mailQueue.consume(async msg => {
  console.log("Sending ticket")
  await sendmail(msg.mail, msg.attachment, msg.topic);
})

export const consumeRender = () => ctx.renderQueue.consume(async msg => {
  const event = (await db.select().from(events).where(eq(events.id, msg.eventId)))[0];

  console.log("Rendering ticket....");

  const pdf = await renderPdf({
    EVENT_NAME: event.name,
    USER_NAME: msg.fullName.toUpperCase(),
    DATE: event.date.toUpperCase(),
    IMAGE: event.image,
  });

  await ctx.mailQueue.send({
    mail: msg.mail,
    attachment: pdf,
    topic: `Bilet na wydarzenie "${event.name}"`,
  })

})


