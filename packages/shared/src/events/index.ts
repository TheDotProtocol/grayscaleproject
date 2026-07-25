/**
 * Domain events — re-exported from @grayscale/platform for backward compatibility.
 * New code should import from @grayscale/platform directly.
 */
export {
  EVENT_CATALOG,
  DOMAIN_EVENTS,
  getEventVersion,
  isKnownEventType,
  listEventsByCategory,
  createPlatformEvent,
  createDomainEvent,
  storedToPlatformEvent,
  type PlatformEventType,
  type PlatformEvent,
  type PlatformEventMetadata,
  type DomainEvent,
  type DomainEventType,
  type EventStatus,
  type StoredDomainEvent,
  type PublishEventOptions,
  type EventProjector,
  type ProjectorResult,
  type ReplayOptions,
  type ReplayResult,
  type EventCategory,
} from "@grayscale/platform";
