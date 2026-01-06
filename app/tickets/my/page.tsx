import React from "react";
import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/option";
import TicketStatusBadge from "@/components/TicketStatusBadge";
import TicketPriority from "@/components/TicketPriority";
import Link from "next/link";

const MyTickets = async () => {
  const session = await getServerSession(options);

  if (!session || session.user?.role !== "TECH") {
    return (
      <p className="text-destructive">
        Forbidden: Only technicians can view this page.
      </p>
    );
  }

  const userId =
    typeof session.user?.id === "string"
      ? parseInt(session.user.id)
      : session.user?.id;

  if (!userId) {
    return <p className="text-destructive">No user id found.</p>;
  }

  const tickets = await prisma.ticket.findMany({
    where: { assignedToUserId: userId },
    orderBy: { updatedAt: "desc" },
    include: { assignedToUser: true },
  });

  return (
    <div className="py-8">
      <h1 className="text-2xl font-semibold mb-6">My Tickets</h1>

      {tickets.length === 0 ? (
        <p>No tickets assigned to you.</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="rounded-md border p-4 flex items-center gap-4"
            >
              <TicketStatusBadge status={ticket.status} />
              <div className="flex-1">
                <Link href={`/tickets/${ticket.id}`} className="font-medium">
                  {ticket.title}
                </Link>
                <div className="text-sm text-muted-foreground">
                  Updated {ticket.updatedAt.toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <TicketPriority priority={ticket.priority} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;
