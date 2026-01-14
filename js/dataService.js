
window.DataService = {
    // Configuration
    MODE: 'server', // Default to server as requested
    API_BASE: '/api',

    // In-memory cache
    cache: {
        projects: [], // List of {id, name, ...metadata}
        projectData: {} // Map projectId -> full data object
    },

    CLOUD_CONFIG: null, // Will be loaded from window

    isInitialized: false,

    // Initialize: Fetch data from source
    init: async function () {
        if (this.isInitialized) return;

        // Check global config override
        if (typeof window.STORAGE_MODE !== 'undefined') {
            this.MODE = window.STORAGE_MODE;
        }
        if (typeof window.API_BASE !== 'undefined') {
            this.API_BASE = window.API_BASE;
        }
        if (typeof window.CLOUD_CONFIG !== 'undefined') {
            this.CLOUD_CONFIG = window.CLOUD_CONFIG;
        }

        console.log(`DataService initializing in ${this.MODE} mode...`);

        // Load initial list
        await this.getProjects();
        this.isInitialized = true;
    },

    // --- Core CRUD Operations ---

    // 1. List Projects
    getProjects: async function () {
        if (this.MODE === 'server') {
            try {
                const res = await fetch(`${this.API_BASE}/projects`);
                if (!res.ok) throw new Error("Failed to fetch projects");
                const projects = await res.json();

                // Cache logic: In this simple model, the API returns full objects.
                // We'll update our cache.
                this.cache.projects = projects.map(p => ({
                    id: p.id,
                    name: p.projectName || p.name, // Handle varied naming
                    accountId: p.accountId,
                    engagementType: p.engagementType,
                    lastModified: p.lastUpdated || p.lastModified,
                    archived: p.archived
                }));

                // Also cache the full data to avoid re-fetching immediately
                projects.forEach(p => {
                    this.cache.projectData[p.id] = p;
                });

                return this.cache.projects;
            } catch (e) {
                console.error("API Error (List):", e);
                this.handleOffline();
                return this.listProjectsLocal();
            }
        } else if (this.MODE === 'cloud') {
            return this.getProjectsCloud();
        } else {
            return this.listProjectsLocal();
        }
    },

    // 2. Get Single Project
    getProject: async function (projectId) {
        if (this.MODE === 'server') {
            // Return from cache if we have it and it's fresh? 
            // For POC, "Refresh on load" is requested. 
            // But if we just listed projects, we likely have the data.
            // Let's implement a fetch if missing.
            if (this.cache.projectData[projectId]) {
                return this.cache.projectData[projectId];
            }

            try {
                const res = await fetch(`${this.API_BASE}/projects/${projectId}`);
                if (!res.ok) throw new Error("Failed to fetch project");
                const project = await res.json();
                this.cache.projectData[projectId] = project;
                return project;
            } catch (e) {
                console.error("API Error (Get Project):", e);
                // Try fallback logic? 
                // If offline, maybe we have it in memory? or localStorage backup?
                return this.getProjectLocal(projectId);
            }
        } else if (this.MODE === 'cloud') {
            if (this.cache.projectData[projectId]) {
                return this.cache.projectData[projectId];
            }
            // For cloud/single-bin model, getProjects already fetched EVERYTHING.
            // If it's not in cache, maybe we haven't fetched yet?
            await this.getProjectsCloud();
            return this.cache.projectData[projectId] || null;
        } else {
            return this.getProjectLocal(projectId);
        }
    },

    // 3. Create Project
    createProject: async function (projectMeta, projectData) {
        // Prepare the unified object
        const fullObject = {
            ...projectMeta,
            ...projectData,
            id: projectMeta.id, // Ensure ID matches
            projectName: projectMeta.name, // Ensure Name matches
            createdBy: 'user', // Placeholder
            lastUpdated: new Date().toISOString()
        };

        if (this.MODE === 'server') {
            try {
                const res = await fetch(`${this.API_BASE}/projects`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(fullObject)
                });
                if (!res.ok) throw new Error("Failed to create project");

                const saved = await res.json();
                // Update Cache
                this.cache.projects.push(projectMeta);
                this.cache.projectData[projectMeta.id] = saved;

                return saved;
                return saved;
            } catch (e) {
                console.error("API Error (Create):", e);
                this.handleOffline();
                return this.createProjectLocal(projectMeta, projectData);
            }
        } else if (this.MODE === 'cloud') {
            return this.createProjectCloud(projectMeta, projectData);
        } else {
            return this.createProjectLocal(projectMeta, projectData);
        }
    },

    // 4. Update Project (Data or Meta)
    // We treat "Update Data" and "Update Meta" similarly now: Update the server entity.
    updateProjectData: async function (projectId, data) {
        if (this.MODE === 'server') {
            try {
                const res = await fetch(`${this.API_BASE}/projects/${projectId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (!res.ok) throw new Error("Failed to update project");

                const saved = await res.json();
                this.cache.projectData[projectId] = saved;

                // Update meta in cache if changed
                const idx = this.cache.projects.findIndex(p => p.id === projectId);
                if (idx !== -1) {
                    this.cache.projects[idx].name = saved.projectName || saved.name;
                    this.cache.projects[idx].lastModified = saved.lastUpdated;
                }

                if (window.showToast) window.showToast("Saved to Server");
                if (window.showToast) window.showToast("Saved to Server");
            } catch (e) {
                console.error("API Error (Update):", e);
                this.handleOffline();
                this.updateProjectDataLocal(projectId, data);
            }
        } else if (this.MODE === 'cloud') {
            this.updateProjectCloud(projectId, data);
        } else {
            this.updateProjectDataLocal(projectId, data);
        }
    },

    updateProjectMeta: async function (projectId, updates) {
        // Get current data first to ensure we don't lose anything?
        // Or send partial update (PATCH)? 
        // Our server implements PUT (Update/Replace). So we need full object.

        let current = await this.getProject(projectId);
        if (!current) return; // Error

        const updated = { ...current, ...updates };
        // Map specific meta fields back to data fields if necessary
        if (updates.name) updated.projectName = updates.name;

        await this.updateProjectData(projectId, updated);
    },

    // 5. Delete Project
    deleteProject: async function (projectId) {
        if (this.MODE === 'server') {
            try {
                const res = await fetch(`${this.API_BASE}/projects/${projectId}`, {
                    method: 'DELETE'
                });
                if (!res.ok) throw new Error("Failed to delete project");

                // Update Cache
                this.cache.projects = this.cache.projects.filter(p => p.id !== projectId);
                delete this.cache.projectData[projectId];

            } catch (e) {
                console.error("API Error (Delete):", e);
                this.handleOffline();
                this.deleteProjectLocal(projectId);
            }
        } else if (this.MODE === 'cloud') {
            this.deleteProjectCloud(projectId);
        } else {
            this.deleteProjectLocal(projectId);
        }
    },

    // --- Feedback Operations (Keeping legacy structure aligned) ---
    getFeedback: async function () {
        // For simplicity, maybe we don't implement shared feedback in this step unless requested.
        // The prompt says "Persist data in a server-side JSON...". 
        // And "Only refactor data persistence...".
        // Server saves 'projects'. Feedback was separate.
        // Let's implement local fallback for feedback or ignore for now.
        return this.getFeedbackLocal();
    },
    addFeedback: async function (item) { return this.addFeedbackLocal(item); },
    voteFeedback: async function (id) { return this.voteFeedbackLocal(id); },

    // --- Cloud Implementation (JSONBin) ---
    // Note: JSONBin V3 returns { record: [...], metadata: ... }

    getCloudHeaders: function () {
        if (!this.CLOUD_CONFIG || !this.CLOUD_CONFIG.apiKey) {
            console.error("Missing Cloud Config");
            throw new Error("Missing Cloud Config");
        }
        return {
            'Content-Type': 'application/json',
            'X-Master-Key': this.CLOUD_CONFIG.apiKey
        };
    },

    getProjectsCloud: async function () {
        try {
            const url = `https://api.jsonbin.io/v3/b/${this.CLOUD_CONFIG.binId}`;
            const res = await fetch(url, {
                method: 'GET',
                headers: this.getCloudHeaders()
            });
            if (!res.ok) throw new Error(`Cloud Error: ${res.status}`);

            const data = await res.json();
            // JSONBin v3 returns data in .record
            const projects = data.record || [];

            // Update Cache
            this.cache.projects = projects.map(p => ({
                id: p.id,
                name: p.projectName || p.name,
                accountId: p.accountId,
                engagementType: p.engagementType,
                lastModified: p.lastUpdated || p.lastModified,
                archived: p.archived
            }));

            // Cache Data
            projects.forEach(p => {
                this.cache.projectData[p.id] = p;
            });

            if (window.showToast && !this.cloudConnectedToastShown) {
                window.showToast("☁️ Cloud System Connected");
                this.cloudConnectedToastShown = true;
            }

            return this.cache.projects;

        } catch (e) {
            console.error("Cloud Fetch Error:", e);
            this.handleOffline(); // Show warning
            return this.listProjectsLocal();
        }
    },

    saveCloudBin: async function (allProjects) {
        try {
            const url = `https://api.jsonbin.io/v3/b/${this.CLOUD_CONFIG.binId}`;
            const res = await fetch(url, {
                method: 'PUT',
                headers: this.getCloudHeaders(),
                body: JSON.stringify(allProjects)
            });
            if (!res.ok) throw new Error("Failed to save to cloud");

            if (window.showToast) window.showToast("Saved to Cloud ☁️");
            return true;
        } catch (e) {
            console.error("Cloud Save Error:", e);
            // Fallback?
            if (window.showToast) window.showToast("⚠️ Cloud Save Failed");
            return false;
        }
    },

    createProjectCloud: async function (meta, data) {
        // Prepare Object
        const fullObject = {
            ...meta,
            ...data,
            id: meta.id, // Ensure ID matches
            projectName: meta.name, // Ensure Name matches
            createdBy: 'user', // Placeholder
            lastUpdated: new Date().toISOString()
        };

        // 1. Get Current (to ensure we have latest)
        await this.getProjectsCloud();

        // 2. Append
        const allProjects = Object.values(this.cache.projectData);
        allProjects.push(fullObject);

        // 3. Save
        const success = await this.saveCloudBin(allProjects);
        if (success) {
            // Update Cache Manually to ensure sync
            this.cache.projects.push(meta);
            this.cache.projectData[meta.id] = fullObject;
            return fullObject;
        } else {
            return this.createProjectLocal(meta, data);
        }
    },

    updateProjectCloud: async function (projectId, updates) {
        // Update Cache First (Optimistic)
        if (this.cache.projectData[projectId]) {
            this.cache.projectData[projectId] = { ...this.cache.projectData[projectId], ...updates };
            // fix meta for list
            const idx = this.cache.projects.findIndex(p => p.id === projectId);
            if (idx !== -1) {
                this.cache.projects[idx].lastModified = updates.lastUpdated || new Date().toISOString();
                if (updates.projectName) this.cache.projects[idx].name = updates.projectName;
            }
        }

        const allProjects = Object.values(this.cache.projectData);
        await this.saveCloudBin(allProjects);
    },

    deleteProjectCloud: async function (projectId) {
        if (this.cache.projectData[projectId]) {
            delete this.cache.projectData[projectId];
            this.cache.projects = this.cache.projects.filter(p => p.id !== projectId);
        }
        const allProjects = Object.values(this.cache.projectData);
        await this.saveCloudBin(allProjects);
    },


    // --- LocalStorage Implementation (Fallback & Legacy) ---

    listProjectsLocal: function () {
        const index = localStorage.getItem('suzano_projects_index');
        return index ? JSON.parse(index) : [];
    },

    getProjectLocal: function (id) {
        const data = localStorage.getItem(id);
        return data ? JSON.parse(data) : null;
    },

    createProjectLocal: function (meta, data) {
        const projects = this.listProjectsLocal();
        projects.push(meta);
        localStorage.setItem('suzano_projects_index', JSON.stringify(projects));
        localStorage.setItem(meta.id, JSON.stringify(data));
        return data;
    },

    updateProjectDataLocal: function (id, data) {
        localStorage.setItem(id, JSON.stringify(data));
        // Update timestamp in index
        const projects = this.listProjectsLocal();
        const p = projects.find(x => x.id === id);
        if (p) {
            p.lastModified = new Date().toISOString();
            localStorage.setItem('suzano_projects_index', JSON.stringify(projects));
        }
    },

    deleteProjectLocal: function (id) {
        let projects = this.listProjectsLocal();
        projects = projects.filter(p => p.id !== id);
        localStorage.setItem('suzano_projects_index', JSON.stringify(projects));
        localStorage.removeItem(id);
    },

    // Feedback Local
    getFeedbackLocal: function () {
        const fb = localStorage.getItem('suzano_poc_feedback');
        return fb ? JSON.parse(fb) : [];
    },
    addFeedbackLocal: function (item) {
        const list = this.getFeedbackLocal();
        list.push(item);
        localStorage.setItem('suzano_poc_feedback', JSON.stringify(list));
    },
    voteFeedbackLocal: function (id) {
        const list = this.getFeedbackLocal();
        const i = list.find(x => x.id === id);
        if (i) i.votes++;
        localStorage.setItem('suzano_poc_feedback', JSON.stringify(list));
    },

    // --- Helper for Offline Mode ---
    handleOffline: function () {
        if (this.offlineNotified) return;
        console.warn("Server unavailable. Switching to LocalStorage.");

        // Show UI Warning
        const warning = document.createElement('div');
        warning.innerHTML = "⚠️ <b>Offline Mode</b><br>Unable to connect to server. Changes are saved locally.";
        warning.style.cssText = "position:fixed; bottom:20px; left:20px; background:#ff4136; color:white; padding:10px 15px; border-radius:8px; z-index:99999; box-shadow:0 4px 12px rgba(0,0,0,0.3); font-size:0.9rem;";
        warning.onclick = () => warning.remove();
        document.body.appendChild(warning);

        this.offlineNotified = true;
    }
};

