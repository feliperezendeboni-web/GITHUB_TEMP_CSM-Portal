const ReferenceData = {
    state: new Map(),
    activeTab: null,
    modalOpen: false,
    pollInterval: null,

    init() {
        console.log("ReferenceData initializing (Dynamic Mode)...");
        window.openReferenceCatalog = (fileId) => this.openCatalog(fileId);
        window.refreshCatalogTabs = () => this.refreshCatalogTabs();
    },

    async openCatalog(defaultFileId) {
        this.modalOpen = true;
        this.renderModalStructure();
        await this.refreshCatalogTabs();

        if (this.pollInterval) clearInterval(this.pollInterval);
        this.pollInterval = setInterval(() => {
            if (this.modalOpen) this.refreshCatalogTabs();
        }, 10000);

        if (defaultFileId && this.state.has(defaultFileId)) {
            this.activateTab(defaultFileId);
        } else if (this.state.size > 0 && !this.activeTab) {
            const first = this.state.keys().next().value;
            this.activateTab(first);
        }
    },

    closeCatalog() {
        this.modalOpen = false;
        if (this.pollInterval) clearInterval(this.pollInterval);
        const modal = document.getElementById('ref-catalog-modal');
        if (modal) modal.remove();
    },

    async refreshCatalogTabs() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);

            const res = await fetch('/api/catalog', { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!res.ok) throw new Error("Failed to fetch catalog");

            const newCatalog = await res.json();
            this.processCatalogUpdate(newCatalog);

        } catch (e) {
            console.warn("Server unavailable, using offline fallback:", e.message);
            const fallbackCatalog = [
                { name: '2026_Master Entitlements_LIST.csv', lastModified: new Date().toISOString() },
                { name: 'Training Catalog.csv', lastModified: new Date().toISOString() },
                { name: 'felipe.csv', lastModified: new Date().toISOString() }
            ];
            this.processCatalogUpdate(fallbackCatalog);
        }
    },

    processCatalogUpdate(newCatalog) {
        const newNames = new Set(newCatalog.map(f => f.name));
        const currentNames = new Set(this.state.keys());

        for (const name of currentNames) {
            if (!newNames.has(name)) {
                console.log(`[Catalog] Removing ${name}`);
                this.removeTab(name);
                this.state.delete(name);
                if (this.activeTab === name) {
                    this.activeTab = null;
                }
            }
        }

        for (const item of newCatalog) {
            const existing = this.state.get(item.name);

            if (!existing) {
                console.log(`[Catalog] Adding ${item.name}`);
                this.state.set(item.name, {
                    name: item.name,
                    lastModified: item.lastModified,
                    data: null,
                    loaded: false
                });
                this.createTab(item.name);
            } else {
                if (existing.lastModified !== item.lastModified) {
                    console.log(`[Catalog] Updating ${item.name} (Changed)`);
                    existing.lastModified = item.lastModified;
                    existing.loaded = false;

                    const btn = document.querySelector(`button[data-file="${item.name}"]`);
                    if (btn) {
                        btn.innerHTML = `${this.formatLabel(item.name)} <span style="color:#00A4EF; font-size:0.7em;">●</span>`;
                    }

                    if (this.activeTab === item.name) {
                        this.loadAndRender(item.name);
                    }
                }
            }
        }

        if (!this.activeTab && this.state.size > 0) {
            this.activateTab(this.state.keys().next().value);
        }
    },

    renderModalStructure() {
        if (document.getElementById('ref-catalog-modal')) return;

        const overlay = document.createElement('div');
        overlay.id = 'ref-catalog-modal';
        overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; display:flex; justify-content:center; align-items:center;';

        const content = document.createElement('div');
        content.style.cssText = 'background:#0f172a; width:90%; height:90%; border-radius:8px; box-shadow:0 0 20px rgba(0,0,0,0.5); display:flex; flex-direction:column; color:white; font-family:var(--font-primary); overflow:hidden; border: 1px solid #334155;';

        const header = document.createElement('div');
        header.style.cssText = 'padding:20px; border-bottom:1px solid #1e293b; display:flex; justify-content:space-between; align-items:center; background:#1e293b;';
        header.innerHTML = `<h2 style="margin:0; display:flex; align-items:center; gap:10px;"><span style="color:#00A4EF; font-size:1.5em;">📚</span> ${window.getUIText ? window.getUIText('refCatalog') : 'Entitlements Catalog'}</h2>`;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = 'background:none; border:none; color:white; font-size:2rem; cursor:pointer;';
        closeBtn.onclick = () => this.closeCatalog();
        header.appendChild(closeBtn);
        content.appendChild(header);

        const controls = document.createElement('div');
        controls.style.cssText = 'background:#0f172a; border-bottom:1px solid #334155; display:flex; flex-direction:column;';

        const tabsRow = document.createElement('div');
        tabsRow.id = 'ref-tabs-row';
        tabsRow.style.cssText = 'display:flex; gap:2px; padding:0 15px; background:#1e293b; pt:10px; align-items:flex-end; overflow-x: auto;';

        const searchRow = document.createElement('div');
        searchRow.style.cssText = 'padding:10px 15px; display:flex; gap:10px; align-items:center; background:#0f172a;';

        const searchInput = document.createElement('input');
        searchInput.id = 'ref-search-input';
        searchInput.type = 'text';
        searchInput.placeholder = window.getUIText ? window.getUIText('refSearchPlaceholder') : 'Search...';
        searchInput.style.cssText = 'padding:8px 12px; border-radius:4px; background:#1e293b; color:white; border:1px solid #334155; flex:1; max-width:400px;';
        searchInput.oninput = (e) => this.filterCurrentView(e.target.value);

        const refreshBtn = document.createElement('button');
        refreshBtn.innerText = '🔄';
        refreshBtn.title = 'Force Refresh';
        refreshBtn.style.cssText = 'background:transparent; border:none; color:#94a3b8; cursor:pointer; font-size:1.2rem; margin-left:5px;';
        refreshBtn.onclick = async () => {
            refreshBtn.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 1000 });
            await this.refreshCatalogTabs();
            if (this.activeTab) this.loadAndRender(this.activeTab);
        };

        searchRow.appendChild(searchInput);
        searchRow.appendChild(refreshBtn);

        controls.appendChild(tabsRow);
        controls.appendChild(searchRow);
        content.appendChild(controls);

        const resultsContainer = document.createElement('div');
        resultsContainer.id = 'ref-results-container';
        resultsContainer.style.cssText = 'flex:1; overflow:auto; padding:0; position:relative;';
        content.appendChild(resultsContainer);

        overlay.appendChild(content);
        document.body.appendChild(overlay);
    },

    createTab(filename) {
        const tabsRow = document.getElementById('ref-tabs-row');
        if (!tabsRow) return;

        const btn = document.createElement('button');
        btn.dataset.file = filename;
        btn.innerHTML = this.formatLabel(filename);
        this.setTabStyle(btn, false);
        btn.onclick = () => this.activateTab(filename);
        tabsRow.appendChild(btn);
    },

    removeTab(filename) {
        const btn = document.querySelector(`button[data-file="${filename}"]`);
        if (btn) btn.remove();
        if (this.activeTab === filename) {
            document.getElementById('ref-results-container').innerHTML = '';
        }
    },

    setTabStyle(btn, isActive) {
        btn.style.cssText = `
            padding: 10px 20px;
            background: ${isActive ? '#0f172a' : 'transparent'};
            color: ${isActive ? '#00A4EF' : '#94a3b8'};
            border: 1px solid ${isActive ? '#334155' : 'transparent'};
            border-bottom: none;
            border-radius: 8px 8px 0 0;
            cursor: pointer;
            font-weight: ${isActive ? 'bold' : 'normal'};
            transition: all 0.2s;
            margin-bottom: -4px;
            z-index: ${isActive ? '10' : '1'};
            white-space: nowrap;
        `;
    },

    formatLabel(filename) {
        return filename.replace('.csv', '').replace('2026_', '').replace(/_/g, ' ');
    },

    activateTab(filename) {
        this.activeTab = filename;

        const tabs = document.querySelectorAll('#ref-tabs-row button');
        tabs.forEach(t => {
            const isTarget = t.dataset.file === filename;
            this.setTabStyle(t, isTarget);
        });

        this.loadAndRender(filename);
    },

    async ensureDataLoaded(filename) {
        const fileObj = this.state.get(filename);
        if (!fileObj) return null;
        if (fileObj.loaded && fileObj.data) return fileObj.data;

        try {
            const encodedName = encodeURIComponent(filename);
            let res = await fetch(`/api/catalog/${encodedName}`);

            if (!res.ok) {
                console.log(`API failed, trying direct path for ${filename}`);
                res = await fetch(`reference tables/${encodedName}`);
            }

            if (!res.ok) throw new Error("Failed to load from server/file");
            const text = await res.text();
            const data = this.parseCSV(text);

            fileObj.data = data;
            fileObj.loaded = true;
            this.state.set(filename, fileObj);
            return data;
        } catch (e) {
            console.warn(`Failed to load ${filename} from server/file, trying global fallback:`, e.message);

            // FALLBACK: Use global window data
            const data = this.loadFromGlobalFallback(filename);
            if (data) {
                fileObj.data = data;
                fileObj.loaded = true;
                this.state.set(filename, fileObj);
                return data;
            }

            console.error("All loading methods failed for:", filename);
            return null;
        }
    },

    loadFromGlobalFallback(filename) {
        const normalizedName = filename.toLowerCase();

        if (normalizedName.includes('master') && normalizedName.includes('entitlement')) {
            if (window.RefData_Entitlements) {
                console.log(`✓ Using global fallback: window.RefData_Entitlements for ${filename}`);
                return window.RefData_Entitlements;
            }
        }

        if (normalizedName.includes('training')) {
            if (window.RefData_Training) {
                console.log(`✓ Using global fallback: window.RefData_Training for ${filename}`);
                return window.RefData_Training;
            }
        }

        if (normalizedName.includes('felipe')) {
            if (window.RefData_Training) {
                console.log(`✓ Using global fallback: window.RefData_Training for ${filename}`);
                return window.RefData_Training;
            }
        }

        return null;
    },

    async loadAndRender(filename) {
        const container = document.getElementById('ref-results-container');
        if (!container) return;

        container.innerHTML = `<div style="text-align:center; padding:50px;"><span style="font-size:2rem;">⌛</span> Loading...</div>`;

        const data = await this.ensureDataLoaded(filename);
        if (data) {
            this.renderTable(data);
        } else {
            container.innerHTML = `<div style="text-align:center; padding:50px; color:red;">Failed to load data.</div>`;
        }
    },

    async getOptions(fileIdentifier, columnName) {
        if (this.state.size === 0) {
            await this.refreshCatalogTabs();
        }

        let key = fileIdentifier;
        if (!this.state.has(key)) {
            for (const k of this.state.keys()) {
                if (fileIdentifier === 'master_entitlements' && k.includes('Master Entitlements')) {
                    key = k; break;
                }
                if (k.toLowerCase() === fileIdentifier.toLowerCase() + '.csv') {
                    key = k; break;
                }
            }
        }

        const data = await this.ensureDataLoaded(key);
        if (!data) return [];

        const opts = new Set();
        data.forEach(row => {
            if (row[columnName]) opts.add(row[columnName]);
        });
        return Array.from(opts).sort();
    },

    parseCSV(text) {
        const lines = text.trim().split(/\r?\n/);
        if (lines.length < 2) return [];
        const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());

        const result = [];
        for (let i = 1; i < lines.length; i++) {
            const row = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
            if (!row) continue;

            const obj = {};
            headers.forEach((h, index) => {
                let val = row[index] || '';
                val = val.replace(/^"|"$/g, '').replace(/""/g, '"').trim();
                obj[h] = val;
            });
            result.push(obj);
        }
        return result;
    },

    renderTable(data) {
        const container = document.getElementById('ref-results-container');
        if (!container) return;

        if (!data || data.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding:50px;">Empty File</div>`;
            return;
        }

        const headers = Object.keys(data[0]);

        let html = `
            <table style="width:100%; border-collapse:separate; border-spacing:0; font-size:0.85rem;">
                <thead>
                    <tr>
                        ${headers.map(h => `
                            <th style="background:#0f172a; color:#94a3b8; padding:12px; text-align:left; border-bottom:1px solid #334155; position:sticky; top:0; z-index:20;">
                                ${h}
                            </th>
                        `).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${data.map(row => `
                        <tr>
                            ${headers.map(h => `
                                <td style="padding:8px 12px; border-bottom:1px solid #1e293b; color:#cbd5e1; vertical-align:top; border-right: 1px solid rgba(255,255,255,0.05);">
                                    ${row[h] || ''}
                                </td>
                            `).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = html;

        const searchInput = document.getElementById('ref-search-input');
        if (searchInput && searchInput.value) {
            this.filterCurrentView(searchInput.value);
        }
    },

    filterCurrentView(query) {
        const container = document.getElementById('ref-results-container');
        if (!container) return;
        const rows = container.querySelectorAll('tbody tr');

        const lowerQ = query.toLowerCase();

        rows.forEach(row => {
            const text = row.innerText.toLowerCase();
            row.style.display = text.includes(lowerQ) ? '' : 'none';
        });
    }
};

ReferenceData.init();
