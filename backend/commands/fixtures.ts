import { fixtures as fixturesTable, events, db } from "backend/schema"
import { eq } from "drizzle-orm";
import { eventsFixture } from "backend/fixtures/events"

export const fixtures = async () => {
  console.log("Loading fixtures....")

  for (const declaredFixture of declaredFixtures) {
    const entities = await db.select().from(fixturesTable).where(eq(fixturesTable.name, declaredFixture.name));

    if (entities.length) {
      continue;
    }

    await declaredFixture.fn()

    await db.insert(fixturesTable).values({ name: declaredFixture.name })

    console.log("Inserted")
  }

  process.exit();
}

const declaredFixtures = [
  {
    name: "insert-events-v1",
    fn: eventsFixture,
  },
]

