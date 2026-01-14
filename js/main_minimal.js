// MINIMAL WORKING VERSION OF MAIN.JS
// This version only includes essential initialization

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Starting minimal main.js');

    const app = document.getElementById('app');
    if (!app) {
        console.error('App element not found!');
        return;
    }

    // Check for Project System
    if (window.ProjectManager) {
        console.log('ProjectManager found');
        window.ProjectManager.checkForLegacyData();
        const currentProjectId = window.ProjectManager.getCurrentProjectId();

        if (!currentProjectId) {
            console.log('No project selected, showing project selector');
            if (window.renderProjectSelector) {
                window.renderProjectSelector(app);
            } else {
                console.error('renderProjectSelector not found!');
            }
            return;
        }
        console.log('Current project:', currentProjectId);
    } else {
        console.log('ProjectManager not found - continuing without it');
    }

    // Storage key
    const STORAGE_KEY = window.ProjectManager ? window.ProjectManager.getCurrentProjectId() : 'suzano-dashboard-data';
    console.log('Using storage key:', STORAGE_KEY);

    // Load data from localStorage
    function loadData() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const savedData = JSON.parse(saved);
                window.dashboardData = Object.assign({}, window.dashboardData, savedData);
                console.log('Data loaded from localStorage');
            } catch (e) {
                console.error('Error loading data:', e);
            }
        } else {
            console.log('No saved data found');
        }
    }

    // Save data to localStorage
    window.saveData = function () {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(window.dashboardData));
            console.log('Data saved to localStorage');
        } catch (e) {
            console.error('Error saving data:', e);
        }
    };

    // Load data
    loadData();

    // Create simple header
    const header = document.createElement('div');
    header.className = 'header';
    header.innerHTML = `
        <div class="header-left">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Suzano_logo.svg/320px-Suzano_logo.svg.png" alt="Suzano" class="logo">
            <h1>Alteryx - One Page Overview</h1>
        </div>
        <div class="header-right">
            <div class="language-selector">
                <button class="lang-btn active" data-lang="pt">PT</button>
                <button class="lang-btn" data-lang="en">EN</button>
                <button class="lang-btn" data-lang="es">ES</button>
            </div>
            <span class="date">${new Date().toLocaleDateString('pt-BR')}</span>
        </div>
    `;
    app.appendChild(header);
    console.log('Header created');

    // Language selector
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.onclick = () => {
            const lang = btn.dataset.lang;
            window.currentLanguage = lang;
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            console.log('Language changed to:', lang);
            if (window.refreshDashboard) {
                window.refreshDashboard();
            }
        };
    });

    // Create tabs
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'tabs';

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'successplan', label: 'Success Plan', icon: '🎯' },
        { id: 'logbook', label: 'Logbook', icon: '📝' },
        { id: 'orgmap', label: 'Organizational Map', icon: '🏢' }
    ];

    tabs.forEach((tab, index) => {
        const btn = document.createElement('button');
        btn.className = 'tab-btn' + (index === 0 ? ' active' : '');
        btn.dataset.tab = tab.id;
        btn.innerHTML = `${tab.icon} ${tab.label}`;
        btn.onclick = () => switchTab(tab.id);
        tabsContainer.appendChild(btn);
    });

    app.appendChild(tabsContainer);
    console.log('Tabs created');

    // Create tab contents
    const overviewTab = document.createElement('div');
    overviewTab.id = 'overview-tab';
    overviewTab.className = 'tab-content active';
    app.appendChild(overviewTab);

    const successPlanTab = document.createElement('div');
    successPlanTab.id = 'success-plan-content';
    successPlanTab.className = 'tab-content';
    app.appendChild(successPlanTab);

    const logbookTab = document.createElement('div');
    logbookTab.id = 'logbook-tab';
    logbookTab.className = 'tab-content';
    app.appendChild(logbookTab);

    const orgMapTab = document.createElement('div');
    orgMapTab.id = 'org-map-tab';
    orgMapTab.className = 'tab-content';
    app.appendChild(orgMapTab);

    console.log('Tab contents created');

    // Switch tabs function
    function switchTab(tabId) {
        console.log('Switching to tab:', tabId);

        // Update buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        const targetTab = document.getElementById(
            tabId === 'overview' ? 'overview-tab' :
                tabId === 'successplan' ? 'success-plan-content' :
                    tabId === 'logbook' ? 'logbook-tab' :
                        'org-map-tab'
        );

        if (targetTab) {
            targetTab.classList.add('active');

            // Render content for the tab
            if (tabId === 'successplan' && window.renderSuccessPlan) {
                targetTab.innerHTML = '';
                targetTab.appendChild(window.renderSuccessPlan());
            } else if (tabId === 'logbook' && window.renderLogbook) {
                targetTab.innerHTML = '';
                targetTab.appendChild(window.renderLogbook());
            } else if (tabId === 'orgmap' && window.renderOrgMap) {
                targetTab.innerHTML = '';
                targetTab.appendChild(window.renderOrgMap());
            }
        }
    }

    // Render overview
    function refreshDashboard() {
        console.log('Refreshing dashboard...');
        const grid = overviewTab;
        grid.innerHTML = '';
        const data = window.dashboardData;

        if (!data) {
            console.error('dashboardData not found!');
            grid.innerHTML = '<p style="color: red;">Error: Dashboard data not loaded</p>';
            return;
        }

        // Render tables if render function exists
        if (window.render) {
            try {
                grid.appendChild(window.render(data.tasks, 'tasks'));
                grid.appendChild(window.render(data.risks, 'risks'));
                grid.appendChild(window.render(data.support, 'support'));
                grid.appendChild(window.render(data.initiatives, 'initiatives'));

                // Bottom row
                const bottomRow = document.createElement('div');
                bottomRow.style.display = 'grid';
                bottomRow.style.gridTemplateColumns = '1fr 1fr';
                bottomRow.style.gap = 'var(--spacing-lg)';
                bottomRow.appendChild(window.render(data.engagement, 'engagement'));
                bottomRow.appendChild(window.render(data.opportunities, 'opportunities'));
                grid.appendChild(bottomRow);

                console.log('Dashboard rendered successfully');
            } catch (e) {
                console.error('Error rendering dashboard:', e);
                grid.innerHTML = '<p style="color: red;">Error rendering dashboard: ' + e.message + '</p>';
            }
        } else {
            console.error('render function not found!');
            grid.innerHTML = '<p style="color: red;">Error: render function not available</p>';
        }
    }

    // Initial render
    refreshDashboard();

    // Make refresh available globally
    window.refreshDashboard = refreshDashboard;

    console.log('Dashboard initialized successfully!');
});
