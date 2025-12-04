/**
 * Ekadi Platform Event Management API
 * 
 * This module provides functions for interacting with the event management API.
 * All functions use the configured apiClient which includes authentication,
 * error handling, and automatic token refresh.
 * 
 * Features:
 * - CRUD operations for events
 * - Event state management (close/reopen)
 * - Event statistics retrieval
 * - Helper functions for formatting and display
 * 
 * @module events
 */

import apiClient from './api';
import { API_ENDPOINTS, EVENT_TYPES, EVENT_STATUSES } from './constants';
import type {
  Event,
  EventListItem,
  EventDetail,
  EventFormData,
  EventStats,
} from '@/src/types';

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Get list of user's events with optional filtering
 * 
 * @param filters - Optional filter parameters
 * @param filters.event_type - Filter by event type (wedding, conference, etc.)
 * @param filters.status - Filter by status (draft, active, closed)
 * @param filters.search - Search in event name, location, or description
 * @returns Promise resolving to array of event list items
 * @throws ApiError if request fails
 * 
 * @example
 * ```typescript
 * // Get all events
 * const events = await getAllEvents();
 * 
 * // Get active weddings
 * const weddings = await getAllEvents({ 
 *   event_type: 'wedding', 
 *   status: 'active' 
 * });
 * 
 * // Search for events
 * const results = await getAllEvents({ search: 'conference' });
 * ```
 */
export const getAllEvents = async (
  filters?: {
    event_type?: string;
    status?: string;
    search?: string;
  }
): Promise<EventListItem[]> => {
  try {
    const params = new URLSearchParams();
    
    if (filters?.event_type) {
      params.append('event_type', filters.event_type);
    }
    if (filters?.status) {
      params.append('status', filters.status);
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }

    const queryString = params.toString();
    const url = `${API_ENDPOINTS.EVENTS.LIST_CREATE}${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<EventListItem[]>(url);
    
    // Ensure we always return an array
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // Handle case where data might be wrapped in a results property (pagination)
    if (response.data && typeof response.data === 'object' && 'results' in response.data) {
      return (response.data as any).results || [];
    }
    
    // Log unexpected response format
    console.warn('Unexpected API response format:', response.data);
    return [];
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

/**
 * Get detailed information for a single event
 * 
 * @param id - Event ID (primary key)
 * @returns Promise resolving to detailed event object with nested user data
 * @throws ApiError if event not found or request fails
 * 
 * @example
 * ```typescript
 * const event = await getEventById(1);
 * console.log(event.event_name); // "John & Jane Wedding"
 * console.log(event.created_by.email); // Full user object
 * ```
 */
export const getEventById = async (id: number): Promise<EventDetail> => {
  try {
    const response = await apiClient.get<EventDetail>(API_ENDPOINTS.EVENTS.DETAIL(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new event
 * 
 * @param data - Event form data for creation
 * @returns Promise resolving to created event object
 * @throws ApiError if validation fails or request fails
 * 
 * @example
 * ```typescript
 * const newEvent = await createEvent({
 *   event_type: 'wedding',
 *   event_name: 'John & Jane Wedding',
 *   event_location: 'Grand Hotel, Nairobi',
 *   event_date: '2025-12-25',
 *   event_time: '14:00:00',
 *   event_description: 'A beautiful wedding ceremony',
 *   status: 'draft'
 * });
 * ```
 */
export const createEvent = async (data: EventFormData): Promise<Event> => {
  try {
    const response = await apiClient.post<Event>(
      API_ENDPOINTS.EVENTS.LIST_CREATE,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing event
 * 
 * Supports partial updates - only provided fields will be updated.
 * Closed events cannot be updated (must reopen first).
 * 
 * @param id - Event ID to update
 * @param data - Partial event form data (only fields to update)
 * @returns Promise resolving to updated event object
 * @throws ApiError if event is closed, validation fails, or request fails
 * 
 * @example
 * ```typescript
 * // Partial update - only change name and status
 * const updated = await updateEvent(1, {
 *   event_name: 'Updated Event Name',
 *   status: 'active'
 * });
 * 
 * // Full update
 * const updated = await updateEvent(1, {
 *   event_type: 'conference',
 *   event_name: 'Tech Summit 2025',
 *   event_location: 'KICC, Nairobi',
 *   event_date: '2026-01-15',
 *   event_time: '09:00:00',
 *   event_description: 'Annual tech conference',
 *   status: 'active'
 * });
 * ```
 */
export const updateEvent = async (
  id: number,
  data: Partial<EventFormData>
): Promise<Event> => {
  try {
    const response = await apiClient.patch<Event>(
      API_ENDPOINTS.EVENTS.UPDATE(id),
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Soft delete an event
 * 
 * The event is marked as deleted but not removed from the database.
 * Soft-deleted events are excluded from list and detail views.
 * 
 * @param id - Event ID to delete
 * @returns Promise that resolves when deletion is complete
 * @throws ApiError if event not found or request fails
 * 
 * @example
 * ```typescript
 * await deleteEvent(1);
 * // Event is now soft-deleted and won't appear in lists
 * ```
 */
export const deleteEvent = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(API_ENDPOINTS.EVENTS.DELETE(id));
  } catch (error) {
    throw error;
  }
};

/**
 * Close an event (mark as completed)
 * 
 * Sets the event status to "closed" and prevents further edits.
 * Closed events can be reopened using reopenEvent().
 * 
 * @param id - Event ID to close
 * @returns Promise resolving to updated event object with status="closed"
 * @throws ApiError if event not found, already closed, or request fails
 * 
 * @example
 * ```typescript
 * const closedEvent = await closeEvent(1);
 * console.log(closedEvent.status); // "closed"
 * console.log(closedEvent.can_edit); // false
 * ```
 */
export const closeEvent = async (id: number): Promise<Event> => {
  try {
    const response = await apiClient.post<Event>(API_ENDPOINTS.EVENTS.CLOSE(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reopen a closed event
 * 
 * Sets the event status back to "active", allowing edits again.
 * Only works on events that are currently closed.
 * 
 * @param id - Event ID to reopen
 * @returns Promise resolving to updated event object with status="active"
 * @throws ApiError if event not found, not closed, or request fails
 * 
 * @example
 * ```typescript
 * const reopenedEvent = await reopenEvent(1);
 * console.log(reopenedEvent.status); // "active"
 * console.log(reopenedEvent.can_edit); // true
 * ```
 */
export const reopenEvent = async (id: number): Promise<Event> => {
  try {
    const response = await apiClient.post<Event>(API_ENDPOINTS.EVENTS.REOPEN(id));
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get event statistics for the authenticated user
 * 
 * Returns aggregate statistics including counts by status,
 * upcoming vs past events, and invitation metrics.
 * 
 * @returns Promise resolving to event statistics object
 * @throws ApiError if request fails
 * 
 * @example
 * ```typescript
 * const stats = await getEventStats();
 * console.log(stats.total_events); // 15
 * console.log(stats.active_events); // 5
 * console.log(stats.upcoming_events); // 8
 * ```
 */
export const getEventStats = async (): Promise<EventStats> => {
  try {
    const response = await apiClient.get<EventStats>(API_ENDPOINTS.EVENTS.STATS);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format ISO date string to readable format
 * 
 * Converts date from "YYYY-MM-DD" format to "MMM dd, yyyy" format
 * (e.g., "2025-12-25" → "Dec 25, 2025")
 * 
 * @param date - ISO date string (YYYY-MM-DD)
 * @returns Formatted date string
 * 
 * @example
 * ```typescript
 * formatEventDate('2025-12-25'); // "Dec 25, 2025"
 * formatEventDate('2026-01-15'); // "Jan 15, 2026"
 * ```
 */
export const formatEventDate = (date: string): string => {
  try {
    const dateObj = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return dateObj.toLocaleDateString('en-US', options);
  } catch (error) {
    // Return original string if parsing fails
    return date;
  }
};

/**
 * Format 24-hour time string to 12-hour format with AM/PM
 * 
 * Converts time from "HH:MM:SS" or "HH:MM" format to "h:mm AM/PM" format
 * (e.g., "14:00:00" → "2:00 PM", "09:30:00" → "9:30 AM")
 * 
 * @param time - Time string in 24-hour format (HH:MM:SS or HH:MM)
 * @returns Formatted time string with AM/PM
 * 
 * @example
 * ```typescript
 * formatEventTime('14:00:00'); // "2:00 PM"
 * formatEventTime('09:30:00'); // "9:30 AM"
 * formatEventTime('23:45'); // "11:45 PM"
 * ```
 */
export const formatEventTime = (time: string): string => {
  try {
    // Extract hours and minutes (handle both HH:MM:SS and HH:MM formats)
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes || 0, 0);
    
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    
    return date.toLocaleTimeString('en-US', options);
  } catch (error) {
    // Return original string if parsing fails
    return time;
  }
};

/**
 * Get icon emoji for event type
 * 
 * Returns the icon associated with the event type from constants.
 * Falls back to '🎉' if type is not found.
 * 
 * @param type - Event type string (wedding, conference, etc.)
 * @returns Icon emoji string
 * 
 * @example
 * ```typescript
 * getEventTypeIcon('wedding'); // '💒'
 * getEventTypeIcon('conference'); // '📊'
 * getEventTypeIcon('unknown'); // '🎉' (default)
 * ```
 */
export const getEventTypeIcon = (type: string): string => {
  const eventType = EVENT_TYPES.find((et) => et.value === type);
  return eventType?.icon || '🎉';
};

/**
 * Get color for event status badge
 * 
 * Returns the color associated with the event status from constants.
 * Falls back to 'gray' if status is not found.
 * 
 * @param status - Event status string (draft, active, closed)
 * @returns Color string for badge styling
 * 
 * @example
 * ```typescript
 * getEventStatusColor('active'); // 'green'
 * getEventStatusColor('closed'); // 'red'
 * getEventStatusColor('draft'); // 'gray'
 * getEventStatusColor('unknown'); // 'gray' (default)
 * ```
 */
export const getEventStatusColor = (status: string): string => {
  const eventStatus = EVENT_STATUSES.find((es) => es.value === status);
  return eventStatus?.color || 'gray';
};

