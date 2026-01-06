"use client";
import React, { useState, useEffect } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Label } from "./ui/label";
import { ticketSchema } from "@/ValidationSchemas/ticket";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "./ui/input";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Ticket } from "@prisma/client";

type TicketFormData = z.infer<typeof ticketSchema>;

interface Props {
  ticket?: Ticket;
  role?: string | null;
}

const TicketForm = ({ ticket, role }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: ticket?.title || "",
      description: ticket?.description || "",
      status: ticket?.status || "OPEN",
      priority: ticket?.priority || "MEDIUM",
    },
  });

  useEffect(() => {
    if (ticket) {
      form.reset({
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
      });
    }
  }, [ticket]);

  async function onSubmit(values: z.infer<typeof ticketSchema>) {
    try {
      console.log(
        "Submitting values",
        values,
        "ticketId",
        ticket?.id,
        "role",
        role
      );
      setIsSubmitting(true);
      setError("");

      // If editing and user is TECH, only allow status updates
      if (ticket && role === "TECH") {
        // Ensure status is present (use current form value if not)
        const statusValue = values.status || form.getValues("status");
        if (!statusValue) {
          setIsSubmitting(false);
          setError("Technicians can only update status");
          return;
        }
        await axios.patch(`/api/tickets/${ticket.id}`, { status: statusValue });
      } else if (ticket) {
        await axios.patch(`/api/tickets/${ticket.id}`, values);
      } else {
        await axios.post("/api/tickets", values);
      }

      setIsSubmitting(false);

      router.push("/tickets");
      router.refresh();
    } catch (err: any) {
      console.log(err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || err.message);
      } else {
        setError(String(err));
      }
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-md border w-full p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          {ticket && role === "TECH" ? (
            <div className="space-y-2">
              <Label>Ticket Title</Label>
              <div className="p-2 rounded-md border bg-muted">
                {ticket.title}
              </div>
            </div>
          ) : (
            <FormField
              control={form.control}
              name="title"
              defaultValue={ticket?.title}
              render={({ field }) => (
                <FormItem>
                  <Label>Ticket Title</Label>
                  <FormControl>
                    <Input placeholder="Ticket Title..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          {ticket && role === "TECH" ? (
            <div className="space-y-2">
              <Label>Description</Label>
              <div className="prose dark:prose-invert p-2 rounded-md border bg-muted">
                <div dangerouslySetInnerHTML={{ __html: ticket.description }} />
              </div>
            </div>
          ) : (
            <Controller
              name="description"
              defaultValue={ticket?.description}
              control={form.control}
              render={({ field }) => (
                <SimpleMDE placeholder="Description" {...field} />
              )}
            />
          )}
          <div className="flex w-full space-x-4">
            <FormField
              control={form.control}
              name="status"
              defaultValue={ticket?.status}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                    disabled={ticket && role === "TECH" ? false : false}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Status..."
                          defaultValue={ticket?.status}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="OPEN">Open</SelectItem>
                      <SelectItem value="STARTED">Started</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {ticket ? (
              <div className="space-y-2">
                <Label>Priority</Label>
                <div className="p-2 rounded-md border bg-muted">
                  {ticket.priority}
                </div>
              </div>
            ) : (
              <FormField
                control={form.control}
                name="priority"
                defaultValue={"MEDIUM"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Priority..."
                            defaultValue={"MEDIUM"}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            )}
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {ticket ? "Update Ticket" : "Create Ticket"}
          </Button>
        </form>
      </Form>
      <p className="text-destructive">{error}</p>
    </div>
  );
};

export default TicketForm;
