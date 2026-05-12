import { getGeocodedCoordinates } from '@/api/geocoding.api'
import type {
  AdminCollectionKey,
  AdminEditableRecord,
  AdminFieldConfig,
  AdminFieldValue,
} from '@/types/admin'

export function cloneAdminRecord(record: AdminEditableRecord): AdminEditableRecord {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key, Array.isArray(value) ? [...value] : value]),
  ) as AdminEditableRecord
}

export function toEditableAdminRecord(
  record: AdminEditableRecord,
  fields: AdminFieldConfig[],
): AdminEditableRecord {
  return Object.fromEntries(
    fields.map((field) => [field.key, normalizeAdminValue(record[field.key])]),
  )
}

export function normalizeAdminValue(value: AdminFieldValue | undefined): AdminFieldValue {
  if (value === undefined) {
    return ''
  }

  return value
}

export function getAdminStringValue(record: AdminEditableRecord, key: string): string {
  const value = record[key]
  return typeof value === 'string' ? value.trim() : ''
}

export function isAddressGeocodedCollection(collection: AdminCollectionKey): boolean {
  return collection === 'attractions' || collection === 'events'
}

export async function withResolvedGpsPosition(
  collection: AdminCollectionKey,
  record: AdminEditableRecord,
): Promise<AdminEditableRecord> {
  const payload: AdminEditableRecord = { ...record }

  if (isAddressGeocodedCollection(collection)) {
    const address = getAdminStringValue(payload, 'address')
    const city = getAdminStringValue(payload, 'city')

    if (!address || !city) {
      throw new Error('Indtast både adresse og by.')
    }

    const location = await getGeocodedCoordinates(address, city)
    payload.gpsPosition = `${location.latitude},${location.longitude}`

    delete payload.address
    delete payload.city

    return payload
  }

  if (collection === 'city') {
    const name = getAdminStringValue(payload, 'name')

    if (!name) {
      throw new Error('Indtast bynavn.')
    }

    const location = await getGeocodedCoordinates(null, name)
    payload.gpsPosition = `${location.latitude},${location.longitude}`
  }

  return payload
}
