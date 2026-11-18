
import { supabase } from "../../lib/supabase";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

async function getAuthHeaders() {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error("Unable to get authentication session.");
  }

  const token = data.session?.access_token;

  if (!token) {
    throw new Error("Please sign in before using Ticket Management.");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
}

async function handleResponse(response) {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  if (response.status === 204) return null;

  return response.json();
}

// Get tickets visible to the logged-in user.
export async function getTickets() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/api/tickets`, {
    headers
  });

  return handleResponse(response);
}

export async function getCategories() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/api/categories`, {
    headers
  });

  return handleResponse(response);
}

export async function getTicketStatuses() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/api/ticket-statuses`, {
    headers
  });

  return handleResponse(response);
}

// Create a new ticket.
export async function createTicket(ticketData) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/api/tickets`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      title: ticketData.title,
      description: ticketData.description,
      categoryId: ticketData.categoryId,
      location: ticketData.location,
      priority: ticketData.priority
    })
  });

  return handleResponse(response);
}

// Get active staff belonging to the admin's college.
export async function getAvailableStaff() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/api/tickets/staff`, {
    headers
  });

  return handleResponse(response);
}

// Assign or reassign a ticket.
export async function assignTicket(ticketId, staffId) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/api/tickets/${ticketId}/assign`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        assignedTo: staffId
      })
    }
  );

  return handleResponse(response);
}

// Update ticket status.
export async function updateTicketStatus(ticketId, statusId) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/api/tickets/${ticketId}/status`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({ statusId })
    }
  );

  return handleResponse(response);
}

// Withdraw a ticket raised by the logged-in student or staff member.
export async function withdrawTicket(ticketId) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/api/tickets/${ticketId}/withdraw`,
    {
      method: "PATCH",
      headers
    }
  );

  return handleResponse(response);
}

// Search and filter tickets.
export async function filterTickets({
  keyword = "",
  priority = "",
  statusId = ""
} = {}) {
  const headers = await getAuthHeaders();
  const params = new URLSearchParams();

  if (keyword.trim()) {
    params.append("keyword", keyword.trim());
  }

  if (priority && priority !== "All") {
    params.append("priority", priority);
  }

  if (statusId && statusId !== "All") {
    params.append("statusId", statusId);
  }

  const response = await fetch(
    `${API_BASE_URL}/api/tickets/filter?${params.toString()}`,
    { headers }
  );

  return handleResponse(response);
}
