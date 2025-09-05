let config: { API_BASE_URL: string } | null = null;

export async function loadConfig(): Promise<{ API_BASE_URL: string }> {
    if (!config) {
        const res = await fetch("/config.json");
        if (!res.ok) throw new Error("Failed to load config.json");

        const json = (await res.json()) as { API_BASE_URL: string };
        if (!json?.API_BASE_URL) {
            throw new Error("API_BASE_URL is missing in config.json");
        }

        config = json;
    }

    return config;
}

export async function getApiBaseUrl(): Promise<string> {
    const cfg = await loadConfig();
    return cfg.API_BASE_URL;
}