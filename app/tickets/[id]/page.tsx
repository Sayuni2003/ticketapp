import React from "react";
import prisma from "@/prisma/db";
import TicketDetails from "./TicketDetails";
import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/option";

interface Props {
  params: { id: string };
}

const ViewTicket = async ({ params }: Props) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: parseInt(params.id) },
  });

  const users = await prisma.user.findMany();

  const session = await getServerSession(options);

  if (!ticket) {
    return <p className="text-destructive">Ticket NotFound!!</p>;
  }

  return (
    <TicketDetails ticket={ticket} users={users} role={session?.user?.role} />
  );
};

export default ViewTicket;
