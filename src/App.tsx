import { useEffect, useState, useCallback, useMemo } from "react";
import type { FormEvent } from "react";
import { Plus, Edit2, Trash2, X, Save, LogOut } from "lucide-react";
import {
    getAllApplications,
    addApplication,
    deleteApplication,
    updateApplication,
} from "./api";
import type { JobApplication } from "./api";
import "./App.scss";

const STATUS_OPTIONS = [
    { value: 0, label: "Applied", colorClass: "status-0" },
    { value: 1, label: "Interview", colorClass: "status-1" },
    { value: 2, label: "Offer", colorClass: "status-2" },
    { value: 3, label: "Rejected", colorClass: "status-3" },
    { value: 4, label: "Accepted", colorClass: "status-4" },
];

const SORT_OPTIONS = [
    { value: "dateAsc", label: "Applied Date ↑" },
    { value: "dateDesc", label: "Applied Date ↓" },
    { value: "companyAsc", label: "Company ↑" },
    { value: "companyDesc", label: "Company ↓" },
];

type ToastType = "success" | "error";

function App() {
    // --- STATE ---
    const [apps, setApps] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(false);

    const [filterStatus, setFilterStatus] = useState<number | "all">(() => {
        const saved = localStorage.getItem("filterStatus");
        if (!saved) return "all";
        return saved === "all" ? "all" : Number(saved);
    });

    const [sortOrder, setSortOrder] = useState<string>(
        () => localStorage.getItem("sortOrder") ?? "dateDesc"
    );

    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [status, setStatus] = useState(0);
    const [appliedDate, setAppliedDate] = useState(new Date().toISOString().substring(0, 10));
    const [notes, setNotes] = useState("");

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editCompany, setEditCompany] = useState("");
    const [editRole, setEditRole] = useState("");
    const [editStatus, setEditStatus] = useState(0);
    const [editAppliedDate, setEditAppliedDate] = useState("");
    const [editNotes, setEditNotes] = useState("");

    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    const [showAddForm, setShowAddForm] = useState(false);

    const token = localStorage.getItem("token");

    // --- TOAST ---
    const showToast = useCallback((message: string, type: ToastType = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    // --- FETCH APPLICATIONS ---
    useEffect(() => {
        if (!token) return;
        setLoading(true);
        getAllApplications()
            .then(setApps)
            .catch(() => showToast("Failed to load applications", "error"))
            .finally(() => setLoading(false));
    }, [token, showToast]);

    // --- LOCAL STORAGE ---
    useEffect(() => localStorage.setItem("filterStatus", String(filterStatus)), [filterStatus]);
    useEffect(() => localStorage.setItem("sortOrder", sortOrder), [sortOrder]);

    // --- FILTER & SORT ---
    const filteredApps = useMemo(() => {
        let filtered = filterStatus === "all" ? apps : apps.filter((app) => app.status === filterStatus);

        switch (sortOrder) {
            case "dateAsc":
                filtered = filtered.slice().sort((a, b) => new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime());
                break;
            case "dateDesc":
                filtered = filtered.slice().sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());
                break;
            case "companyAsc":
                filtered = filtered.slice().sort((a, b) => a.company.localeCompare(b.company));
                break;
            case "companyDesc":
                filtered = filtered.slice().sort((a, b) => b.company.localeCompare(a.company));
                break;
        }
        return filtered;
    }, [apps, filterStatus, sortOrder]);

    // --- LOGOUT ---
    const handleLogout = () => {
        localStorage.removeItem("token");
        showToast("Logged out");
        window.location.reload();
    };

    // --- ADD APPLICATION ---
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!company.trim() || !role.trim()) return;

        const newApp: JobApplication = {
            company: company.trim(),
            role: role.trim(),
            status,
            appliedDate: appliedDate,
            notes: notes.trim(),
        };

        console.log("handleSubmit -> newApp", newApp);

        setLoading(true);
        try {
            const saved = await addApplication(newApp);
            console.log("Saved application:", saved);

            setApps((prev) => [...prev, saved]);
            showToast("Application added");
            setCompany(""); setRole(""); setStatus(0); setAppliedDate(new Date().toISOString().substring(0, 10)); setNotes("");
        } catch (err) {
            console.error("Error adding application:", err);
            showToast("Failed to add application", "error");
        } finally {
            setLoading(false);
        }
    };

    // --- EDIT & DELETE HANDLERS ---
    const startEditing = (app: JobApplication) => {
        setEditingId(app.id ?? null);
        setEditCompany(app.company);
        setEditRole(app.role);
        setEditStatus(app.status);
        setEditAppliedDate(app.appliedDate.substring(0, 10));
        setEditNotes(app.notes ?? "");
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditCompany(""); setEditRole(""); setEditStatus(0); setEditAppliedDate(""); setEditNotes("");
    };

    const saveEdit = async () => {
        if (editingId === null || !editCompany.trim() || !editRole.trim()) return;

        const updatedApp: JobApplication = {
            id: editingId,
            company: editCompany.trim(),
            role: editRole.trim(),
            status: editStatus,
            appliedDate: new Date(editAppliedDate).toISOString(),
            notes: editNotes.trim(),
        };

        console.log("saveEdit -> updatedApp", updatedApp);

        setLoading(true);
        try {
            await updateApplication(editingId, updatedApp);
            console.log("Application updated successfully");

            setApps((prev) => prev.map((app) => (app.id === editingId ? updatedApp : app)));
            showToast("Application updated");
            cancelEditing();
        } catch (err) {
            console.error("Error updating application:", err);
            showToast("Failed to update application", "error");
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id: number) => setConfirmDeleteId(id);
    const cancelDelete = () => setConfirmDeleteId(null);

    const handleDelete = async () => {
        if (confirmDeleteId === null) return;
        console.log("handleDelete -> id", confirmDeleteId);

        setLoading(true);
        try {
            await deleteApplication(confirmDeleteId);
            console.log("Application deleted successfully");

            setApps((prev) => prev.filter((app) => app.id !== confirmDeleteId));
            showToast("Application deleted");
        } catch (err) {
            console.error("Error deleting application:", err);
            showToast("Failed to delete application", "error");
        } finally {
            setLoading(false);
            setConfirmDeleteId(null);
        }
    };

    // --- COMPONENTS ---
    const StatusBadge = ({ status }: { status: number }) => {
        const option = STATUS_OPTIONS.find((opt) => opt.value === status);
        return <span className={`status-badge ${option?.colorClass}`}>{option?.label}</span>;
    };

    // --- RENDER ---
    if (!token) return <p>Please login to access applications.</p>;

    return (
        <div className="app-container">
            <div className="header">
                <h1 className="app-title">Job Applications Tracker</h1>
                <button className="logout-btn" onClick={handleLogout} title="Logout">
                    <LogOut size={20} />
                </button>
            </div>

            {/* Filter & Sort Controls */}
            <div className="controls">
                <label>
                    Filter by Status:
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value === "all" ? "all" : Number(e.target.value))}>
                        <option value="all">All</option>
                        {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </label>

                <label>
                    Sort by:
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        {SORT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </label>
            </div>

            <button
                className="icon-btn add-new-btn"
                onClick={() => setShowAddForm((prev) => !prev)}
            >
                <Plus size={16} /> {showAddForm ? "Close" : "New Application"}
            </button>


            {/* Add Application Form */}
            {showAddForm && (
                <form onSubmit={handleSubmit} className="add-application-form">
                    <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" required disabled={loading} />
                    <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" required disabled={loading} />
                    <select value={status} onChange={(e) => setStatus(Number(e.target.value))} disabled={loading}>
                        {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <input type="date" value={appliedDate} onChange={(e) => setAppliedDate(e.target.value)} required disabled={loading} />
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} disabled={loading} placeholder="Notes" />
                    <button type="submit" disabled={loading}>{loading ? "Saving..." : "Add"}</button>
                </form>
            )}

            {/* Applications List */}
            <ul className="applications-list">
                {filteredApps.map(app => (
                    <li key={app.id} className="application-item">
                        {editingId === app.id ? (
                            <div className="edit-form">
                                <div className="edit-fields">
                                    <input value={editCompany} onChange={(e) => setEditCompany(e.target.value)} placeholder="Company" />
                                    <input value={editRole} onChange={(e) => setEditRole(e.target.value)} placeholder="Role" />
                                    <select value={editStatus} onChange={(e) => setEditStatus(Number(e.target.value))}>
                                        {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                    <input type="date" value={editAppliedDate} onChange={(e) => setEditAppliedDate(e.target.value)} />
                                    <textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="Notes" />
                                </div>

                                <div className="edit-actions">
                                    <button onClick={saveEdit} className="icon-btn"><Save size={16} /></button>
                                    <button onClick={cancelEditing} className="icon-btn delete"><X size={16} /></button>
                                </div>
                            </div>
                        ) : (
                            <div className="application-view">
                                <div><strong>{app.company}</strong> - {app.role} <StatusBadge status={app.status} /></div>
                                <div>Applied: {new Date(app.appliedDate).toLocaleDateString()}</div>
                                {app.notes && <div>Notes: {app.notes}</div>}
                                <div className="actions">
                                    <button onClick={() => startEditing(app)} className="icon-btn">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => confirmDelete(app.id!)} className="icon-btn delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            {/* Delete Confirmation */}
            {confirmDeleteId !== null && (
                <div className="modal">
                    <p>Are you sure you want to delete this application?</p>
                    <button onClick={handleDelete}>Yes</button>
                    <button onClick={cancelDelete}>No</button>
                </div>
            )}

            {/* Toast */}
            {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
        </div>
    );
}

export default App;
