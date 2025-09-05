export interface JobApplication {
    id?: number;
    company: string;
    role: string;
    status: number;
    appliedDate: string;
    notes: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

// Helper to handle and log responses
async function handleResponse(res: Response) {
    const text = await res.text();
    let data: any;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    console.debug("Response:", {
        url: res.url,
        status: res.status,
        statusText: res.statusText,
        data,
    });

    if (!res.ok) {
        throw new Error(
            data?.message || `Request failed with ${res.status} ${res.statusText}`
        );
    }
    return data;
}

// --- API CALLS ---
export async function getAllApplications(): Promise<JobApplication[]> {
    const url = `${API_BASE}/JobApplications`;
    const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });
    return handleResponse(res);
}

export async function addApplication(app: JobApplication): Promise<JobApplication> {
    const url = `${API_BASE}/JobApplications`;
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(app),
    });
    return handleResponse(res);
}

export async function deleteApplication(id: number): Promise<void> {
    const url = `${API_BASE}/JobApplications/${id}`;
    const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });
    await handleResponse(res);
}

export async function updateApplication(id: number, app: JobApplication): Promise<void> {
    const url = `${API_BASE}/JobApplications/${id}`;
    const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(app),
    });
    await handleResponse(res);
}
