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

export async function getAllApplications(): Promise<JobApplication[]> {
    const res = await fetch(`${API_BASE}/JobApplications`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch job applications");
    return await res.json();
}

export async function addApplication(app: JobApplication): Promise<JobApplication> {
    const res = await fetch(`${API_BASE}/JobApplications`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(app),
    });
    if (!res.ok) throw new Error("Failed to add job application");
    return await res.json();
}

export async function deleteApplication(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/JobApplications/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete job application");
}

export async function updateApplication(id: number, app: JobApplication): Promise<void> {
    const res = await fetch(`${API_BASE}/JobApplications/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(app),
    });
    if (!res.ok) throw new Error("Failed to update job application");
}
