import { fixtures as fixturesTable, events, db } from "backend/schema"

export const eventsFixture = async () => {
  await db.delete(events).returning();

  await Promise.all(eventsFixtures.map(async _ => {
    await db.insert(events).values({
      name: _.name,
      slug: _.slug,
      image: _.image,
      date: _.data,
    });
  }))
}

const eventsFixtures = [
  {
    name: "Koncert Jazzowy - Jazz Vibes",
    slug: "koncert-jazzowy",
    image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    data: "2023-11-15",
    hour: "19:00"
  },
  {
    name: "Festiwal Filmowy - CineMagic",
    slug: "festiwal-filmowy",
    image: "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    data: "2023-11-20",
    hour: "18:00"
  },
  {
    name: "Targi Książki - Book Haven",
    slug: "targi-książki",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    data: "2023-11-25",
    hour: "10:00"
  },
  {
    name: "Wystawa Sztuki Nowoczesnej - Art Fusion",
    slug: "wystawa-sztuki nowoczesnej",
    image: "https://plus.unsplash.com/premium_photo-1682308349934-9b0848826813?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    data: "2023-12-01",
    hour: "09:00"
  },
  {
    name: "Maraton Miejski - Urban Run",
    slug: "maraton-miejski",
    image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    data: "2023-12-05",
    hour: "08:00"
  },
  {
    name: "Jarmark Bożonarodzeniowy - Winter Wonderland",
    slug: "jarmark-bożonarodzeniowy",
    image: "https://images.unsplash.com/photo-1544176617-98a2c9f5ba9e?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    data: "2023-12-10",
    hour: "11:00"
  },
  {
    name: "Spektakl Teatralny - Drama Night",
    slug: "spektakl-teatralny",
    image: "https://images.unsplash.com/photo-1605034949929-6af5f19593b3?q=80&w=370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    data: "2023-12-15",
    hour: "20:00"
  },
  {
    name: "Warsztaty Kulinarne - Chef's Table",
    slug: "warsztaty-kulinarne",
    image: "https://plus.unsplash.com/premium_photo-1700488746598-6fff1673c543?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    data: "2023-12-20",
    hour: "17:00"
  },
  {
    name: "Koncert Muzyki Klasycznej - Symphony Night",
    slug: "koncert-muzyki-klasycznej",
    image: "https://images.unsplash.com/photo-1700061731520-9e6d6ecb3c66?q=80&w=509&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    data: "2023-12-25",
    hour: "18:00"
  },
  {
    name: "Sylwestrowa Noc Filmowa - Movie Marathon",
    slug: "sylwestrowa-noc-filmowa",
    image: "https://images.unsplash.com/photo-1560986752-2e31d9507413?q=80&w=422&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    data: "2023-12-31",
    hour: "21:00"
  }
]
