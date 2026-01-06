import React from "react";
import dynamic from "next/dynamic";
import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/option";

interface Props {
  params: { id: string };
}

const TicketForm = dynamic(() => import("@/components/TicketForm"), {
  ssr: false,
});

const EditTicket = async ({ params }: Props) => {
  const ticket = await prisma?.ticket.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!ticket) {
    return <p className="text-destructive">Ticket not found!!</p>;
  }

  const session = await getServerSession(options);

  if (!session || session.user?.role !== "TECH") {
    return (
      <p className="text-destructive">
        Forbidden: Only technicians can edit tickets.
      </p>
    );
  }

  return <TicketForm ticket={ticket} role={session.user.role} />;
};

export default EditTicket;
