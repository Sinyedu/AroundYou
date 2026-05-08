import { Request, Response } from "express";
import {
  CONTACT_TICKET_CATEGORIES,
  ContactTicketModel,
} from "../models/contactTicketModel";
import {
  ContactTicketCategory,
  ContactTicketStatus,
} from "../interfaces/contactTicket";

function isTicketCategory(value: unknown): value is ContactTicketCategory {
  return (
    typeof value === "string" &&
    CONTACT_TICKET_CATEGORIES.includes(value as ContactTicketCategory)
  );
}

function getTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getStatusFilter(value: unknown): ContactTicketStatus | "all" {
  if (value === "completed" || value === "all") {
    return value;
  }

  return "open";
}

export async function createContactTicket(
  req: Request,
  res: Response,
): Promise<void> {
  const category = req.body.category;
  const subject = getTrimmedString(req.body.subject);
  const message = getTrimmedString(req.body.message);

  if (!isTicketCategory(category)) {
    res.status(400).json({ message: "Vælg en gyldig kategori." });
    return;
  }

  if (subject.length < 3 || subject.length > 140) {
    res.status(400).json({ message: "Emnet skal være mellem 3 og 140 tegn." });
    return;
  }

  if (message.length < 10 || message.length > 3000) {
    res.status(400).json({
      message: "Beskeden skal være mellem 10 og 3000 tegn.",
    });
    return;
  }

  if (!req.user?.userID || !req.user.userName || !req.user.email) {
    res.status(401).json({ message: "Du skal være logget ind." });
    return;
  }

  try {
    const ticket = new ContactTicketModel({
      category,
      subject,
      message,
      submittedBy: req.user.userID,
      submittedByName: req.user.userName,
      submittedByEmail: req.user.email,
    });

    res.status(201).json(await ticket.save());
  } catch (err) {
    console.error("Error creating contact ticket:", err);
    res.status(500).json({ message: "Kunne ikke oprette henvendelsen." });
  }
}

export async function getMyContactTickets(
  req: Request,
  res: Response,
): Promise<void> {
  if (!req.user?.userID) {
    res.status(401).json({ message: "Du skal være logget ind." });
    return;
  }

  try {
    const tickets = await ContactTicketModel.find({
      submittedBy: req.user.userID,
    }).sort({ createdAt: -1 });

    res.status(200).json(tickets);
  } catch (err) {
    console.error("Error fetching contact tickets:", err);
    res.status(500).json({ message: "Kunne ikke hente henvendelser." });
  }
}

export async function getAdminContactTickets(
  req: Request,
  res: Response,
): Promise<void> {
  const status = getStatusFilter(req.query.status);
  const query: Record<string, unknown> = {};

  if (status !== "all") {
    query.status = status;
  }

  if (isTicketCategory(req.query.category)) {
    query.category = req.query.category;
  }

  try {
    const tickets = await ContactTicketModel.find(query).sort({
      status: 1,
      createdAt: -1,
    });

    res.status(200).json(tickets);
  } catch (err) {
    console.error("Error fetching admin contact tickets:", err);
    res.status(500).json({ message: "Kunne ikke hente henvendelser." });
  }
}

export async function completeContactTicket(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const ticket = await ContactTicketModel.findByIdAndUpdate(
      req.params.id,
      {
        status: "completed",
        completedAt: new Date(),
        completedBy: req.user?.userID,
      },
      { new: true, runValidators: true },
    );

    if (!ticket) {
      res.status(404).json({ message: "Henvendelsen blev ikke fundet." });
      return;
    }

    res.status(200).json(ticket);
  } catch (err) {
    console.error("Error completing contact ticket:", err);
    res.status(500).json({ message: "Kunne ikke afslutte henvendelsen." });
  }
}

export async function reopenContactTicket(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const ticket = await ContactTicketModel.findByIdAndUpdate(
      req.params.id,
      {
        status: "open",
        $unset: { completedAt: "", completedBy: "" },
      },
      { new: true, runValidators: true },
    );

    if (!ticket) {
      res.status(404).json({ message: "Henvendelsen blev ikke fundet." });
      return;
    }

    res.status(200).json(ticket);
  } catch (err) {
    console.error("Error reopening contact ticket:", err);
    res.status(500).json({ message: "Kunne ikke genåbne henvendelsen." });
  }
}
