import { MouseEvent, useState } from 'react'
import { Button } from "flowbite-react";
import { Card } from "flowbite-react";
import * as FB from "flowbite-react";
import { FaCircleNotch } from "react-icons/fa";
import axios from "axios";
import { useAsync } from 'frontend/utils/react/useAsync';
import type * as db from 'backend/schema'

interface State {
  event?: db.Event;
  loading: boolean,
  done: boolean,
}

const defState: State = {
  loading: false,
  done: false,
};

export const EventList = () => {
  const [modal, setModal] = useState<State>({ ...defState });

  const close = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      setModal(defState)
    }
  }

  const rsp = useAsync<any[]>(async () => {
    return await axios.get(`${EVENTS_BACKEND_PREFIX}/events`).then(_ => _.data)
  })

  console.log("Data", rsp)

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {(rsp.data ?? []).map(_ => (
          <div className="">
            <Card
              renderImage={() => (
                <div className="bg-cover bg-center h-[200px] w-full bg-neutral-900 rounded-t-md overflow-hidden" style={{
                  backgroundImage: `url(${_.image ?? `https://images.unsplash.com/photo-1522158637959-30385a09e0da?q=80&w=5070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`})`,
                }} />
              )}
            >
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {_.name}
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {_.date}
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
                Kup bilet na "{modal.event!.name}"
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

                    buyTicket(modal.event!.id)
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

const buyTicket = async (id: number) => {
  await axios.post(`${EVENTS_BACKEND_PREFIX}/buy`, { id });
};
