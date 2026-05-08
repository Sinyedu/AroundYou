import { EventModel } from "../models/eventModel";
import { buildDynamicQuery, SearchBody } from "../utils/dynamicQueryBuilder";
import { getHideUpdate, getRestoreUpdate } from "../utils/resourceUtils";

export async function createEventRecord(payload: Record<string, unknown>) {
  const event = new EventModel(payload);
  return event.save();
}

export function findEvents(visibilityFilter: Record<string, unknown>) {
  return EventModel.find(visibilityFilter);
}

export function findEventById(id: string, visibilityFilter: Record<string, unknown>) {
  return EventModel.findOne({
    _id: id,
    ...visibilityFilter,
  });
}

export function updateEventRecord(id: string, payload: Record<string, unknown>) {
  return EventModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
}

export function hideEventRecord(id: string, hiddenBy?: string) {
  return EventModel.findByIdAndUpdate(id, getHideUpdate(hiddenBy), {
    new: true,
  });
}

export function restoreEventRecord(id: string) {
  return EventModel.findByIdAndUpdate(id, getRestoreUpdate(), {
    new: true,
  });
}

export function queryEventsByField(
  key: string,
  value: string,
  visibilityFilter: Record<string, unknown>,
) {
  return EventModel.find({
    ...visibilityFilter,
    [key]: { $regex: value, $options: "i" },
  });
}

export function queryEvents(
  body: SearchBody,
  visibilityFilter: Record<string, unknown>,
) {
  const query = buildDynamicQuery(EventModel, body);

  return EventModel.find({
    ...query,
    ...visibilityFilter,
  });
}
