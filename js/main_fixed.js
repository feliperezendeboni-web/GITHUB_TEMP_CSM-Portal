// Preserve initial data for new project creation
window.initialDashboardData = JSON.parse(JSON.stringify(window.dashboardData));

// Main entry point
document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');

    // --- Project System Integration ---
    if (window.ProjectManager) {
        window.ProjectManager.checkForLegacyData();
        const currentProjectId = window.ProjectManager.getCurrentProjectId();

        if (!currentProjectId) {
            window.renderProjectSelector(app);
            return;
        }
    }

    const STORAGE_KEY = window.ProjectManager.getCurrentProjectId();

    // --- Persistence Logic ---
    function loadData() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                // Merge saved data with defaults to ensure new top-level keys are preserved
                const savedData = JSON.parse(saved);
                window.dashboardData = Object.assign({}, window.dashboardData, savedData);

                // FORCE COLUMN DEFINITIONS (Fix for key order issues)
                // FORCE SCHEMA UPDATES (Headers and Columns)
                const schemaUpdates = {
                    opportunities: {
                        headers: ["N.", "Oportunidade", "Contato", "Comentário", "Status"],
                        columns: ["id", "name", "contact", "comment", "status"]
                    },
                    initiatives: {
                        headers: ["N.", "Iniciativa/Projeto", "Horas/Tokens", "Status"],
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
                // User reported that 'Archive' was causing items to disappear (trap).
                // We are switching to Logical Delete (status='notPlanned').
                // So we should unarchive everything in Tactical Roadmap to ensure they are visible in the Modal/Success Plan.
                if (window.dashboardData.tacticalRoadmap && window.dashboardData.tacticalRoadmap.rows) {
                    let recovered = 0;
                    window.dashboardData.tacticalRoadmap.rows.forEach(r => {
                        if (r.archived) {
                            r.archived = false;
                            // Ensure status is not active if it was archived, to keep it off overview?
                            // Or let it appear so user can decide?
                            // Safest: Set to 'notPlanned' if it was archived, so it mimics "Removed from View" but is available in Modal.
                            // But usually Archive implies it was done or later.
                            // Let's just unarchive. Status remains whatever it was.
                            // If it was 'active', it will reappear in Overview. User can then Delete (Logical Remove) it properly.
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
                // This ensures old localStorage data doesn't override our new column structure
                if (window.dashboardData.initiatives) {
                    window.dashboardData.initiatives.title = "Entitlements"; // User requested rename
                    window.dashboardData.initiatives.headers = ["Iniciativa / Projeto", "Categoria", "Envolvimento", "Horas/Tokens", "Mês Planejado", "Status"];
                    window.dashboardData.initiatives.columns = ["tactic", "category", "involvement", "estHours", "plannedMonth", "status"];
                    // Ensure total pool logic exists
                    if (window.dashboardData.initiatives.totalHoursPool === undefined) {
                        window.dashboardData.initiatives.totalHoursPool = 80;
                    }
                }

                console.log("Loaded data from localStorage");
            } catch (e) {
                console.error("Error loading saved data", e);
            }
        }
    }

    function saveData() {
        // Use ProjectManager to save (updates timestamp in index)
        if (window.ProjectManager) {
            window.ProjectManager.saveProjectData(STORAGE_KEY, window.dashboardData);
        } else {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(window.dashboardData));
        }
        console.log("Data saved to localStorage");
    }
    // Expose for other tabs
    window.saveData = saveData;

    function resetData() {
        if (confirm("Tem certeza? Isso apagará todas as suas edições e voltará ao padrão do arquivo.")) {
            localStorage.removeItem(STORAGE_KEY);
            window.location.reload();
        }
    }

    // Load persisted data BEFORE rendering
    loadData();

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
    let displayDate = today.toLocaleDateString(window.currentLanguage === 'en' ? 'en-US' : 'pt-BR', {
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

    header.innerHTML = `
        <div class="logo-wrapper" id="suzano-logo-wrapper" title="Clique para alterar a imagem" style="cursor: pointer;">
            <img src="${suzanoLogoSrc}" alt="Suzano Logo" id="suzano-logo-img">
        </div>
        <div class="title-container">
            <h1>Alteryx CS - Customer One Page</h1>
            <p class="header-date" id="header-date-display">${displayDate}</p>
            <div class="header-owner-container">
                <input type="text" class="header-owner-input" id="header-owner" placeholder="Nome do CSM (Responsável)" value="${data.headerOwner || ''}">
            </div>
        </div>
        <div class="logo-wrapper">
            <img src="images/alteryx_logo_v3.jpg" alt="Alteryx Logo">
        </div>
        <div class="language-selector" style="position: absolute; top: 20px; right: 20px;">
            <label>🌐</label>
            <button class="lang-btn ${window.currentLanguage === 'pt' ? 'active' : ''}" data-lang="pt">PT</button>
            <button class="lang-btn ${window.currentLanguage === 'en' ? 'active' : ''}" data-lang="en">EN</button>
            <button class="lang-btn ${window.currentLanguage === 'es' ? 'active' : ''}" data-lang="es">ES</button>
        </div>
    `;
    app.appendChild(header);

    // Create Read-Only Badge
    const badge = document.createElement('div');
    badge.className = 'read-only-badge';
    badge.innerText = 'Baseline — Read-only';
    document.body.appendChild(badge);

    // Language selector event handlers
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.onclick = () => {
            const newLang = btn.dataset.lang;
            if (newLang !== window.currentLanguage) {
                // Update language
                window.currentLanguage = newLang;
                localStorage.setItem('dashboard_language', newLang);

                // Update table headers to match new language
                if (window.getDefaultHeaders) {
                    const sections = ['tasks', 'support', 'initiatives', 'opportunities', 'engagement', 'risks', 'entitlement'];
                    sections.forEach(sectionKey => {
                        if (window.dashboardData[sectionKey]) {
                            const defaultHeaders = window.getDefaultHeaders(sectionKey);
                            if (defaultHeaders && defaultHeaders.length > 0) {
                                // Check if first column is an ID column
                                const hasIdColumn = window.dashboardData[sectionKey].columns &&
                                    (window.dashboardData[sectionKey].columns[0] === 'id' ||
                                        window.dashboardData[sectionKey].headers[0] === 'N.');

                                // Completely replace headers with translated ones
                                if (hasIdColumn) {
                                    window.dashboardData[sectionKey].headers = ['N.', ...defaultHeaders];
                                } else {
                                    window.dashboardData[sectionKey].headers = defaultHeaders;
                                }
                            }
                        }
                    });
                }

                // Explicitly save data before reload to ensure no data loss
                saveData();

                // Reload page to apply all translations
                window.location.reload();
            }
        };
    });

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
                alert("Logo atualizado com sucesso!");
            };
            reader.readAsDataURL(file);
        }
    };
    app.appendChild(fileInput);

    document.getElementById('suzano-logo-wrapper').onclick = () => {
        if (confirm("Deseja alterar o logo da Suzano?")) {
            fileInput.click();
        }
    };

    // 2. Render Toolbar (Reset Button)
    const toolbar = document.createElement('div');
    toolbar.style.display = 'flex';
    toolbar.style.justifyContent = 'space-between'; // Changed to space-between for back button
    toolbar.style.gap = '10px';
    toolbar.style.marginBottom = '20px';

    // Left side: Back to Projects
    const leftGrp = document.createElement('div');
    const btnBack = document.createElement('button');
    btnBack.textContent = '← Projetos';
    btnBack.style.cssText = `
        background: transparent;
        border: 1px solid rgba(255,255,255,0.3);
        color: white;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
    `;
    btnBack.onclick = () => {
        window.ProjectManager.setCurrentProjectId(null);
        window.location.reload();
    };
    leftGrp.appendChild(btnBack);
    toolbar.appendChild(leftGrp);

    // Right side: Actions
    const rightGrp = document.createElement('div');
    rightGrp.style.display = 'flex';
    rightGrp.style.gap = '10px';
    rightGrp.style.alignItems = 'center';

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
    btnDeleteBaseline.style.cssText = `
        background: #FF4136;
        border: none;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        display: none; /* Hidden by default */
        margin-left: 5px;
        align-items: center;
        justify-content: center;
    `;

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
                const dateStr = dateObj.toLocaleDateString(window.currentLanguage === 'en' ? 'en-US' : 'pt-BR', {
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
    btnCreateBaseline.style.cssText = `
        background-color: #001f3f;
        border: 1px solid var(--status-blue);
        color: var(--status-blue);
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s;
    `;
    btnCreateBaseline.onmouseover = () => {
        btnCreateBaseline.style.backgroundColor = 'var(--status-blue)';
        btnCreateBaseline.style.color = '#000';
    };
    btnCreateBaseline.onmouseout = () => {
        btnCreateBaseline.style.backgroundColor = '#001f3f';
        btnCreateBaseline.style.color = 'var(--status-blue)';
    };
    btnCreateBaseline.onclick = () => {
        showBaselineModal();
    };
    rightGrp.appendChild(btnCreateBaseline);

    btnPrint.onclick = () => {
        window.print();
    };

    // Client/Internal View Toggle
    const btnToggleView = document.createElement('button');
    btnToggleView.className = 'btn-toggle-view';
    btnToggleView.innerHTML = `👁️ ${window.isClientView ? 'Client View' : 'Internal View'}`;
    btnToggleView.title = "Toggle between Client-Ready and Internal View";
    btnToggleView.style.cssText = `
        background: ${window.isClientView ? '#2ECC40' : '#85144b'}; /* Green or Maroon */
        border: none;
        color: white;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        min-width: 110px;
    `;
    btnToggleView.onclick = () => {
        window.isClientView = !window.isClientView;
        btnToggleView.innerHTML = `👁️ ${window.isClientView ? 'Client View' : 'Internal View'}`;
        btnToggleView.style.background = window.isClientView ? '#2ECC40' : '#85144b';

        // Toggle Badge Visibility
        const badge = document.querySelector('.client-view-badge');
        if (badge) badge.style.display = window.isClientView ? 'block' : 'none';

        refreshDashboard();
    };
    rightGrp.appendChild(btnToggleView);



    // Generic Toast Function
    window.showToast = function (message) {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        container.appendChild(toast);

        // Show
        requestAnimationFrame(() => toast.classList.add('show'));

        // Hide after 3s
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentElement) toast.parentElement.removeChild(toast);
            }, 500);
        }, 3000);
    };

    // Save Button Removed per user request (Auto-Save enabled)
    // rightGrp.appendChild(btnSave);
    rightGrp.appendChild(btnPrint);
    toolbar.appendChild(rightGrp);

    // 2.1 Create Tab Navigation
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'tabs-container';

    const tabsNav = document.createElement('div');
    tabsNav.className = 'tabs-nav';

    const overviewTab = document.createElement('button');
    overviewTab.className = 'tab-button active';
    overviewTab.textContent = window.t ? window.t('overview') : 'Overview';
    overviewTab.dataset.tab = 'overview';

    const successPlanTab = document.createElement('button');
    successPlanTab.className = 'tab-button';
    successPlanTab.textContent = window.t ? window.t('successPlan') : 'Success Plan';
    successPlanTab.dataset.tab = 'successplan';

    const orgMapTab = document.createElement('button');
    orgMapTab.className = 'tab-button';
    const orgMapLabel = window.t ? window.t('orgMap') : 'Mapa Organizacional';
    orgMapTab.innerHTML = `<span style="margin-right:8px;">👥</span> ${orgMapLabel}`;
    orgMapTab.dataset.tab = 'orgmap';

    const logbookTab = document.createElement('button');
    logbookTab.className = 'tab-button';
    logbookTab.textContent = window.t ? window.t('logbook') : 'Diário de Bordo';
    logbookTab.dataset.tab = 'logbook';

    tabsNav.appendChild(overviewTab);
    tabsNav.appendChild(successPlanTab);
    tabsNav.appendChild(logbookTab);
    tabsNav.appendChild(orgMapTab);
    tabsContainer.appendChild(tabsNav);

    app.appendChild(tabsContainer);

    // 2.2 Create Tab Content Containers
    const overviewContent = document.createElement('div');
    overviewContent.className = 'tab-content active';
    overviewContent.id = 'overview-tab';

    const successPlanContent = document.createElement('div');
    successPlanContent.className = 'tab-content';
    successPlanContent.id = 'successplan-tab';

    const logbookContent = document.createElement('div');
    logbookContent.className = 'tab-content';
    logbookContent.id = 'logbook-tab';

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
    indicatorsTitle.innerHTML = (window.getUIText ? window.getUIText('statusIndicators') : 'Indicadores de Status') +
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
    addGoalBtn.style.cssText = `
        padding: 8px 16px;
        background: var(--table-header-bg);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        margin-bottom: 20px;
        transition: all 0.3s ease;
    `;
    addGoalBtn.onmouseover = () => {
        addGoalBtn.style.background = '#0056b3';
        addGoalBtn.style.transform = 'translateY(-2px)';
    };
    addGoalBtn.onmouseout = () => {
        addGoalBtn.style.background = 'var(--table-header-bg)';
        addGoalBtn.style.transform = 'translateY(0)';
    };

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
            title: "Novo Objetivo",
            content: "Descreva seus objetivos aqui..."
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

    tabsContainer.appendChild(overviewContent);
    tabsContainer.appendChild(planContent);
    tabsContainer.appendChild(orgMapContent);
    tabsContainer.appendChild(logbookContentElement); // Append the new element

    // Tab Switching Logic
    function switchTab(tabName) {
        // Auto-save when leaving current tab/switching
        if (typeof saveData === 'function') {
            saveData();
            // Optional: Show toast or silent save? User asked to remove explicit save flow, maybe silent is better or quick toast.
            // window.showToast(window.t('dataSaved')); // Let's keep it silent or brief.
            // Actually user asked for toast for explicit save. For auto-save, maybe less intrusive?
            // "seria possivel salvar automaticamente ao mudar de TAB... esse botão de SAVE talvez não seja necessario..."
            // I'll show the toast but maybe I should ensure it's not annoying.
            // user: "ajustar somente o texto da mensagem. 2-Seria possivel salvar automaticamente..."
            // The toast looks transient enough.
            const msg = window.t ? window.t('dataSaved') : 'Dados salvos com sucesso!';
            if (window.showToast) window.showToast(msg);
        }

        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));

        overviewContent.style.display = 'none';
        planContent.style.display = 'none';
        orgMapContent.style.display = 'none';
        logbookContentElement.style.display = 'none';

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
        }
        localStorage.setItem('active_tab', tabName);
    }

    overviewTab.onclick = () => switchTab('overview');
    successPlanTab.onclick = () => switchTab('successplan');
    orgMapTab.onclick = () => switchTab('orgmap');
    logbookTab.onclick = () => switchTab('logbook');

    const savedTab = localStorage.getItem('active_tab') || 'overview';
    switchTab(savedTab);



    function refreshDashboard() {
        grid.innerHTML = ''; // Clear current grid
        const data = window.dashboardData;


        // Render Top Section (Full Width Tables)
        grid.appendChild(render(data.tasks, 'tasks'));
        grid.appendChild(render(data.risks, 'risks'));

        grid.appendChild(render(data.support, 'support'));

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
            if (confirm(window.getUIText ? window.getUIText('noAvailableInitiatives') + '\n\n' + (window.t ? window.t('goToSuccessPlan') : "Ir para Success Plan?") : 'Não há iniciativas disponíveis. Deseja ir ao Success Plan para criar uma nova?')) {
                const spTab = document.querySelector('button[data-tab="successplan"]');
                if (spTab) spTab.click();
            }
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
        placeholder.textContent = "Selecione...";
        placeholder.disabled = true;
        placeholder.selected = true;
        select.appendChild(placeholder);

        availableItems.forEach((item, idx) => {
            const opt = document.createElement('option');
            const roadmapIndex = roadmap.rows.indexOf(item);
            opt.value = roadmapIndex;
            opt.textContent = item.tactic || 'Sem Nome';
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
            if (sectionKey === 'tasks') newRow = { id: rows.length + 1, task: "Nova Tarefa", owner: "", startDate: "", endDate: "", status: "", statusColor: "" };
            if (sectionKey === 'support') newRow = { id: "", case: "", desc: "", owner: "", status: "" };
            // Initiatives handled above
            if (sectionKey === 'opportunities') newRow = { id: rows.length + 1, name: "Nova Oportunidade", owner: "" };
            if (sectionKey === 'engagement') newRow = { id: rows.length + 1, name: "Novo Engajamento", owner: "" };
            if (sectionKey === 'risks') newRow = { risk: "", category: "", impact: "", mitigation: "", status: "", statusColor: "" };
        }

        // 3. Specific Overrides (Apply defaults regardless of how row was created)
        if (sectionKey === 'tasks') {
            newRow.task = "Nova Tarefa"; // Ensure title is set
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
            if (confirm("Linha vazia detectada. Deseja excluir permanentemente?")) {
                window.dashboardData[section].rows.splice(row, 1);
            } else {
                return; // Cancel action
            }
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
            if (confirm(window.getUIText ? window.getUIText('confirmDelete') : "Remover do Overview? (A linha continuará no Success Plan)")) {
                rowData.status = 'notPlanned';
                saveData();
                refreshDashboard();
            }
            return;
        }

        if (confirm("Deseja realmente excluir esta linha permanentemente? Esta ação não pode ser desfeita.")) {
            window.dashboardData[section].rows.splice(row, 1);
            saveData();
            refreshDashboard();
        }
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
        alert(window.t('baselineCreated'));
    };

    // Allow Enter key to submit
    inputLabel.onkeypress = (e) => {
        if (e.key === 'Enter') {
            document.getElementById('btn-confirm-baseline').click();
        }
    };
}
});
