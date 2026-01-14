window.ProjectManager = {
    PROJECTS_KEY: 'suzano_projects_index',
    LEGACY_KEY: 'suzano_report_data',
    STORAGE_PREFIX: 'suzano_project_',

    // --- Integration with DataService ---

    // Get list of all projects (ASYNC)
    getProjects: async function () {
        if (window.DataService) {
            return await window.DataService.getProjects();
        }
        return []; // Fallback
    },

    // Create a new project (ASYNC)
    createProject: async function (name, accountId, engagementType) {
        const newId = this.STORAGE_PREFIX + Date.now();
        const newProjectMeta = {
            id: newId,
            name: name,
            accountId: accountId || "",
            engagementType: engagementType || "Lite",
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            archived: false
        };

        // Initialize project data with default structure
        const baseData = window.initialDashboardData || window.dashboardData || {};
        const cleanData = JSON.parse(JSON.stringify(baseData));

        cleanData.accountId = accountId || "";
        cleanData.engagementType = engagementType || "Lite";
        cleanData.projectName = name;
        cleanData.headerOwner = "";

        // Reset tables
        const tableSections = ['tasks', 'risks', 'support', 'initiatives', 'opportunities', 'engagement', 'tacticalRoadmap'];
        tableSections.forEach(section => {
            if (cleanData[section] && Array.isArray(cleanData[section].rows)) {
                cleanData[section].rows = [];
            }
        });

        // Reset other sections
        if (cleanData.logbook) cleanData.logbook.entries = [];
        if (cleanData.strategicGoals) cleanData.strategicGoals.cards = [];
        if (cleanData.milestones) cleanData.milestones.items = [];
        if (cleanData.successMetrics) cleanData.successMetrics = []; // Reset metrics

        // Reset indicators
        const indicators = ['healthScore', 'adoptionLevel', 'licenseLevel', 'supportStatus', 'execEngagement', 'entitlementUsage'];
        indicators.forEach(key => cleanData[key] = null);

        // Reset Executive Summary
        if (cleanData.executiveSummary) {
            cleanData.executiveSummary.period = "";
            cleanData.executiveSummary.mission = "";
            cleanData.executiveSummary.purpose = "";
            cleanData.executiveSummary.vision = "";
            cleanData.executiveSummary.drivers = [];
            cleanData.executiveSummary.enablers = [];
            cleanData.executiveSummary.ambition = [];
            cleanData.executiveSummary.priorities = [];
        }

        cleanData.customSuzanoLogo = 'images/default_logo.png';

        if (window.DataService) {
            await window.DataService.createProject(newProjectMeta, cleanData);
        }
        return newId;
    },

    // Update project details (ASYNC)
    updateProject: async function (id, updates) {
        if (window.DataService) {
            // Update Meta
            await window.DataService.updateProjectMeta(id, updates);

            // If certain fields change, update data blob too
            if (updates.name || updates.accountId || updates.engagementType) {
                const currentData = await window.DataService.getProject(id);
                if (currentData) {
                    if (updates.name !== undefined) currentData.projectName = updates.name;
                    if (updates.accountId !== undefined) currentData.accountId = updates.accountId;
                    if (updates.engagementType !== undefined) currentData.engagementType = updates.engagementType;
                    await window.DataService.updateProjectData(id, currentData);
                }
            }
        }
    },

    // Legacy alias
    renameProject: async function (id, newName) {
        await this.updateProject(id, { name: newName });
    },

    toggleArchiveProject: async function (id) {
        const projects = await this.getProjects();
        const project = projects.find(p => p.id === id);
        if (project) {
            await this.updateProject(id, { archived: !project.archived });
        }
    },

    deleteProject: async function (id) {
        if (window.DataService) {
            await window.DataService.deleteProject(id);
        }
        if (this.getCurrentProjectId() === id) {
            this.setCurrentProjectId(null);
        }
    },

    // Data Access (ASYNC)
    getProjectData: async function (id) {
        if (window.DataService) {
            return await window.DataService.getProject(id);
        }
        return null;
    },

    saveProjectData: async function (id, data) {
        if (window.DataService) {
            await window.DataService.updateProjectData(id, data);
        }
    },

    // Local Session State (Sync) - This is per-user session
    getCurrentProjectId: function () {
        return localStorage.getItem('current_project_id');
    },

    setCurrentProjectId: function (id) {
        if (id) {
            localStorage.setItem('current_project_id', id);
        } else {
            localStorage.removeItem('current_project_id');
        }
    },

    // Legacy Migration
    checkForLegacyData: function () {
        // We can't easily migrate async in a sync flow, but we can try.
        // For shared mock server, legacy local migration is tricky.
        // We'll skip auto-migration for now or assume DataService handles its own 'loadLocal' which reads legacy keys.
        // Actually, DataService.loadLocal() does read legacy keys.
    },

    // Feedback System (Delegated to DataService)
    getFeedback: async function () {
        if (window.DataService) {
            return await window.DataService.getFeedback();
        }
        return [];
    },

    addFeedback: async function (feedbackItem) {
        const item = {
            id: Date.now(),
            date: new Date().toISOString(),
            name: feedbackItem.name || 'Anonymous',
            type: feedbackItem.type || 'General',
            message: feedbackItem.message || '',
            votes: 0
        };
        if (window.DataService) {
            await window.DataService.addFeedback(item);
        }
        return item;
    },

    voteFeedback: async function (id) {
        if (window.DataService) {
            await window.DataService.voteFeedback(id);
        }
    }
};
