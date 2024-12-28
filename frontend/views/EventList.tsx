import { MouseEvent, useState } from 'react'
import { Button } from "flowbite-react";
import { Card } from "flowbite-react";
import * as FB from "flowbite-react";
import { FaCircleNotch } from "react-icons/fa";

interface State {
  event?: Event;
  loading: boolean,
  done: boolean,
}

const defState: State = {
  loading: false,
  done: false,
};

export const EventList = () => {
  const [modal, setModal] = useState<State>({ ...defState, event: fixtures[0] });
  // const [modal, setModal] = useState<State>({  });

  const close = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      setModal(defState)
    }
  }

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {fixtures.map(_ => (
          <div className="">
            <Card
              renderImage={() => (
                <div className="bg-cover bg-center h-[200px] w-full bg-neutral-900 rounded-t-md overflow-hidden" style={{
                  backgroundImage: `url(${_.image ?? `https://images.unsplash.com/photo-1522158637959-30385a09e0da?q=80&w=5070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`})`,
                }} />
              )}
            >
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {_.nazwa}
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {_.data}, {_.godzina}
              </p>
              <Button type="submit" onClick={(e) => {
                setModal(s => ({ ...s, event: _ }))
              }}>Kup bilet</Button>
            </Card>
          </div>
        ))}
      </div>

      {modal.event && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur z-50" onClick={close}>
          <div className="container mx-auto flex justify-center items-center justify-items-center h-full max-w-[800px]" onClick={close}>
            <Card className="w-full">
              <div className="font-bold text-xl">
                Kup bilet na "{modal.event!.nazwa}"
              </div>

              <div className="font-bold text-xl">
                {CONFIG}
              </div>


              <div>
                <div className="mb-2 block">
                  <FB.Label htmlFor="email1" value="E-Mail" />
                </div>
                <FB.TextInput id="email1" type="email" placeholder="jan.kowalski@wp.pl" value="jan.kowalski@wp.pl" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-2 block">
                    <FB.Label htmlFor="firstName" value="Imie" />
                  </div>
                  <FB.TextInput id="firstName" type="email" placeholder="Jan" value="Jan" required />
                </div>

                <div>
                  <div className="mb-2 block">
                    <FB.Label htmlFor="lastName" value="Nazwisko" />
                  </div>
                  <FB.TextInput id="lastName" type="email" placeholder="Kowalski" value="Kowalski" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Button className="" onClick={() => {
                    setModal(s => ({ ...s, loading: true }));
                  }}>
                    Złóż zamówienie
                  </Button>
                  {modal.loading && <FaCircleNotch className="animate-spin text-xl" />}

                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  )
}

const fixtures = [
  {
    nazwa: "Koncert Jazzowy",
    slug: "koncert-jazzowy",
    image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=4368&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    data: "2023-11-15",
    godzina: "19:00"
  },
  {
    nazwa: "Festiwal Filmowy",
    slug: "festiwal-filmowy",
    image: "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?q=80&w=4855&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    data: "2023-11-20",
    godzina: "18:00"
  },
  {
    nazwa: "Targi Książki",
    slug: "targi-książki",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=4744&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    data: "2023-11-25",
    godzina: "10:00"
  },
  {
    nazwa: "Wystawa Sztuki Nowoczesnej",
    slug: "wystawa-sztuki nowoczesnej",
    image: "https://plus.unsplash.com/premium_photo-1682308349934-9b0848826813?q=80&w=5186&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    data: "2023-12-01",
    godzina: "09:00"
  },
  {
    nazwa: "Maraton Miejski",
    slug: "maraton-miejski",
    image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=4288&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    data: "2023-12-05",
    godzina: "08:00"
  },
  {
    nazwa: "Jarmark Bożonarodzeniowy",
    slug: "jarmark-bożonarodzeniowy",
    image: "https://images.unsplash.com/photo-1544176617-98a2c9f5ba9e?q=80&w=4000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    data: "2023-12-10",
    godzina: "11:00"
  },
  {
    nazwa: "Spektakl Teatralny",
    slug: "spektakl-teatralny",
    image: "https://images.unsplash.com/photo-1605034949929-6af5f19593b3?q=80&w=3750&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    data: "2023-12-15",
    godzina: "20:00"
  },
  {
    nazwa: "Warsztaty Kulinarne",
    slug: "warsztaty-kulinarne",
    image: "https://plus.unsplash.com/premium_photo-1700488746598-6fff1673c543?q=80&w=5070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    data: "2023-12-20",
    godzina: "17:00"
  },
  {
    nazwa: "Koncert Muzyki Klasycznej",
    slug: "koncert-muzyki-klasycznej",
    image: "https://images.unsplash.com/photo-1700061731520-9e6d6ecb3c66?q=80&w=5069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    data: "2023-12-25",
    godzina: "18:00"
  },
  {
    nazwa: "Sylwestrowa Noc Filmowa",
    slug: "sylwestrowa-noc-filmowa",
    image: "https://images.unsplash.com/photo-1560986752-2e31d9507413?q=80&w=4272&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    data: "2023-12-31",
    godzina: "21:00"
  }
]

interface Event {
  nazwa: string,
  slug: string,
  image: string,
  data: string,
  godzina: string,
}
