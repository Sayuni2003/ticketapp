import React from "react";
import prisma from "@/prisma/db";
import DashRecentTickets from "@/components/DashRecentTickets";
import DashChart from "@/components/DashChart";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const Dashboard = async () => {
  const tickets = await prisma.ticket.findMany({
    where: {
      NOT: [{ status: "CLOSED" }],
    },
    orderBy: {
      updatedAt: "desc",
    },
    skip: 0,
    take: 5,
    include: {
      assignedToUser: true,
    },
  });

  const totalTickets = await prisma.ticket.count();
  const assignedTickets = await prisma.ticket.count({
    where: { assignedToUserId: { not: null } },
  });
  const openTickets = await prisma.ticket.count({
    where: { status: { not: "CLOSED" } },
  });

  const groupTicket = await prisma.ticket.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
  });

  const data = groupTicket.map((item) => {
    return {
      name: item.status,
      total: item._count.id,
    };
  });

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3 px-2 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Tickets</CardTitle>
            <CardDescription>All tickets in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalTickets}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Tickets</CardTitle>
            <CardDescription>All tickets assigned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{assignedTickets}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Open Tickets</CardTitle>
            <CardDescription>Not closed yet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{openTickets}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 px-2">
        <div>
          <DashRecentTickets tickets={tickets} />
        </div>
        <div>
          <DashChart data={data} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
