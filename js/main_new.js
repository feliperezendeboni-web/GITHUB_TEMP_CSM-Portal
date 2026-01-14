// Main Dashboard Application
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

    const STORAGE_KEY = window.ProjectManager ? window.ProjectManager.getCurrentProjectId() : 'suzano-dashboard-data';

    // --- Load Data ---
    function loadData() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const savedData = JSON.parse(saved);
                window.dashboardData = Object.assign({}, window.dashboardData, savedData);
                console.log('Loaded data from localStorage');
            } catch (e) {
                console.error('Error loading data:', e);
            }
        }
    }

    // --- Save Data ---
    window.saveData = function () {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(window.dashboardData));
            console.log('Data saved');
        } catch (e) {
            console.error('Error saving data:', e);
        }
    };

    // --- Initialize ---
    loadData();

    // Create header
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

    // Language selector functionality
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.onclick = () => {
            const lang = btn.dataset.lang;
            window.currentLanguage = lang;
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Refresh all content
            refreshDashboard();

            // Refresh other tabs if they're active
            const activeTab = document.querySelector('.tab-btn.active');
            if (activeTab) {
                switchTab(activeTab.dataset.tab);
            }
        };
    });

    // Create tabs
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'tabs';

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'successplan', label: 'Success Plan', icon: '🎯' },
        { id: 'logbook', label: 'Logbook', icon: '📝' }
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

    // Switch tabs function
    function switchTab(tabId) {
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
                    'logbook-tab'
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
            }
        }
    }

    // Render overview
    function refreshDashboard() {
        const grid = overviewTab;
        grid.innerHTML = '';
        const data = window.dashboardData;

        // Render tables
        if (window.render) {
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
        }
    }

    // Initial render
    refreshDashboard();

    // Make refresh available globally
    window.refreshDashboard = refreshDashboard;

    console.log('Dashboard initialized successfully!');
});
