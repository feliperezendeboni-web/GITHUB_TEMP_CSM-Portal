
// js/referenceData.js

window.ReferenceData = {
    // Lista padrão (fallback)
    defaultFiles: [
        {
            id: 'master_entitlements',
            label: '2026_Master Entitlements_LIST.csv',
            path: '/api/refs/2026_Master Entitlements_LIST.csv',
            data: null
        },
        {
            id: 'training_catalog',
            label: 'Training Catalog.csv',
            path: '/api/refs/Training Catalog.csv',
            data: null
        }
    ],

    // Lista ativa em tempo de execução
    files: [],

    // Cache dos dados carregados
    cache: {},

    /**
     * Inicializa o módulo, tentando buscar arquivos do servidor local
     */
    async init() {
        this.files = [...this.defaultFiles];

        try {
            const endpoint = (window.API_BASE || '/api') + '/reference-files';
            // Adiciona timestamp para evitar cache agressivo de requisições de API
            const res = await fetch(`${endpoint}?t=${Date.now()}`);
            if (res.ok) {
                const updatedList = await res.json();
                if (Array.isArray(updatedList) && updatedList.length > 0) {
                    console.log("Lista de referência atualizada via API:", updatedList);
                    this.files = updatedList;
                    // Pre-seleciona e limpa cache para garantir dados frescos
                    this.cache = {};
                }
            }
        } catch (e) {
            console.log("Modo estático (ou erro na API de lista): usando lista padrão de arquivos.");
        }
    },

    /**
     * Tenta carregar arquivo via URL (fetch)
     */
    async loadFile(fileConfig) {
        // Se já tiver cache e NÃO quisermos forçar atualização, retornamos.
        // Mas o usuário pediu "sempre atualizado", então vamos ignorar cache ou limpar antes.
        // Vamos tentar fetch sempre na abertura.

        try {
            let url = fileConfig.path;

            // Encode path parts if needed
            if (!url.includes('%20') && !url.startsWith('/api')) {
                url = encodeURI(url);
            }

            // Adiciona timestamp para evitar cache do navegador (garante "online update")
            const separator = url.includes('?') ? '&' : '?';
            const fetchUrl = `${url}${separator}t=${Date.now()}`;

            console.log(`Tentando carregar: ${fetchUrl}`);

            const response = await fetch(fetchUrl);

            if (!response.ok) {
                // Se der erro (ex: 404 ou bloqueio de CORS/file no browser), lançamos erro
                throw new Error(response.statusText || "Falha na conexão/arquivo local");
            }

            const arrayBuffer = await response.arrayBuffer();
            return this.parseExcelBuffer(arrayBuffer, fileConfig.id);

        } catch (error) {
            console.warn("Fetch falhou:", error);
            return { success: false, error: error.message, isNetworkError: true };
        }
    },

    /**
     * Processa o buffer do Excel usando SheetJS
     */
    parseExcelBuffer(arrayBuffer, id) {
        try {
            if (typeof XLSX === 'undefined') {
                throw new Error("Biblioteca SheetJS não carregada.");
            }

            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            if (!workbook.SheetNames.length) throw new Error("Arquivo Excel vazio.");

            // Pega a primeira aba
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            // Converte para JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

            this.cache[id] = jsonData;
            return { success: true, data: jsonData };

        } catch (err) {
            return { success: false, error: "Erro ao ler estrutura do Excel (CSV válido?): " + err.message };
        }
    },

    /**
     * Abre a Modal Principal
     */
    async openSearchModal() {
        // Inicializa (busca lista atualizada se estiver no server)
        await this.init();

        // Remove modal anterior
        const existing = document.querySelector('.reference-modal-overlay');
        if (existing) document.body.removeChild(existing);

        // --- DOM Elements ---
        const overlay = document.createElement('div');
        overlay.className = 'reference-modal-overlay';
        overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); display:flex; justify-content:center; align-items:center; z-index:10000; backdrop-filter: blur(4px);';

        const content = document.createElement('div');
        content.className = 'modal-content premium-box';
        content.style.cssText = 'max-width:1000px; width:95%; height:85vh; display:flex; flex-direction:column; background:#001a33; border:1px solid rgba(255,255,255,0.15); border-radius:12px; box-shadow:0 20px 50px rgba(0,0,0,0.6); overflow:hidden; animation: fadeIn 0.3s ease;';

        // Header
        const header = document.createElement('div');
        header.style.cssText = 'padding:20px 25px; border-bottom:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center; background:linear-gradient(90deg, rgba(0,47,93,0.5) 0%, rgba(0,0,0,0) 100%);';

        const titleValues = document.createElement('div');
        const titleText = window.t ? window.t('refCatalog') : 'Catálogo de Referência';
        titleValues.innerHTML = `<h2 style="margin:0; color:white; font-size:1.4rem; display:flex; align-items:center; gap:10px;">📚 ${titleText}</h2>`;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = 'background:none; border:none; color:white; font-size:2rem; cursor:pointer; opacity:0.7;';
        closeBtn.onclick = () => document.body.removeChild(overlay);
        header.appendChild(titleValues);
        header.appendChild(closeBtn);
        content.appendChild(header);

        // Toolbar
        const controls = document.createElement('div');
        controls.style.cssText = 'padding:20px 25px; display:flex; gap:15px; background:rgba(255,255,255,0.02); border-bottom:1px solid rgba(255,255,255,0.05); flex-wrap:wrap; align-items:center;';

        const fileSelect = document.createElement('select');
        fileSelect.style.cssText = 'padding:10px 15px; background:#002f5d; color:white; border:1px solid rgba(255,255,255,0.3); border-radius:6px; cursor:pointer; flex:1; min-width:250px; outline:none;';

        const updateFileOptions = () => {
            fileSelect.innerHTML = '';
            if (this.files.length === 0) {
                fileSelect.innerHTML = '<option>Nenhum arquivo encontrado</option>';
            } else {
                this.files.forEach(f => {
                    const opt = document.createElement('option');
                    opt.value = f.id;
                    opt.innerText = f.label;
                    fileSelect.appendChild(opt);
                });
            }
        };
        updateFileOptions();

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = window.t ? window.t('refSearchPlaceholder') : 'Digite para filtrar...';
        searchInput.style.cssText = 'flex:2; padding:10px 15px; border-radius:6px; background:rgba(0,0,0,0.3); color:white; border:1px solid rgba(255,255,255,0.2); min-width:200px;';

        controls.appendChild(document.createTextNode((window.t ? window.t('refFile') : 'Arquivo') + ': '));
        controls.appendChild(fileSelect);
        controls.appendChild(document.createTextNode(' ' + (window.t ? window.t('refSearch') : 'Buscar') + ': '));
        controls.appendChild(searchInput);
        content.appendChild(controls);

        // Results
        const resultsContainer = document.createElement('div');
        resultsContainer.style.cssText = 'flex:1; overflow:auto; padding:0; position:relative;';
        content.appendChild(resultsContainer);

        // Drag & Drop Handling (Fallback)
        const setupDragDrop = () => {
            const dz = document.createElement('div');
            dz.id = 'drag-overlay';
            dz.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,47,93,0.95); z-index:50; display:none; justify-content:center; align-items:center; flex-direction:column; pointer-events:none; transition:opacity 0.2s;';
            const dropText = window.t ? window.t('refDragDrop') : 'Solte o arquivo para visualizar';
            dz.innerHTML = `<div style="font-size:4rem;">📂</div><div style="font-size:1.5rem; color:white; margin-top:20px;">${dropText}</div>`;
            resultsContainer.appendChild(dz);

            const showDz = () => { dz.style.display = 'flex'; dz.style.pointerEvents = 'all'; };
            const hideDz = () => { dz.style.display = 'none'; dz.style.pointerEvents = 'none'; };

            content.addEventListener('dragenter', (e) => { e.preventDefault(); e.stopPropagation(); showDz(); });
            const onDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
            content.addEventListener('dragover', onDragOver);
            dz.addEventListener('dragover', onDragOver);

            dz.addEventListener('dragleave', (e) => { e.preventDefault(); e.stopPropagation(); hideDz(); });

            dz.addEventListener('drop', (e) => {
                e.preventDefault(); e.stopPropagation();
                hideDz();
                const file = e.dataTransfer.files[0];
                if (file) handleManualFileUpload(file);
            });
        };

        const handleManualFileUpload = (file) => {
            const loadingText = window.t ? window.t('refLoading') : 'Carregando...';
            resultsContainer.innerHTML = `<div style="text-align:center; padding:50px; color:white;">${loadingText}</div>`;
            const reader = new FileReader();
            reader.onload = (e) => {
                // Usa o ID selecionado atualmente para "sobrescrever" o cache visualmente
                const currentId = fileSelect.value;
                const res = this.parseExcelBuffer(e.target.result, currentId);
                if (res.success) {
                    renderTable(res, searchInput.value);
                } else {
                    renderTable(res);
                }
            };
            reader.readAsArrayBuffer(file);
        };

        // Render Function
        const renderTable = (result, filter = '') => {
            resultsContainer.innerHTML = '';
            setupDragDrop(); // Re-attach DnD

            if (!result.success) {
                // Se falhou (provavelmente CORS/File Protocol), oferecemos o Drop Zone amigável
                const isFileProtocol = window.location.protocol === 'file:';

                resultsContainer.innerHTML = `
                    <div style="text-align:center; margin-top:40px; padding:30px; color:#ffcccc;">
                        <div style="font-size:3rem; margin-bottom:10px;">⚠️</div>
                        <h3 style="color:#ff6b6b; margin-bottom:15px;">${window.t ? window.t('refError') : 'Não foi possível carregar automaticamente'}</h3>
                        <p style="opacity:0.8;">${result.error}</p>
                        
                        ${isFileProtocol ? `
                        <div style="margin-top:30px; padding:20px; background:rgba(255,255,255,0.05); border-radius:10px; border:2px dashed rgba(255,255,255,0.2); max-width:500px; margin-left:auto; margin-right:auto;">
                            <p style="margin-bottom:10px; color:white; font-weight:bold;">${window.t ? window.t('refOfflineMode') : 'Modo Offline Detectado'}</p>
                            <p style="font-size:0.9rem; opacity:0.8;">${window.t ? window.t('refLocalWarning') : 'O navegador bloqueou a leitura automática do arquivo local.'}</p>
                            <div style="margin-top:20px; font-size:1.1rem; color:var(--status-blue);">
                                👉 ${window.t ? window.t('refLocalInstruction') : 'Arraste o arquivo'} <strong>${this.files.find(f => f.id === fileSelect.value)?.label || 'Excel/CSV'}</strong>
                            </div>
                        </div>
                        ` : ''}
                    </div>`;
                return;
            }

            const data = result.data;
            if (!data || !data.length) {
                resultsContainer.innerHTML = `<div style="text-align:center; padding:50px; opacity:0.5;">${window.t ? window.t('refEmptyFile') : 'Arquivo vazio.'}</div>`;
                return;
            }

            const keys = Object.keys(data[0]);
            const lowerFilter = filter.toLowerCase();

            let filtered = data;
            if (lowerFilter.length > 0) {
                filtered = data.filter(row => {
                    return keys.some(k => String(row[k] || '').toLowerCase().includes(lowerFilter));
                });
            }

            if (!filtered.length) {
                const noResText = window.t ? window.t('refNoResults') : 'Sem resultados';
                resultsContainer.innerHTML = `<div style="text-align:center; padding:50px; opacity:0.5;">${noResText} "${filter}".</div>`;
                return;
            }

            const table = document.createElement('table');
            table.style.cssText = 'width:100%; border-collapse:collapse; min-width:800px; font-size:0.9rem;';

            const thead = document.createElement('thead');
            const trHead = document.createElement('tr');
            keys.forEach(k => {
                const th = document.createElement('th');
                th.innerText = k;
                th.style.cssText = 'background:#002f5d; color:white; padding:12px 15px; text-align:left; position:sticky; top:0; z-index:10; font-weight:600; white-space:nowrap; border-bottom:2px solid rgba(0,0,0,0.2);';
                trHead.appendChild(th);
            });
            thead.appendChild(trHead);
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            filtered.forEach((row, i) => {
                const tr = document.createElement('tr');
                tr.style.background = i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent';

                keys.forEach(k => {
                    const td = document.createElement('td');
                    td.innerText = row[k] || '';
                    td.style.cssText = 'padding:6px 15px; border-bottom:1px solid rgba(255,255,255,0.05); color:rgba(255,255,255,0.9);';
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            resultsContainer.appendChild(table);
        };

        // Event Wiring
        fileSelect.onchange = async () => {
            const val = fileSelect.value;
            if (!val) return;
            const loadText = window.t ? window.t('refLoading') : 'Carregando...';
            resultsContainer.innerHTML = `<div style="text-align:center; padding:50px;"><span class="loader"></span> ${loadText}</div>`;

            const conf = this.files.find(f => f.id === val);
            if (conf) {
                const res = await this.loadFile(conf);
                renderTable(res, searchInput.value);
            }
        };

        searchInput.oninput = (e) => {
            const val = fileSelect.value;
            if (val && this.cache[val]) {
                const data = { success: true, data: this.cache[val] };
                renderTable(data, e.target.value);
            }
        };

        overlay.appendChild(content);
        document.body.appendChild(overlay);

        // Initial Trigger
        if (fileSelect.options.length > 0) {
            fileSelect.selectedIndex = 0;
            fileSelect.dispatchEvent(new Event('change'));
        }
    }
};
