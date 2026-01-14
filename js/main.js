// Preserve initial data for new project creation
// window.initialDashboardData = JSON.parse(JSON.stringify(window.dashboardData));

// --- CONFIGURATION ---
const STORAGE_MODE = "server"; // "local" or "server"
const API_BASE = "/api";

window.DATA_MODE = STORAGE_MODE; // Legacy compat
window.STORAGE_MODE = STORAGE_MODE;
window.API_BASE = API_BASE;

// Main entry point
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const app = document.getElementById('app');
        if (!app) throw new Error("DOM Error: #app element not found");

        // Initialize DataService
        if (window.DataService) {
            window.DataService.MODE = DATA_MODE; // Ensure mode is set
            await window.DataService.init();
        }

        // --- Project System Integration ---
        if (window.ProjectManager) {
            window.ProjectManager.checkForLegacyData();
            const currentProjectId = window.ProjectManager.getCurrentProjectId();

            if (!currentProjectId) {
                // Determine if we are on the project selector page (no ID)
                // We need to pass the app container
                if (window.renderProjectSelector) {
                    await window.renderProjectSelector(app);
                }
                return;
            }
        }

        const STORAGE_KEY = window.ProjectManager ? window.ProjectManager.getCurrentProjectId() : 'suzano-dashboard-data';

        // --- Persistence Logic ---
        async function loadData() {
            let savedData = null;

            if (window.ProjectManager) {
                savedData = await window.ProjectManager.getProjectData(STORAGE_KEY);
            } else {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) savedData = JSON.parse(saved);
            }

            if (savedData) {
                try {
                    // Merge saved data with defaults to ensure new top-level keys are preserved
                    window.dashboardData = Object.assign({}, window.dashboardData, savedData);

                    // FORCE COLUMN DEFINITIONS (Fix for key order issues)
                    // FORCE SCHEMA UPDATES (Headers and Columns)
                    const schemaUpdates = {
                        opportunities: {
                            headers: ["N.", "Oportunidade", "Contato", "Comentário", "Status"],
                            columns: ["id", "name", "contact", "comment", "status"]
                        },
                        initiatives: {
                            headers: ["N.", "Entitlements", "Horas/Tokens", "Status"],
                            columns: ["id", "name", "hours", "status"]
                        },
                        engagement: {
                            headers: ["N.", "Engajamento Parceiro", "Contato", "Comentário", "Status"],
                            columns: ["id", "name", "contact", "comment", "status"]
                        },
                        support: {
                            headers: ["N. Caso", "Descrição", "Responsável", "Status"],
                            columns: ["case", "desc", "owner", "status"]
                        }
                    };

                    Object.keys(schemaUpdates).forEach(key => {
                        if (window.dashboardData[key]) {
                            window.dashboardData[key].headers = schemaUpdates[key].headers;
                            window.dashboardData[key].columns = schemaUpdates[key].columns;
                        }
                    });

                    // Force Column Keys for others (to prevent reordering issues)
                    const columnDefaults = {
                        tasks: ["id", "task", "owner", "startDate", "endDate", "status"],
                        support: ["case", "desc", "owner", "status"],
                        initiatives: ["id", "name", "hours", "status"],
                        risks: ["risk", "category", "impact", "mitigation", "status"]
                    };

                    Object.keys(columnDefaults).forEach(key => {
                        if (window.dashboardData[key]) {
                            window.dashboardData[key].columns = columnDefaults[key];
                        }
                    });


                    // SCHEMA MIGRATION: Remove 'Balanço 2026' from Initiatives if present
                    if (window.dashboardData.initiatives &&
                        window.dashboardData.initiatives.headers.includes("Balanço 2026")) {

                        console.log("Migrating schema: Removing Balance column from Initiatives");
                        const idx = window.dashboardData.initiatives.headers.indexOf("Balanço 2026");
                        if (idx !== -1) {
                            window.dashboardData.initiatives.headers.splice(idx, 1);
                        }
                        if (window.dashboardData.initiatives.totalHoursPool === undefined) {
                            window.dashboardData.initiatives.totalHoursPool = 80;
                        }
                        saveData();
                    }

                    // MIGRATION: Rescue 'Archived' Initiatives from Overview experiments
                    if (window.dashboardData.tacticalRoadmap && window.dashboardData.tacticalRoadmap.rows) {
                        let recovered = 0;
                        window.dashboardData.tacticalRoadmap.rows.forEach(r => {
                            if (r.archived) {
                                r.archived = false;
                                recovered++;
                            }
                        });
                        if (recovered > 0) {
                            console.log(`Recovered ${recovered} archived initiatives.`);
                            saveData();
                        }
                    }


                    // DATA MIGRATION: Normalize Indicators to Keys (Fix for Language Switch)
                    const indicatorKeys = ['healthScore', 'adoptionLevel', 'licenseLevel', 'supportStatus', 'execEngagement', 'entitlementUsage'];
                    const legacyMap = {
                        // PT
                        'Saudável': 'healthy', 'Atenção': 'attention', 'Risco': 'risk', 'At Risk': 'risk',
                        'Baixo': 'low', 'Médio': 'medium', 'Alto': 'high',
                        'Sob Controle': 'underControl', 'Crítico': 'critical',
                        'Sim': 'yes', 'Parcial': 'partial', 'Não': 'no',
                        // EN Legacy (if any)
                        'Healthy': 'healthy', 'Attention': 'attention',
                        'Low': 'low', 'Medium': 'medium', 'High': 'high',
                        'Under Control': 'underControl', 'Critical': 'critical',
                        'Yes': 'yes', 'Partial': 'partial', 'No': 'no'
                    };

                    indicatorKeys.forEach(key => {
                        const val = window.dashboardData[key];
                        if (legacyMap[val]) {
                            console.log(`Migrating indicator ${key}: ${val} -> ${legacyMap[val]}`);
                            window.dashboardData[key] = legacyMap[val];
                            saveData();
                        }
                    });

                    if (!window.dashboardData.orgMap) {
                        window.dashboardData.orgMap = {
                            root: {
                                id: "root",
                                name: "Root",
                                role: "",
                                notes: "",
                                type: "root",
                                children: []
                            }
                        };
                    }

                    // Initialize Baselines
                    if (!window.dashboardData.baselines) {
                        window.dashboardData.baselines = [];
                    }

                    // FORCE UPDATE SCHEMA for Initiatives (Linkage to Success Plan)
                    if (window.dashboardData.initiatives) {
                        window.dashboardData.initiatives.title = "Entitlements"; // User requested rename
                        window.dashboardData.initiatives.headers = ["Iniciativa / Projeto", "Categoria", "Envolvimento", "Horas/Tokens", "Mês Planejado", "Status"];
                        window.dashboardData.initiatives.columns = ["tactic", "category", "involvement", "estHours", "plannedMonth", "status"];
                        // Ensure total pool logic exists
                        if (window.dashboardData.initiatives.totalHoursPool === undefined) {
                            window.dashboardData.initiatives.totalHoursPool = 80;
                        }
                    }

                    console.log("Loaded data successfully");
                } catch (e) {
                    console.error("Error loading saved data", e);
                }
            } else {
                console.log("No saved data found, using defaults for project " + STORAGE_KEY);
            }
        }

        async function saveData() {
            // Update timestamp
            window.dashboardData.lastUpdated = new Date().toISOString();

            // Use ProjectManager to save (updates timestamp in index)
            if (window.ProjectManager) {
                await window.ProjectManager.saveProjectData(STORAGE_KEY, window.dashboardData);
            } else {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(window.dashboardData));
            }
            console.log("Data saved");
            updateHeaderLastUpdate();
        }
        // Expose for other tabs
        window.saveData = saveData;

        function updateHeaderLastUpdate() {
            const el = document.getElementById('header-last-update');
            if (el && window.dashboardData && window.dashboardData.lastUpdated) {
                const date = new Date(window.dashboardData.lastUpdated);
                const localeMap = { 'en': 'en-US', 'es': 'es-ES', 'jp': 'ja-JP', 'pt': 'pt-BR' };
                const locale = localeMap[window.currentLanguage] || 'pt-BR';
                el.innerText = (window.t ? window.t('lastUpdate') : 'Last Update') + ': ' + date.toLocaleString(locale);
            }
        }

        function resetData() {
            window.showConfirm("Tem certeza? Isso apagará todas as suas edições e voltará ao padrão do arquivo.", () => {
                // Logic to delete project data? Or just reset? 
                // For now, let's keep it simple.
                if (window.ProjectManager) {
                    // Maybe clear remote data? 
                    // User said "Do not change existing features". 
                    // Existing feature was: localStorage.removeItem(STORAGE_KEY).
                    // We should ideally call DataService to clear data?
                    // But deleteProject handles that. ResetData implies clearing current view.
                    // Let's rely on saveProjectData with default data?
                    // For now, reload.
                } else {
                    localStorage.removeItem(STORAGE_KEY);
                }
                window.location.reload();
            });
        }

        // Load persisted data BEFORE rendering
        await loadData();

        // Access globals
        const data = window.dashboardData;
        const render = window.renderTable;

        if (!data || !render) {
            console.error("Dashboard data or render function not loaded properly.");
            return;
        }

        // --- Rendering ---

        // 1. Render Header
        const header = document.createElement('header');
        header.className = 'header';

        const suzanoLogoSrc = data.customSuzanoLogo || 'images/suzano_logo.png';

        const today = new Date();
        // Default to today
        const localeMap = { 'en': 'en-US', 'es': 'es-ES', 'jp': 'ja-JP', 'pt': 'pt-BR' };
        const locale = localeMap[window.currentLanguage] || 'pt-BR';

        // Default to today
        let displayDate = today.toLocaleDateString(locale, {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        // Check if we are loading a specific date from a baseline (snapshot)
        // The snapshot data usually has headerOwner or similar, but maybe we should store the snapshot date in the data itself?
        // In our createBaseline function, we store 'date' in the metadata wraper, but we load 'data' into window.dashboardData.
        // Let's check if we can infer it. 
        // Actually, when we load a baseline, we are just looking at window.dashboardData. 
        // We should probably inject the baseline date into window.dashboardData when loading it if we want it here.
        // ALTHOUGH: The user request implies they want to see the label "VERSÃO BASELINE: [Date]"

        // Let's modify the header rendering to check if we are in read-only mode and if so, try to find the active baseline option text.
        // However, the header renders BEFORE the version selector logic might run/select something.
        // Wait, 'renderVersionOptions' and 'enterReadOnlyMode' are defined LATER.
        // But 'window.dashboardData' is already loaded.

        // If we have just loaded a baseline, we might want to know that.
        // But initially on page load, we are always effectively "Current".
        // When we switch to a baseline, 'enterReadOnlyMode' calls 'refreshDashboard'.
        // BUT 'refreshDashboard' does NOT re-render the Header. The header is static in 'main.js'.

        // ACTION: We need to update the Header DATE Element when entering/exiting read-only mode.
        // So let's give the date element an ID.

        const datePrefix = '';
        // We will update this dynamically.

        const accountId = data.accountId || '';
        const engagementType = data.engagementType || '';
        const titleText = data.projectName || (window.t ? window.t('headerTitle') : 'CX - Customer Success Portal');

        let engagementBadge = '';
        if (engagementType) {
            let color = '#aaa'; // Lite
            if (engagementType.includes('Plus')) color = '#DAA520'; // Gold
            else if (engagementType.includes('Premier')) color = 'var(--status-blue)'; // Blue
            else if (engagementType === 'Não Pago') color = '#555'; // Dark grey for Not Paid

            const displayLabel = window.t ? window.t(engagementType) : engagementType;
            engagementBadge = `<span id="header-engagement-badge" style="font-size: 0.45em; background: ${color}; color: white; padding: 2px 8px; border-radius: 10px; margin-left: 10px; vertical-align: middle; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.9;">${displayLabel}</span>`;
        }

        const accountIdHtml = accountId ? `<span style="font-size: 0.6em; opacity: 0.7; margin-left: 15px; font-weight: normal; vertical-align: middle;">ID: ${accountId}</span>` : '';

        header.innerHTML = `
        <div class="logo-wrapper" id="suzano-logo-wrapper" title="Clique para alterar a imagem" style="cursor: pointer;">
            <img src="${suzanoLogoSrc}" alt="Suzano Logo" id="suzano-logo-img">
        </div>
        <div class="title-container">
            <h1 style="display: flex; align-items: center; justify-content: center;">
                ${titleText}
                ${accountIdHtml}
                ${engagementBadge}
            </h1>
            <p class="header-date" id="header-date-display">${displayDate}</p>
            <div class="header-owner-container">
                <input type="text" class="header-owner-input" id="header-owner" placeholder="${window.t ? window.t('csmPlaceholder') : 'Nome do CSM (Responsável)'}" value="${data.headerOwner || ''}">
                <div id="header-last-update" style="font-size: 0.75rem; color: rgba(255,255,255,0.6); margin-top: 5px; text-align: right; min-height: 1em;"></div>
            </div>
        </div>
        <div class="logo-wrapper">
            <img src="images/alteryx_logo_v3.jpg" alt="Alteryx Logo">
        </div>
    `;

        // Header Style Adjustment to prevent overlap if screen is small
        header.style.position = 'relative';
        app.appendChild(header);

        // Create Read-Only Badge
        const badge = document.createElement('div');
        badge.className = 'read-only-badge';
        badge.innerText = 'Baseline — Read-only';
        document.body.appendChild(badge);

        // POC Shared Mode Badge
        if (typeof DATA_MODE !== 'undefined' && DATA_MODE === 'shared_mock') {
            const modeBadge = document.createElement('div');
            modeBadge.innerText = 'POC Shared Mode (No Auth)';
            modeBadge.style.cssText = 'position:fixed; bottom:10px; right:10px; background:rgba(218, 165, 32, 0.3); color:rgba(255,255,255,0.7); padding:4px 8px; border-radius:4px; font-size:0.7em; z-index:9999; pointer-events:none; border: 1px solid rgba(218, 165, 32, 0.5);';
            document.body.appendChild(modeBadge);
        }

        // Header Owner Input Logic
        const ownerInput = document.getElementById('header-owner');
        ownerInput.oninput = (e) => {
            window.dashboardData.headerOwner = e.target.value;
            saveData();
        };

        // Hidden File Input for Logo Upload
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (readerEvent) => {
                    const result = readerEvent.target.result;
                    document.getElementById('suzano-logo-img').src = result;
                    const footerLogo = document.getElementById('footer-logo-img');
                    if (footerLogo) footerLogo.src = result;

                    window.dashboardData.customSuzanoLogo = result;
                    saveData();
                    window.showAlert("Logo atualizado com sucesso!");
                };
                reader.readAsDataURL(file);
            }
        };
        app.appendChild(fileInput);

        document.getElementById('suzano-logo-wrapper').onclick = () => {
            const msg = window.t ? window.t('changeLogoConfirm') : "Deseja alterar o logo da Suzano?";
            window.showConfirm(msg, () => {
                fileInput.click();
            });
        };

        // 2. Render Toolbar (Reset Button)
        const toolbar = document.createElement('div');
        toolbar.style.display = 'flex';
        toolbar.style.justifyContent = 'space-between'; // Changed to space-between for back button
        toolbar.style.gap = '10px';
        toolbar.style.marginBottom = '20px';

        // Left side: Back to Projects
        const leftGrp = document.createElement('div');
        leftGrp.style.display = 'flex';
        leftGrp.style.alignItems = 'center';
        leftGrp.style.gap = '10px';

        const btnBack = document.createElement('button');
        btnBack.id = 'btn-back-projects';
        btnBack.innerHTML = `<span>←</span> ${window.t ? window.t('myProjects') : 'Projetos'}`;
        btnBack.className = 'btn-premium primary';
        // btnBack.style.cssText removed in favor of classes
        // Hover handled by CSS

        btnBack.onclick = () => {
            window.ProjectManager.setCurrentProjectId(null);
            window.location.reload();
        };
        leftGrp.appendChild(btnBack);

        // CSM Engagement Label & Dropdown
        const engLabel = document.createElement('span');
        engLabel.textContent = window.t ? window.t('csmEngagementType') + ':' : 'CSM Engagement Type:';
        engLabel.style.color = 'rgba(255,255,255,0.7)';
        engLabel.style.fontSize = '0.9rem';
        engLabel.style.marginLeft = '10px';
        leftGrp.appendChild(engLabel);

        const engSelect = document.createElement('select');
        engSelect.className = 'btn-premium'; // Reuse base class
        engSelect.style.cursor = 'pointer';
        engSelect.style.appearance = 'auto';
        engSelect.style.background = 'rgba(0,0,0,0.3)';
        engSelect.style.border = '1px solid rgba(255,255,255,0.2)';
        engSelect.style.color = 'white';
        engSelect.style.padding = '8px 12px';
        engSelect.style.borderRadius = '4px';

        ['Não Pago', 'Lite', 'Premier Success', 'Premier Success Plus'].forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            // Use translation if available, otherwise fallback to opt string
            option.textContent = window.t ? window.t(opt) : opt;

            // Fix visibility: Force dark background and white text for options
            option.style.backgroundColor = '#002f5d';
            option.style.color = '#ffffff';

            if (data.engagementType === opt) option.selected = true;
            engSelect.appendChild(option);
        });

        engSelect.onchange = (e) => {
            const newVal = e.target.value;
            window.dashboardData.engagementType = newVal;
            saveData();

            // Sync with ProjectManager index to persist across reloads/UI
            if (window.ProjectManager) {
                window.ProjectManager.updateProject(window.ProjectManager.getCurrentProjectId(), {
                    engagementType: newVal
                });
            }

            // Dynamic Update without Reload
            let badge = document.getElementById('header-engagement-badge');

            let color = '#aaa';
            if (newVal.includes('Plus')) color = '#DAA520';
            else if (newVal.includes('Premier')) color = 'var(--status-blue)';
            else if (newVal === 'Não Pago') color = '#555'; // Dark grey for Not Paid

            if (badge) {
                badge.textContent = window.t ? window.t(newVal) : newVal;
                badge.style.background = color;
            } else {
                // Create if not exists (e.g. was empty)
                badge = document.createElement('span');
                badge.id = 'header-engagement-badge';
                badge.style.cssText = `font-size: 0.45em; background: ${color}; color: white; padding: 2px 8px; border-radius: 10px; margin-left: 10px; vertical-align: middle; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.9;`;
                badge.textContent = window.t ? window.t(newVal) : newVal;
                // Append to h1. Need to find the h1 safely. 
                const h1 = document.querySelector('.title-container h1');
                if (h1) h1.appendChild(badge);
            }
        };
        leftGrp.appendChild(engSelect);
        toolbar.appendChild(leftGrp);

        // Right side: Actions
        const rightGrp = document.createElement('div');
        rightGrp.style.display = 'flex';
        rightGrp.style.gap = '10px';
        rightGrp.style.alignItems = 'center';

        // Read Me Button (Compact)
        const btnReadMe = document.createElement('button');
        btnReadMe.innerHTML = `<span>?</span>`;
        btnReadMe.title = window.t ? window.t('readMeTitle') : 'Help'; // Tooltip
        btnReadMe.className = 'btn-premium';
        // Circular Icon Button Style
        btnReadMe.style.background = 'rgba(255, 255, 255, 0.1)';
        btnReadMe.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        btnReadMe.style.width = '32px';
        btnReadMe.style.height = '32px';
        btnReadMe.style.borderRadius = '50%';
        btnReadMe.style.padding = '0';
        btnReadMe.style.display = 'flex';
        btnReadMe.style.alignItems = 'center';
        btnReadMe.style.justifyContent = 'center';
        btnReadMe.style.fontSize = '1.2rem';
        btnReadMe.style.fontWeight = 'bold';

        btnReadMe.onclick = () => {
            // Create Modal
            const modalOverlay = document.createElement('div');
            modalOverlay.style.position = 'fixed';
            modalOverlay.style.top = '0';
            modalOverlay.style.left = '0';
            modalOverlay.style.width = '100%';
            modalOverlay.style.height = '100%';
            modalOverlay.style.background = 'rgba(0,0,0,0.7)';
            modalOverlay.style.display = 'flex';
            modalOverlay.style.justifyContent = 'center';
            modalOverlay.style.alignItems = 'center';
            modalOverlay.style.zIndex = '10000';

            const modalContent = document.createElement('div');
            modalContent.style.background = '#001a33'; // Opaque dark blue for readability
            modalContent.style.padding = '30px';
            modalContent.style.borderRadius = '12px';
            modalContent.style.maxWidth = '600px';
            modalContent.style.width = '90%';
            modalContent.style.border = '1px solid rgba(255,255,255,0.1)';
            modalContent.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5)';
            modalContent.style.color = 'white';
            modalContent.style.fontFamily = 'var(--font-primary)';
            modalContent.style.position = 'relative';

            const title = window.t ? window.t('readMeTitle') : 'About';
            const body = window.t ? window.t('readMeContent') : 'Content...';

            modalContent.innerHTML = `
                <h2 style="margin-top:0; color:var(--status-blue); margin-bottom: 20px;">${title}</h2>
                <div style="line-height: 1.6; font-size: 1rem; opacity: 0.9;">
                    ${body}
                </div>
                <button id="close-readme-modal" style="position: absolute; top: 15px; right: 15px; background:none; border:none; color:white; font-size: 1.5rem; cursor:pointer;">&times;</button>
            `;

            modalOverlay.appendChild(modalContent);
            document.body.appendChild(modalOverlay);

            const close = () => document.body.removeChild(modalOverlay);
            document.getElementById('close-readme-modal').onclick = close;
            modalOverlay.onclick = (e) => {
                if (e.target === modalOverlay) close();
            };
        };
        rightGrp.appendChild(btnReadMe);

        // Version Selector
        const versionSelect = document.createElement('select');
        versionSelect.className = 'version-selector';
        // Use translated "Current" text
        const currentLabel = window.t ? window.t('currentVersion') : 'Current (Editable)';
        versionSelect.innerHTML = `<option value="current">${currentLabel}</option>`;


        const renderVersionOptions = () => {
            // Clear existing options except first
            while (versionSelect.options.length > 1) {
                versionSelect.remove(1);
            }
            if (window.dashboardData.baselines && window.dashboardData.baselines.length > 0) {
                window.dashboardData.baselines.forEach(b => {
                    const date = new Date(b.date).toLocaleDateString();
                    const opt = document.createElement('option');
                    opt.value = b.id;
                    opt.textContent = `${date} — ${b.label || 'Snapshot'}`;
                    versionSelect.appendChild(opt);
                });
            }
        };
        renderVersionOptions();

        // Delete Baseline Button (initially hidden)
        const btnDeleteBaseline = document.createElement('button');
        btnDeleteBaseline.className = 'btn-delete-baseline';
        btnDeleteBaseline.title = window.t ? window.t('deleteBaseline') : 'Delete Baseline';
        btnDeleteBaseline.innerHTML = '🗑️'; // Use an icon for compactness
        btnDeleteBaseline.className = 'btn-delete-baseline btn-premium';
        btnDeleteBaseline.title = window.t ? window.t('deleteBaseline') : 'Delete Baseline';
        btnDeleteBaseline.innerHTML = '🗑️'; // Use an icon for compactness
        btnDeleteBaseline.style.background = '#FF4136'; // Specific color override
        btnDeleteBaseline.style.display = 'none';
        btnDeleteBaseline.style.marginLeft = '5px';

        btnDeleteBaseline.onclick = () => {
            const val = versionSelect.value;
            if (val === 'current') return;

            const confirmMsg = window.t ? window.t('confirmDeleteBaseline') : 'Are you sure you want to delete this baseline?';
            if (confirm(confirmMsg)) {
                // Logic to delete
                // We need to look at the ORIGINAL data structure, which is preserved in window.dashboardData.baselines 
                // even when we are in read-only mode (thanks to enterReadOnlyMode logic, but better to be safe).
                // Actually, when in read-only mode, 'window.dashboardData' IS a snapshot. 
                // BUT, we preserved 'baselines' array reference.

                // However, to be absolutely safe and since we want to modify the PERMANENT storage, we should allow deletion only if we can access the master list.
                // Our enterReadOnlyMode kept 'baselines' attached to the snapshot object.

                const baselineId = val;
                const index = window.dashboardData.baselines.findIndex(b => b.id.toString() === baselineId);

                if (index !== -1) {
                    window.dashboardData.baselines.splice(index, 1);

                    // We need to save this change to localStorage. 
                    // We must be careful not to overwrite the "Editable" project configuration with the current Snapshot data if we were to just call saveData().
                    // However, 'saveData' saves 'window.dashboardData'. 
                    // If we are in Read-Only mode, 'window.dashboardData' is the snapshot... 
                    // WAIT! If we save now, we overwrite the live project with the snapshot! This is dangerous.

                    // CORRECT APPROACH:
                    // We need to load the LIVE data from localStorage, remove the baseline from IT, save IT, and then refresh.

                    const savedKey = window.ProjectManager ? window.ProjectManager.getCurrentProjectId() : 'dashboard_data';
                    const savedParams = localStorage.getItem(savedKey);
                    if (savedParams) {
                        const liveData = JSON.parse(savedParams);
                        // Remove baseline from live data
                        if (liveData.baselines) {
                            const liveIndex = liveData.baselines.findIndex(b => b.id.toString() === baselineId);
                            if (liveIndex !== -1) {
                                liveData.baselines.splice(liveIndex, 1);
                                localStorage.setItem(savedKey, JSON.stringify(liveData));
                                console.log("Deleted baseline from storage.");
                            }
                        }
                    }

                    // Now switch back to current to be safe and refresh everything
                    versionSelect.value = 'current';
                    exitReadOnlyMode();
                    // Re-render options
                    renderVersionOptions();
                    btnDeleteBaseline.style.display = 'none';
                }
            }
        };

        versionSelect.onchange = (e) => {
            const val = e.target.value;
            if (val === 'current') {
                exitReadOnlyMode();
                btnDeleteBaseline.style.display = 'none';
            } else {
                const baseline = window.dashboardData.baselines.find(b => b.id.toString() === val);
                if (baseline) {
                    // Pass date string for header update
                    const dateObj = new Date(baseline.date);
                    const localeMap = { 'en': 'en-US', 'es': 'es-ES', 'jp': 'ja-JP', 'pt': 'pt-BR' };
                    const locale = localeMap[window.currentLanguage] || 'pt-BR';
                    const dateStr = dateObj.toLocaleDateString(locale, {
                        day: '2-digit', month: 'long', year: 'numeric'
                    });
                    enterReadOnlyMode(baseline.data, dateStr);
                    btnDeleteBaseline.style.display = 'flex';
                }
            }
        };
        rightGrp.appendChild(versionSelect);
        rightGrp.appendChild(btnDeleteBaseline);

        // Create Baseline Button
        const btnCreateBaseline = document.createElement('button');
        btnCreateBaseline.className = 'btn-create-baseline';
        btnCreateBaseline.textContent = window.t ? window.t('createBaseline') : 'Criar Baseline';
        btnCreateBaseline.className = 'btn-create-baseline btn-premium';
        btnCreateBaseline.textContent = window.t ? window.t('createBaseline') : 'Criar Baseline';
        btnCreateBaseline.style.color = 'var(--status-blue)'; // Text color specific override if needed, or let class handle it
        btnCreateBaseline.style.borderColor = 'var(--status-blue)';
        btnCreateBaseline.onmouseover = () => {
            btnCreateBaseline.style.backgroundColor = 'var(--status-blue)';
            btnCreateBaseline.style.color = '#000';
        };
        btnCreateBaseline.onmouseout = () => {
            btnCreateBaseline.style.backgroundColor = 'var(--glass-bg)';
            btnCreateBaseline.style.color = 'var(--status-blue)';
        };
        btnCreateBaseline.onclick = () => {
            showBaselineModal();
        };
        rightGrp.appendChild(btnCreateBaseline);

        // Backup Button
        const btnBackup = document.createElement('button');
        btnBackup.innerHTML = '💾 ' + (window.t ? window.t('backup') : 'Backup');
        btnBackup.title = window.t ? window.t('backup') : 'Backup (Export)';
        btnBackup.className = 'btn-premium';
        btnBackup.style.padding = '5px 15px'; // Ensure padding for text
        btnBackup.onclick = () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.dashboardData, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            const date = new Date().toISOString().split('T')[0];
            const name = (window.dashboardData.projectName || 'Project').replace(/\s+/g, '_');
            downloadAnchorNode.setAttribute("download", `${name}_backup_${date}.json`);
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        };
        rightGrp.appendChild(btnBackup);

        // Print Button
        const btnPrint = document.createElement('button');
        btnPrint.className = 'btn-print';
        btnPrint.textContent = window.t ? window.t('printReport') : 'Imprimir Relatório';
        btnPrint.className = 'btn-print btn-premium';
        btnPrint.textContent = window.t ? window.t('printReport') : 'Imprimir Relatório';
        btnPrint.style.backgroundColor = '#2ECC40';
        btnPrint.style.border = 'none';
        // Hover handled by CSS or specific override if needed
        btnPrint.onmouseover = () => btnPrint.style.backgroundColor = '#28b037';
        btnPrint.onmouseout = () => btnPrint.style.backgroundColor = '#2ECC40';

        btnPrint.onclick = () => {
            window.print();
        };





        // Generic Toast Function removed (moved to modalUtils.js)

        // Save Button Removed per user request (Auto-Save enabled)
        // rightGrp.appendChild(btnSave);
        rightGrp.appendChild(btnPrint);
        toolbar.appendChild(rightGrp);

        // 2.1 Create Tab Navigation
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'tabs-container';

        const tabsNav = document.createElement('div');
        tabsNav.className = 'tabs-nav';
        tabsNav.style.display = 'flex';
        tabsNav.style.justifyContent = 'space-between'; // Ensure separation
        tabsNav.style.alignItems = 'center';

        const tabsGroup = document.createElement('div');
        tabsGroup.style.display = 'flex';
        tabsGroup.style.gap = '5px';

        const overviewTab = document.createElement('button');
        overviewTab.className = 'tab-button active';
        const overviewLabel = window.t ? window.t('overview') : 'Overview';
        overviewTab.innerHTML = `<span style="margin-right:8px;">🏠</span> ${overviewLabel}`;
        overviewTab.dataset.tab = 'overview';

        const successPlanTab = document.createElement('button');
        successPlanTab.className = 'tab-button';
        const successPlanLabel = window.t ? window.t('successPlan') : 'Success Plan';
        successPlanTab.innerHTML = `<span style="margin-right:8px;">🎯</span> ${successPlanLabel}`;
        successPlanTab.dataset.tab = 'successplan';

        const orgMapTab = document.createElement('button');
        orgMapTab.className = 'tab-button';
        const orgMapLabel = window.t ? window.t('orgMap') : 'Mapa Organizacional';
        orgMapTab.innerHTML = `<span style="margin-right:8px;">👥</span> ${orgMapLabel}`;
        orgMapTab.dataset.tab = 'orgmap';

        const logbookTab = document.createElement('button');
        logbookTab.className = 'tab-button';
        const logbookLabel = window.t ? window.t('logbook') : 'Diário de Bordo';
        logbookTab.innerHTML = `<span style="margin-right:8px;">📖</span> ${logbookLabel}`;
        logbookTab.dataset.tab = 'logbook';

        const useCasesTab = document.createElement('button');
        useCasesTab.className = 'tab-button';
        const useCasesLabel = window.getUIText ? window.getUIText('useCases') : 'Use Cases';
        useCasesTab.innerHTML = `<span style="margin-right:8px;">💡</span> ${useCasesLabel}`;
        useCasesTab.dataset.tab = 'usecases';

        useCasesTab.dataset.tab = 'usecases';

        tabsGroup.appendChild(overviewTab);
        tabsGroup.appendChild(successPlanTab);
        tabsGroup.appendChild(logbookTab);
        tabsGroup.appendChild(useCasesTab);
        tabsGroup.appendChild(orgMapTab);

        tabsNav.appendChild(tabsGroup);

        // Language Selector in Tabs
        const langContainer = document.createElement('div');
        langContainer.className = 'language-selector';
        langContainer.style.cssText = 'position: relative; top: 0; right: 0; display: flex; align-items: center; gap: 5px;';
        langContainer.innerHTML = `
            <label style="margin-right: 5px;">🌐</label>
            <button class="lang-btn ${window.currentLanguage === 'pt' ? 'active' : ''}" data-lang="pt">PT</button>
            <button class="lang-btn ${window.currentLanguage === 'en' ? 'active' : ''}" data-lang="en">EN</button>
            <button class="lang-btn ${window.currentLanguage === 'es' ? 'active' : ''}" data-lang="es">ES</button>
            <button class="lang-btn ${window.currentLanguage === 'jp' ? 'active' : ''}" data-lang="jp">JP</button>
        `;
        tabsNav.appendChild(langContainer);

        // Re-attach Language selector event handlers (since we removed previous ones)
        setTimeout(() => {
            langContainer.querySelectorAll('.lang-btn').forEach(btn => {
                btn.onclick = () => {
                    const newLang = btn.dataset.lang;
                    if (newLang !== window.currentLanguage) {
                        window.currentLanguage = newLang;
                        localStorage.setItem('dashboard_language', newLang);

                        if (window.getDefaultHeaders) {
                            const sections = ['tasks', 'support', 'initiatives', 'opportunities', 'engagement', 'risks', 'entitlement'];
                            sections.forEach(sectionKey => {
                                if (window.dashboardData[sectionKey]) {
                                    const defaultHeaders = window.getDefaultHeaders(sectionKey);
                                    if (defaultHeaders && defaultHeaders.length > 0) {
                                        const hasIdColumn = window.dashboardData[sectionKey].columns &&
                                            (window.dashboardData[sectionKey].columns[0] === 'id' ||
                                                window.dashboardData[sectionKey].headers[0] === 'N.');
                                        if (hasIdColumn) {
                                            window.dashboardData[sectionKey].headers = ['N.', ...defaultHeaders];
                                        } else {
                                            window.dashboardData[sectionKey].headers = defaultHeaders;
                                        }
                                    }
                                }
                            });
                        }
                        saveData();
                        window.location.reload();
                    }
                };
            });
        }, 0);
        tabsContainer.appendChild(tabsNav);

        app.appendChild(tabsContainer);

        // Initialize Last Update Display
        updateHeaderLastUpdate();

        // 2.2 Create Tab Content Containers
        // 2.2 Create Tab Content Containers
        const overviewContent = document.createElement('div');
        overviewContent.className = 'tab-content active';
        overviewContent.id = 'overview-tab';

        const successPlanContainer = document.createElement('div');
        successPlanContainer.className = 'tab-content';
        successPlanContainer.id = 'successplan-tab';

        const logbookContainer = document.createElement('div');
        logbookContainer.className = 'tab-content';
        logbookContainer.id = 'logbook-tab';

        // Move toolbar to overview tab
        overviewContent.appendChild(toolbar);

        // 2.5 Indicators Component (Health Score, Adoption, Licenses)
        // Create wrapper for indicators with header
        const indicatorsWrapper = document.createElement('div');
        indicatorsWrapper.style.marginBottom = 'var(--spacing-lg)';

        const indicatorsHeader = document.createElement('div');
        indicatorsHeader.className = 'section-header';

        const indicatorsTitleWrapper = document.createElement('div');
        indicatorsTitleWrapper.className = 'section-title-wrapper';

        const indicatorsTitle = document.createElement('h3');
        indicatorsTitle.className = 'section-title';
        indicatorsTitle.className = 'section-title';
        indicatorsTitle.innerHTML = (window.getUIText ? window.getUIText('statusIndicators') : 'Status Indicators - Alteryx/Customer View') +
            (window.isClientView ? ' <span style="font-size:0.75rem; font-weight:normal; opacity:0.7; margin-left:8px;">(Perception / Not System Metric)</span>' : '');
        indicatorsTitle.style.margin = '0';

        indicatorsTitleWrapper.appendChild(indicatorsTitle);

        const indicatorsToggleBtn = document.createElement('button');
        indicatorsToggleBtn.className = 'btn-toggle-section';
        indicatorsToggleBtn.innerHTML = '<span class="toggle-icon">▼</span>';
        indicatorsToggleBtn.title = window.getUIText ? window.getUIText('minimizeSection') : 'Minimizar seção';
        indicatorsToggleBtn.onclick = () => {
            const isCollapsed = indicatorsSection.classList.contains('collapsed');

            if (isCollapsed) {
                indicatorsSection.classList.remove('collapsed');
                indicatorsToggleBtn.innerHTML = '<span class="toggle-icon">▼</span>';
                indicatorsToggleBtn.title = window.getUIText ? window.getUIText('minimizeSection') : 'Minimizar seção';
                indicatorsToggleBtn.classList.remove('collapsed');
            } else {
                indicatorsSection.classList.add('collapsed');
                indicatorsToggleBtn.innerHTML = '<span class="toggle-icon">▲</span>';
                indicatorsToggleBtn.title = window.getUIText ? window.getUIText('maximizeSection') : 'Maximizar seção';
                indicatorsToggleBtn.classList.add('collapsed');
            }
        };

        indicatorsHeader.appendChild(indicatorsTitleWrapper);
        indicatorsHeader.appendChild(indicatorsToggleBtn);
        indicatorsWrapper.appendChild(indicatorsHeader);

        const indicatorsSection = document.createElement('div');
        indicatorsSection.className = 'indicators-container';

        const createIndicatorSet = (title, key, options) => {
            const container = document.createElement('div');
            container.className = 'indicator-set';

            const h3 = document.createElement('h3');
            h3.textContent = title;
            h3.style.marginBottom = '10px';
            h3.style.fontSize = '1.1rem';
            container.appendChild(h3);

            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'indicator-options-row';

            options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = `health-option ${opt.class}`;

                // Check against value (stable) OR label (legacy support)
                // Also handle case where data[key] matches the internal English key from autoTranslate but saved as text
                if (data[key] === opt.value || data[key] === opt.label) {
                    btn.classList.add('selected');
                }

                btn.textContent = opt.label;
                btn.onclick = () => {
                    optionsDiv.querySelectorAll('.health-option').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    data[key] = opt.value; // Save the stable value key
                    saveData();
                };
                optionsDiv.appendChild(btn);
            });

            container.appendChild(optionsDiv);
            return container;
        };

        const healthOps = [
            { value: 'healthy', label: window.getUIText('healthy'), class: 'healthy' },
            { value: 'attention', label: window.getUIText('attention'), class: 'attention' },
            { value: 'risk', label: window.getUIText('risk'), class: 'at-risk' }
        ];

        const adoptionOps = [
            { value: 'low', label: window.getUIText('low'), class: 'low' },
            { value: 'medium', label: window.getUIText('medium'), class: 'medium' },
            { value: 'high', label: window.getUIText('high'), class: 'high' }
        ];

        const licenseOps = [
            { value: 'low', label: window.getUIText('low'), class: 'low' },
            { value: 'medium', label: window.getUIText('medium'), class: 'medium' },
            { value: 'high', label: window.getUIText('high'), class: 'high' }
        ];

        const supportOps = [
            { value: 'underControl', label: window.getUIText('underControl'), class: 'high' },
            { value: 'attention', label: window.getUIText('attention'), class: 'medium' },
            { value: 'critical', label: window.getUIText('critical'), class: 'low' }
        ];

        const execOps = [
            { value: 'yes', label: window.getUIText('yes'), class: 'high' },
            { value: 'partial', label: window.getUIText('partial'), class: 'medium' },
            { value: 'no', label: window.getUIText('no'), class: 'low' }
        ];

        const entitlementOps = [
            { value: 'low', label: window.getUIText('low'), class: 'low' },
            { value: 'medium', label: window.getUIText('medium'), class: 'medium' },
            { value: 'high', label: window.getUIText('high'), class: 'high' }
        ];

        indicatorsSection.appendChild(createIndicatorSet(window.getUIText('healthScore'), "healthScore", healthOps));
        indicatorsSection.appendChild(createIndicatorSet(window.getUIText('adoptionLevel'), "adoptionLevel", adoptionOps));
        indicatorsSection.appendChild(createIndicatorSet(window.getUIText('licenseUtilization'), "licenseLevel", licenseOps));
        indicatorsSection.appendChild(createIndicatorSet(window.getUIText('supportCases'), "supportStatus", supportOps));
        indicatorsSection.appendChild(createIndicatorSet(window.getUIText('executiveEngagement'), "execEngagement", execOps));
        indicatorsSection.appendChild(createIndicatorSet(window.getUIText('entitlementUsage'), "entitlementUsage", entitlementOps));

        indicatorsWrapper.appendChild(indicatorsSection);
        overviewContent.appendChild(indicatorsWrapper);

        // --- Strategic Goals Section (Moved from Success Plan) ---
        const goalsSection = document.createElement('div');
        goalsSection.className = 'data-section';
        goalsSection.style.marginBottom = 'var(--spacing-lg)';

        const goalsSectionTitle = document.createElement('h3');
        goalsSectionTitle.className = 'section-title';
        goalsSectionTitle.textContent = window.getUIText ? window.getUIText('strategicGoals') : 'Objetivos Estratégicos';
        goalsSection.appendChild(goalsSectionTitle);

        // Add Goal Button
        const addGoalBtn = document.createElement('button');
        addGoalBtn.className = 'btn-add-goal';
        addGoalBtn.innerHTML = '+ ' + (window.getUIText ? window.getUIText('addGoal') : 'Adicionar Objetivo');
        addGoalBtn.className = 'btn-add-goal btn-premium primary';
        addGoalBtn.innerHTML = '+ ' + (window.getUIText ? window.getUIText('addGoal') : 'Adicionar Objetivo');
        addGoalBtn.style.marginBottom = '20px';
        // Hover handled by CSS class

        goalsSection.appendChild(addGoalBtn);

        const goalsGrid = document.createElement('div');
        goalsGrid.className = 'goals-grid';
        goalsSection.appendChild(goalsGrid);

        // Function to render goals
        const renderGoals = () => {
            goalsGrid.innerHTML = '';
            const goals = window.dashboardData.strategicGoals.cards;

            goals.forEach((goal, index) => {
                const goalCard = document.createElement('div');
                goalCard.className = 'goal-card';

                // Card Header with Title and Delete Button
                const cardHeader = document.createElement('div');
                cardHeader.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            `;

                const titleInput = document.createElement('input');
                titleInput.type = 'text';
                titleInput.value = goal.title;
                titleInput.className = 'goal-title-input';
                titleInput.style.cssText = `
                background: transparent;
                border: none;
                color: var(--table-header-bg);
                font-size: 1.2rem;
                font-weight: 600;
                font-family: inherit;
                width: 100%;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.3s ease;
            `;
                titleInput.onfocus = () => {
                    titleInput.style.background = 'rgba(255, 255, 255, 0.05)';
                    titleInput.style.outline = '2px solid var(--table-header-bg)';
                };
                titleInput.onblur = () => {
                    titleInput.style.background = 'transparent';
                    titleInput.style.outline = 'none';
                };
                titleInput.oninput = (e) => {
                    window.dashboardData.strategicGoals.cards[index].title = e.target.value;
                    saveData();
                };

                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = '🗑️';
                deleteBtn.className = 'btn-delete-goal';
                deleteBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                font-size: 1.2rem;
                padding: 4px 8px;
                border-radius: 4px;
                transition: all 0.2s;
                opacity: 0.6;
            `;
                deleteBtn.onmouseover = () => {
                    deleteBtn.style.background = '#ff4136';
                    deleteBtn.style.opacity = '1';
                };
                deleteBtn.onmouseout = () => {
                    deleteBtn.style.background = 'none';
                    deleteBtn.style.opacity = '0.6';
                };
                deleteBtn.onclick = () => {
                    if (confirm(`Deseja remover o objetivo "${goal.title}"?`)) {
                        window.dashboardData.strategicGoals.cards.splice(index, 1);
                        saveData();
                        renderGoals();
                    }
                };

                cardHeader.appendChild(titleInput);
                cardHeader.appendChild(deleteBtn);
                goalCard.appendChild(cardHeader);

                // Content Area (Editable)
                const contentArea = document.createElement('textarea');
                contentArea.value = goal.content;
                contentArea.className = 'goal-content-area';
                contentArea.style.cssText = `
                width: 100%;
                min-height: 150px;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 6px;
                color: rgba(255, 255, 255, 0.9);
                font-family: inherit;
                font-size: 0.95rem;
                padding: 12px;
                resize: vertical;
                line-height: 1.6;
                transition: all 0.3s ease;
            `;
                contentArea.onfocus = () => {
                    contentArea.style.background = 'rgba(255, 255, 255, 0.05)';
                    contentArea.style.borderColor = 'var(--table-header-bg)';
                    contentArea.style.outline = 'none';
                };
                contentArea.onblur = () => {
                    contentArea.style.background = 'rgba(255, 255, 255, 0.03)';
                    contentArea.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                };
                contentArea.oninput = (e) => {
                    window.dashboardData.strategicGoals.cards[index].content = e.target.value;
                    saveData();
                };

                goalCard.appendChild(contentArea);
                goalsGrid.appendChild(goalCard);
            });
        };

        // Add Goal Handler
        addGoalBtn.onclick = () => {
            window.dashboardData.strategicGoals.cards.push({
                title: window.t ? window.t('newObjective') : "Novo Objetivo",
                content: window.t ? window.t('describeObjectives') : "Descreva seus objetivos aqui..."
            });
            saveData();
            renderGoals();
        };

        // Initial render
        renderGoals();

        overviewContent.appendChild(goalsSection);

        // 3. Render Dashboard Grid
        const grid = document.createElement('div');
        grid.className = 'dashboard-grid';
        overviewContent.appendChild(grid);

        // Append both tab contents to app
        // app.appendChild(overviewContent); // Already appended to tabsContainer
        // app.appendChild(successPlanContent); // Already appended to tabsContainer
        // app.appendChild(logbookContent); // Already appended to tabsContainer

        // 2.2 Create Tab Content Containers (moved and modified)
        // overviewContent is already created and has toolbar and other elements
        // successPlanContent and logbookContent are also created above

        const planContent = window.renderSuccessPlan(data);
        planContent.style.display = 'none';
        planContent.id = 'successplan-tab-content'; // Give it an ID for easier access

        const orgMapContent = window.renderOrgMap ? window.renderOrgMap() : document.createElement('div');
        orgMapContent.style.display = 'none';
        orgMapContent.id = 'orgmap-tab-content'; // Give it an ID

        const logbookContentElement = window.renderLogbook(data); // Renamed to avoid conflict with logbookContent variable
        logbookContentElement.style.display = 'none';
        logbookContentElement.id = 'logbook-tab-content'; // Give it an ID

        const useCasesContentElement = window.renderUseCases ? window.renderUseCases() : document.createElement('div');
        useCasesContentElement.style.display = 'none';
        useCasesContentElement.id = 'usecases-tab-content';

        tabsContainer.appendChild(overviewContent);
        tabsContainer.appendChild(planContent);
        tabsContainer.appendChild(orgMapContent);
        tabsContainer.appendChild(logbookContentElement); // Append the new element
        tabsContainer.appendChild(useCasesContentElement);

        // Tab Switching Logic
        function switchTab(tabName) {
            // ... (keep existing logic)
            // Auto-save when leaving current tab/switching
            if (typeof saveData === 'function') {
                saveData();
                const msg = window.t ? window.t('dataSaved') : 'Dados salvos com sucesso!';
                if (window.showToast) window.showToast(msg);
            }

            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));

            overviewContent.style.display = 'none';
            planContent.style.display = 'none';
            orgMapContent.style.display = 'none';
            logbookContentElement.style.display = 'none';
            useCasesContentElement.style.display = 'none';

            if (tabName === 'overview') {
                overviewTab.classList.add('active');
                refreshDashboard(); // Force re-render to reflect changes from other tabs (e.g. Success Plan)
                overviewContent.style.display = 'grid'; // Grid for overview
            } else if (tabName === 'successplan') {
                successPlanTab.classList.add('active');
                planContent.innerHTML = ''; // Clear current content
                planContent.appendChild(window.renderSuccessPlan(window.dashboardData)); // Re-render with latest data
                planContent.style.display = 'block';
            } else if (tabName === 'orgmap') {
                orgMapTab.classList.add('active');
                orgMapContent.style.display = 'block';
            } else if (tabName === 'logbook') {
                logbookTab.classList.add('active');
                logbookContentElement.style.display = 'block';
            } else if (tabName === 'usecases') {
                useCasesTab.classList.add('active');
                useCasesContentElement.style.display = 'block';
            }
            localStorage.setItem('active_tab', tabName);
        }

        overviewTab.onclick = () => switchTab('overview');
        successPlanTab.onclick = () => switchTab('successplan');
        orgMapTab.onclick = () => switchTab('orgmap');
        logbookTab.onclick = () => switchTab('logbook');
        useCasesTab.onclick = () => switchTab('usecases');

        const savedTab = localStorage.getItem('active_tab') || 'overview';
        switchTab(savedTab);

        function refreshDashboard() {
            grid.innerHTML = ''; // Clear current grid
            const data = window.dashboardData;


            // Render Top Section (Full Width Tables)
            grid.appendChild(render(data.tasks, 'tasks'));

            // LINKING LOGIC: Populate Initiatives from Tactical Roadmap
            if (data.tacticalRoadmap && data.tacticalRoadmap.rows) {
                // Include Completed and Planned as 'Active' for display purposes in Overview
                const activeStatuses = ['active', 'em andamento', 'in progress', 'en progreso', 'em progresso', 'completed', 'concluído', 'done', 'finalizado', 'planned', 'planejado', 'planificado', 'cancelled', 'cancelado', 'cancelada'];
                // Filter rows that are active AND not archived
                data.initiatives.rows = data.tacticalRoadmap.rows.filter(row => {
                    const s = (row.status || '').toLowerCase().trim();
                    // Fix: Ensure 'not planned' does NOT match 'planned' via includes()
                    if (s.includes('not') || s.includes('não')) return false;

                    return !row.archived && activeStatuses.some(as => s.includes(as));
                });
            }

            const initiativesTable = render(data.initiatives, 'initiatives');
            grid.appendChild(initiativesTable);

            // License Utilization (Hours Balance)
            renderHoursBalance(initiativesTable);

            grid.appendChild(render(data.risks, 'risks'));

            grid.appendChild(render(data.support, 'support'));

            // USER REQUEST: Milestones moved here from Success Plan
            if (window.renderMilestonesComponent) {
                grid.appendChild(window.renderMilestonesComponent(window.dashboardData));
            }

            // Render Bottom Section (Two Column Tables)
            const bottomRow = document.createElement('div');
            bottomRow.style.display = 'grid';
            bottomRow.style.gridTemplateColumns = '1fr 1fr';
            bottomRow.style.gap = 'var(--spacing-lg)';

            bottomRow.appendChild(render(data.engagement, 'engagement'));
            bottomRow.appendChild(render(data.opportunities, 'opportunities'));
            grid.appendChild(bottomRow);
        }

        // Refresh Success Plan if active or clear it to force re-render on next visit
        const successPlanContent = document.getElementById('success-plan-content');
        if (successPlanContent) {
            successPlanContent.innerHTML = ''; // Clear existing
            const spBtn = document.querySelector('button[data-tab="successplan"]');
            if (spBtn && spBtn.classList.contains('active') && window.renderSuccessPlan) {
                successPlanContent.appendChild(window.renderSuccessPlan());
            }
        }

        // Refresh Logbook if active
        const logbookContent = document.getElementById('logbook-tab');
        if (logbookContent) {
            logbookContent.innerHTML = '';
            const logBtn = document.querySelector('button[data-tab="logbook"]');
            if (logBtn && logBtn.classList.contains('active') && window.renderLogbook) {
                logbookContent.appendChild(window.renderLogbook());
            }
        }

        // Refresh Use Cases if active
        // Simplest way: just rely on internal state of useCases.js, but if we want to ensure fresh data load:
        // Actually, renderUseCases handles its own rendering.
        const activeTab = localStorage.getItem('active_tab');
        if (activeTab === 'usecases') {
            // Re-render if needed or just let it stay. 
            // It might be good to re-fetch if we suspect external changes, but Use Cases is usually isolated.
            // Let's leave it for now.
        }

        function renderHoursBalance(container) {
            const totalAvailable = data.initiatives.totalHoursPool || 80;
            let usedHours = 0;

            data.initiatives.rows.forEach(row => {
                if (row.archived) return;
                const h = parseFloat(String(row.estHours || row.hours || 0).replace(',', '.'));
                if (!isNaN(h)) usedHours += h;
            });

            const balance = totalAvailable - usedHours;
            const percentUsed = Math.min(100, (usedHours / totalAvailable) * 100);

            // Determine Color
            let statusClass = 'green';
            if (percentUsed > 80) statusClass = 'red';
            else if (percentUsed > 50) statusClass = 'orange';

            let targetContainer = container.querySelector('.section-content');
            if (!targetContainer) targetContainer = container;

            let balanceDiv = targetContainer.querySelector('.hours-balance-container');
            if (!balanceDiv) {
                balanceDiv = document.createElement('div');
                balanceDiv.className = 'hours-balance-container';
                // Insert before the clearfix if it exists to keep layout clean, or just append
                targetContainer.appendChild(balanceDiv);
            }

            balanceDiv.innerHTML = `
            <div class="hours-config" style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                <label style="font-size: 0.85rem; color: rgba(255,255,255,0.6); font-weight: normal;">${window.getUIText ? window.getUIText('totalHoursTokens') : 'Total Horas/Tokens:'}</label>
                <div class="input-total-hours" style="min-width: 40px; color: #fff; font-weight: bold; background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); cursor: default;">${totalAvailable}</div>
            </div>
            <div class="hours-info">
                <span class="hours-text">${window.getUIText ? window.getUIText('balance') : 'Saldo:'} <strong>${balance.toFixed(1)}</strong></span>
                <span class="hours-text">${percentUsed.toFixed(1)}% ${window.getUIText ? window.getUIText('percentUsed') : 'Utilizado'}</span>
            </div>
            <div class="hours-progress-track">
                <div class="hours-progress-fill ${statusClass}" style="width: ${percentUsed}%"></div>
            </div>
        `;

            // Input onchange removed as it is now read-only in Overview
            // Adjustment moved to Success Plan tab per user request.
        }

        // Initial Render
        refreshDashboard();

        // --- Event Listeners for Editing ---
        grid.addEventListener('input', (e) => {
            const target = e.target;
            // Check if it's an editable element with data bindings
            if (target.dataset.section && target.dataset.row !== undefined && target.dataset.key) {
                const section = target.dataset.section;
                const row = parseInt(target.dataset.row);
                const key = target.dataset.key;

                // Use value for inputs/selects, innerText for contentEditable
                let newValue = (target.tagName === 'INPUT' || target.tagName === 'SELECT') ? target.value : target.innerText;

                // Converter AAAA-MM-DD de volta para DD/MM/AAAA se for um input de data
                if (target.tagName === 'INPUT' && target.type === 'date' && newValue.includes('-')) {
                    const parts = newValue.split('-');
                    if (parts.length === 3) {
                        newValue = `${parts[2]}/${parts[1]}/${parts[0]}`;
                    }
                }

                // Update global data object
                window.dashboardData[section].rows[row][key] = newValue;
                saveData(); // Auto-save on every keystroke

                // Atualizar o balanço de horas em tempo real se for a seção de iniciativas
                if (section === 'initiatives') {
                    const initiativesSection = target.closest('.data-section');
                    if (initiativesSection) {
                        renderHoursBalance(initiativesSection);
                    }
                }

                // Atualizar cor do status em tempo real se for um badge
                if (target.classList.contains('badge') && key === 'status') {
                    const statusColor = getStatusColorClass(newValue);
                    target.className = `badge ${statusColor}`;
                }
            }
        });

        // Handle Add Row Event
        document.addEventListener('addRow', (e) => {
            const sectionKey = e.detail.section;

            // SPECIAL HANDLER FOR INITIATIVES (Linkage to Roadmap)
            // SPECIAL HANDLER FOR INITIATIVES (Linkage to Roadmap)
            if (sectionKey === 'initiatives') {
                const roadmap = window.dashboardData.tacticalRoadmap;
                // Find items that are NOT currently active in the Dashboard
                // We interpret "active" as visible in the dashboard.
                // Dashboard shows: active, em andamento, completed, done, etc.
                // So we want to add items that are 'planned', 'notPlanned', or 'cancelled'.
                // Actually, we usually don't add cancelled items.
                // Let's filter for items that are 'planned' or 'notPlanned'.

                // Allow matching strictly against 'active', 'in progress', 'completed' to Exclude them.
                // But simplify: Show anything that isn't already "In Progress" or "Done".
                const excludeStatuses = ['active', 'em andamento', 'in progress', 'completed', 'concluído', 'done', 'finalizado'];

                const availableItems = roadmap.rows.filter(r => {
                    const s = (r.status || '').toLowerCase();
                    return !r.archived && !excludeStatuses.some(ex => s.includes(ex));
                });

                if (availableItems.length === 0) {
                    // If no items, offer to go to Success Plan
                    const msg = (window.getUIText ? window.getUIText('noAvailableInitiatives') : 'Não há iniciativas disponíveis.') + '\n\n' + (window.getUIText ? window.getUIText('goToSuccessPlan') : "Ir para Success Plan?");
                    window.showConfirm(msg, () => {
                        const spTab = document.querySelector('button[data-tab="successplan"]');
                        if (spTab) spTab.click();
                    });
                    return;
                }

                // Simple PROMPT for selecting an initiative
                const modal = document.createElement('div');
                // ... (modal styles same as before) ...
                modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 10000;
                backdrop-filter: blur(4px);
            `;
                const content = document.createElement('div');
                content.style.cssText = `
                background: linear-gradient(135deg, #001f3f 0%, #001122 100%); 
                padding: 30px; 
                border-radius: 12px; 
                border: 1px solid var(--status-blue);
                min-width: 400px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.7);
                display: flex;
                flex-direction: column;
                gap: 20px;
            `;
                const title = document.createElement('h3');
                title.textContent = window.t ? window.t('selectInitiative') : 'Selecionar Iniciativa';
                title.style.margin = '0';
                title.style.color = 'white';
                title.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
                title.style.paddingBottom = '10px';

                const select = document.createElement('select');
                select.style.cssText = `
                width: 100%; 
                padding: 12px; 
                background: #003366; 
                color: white; 
                border: 1px solid rgba(255,255,255,0.3); 
                border-radius: 6px;
                font-size: 1rem;
                outline: none;
                cursor: pointer;
            `;

                // Placeholder option
                const placeholder = document.createElement('option');
                placeholder.value = "";
                placeholder.textContent = window.t ? window.t('selectPlaceholder') : "Selecione...";
                placeholder.disabled = true;
                placeholder.selected = true;
                select.appendChild(placeholder);

                availableItems.forEach((item, idx) => {
                    const opt = document.createElement('option');
                    const roadmapIndex = roadmap.rows.indexOf(item);
                    opt.value = roadmapIndex;
                    opt.textContent = item.tactic || (window.t ? window.t('noName') : 'Sem Nome');
                    opt.style.color = 'black';
                    select.appendChild(opt);
                });

                const btnContainer = document.createElement('div');
                btnContainer.style.display = 'flex';
                btnContainer.style.justifyContent = 'flex-end';
                btnContainer.style.gap = '15px';

                const btnCancel = document.createElement('button');
                btnCancel.textContent = window.t ? window.t('cancel') : 'Cancelar';
                btnCancel.style.cssText = `
                background: transparent; border: 1px solid rgba(255,255,255,0.3); color: white; padding: 8px 16px; border-radius: 6px; cursor: pointer;
            `;
                btnCancel.onclick = () => document.body.removeChild(modal);

                const btnConfirm = document.createElement('button');
                btnConfirm.textContent = window.t ? window.t('add') : 'Adicionar';
                btnConfirm.style.cssText = `
                background: var(--status-blue); color: #001f3f; border: none; padding: 8px 24px; font-weight: bold; border-radius: 6px; cursor: pointer;
            `;

                btnConfirm.onclick = () => {
                    if (select.value === "") return;
                    const selectedIndex = parseInt(select.value);
                    if (!isNaN(selectedIndex)) {
                        // Activate the item
                        roadmap.rows[selectedIndex].status = 'active'; // Set to 'active' value
                        saveData();
                        refreshDashboard();
                    }
                    document.body.removeChild(modal);
                };

                btnContainer.appendChild(btnCancel);
                btnContainer.appendChild(btnConfirm);
                content.appendChild(title);
                content.appendChild(select);
                content.appendChild(btnContainer);
                modal.appendChild(content);
                document.body.appendChild(modal);
                return;
            }

            if (window.dashboardData[sectionKey]) {
                const rows = window.dashboardData[sectionKey].rows;
                let newRow = {};
                // 1. Base Strategy: Clone schema from first row if exists
                if (rows.length > 0) {
                    Object.keys(rows[0]).forEach(k => newRow[k] = "");
                    if (newRow.id !== undefined) newRow.id = rows.length + 1;
                } else {
                    // 2. Fallback Strategy: Define schema if table empty
                    newRow = { id: rows.length + 1, task: "", owner: "", status: "" };
                    if (sectionKey === 'tasks') newRow = { id: rows.length + 1, task: window.t ? window.t('newTask') : "Nova Tarefa", owner: "", startDate: "", endDate: "", status: "", statusColor: "" };
                    if (sectionKey === 'support') newRow = { id: "", case: "", desc: "", owner: "", status: "" };
                    // Initiatives handled above
                    if (sectionKey === 'opportunities') newRow = { id: rows.length + 1, name: window.t ? window.t('newOpportunity') : "Nova Oportunidade", owner: "" };
                    if (sectionKey === 'engagement') newRow = { id: rows.length + 1, name: window.t ? window.t('newEngagement') : "Novo Engajamento", owner: "" };
                    if (sectionKey === 'risks') newRow = { risk: "", category: "", impact: "", mitigation: "", status: "", statusColor: "" };
                }

                // 3. Specific Overrides (Apply defaults regardless of how row was created)
                if (sectionKey === 'tasks') {
                    newRow.task = window.t ? window.t('newTask') : "Nova Tarefa"; // Ensure title is set
                    if (newRow.hasOwnProperty('startDate')) {
                        const now = new Date();
                        newRow.startDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
                    }
                }

                rows.push(newRow);
                saveData();
                refreshDashboard();
            }
        });

        // Handle Archive/Unarchive Event
        document.addEventListener('toggleArchive', (e) => {
            const { section, row } = e.detail;
            if (window.dashboardData[section] && window.dashboardData[section].rows[row]) {
                const rowData = window.dashboardData[section].rows[row];

                // SPECIAL HANDLER FOR INITIATIVES
                // Because initiatives.rows is a FILTERED VIEW of tacticalRoadmap,
                // splicing it wouldn't work (it would reappear on refresh).
                // We must modify the object itself.
                if (section === 'initiatives') {
                    if (rowData.archived) {
                        rowData.archived = false;
                    } else {
                        rowData.archived = true;
                    }
                    saveData();
                    refreshDashboard();
                    return;
                }

                // Standard Logic for other sections
                // Helper to check if row is empty (ignore system keys)
                const isRowEmpty = (r) => {
                    const systemKeys = ['id', 'statusColor', 'archived'];
                    for (const key in r) {
                        if (!systemKeys.includes(key)) {
                            const val = r[key];
                            // If any user field has content, it's not empty
                            if (val && String(val).trim() !== "") {
                                return false;
                            }
                        }
                    }
                    return true;
                };

                if (isRowEmpty(rowData)) {
                    // Permanently delete if empty
                    const msg = window.getUIText ? window.getUIText('emptyRowDelete') : "Linha vazia detectada. Deseja excluir permanentemente?";
                    window.showConfirm(msg, () => {
                        window.dashboardData[section].rows.splice(row, 1);
                        saveData();
                        refreshDashboard();
                    });
                } else {
                    // Toggle archive status if not empty
                    rowData.archived = !rowData.archived;
                }

                saveData();
                refreshDashboard();
            }
        });

        // Handle Delete Row Event
        document.addEventListener('deleteRow', (e) => {
            const { section, row } = e.detail;
            if (window.dashboardData[section] && window.dashboardData[section].rows[row]) {

                // SPECIAL HANDLER FOR INITIATIVES
                if (section === 'initiatives') {
                    const rowData = window.dashboardData[section].rows[row];
                    // User Request: "O deletar aqui é logico... não é para deletar a linha em si"
                    // So we change status to 'notPlanned' (which hides it from Overview filter)
                    const msg = window.getUIText ? window.getUIText('removeInitiativeOverview') : "Remover do Overview? (A linha continuará no Success Plan)";
                    window.showConfirm(msg, () => {
                        rowData.status = 'notPlanned';
                        saveData();
                        refreshDashboard();
                    });
                    return;
                    return;
                }

                const msg = window.getUIText ? window.getUIText('confirmDeletePermanent') : "Deseja realmente excluir esta linha permanentemente? Esta ação não pode ser desfeita.";
                window.showConfirm(msg, () => {
                    window.dashboardData[section].rows.splice(row, 1);
                    saveData();
                    refreshDashboard();
                });
            }
        });

        // Handle Save Data Event (triggered by header edits)
        document.addEventListener('saveData', () => {
            saveData();
        });

        // --- Footer ---
        const footer = document.createElement('footer');
        footer.className = 'app-footer';

        const footerLogo = document.createElement('img');
        footerLogo.src = suzanoLogoSrc;
        footerLogo.alt = 'Suzano Logo';
        footerLogo.id = 'footer-logo-img';

        // Update text based on language if function exists
        const updateFooterText = () => {
            footerText.textContent = `${window.getUIText ? window.getUIText('designedBy') : 'Desenvolvido por'} Felipe Boni`;
        };

        const footerText = document.createElement('span');
        updateFooterText();

        footer.appendChild(footerLogo);
        footer.appendChild(footerText);

        app.appendChild(footer);

        // --- Versioning / Baseline Helper Functions ---

        function createBaseline(label) {
            // Deep copy current data
            const snapshot = JSON.parse(JSON.stringify(window.dashboardData));
            // Remove recursive reference to baselines
            delete snapshot.baselines;

            const baseline = {
                id: Date.now(),
                date: new Date().toISOString(),
                label: label || 'Snapshot',
                data: snapshot,
                createdBy: window.dashboardData.headerOwner || 'User'
            };

            if (!window.dashboardData.baselines) window.dashboardData.baselines = [];
            // Add new baseline to start of array
            window.dashboardData.baselines.unshift(baseline);

            saveData(); // Save the main data which now includes the new baseline
            renderVersionOptions(); // Refresh dropdown
            console.log("Baseline created:", baseline.id);
        }

        function enterReadOnlyMode(snapshotData, baselineDateStr) {
            console.log("Entering Read-Only Mode");
            document.body.classList.add('read-only-mode');

            // Preserve the baselines array
            const currentBaselines = window.dashboardData.baselines;

            // Load the snapshot data
            window.dashboardData = JSON.parse(JSON.stringify(snapshotData));
            window.dashboardData.baselines = currentBaselines;

            // Refresh UI
            refreshDashboard();

            // Update Date Header
            const dateEl = document.getElementById('header-date-display');
            if (dateEl && baselineDateStr) {
                const prefix = window.t ? window.t('baselineVersionPrefix') : 'VERSÃO BASELINE:';
                // Convert ISO date to locale string if needed, or just use what we passed
                dateEl.textContent = `${prefix} ${baselineDateStr}`;
                dateEl.style.color = '#ff4136'; // Visual cue
                dateEl.style.fontWeight = 'bold';
            }

            // Disable inputs explicitly
            document.querySelectorAll('input, select, textarea').forEach(el => {
                if (!el.classList.contains('version-selector')) {
                    el.disabled = true;
                }
            });
        }

        function exitReadOnlyMode() {
            console.log("Exiting Read-Only Mode");
            document.body.classList.remove('read-only-mode');

            // Reload fresh data from localStorage
            loadData();

            // Refresh UI
            refreshDashboard();
            renderVersionOptions();

            // Restore Date Header
            const dateEl = document.getElementById('header-date-display');
            if (dateEl) {
                const today = new Date();
                const dateStr = today.toLocaleDateString(window.currentLanguage === 'en' ? 'en-US' : 'pt-BR', {
                    day: '2-digit', month: 'long', year: 'numeric'
                });
                dateEl.textContent = dateStr;
                dateEl.style.color = ''; // Reset color
                dateEl.style.fontWeight = 'normal';
            }

            // Re-enable inputs
            document.querySelectorAll('input, select, textarea').forEach(el => el.disabled = false);
        }

        function showBaselineModal() {
            // Create backdrop
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-overlay';

            const content = document.createElement('div');
            content.className = 'modal-content';

            // Get date string
            const todayStr = new Date().toLocaleDateString(window.currentLanguage === 'en' ? 'en-US' : 'pt-BR');
            const defaultLabel = `Baseline (${todayStr})`;

            content.innerHTML = `
            <div class="modal-header">${window.t('createBaseline')}</div>
            <div class="modal-body">
                <div class="modal-input-group" id="group-baseline-label">
                    <label class="modal-label">${window.t('snapshotLabel')}</label>
                    <input type="text" id="baseline-label" class="modal-input" placeholder="e.g. Weekly Review, QBR..." value="${defaultLabel}">
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" id="btn-cancel-modal">${window.t('cancel')}</button>
                <button class="btn-primary" id="btn-confirm-baseline">${window.t('saveSnapshot')}</button>
            </div>
        `;

            backdrop.appendChild(content);
            document.body.appendChild(backdrop);

            const inputLabel = content.querySelector('#baseline-label');

            // Focus input
            setTimeout(() => inputLabel.focus(), 100);

            document.getElementById('btn-cancel-modal').onclick = () => {
                backdrop.remove();
            };

            document.getElementById('btn-confirm-baseline').onclick = () => {
                createBaseline(inputLabel.value);
                backdrop.remove();
                if (window.showAlert) {
                    window.showAlert(window.t('baselineCreated'));
                } else {
                    alert(window.t('baselineCreated'));
                }
            };

            // Allow Enter key to submit
            inputLabel.onkeypress = (e) => {
                if (e.key === 'Enter') {
                    document.getElementById('btn-confirm-baseline').click();
                }
            };
        }

        // --- Global Custom Confirm Dialog ---
        window.showConfirm = function (message, onConfirm) {
            // Create backdrop
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-overlay';
            backdrop.style.zIndex = '9999';

            const content = document.createElement('div');
            content.className = 'modal-content';
            content.style.maxWidth = '400px';

            content.innerHTML = `
            <div class="modal-header" style="background-color: var(--header-bg); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 15px; font-weight: bold;">
                ${window.t ? window.t('confirmAction') : 'Confirmação'}
            </div>
            <div class="modal-body" style="padding: 20px; font-size: 1rem; color: var(--text-white);">
                ${message}
            </div>
            <div class="modal-footer" style="padding: 15px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: flex-end; gap: 10px;">
                <button class="btn-secondary" id="btn-cancel-confirm" style="padding: 8px 16px; border: 1px solid rgba(255,255,255,0.3); background: transparent; color: white; border-radius: 4px; cursor: pointer;">${window.t ? window.t('cancel') : 'Cancelar'}</button>
                <button class="btn-primary" id="btn-ok-confirm" style="padding: 8px 16px; background: #ff4136; border: none; color: white; border-radius: 4px; cursor: pointer; font-weight: bold;">${window.t ? window.t('confirm') : 'Confirmar'}</button>
            </div>
         `;

            backdrop.appendChild(content);
            document.body.appendChild(backdrop);

            document.getElementById('btn-cancel-confirm').onclick = () => {
                backdrop.remove();
            };

            document.getElementById('btn-ok-confirm').onclick = () => {
                if (onConfirm) onConfirm();
                backdrop.remove();
            };
        };

        // --- Global Custom Alert Dialog ---
        window.showAlert = function (message) {
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-overlay';
            backdrop.style.zIndex = '9999';

            const content = document.createElement('div');
            content.className = 'modal-content';
            content.style.maxWidth = '400px';

            content.innerHTML = `
                <div class="modal-header" style="background-color: var(--header-bg); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 15px; font-weight: bold;">
                    ${window.t ? window.t('headerTitle') : 'Aviso'}
                </div>
                <div class="modal-body" style="padding: 20px; font-size: 1rem; color: var(--text-white);">
                    ${message}
                </div>
                <div class="modal-footer" style="padding: 15px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: flex-end;">
                    <button class="btn-primary" id="btn-ok-alert" style="padding: 8px 16px; background: var(--table-header-bg); border: none; color: white; border-radius: 4px; cursor: pointer; font-weight: bold;">OK</button>
                </div>
             `;

            backdrop.appendChild(content);
            document.body.appendChild(backdrop);

            document.getElementById('btn-ok-alert').onclick = () => {
                backdrop.remove();
            };
        };

    } catch (e) {
        console.error("CRITICAL INITIALIZATION ERROR:", e);
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `<div style="color:white; padding:20px; background:#85144b; font-family:sans-serif;">
                <h1>Critical Error</h1>
                <p>Failed to initialize dashboard.</p>
                <div style="background:rgba(0,0,0,0.3); padding:10px; border-radius:4px; overflow:auto;">
                    <pre>${e.stack}</pre>
                </div>
                <button style="margin-top:20px; padding:10px 20px; cursor:pointer;" onclick="localStorage.removeItem('suzano_projects_index'); location.reload()">Reset Projects Index</button>
            </div>`;
        }
    }
});
