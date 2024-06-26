import React from "react";
import { getRequestByEventId } from "@/lib/actions/booth";
import RequestTable from "@/components/main/RequestTable";
import { RequestType } from "@/lib/type";
import { checkIsEventOwner, getEventById } from "@/lib/actions/event";
import { EventType } from "@/lib/type"; 
import UnauthorizedPage from "@/components/shared/UnauthorizedPage";
import NotFoundPage from "@/components/shared/NotFoundPage";
interface Props {
  params: {
      id: number
  }
}

export async function generateMetadata({ params: { id } }: Props) {
  try {
      let request = id
      if (!request) {
          return {
              title: "Not Found",
              description: "The page you are looking for does not exist."
          }
      }
      return {
          title: String(id),
          description: String(id)
      }
  } catch (error: any) {
      return {
          title: "Not Found",
          description: "The page you are looking for does not exist."
      }
  }
}

export default async function RequestList({ params: { id } }: Props) {
  const event = await getEventById(id)
  if (event?.message ) {
      return <NotFoundPage />
  }
  const isOwner = await checkIsEventOwner(event.author.id)
  if (!isOwner) {
      return <UnauthorizedPage />
  }
  return (
    <>
      <section className="flex items-center justify-between">
        <RequestTable eventId={id}/>
      </section>   
    </>
  );
}

