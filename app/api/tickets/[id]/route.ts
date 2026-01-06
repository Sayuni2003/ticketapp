import { ticketPatchSchema } from "@/ValidationSchemas/ticket";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import options from "../../auth/[...nextauth]/option";

interface Props {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const session = await getServerSession(options);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const validation = ticketPatchSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket Not Found" }, { status: 404 });
  }

  // TECH role can update status and priority only
  if (session.user?.role === "TECH") {
    const updateData: any = {};
    if (body.status) updateData.status = body.status;
    if (body.priority) updateData.priority = body.priority;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Technicians can only update status or priority" },
        { status: 403 }
      );
    }

    const updateTicket = await prisma.ticket.update({
      where: { id: ticket.id },
      data: updateData,
    });

    return NextResponse.json(updateTicket);
  }

  // Only ADMIN can update assignedToUserId
  if (body?.assignedToUserId && session.user?.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden: only admins can assign tickets" },
      { status: 403 }
    );
  }

  if (body?.assignedToUserId) {
    body.assignedToUserId = parseInt(body.assignedToUserId);
  }

  // Allow ADMIN or other permitted roles to update remaining fields
  if (session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updateTicket = await prisma.ticket.update({
    where: { id: ticket.id },
    data: {
      ...body,
    },
  });

  return NextResponse.json(updateTicket);
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const session = await getServerSession(options);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket Not Found" }, { status: 404 });
  }

  await prisma.ticket.delete({
    where: { id: ticket.id },
  });

  return NextResponse.json({ message: "Ticket Deleted" });
}
