const API_BASE = import.meta.env.VITE_API_BASE_URL;

export interface JobApplication {
    id?: number;
    company: string;
    role: string;
    status: number;
    appliedDate: string;
    notes: string;
}

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
            data?.message ||
            `Request failed with ${res.status} ${res.statusText}`
        );
    }
    return data;
}

export async function getAllApplications(): Promise<JobApplication[]> {
    const url = `${API_BASE}/JobApplications`;
    console.debug("GET", url, { headers: getAuthHeaders() });

    const res = await fetch(url, {
        headers: getAuthHeaders(),
    });
    return handleResponse(res);
}

export async function addApplication(app: JobApplication): Promise<JobApplication> {
    const url = `${API_BASE}/JobApplications`;
    console.debug("POST", url, { headers: getAuthHeaders(), body: app });

    const res = await fetch(url, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(app),
    });
    return handleResponse(res);
}

export async function deleteApplication(id: number): Promise<void> {
    const url = `${API_BASE}/JobApplications/${id}`;
    console.debug("DELETE", url, { headers: getAuthHeaders() });

    const res = await fetch(url, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    await handleResponse(res);
}

export async function updateApplication(id: number, app: JobApplication): Promise<void> {
    const url = `${API_BASE}/JobApplications/${id}`;
    console.debug("PUT", url, { headers: getAuthHeaders(), body: app });

    const res = await fetch(url, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(app),
    });
    await handleResponse(res);
}
