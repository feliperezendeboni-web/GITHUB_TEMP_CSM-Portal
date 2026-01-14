// Logbook Tab Content
window.renderLogbook = function () {
    const container = document.createElement('div');
    container.className = 'logbook-container';
    // container.style.padding = '20px'; // Removed for alignment

    // Header
    const header = document.createElement('div');
    header.style.marginBottom = '30px';
    const title = document.createElement('h2');
    title.style.color = 'var(--primary-color)';
    title.textContent = window.getUIText ? window.getUIText('logbook') : 'Diário de Bordo';
    header.appendChild(title);
    container.appendChild(header);

    // Initial Data Check
    if (!window.dashboardData.logbook) {
        window.dashboardData.logbook = { entries: [] };
    }

    // Add Entry Section
    const addSection = document.createElement('div');
    addSection.className = 'data-section';
    addSection.style.marginBottom = '30px';
    addSection.style.padding = '20px';
    addSection.style.background = 'rgba(255, 255, 255, 0.03)';
    addSection.style.borderRadius = '8px';

    const addTitle = document.createElement('h3');
    addTitle.className = 'section-title';
    addTitle.textContent = window.getUIText ? window.getUIText('addLog') : 'Adicionar Registro';
    addSection.appendChild(addTitle);

    const form = document.createElement('div');
    form.style.display = 'grid';
    form.style.gap = '15px';
    form.style.gridTemplateColumns = '1fr 1fr';

    // Date Input
    const dateGroup = document.createElement('div');
    const dateLabel = document.createElement('label');
    dateLabel.textContent = window.getUIText ? window.getUIText('logDate') : 'Data';
    dateLabel.style.display = 'block';
    dateLabel.style.marginBottom = '5px';
    dateLabel.style.color = 'rgba(255,255,255,0.7)';
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.style.width = '100%';
    dateInput.style.padding = '8px';
    dateInput.style.background = 'rgba(255,255,255,0.1)';
    dateInput.style.border = '1px solid rgba(255,255,255,0.2)';
    dateInput.style.color = '#fff';
    dateInput.style.borderRadius = '4px';
    // Default to today
    dateInput.valueAsDate = new Date();
    dateGroup.appendChild(dateLabel);
    dateGroup.appendChild(dateInput);

    // Title Input
    const titleGroup = document.createElement('div');
    const titleLabel = document.createElement('label');
    titleLabel.textContent = window.getUIText ? window.getUIText('logTitle') : 'Assunto';
    titleLabel.style.display = 'block';
    titleLabel.style.marginBottom = '5px';
    titleLabel.style.color = 'rgba(255,255,255,0.7)';
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.style.width = '100%';
    titleInput.style.padding = '8px';
    titleInput.style.background = 'rgba(255,255,255,0.1)';
    titleInput.style.border = '1px solid rgba(255,255,255,0.2)';
    titleInput.style.color = '#fff';
    titleInput.style.borderRadius = '4px';
    titleGroup.appendChild(titleLabel);
    titleGroup.appendChild(titleInput);

    // Entitlement Input (Dropdown)
    const entitlementGroup = document.createElement('div');
    entitlementGroup.style.gridColumn = '1 / -1'; // Full width
    const entitlementLabel = document.createElement('label');
    entitlementLabel.textContent = window.getUIText ? window.getUIText('initiatives') : 'Entitlements';
    entitlementLabel.style.display = 'block';
    entitlementLabel.style.marginBottom = '5px';
    entitlementLabel.style.color = 'rgba(255,255,255,0.7)';

    const entitlementSelect = document.createElement('select');
    entitlementSelect.style.width = '100%';
    entitlementSelect.style.padding = '8px';
    entitlementSelect.style.background = '#0f172a'; // Solid dark background
    entitlementSelect.style.border = '1px solid rgba(255,255,255,0.2)';
    entitlementSelect.style.color = '#fff';
    entitlementSelect.style.borderRadius = '4px';

    // Default option
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = window.getUIText ? window.getUIText('selectPlaceholder') : "Selecione...";
    defaultOption.style.background = '#0f172a';
    defaultOption.style.color = '#fff';
    entitlementSelect.appendChild(defaultOption);

    // Populate from Tactical Roadmap
    if (window.dashboardData.tacticalRoadmap && window.dashboardData.tacticalRoadmap.rows) {
        window.dashboardData.tacticalRoadmap.rows.forEach(row => {
            const opt = document.createElement('option');
            opt.value = row.tactic;
            opt.textContent = row.tactic;
            opt.style.background = '#0f172a';
            opt.style.color = '#fff';
            entitlementSelect.appendChild(opt);
        });
    }

    entitlementGroup.appendChild(entitlementLabel);
    entitlementGroup.appendChild(entitlementSelect);

    // Notes Input (Textarea)
    const notesGroup = document.createElement('div');
    notesGroup.style.gridColumn = '1 / -1';
    const notesLabel = document.createElement('label');
    notesLabel.textContent = window.getUIText ? window.getUIText('logNotes') : 'Observações';
    notesLabel.style.display = 'block';
    notesLabel.style.marginBottom = '5px';
    notesLabel.style.color = 'rgba(255,255,255,0.7)';
    const notesInput = document.createElement('textarea');
    notesInput.style.width = '100%';
    notesInput.style.minHeight = '100px';
    notesInput.style.padding = '8px';
    notesInput.style.background = 'rgba(255,255,255,0.1)';
    notesInput.style.border = '1px solid rgba(255,255,255,0.2)';
    notesInput.style.color = '#fff';
    notesInput.style.borderRadius = '4px';
    notesInput.style.resize = 'vertical';
    notesGroup.appendChild(notesLabel);
    notesGroup.appendChild(notesInput);

    // Add Button
    const btnAdd = document.createElement('button');
    btnAdd.textContent = '+ ' + (window.getUIText ? window.getUIText('addLog') : 'Adicionar');
    btnAdd.className = 'btn-primary';
    btnAdd.style.gridColumn = '1 / -1';
    btnAdd.style.justifySelf = 'start';
    btnAdd.style.padding = '8px 24px';
    btnAdd.style.marginTop = '10px';
    btnAdd.onclick = () => {
        if (!dateInput.value || !titleInput.value) {
            window.showAlert(window.getUIText ? window.getUIText('fillDateTitle') : 'Por favor, preencha data e título.');
            return;
        }
        const newEntry = {
            id: Date.now(),
            date: dateInput.value,
            title: titleInput.value,
            entitlement: entitlementSelect.value,
            content: notesInput.value
        };
        window.dashboardData.logbook.entries.push(newEntry);
        window.saveData();
        titleInput.value = '';
        entitlementSelect.value = '';
        notesInput.value = '';
        renderEntries();
    };

    form.appendChild(dateGroup);
    form.appendChild(titleGroup);
    form.appendChild(entitlementGroup);
    form.appendChild(notesGroup);
    form.appendChild(btnAdd);
    addSection.appendChild(form);
    container.appendChild(addSection);

    // Timeout (Log Entries) Section
    const timelineSection = document.createElement('div');
    timelineSection.className = 'logbook-timeline';
    timelineSection.style.position = 'relative';
    timelineSection.style.paddingLeft = '30px';
    timelineSection.style.borderLeft = '2px solid rgba(0, 105, 170, 0.5)'; // Alteryx Blue vertical line

    const renderEntries = () => {
        timelineSection.innerHTML = '';
        // Sort by date desc
        const entries = [...window.dashboardData.logbook.entries].sort((a, b) => new Date(b.date) - new Date(a.date));

        if (entries.length === 0) {
            timelineSection.textContent = 'Nenhum registro encontrado.';
            timelineSection.style.color = 'rgba(255,255,255,0.5)';
            return;
        }

        entries.forEach((entry, index) => {
            const item = document.createElement('div');
            item.className = 'log-item';
            // Compact margin
            item.style.marginBottom = '12px';
            item.style.position = 'relative';

            // Dot on timeline
            const dot = document.createElement('div');
            dot.style.position = 'absolute';
            dot.style.left = '-37px'; // Adjust based on padding/border
            dot.style.top = '14px';
            dot.style.width = '10px';
            dot.style.height = '10px';
            dot.style.borderRadius = '50%';
            dot.style.background = '#0069AA'; // Alteryx Blue
            dot.style.border = '2px solid #0f172a'; // Match bg
            dot.style.boxShadow = '0 0 0 1px rgba(0, 105, 170, 0.3)';
            item.appendChild(dot);

            // Card
            const card = document.createElement('div');
            card.style.background = 'rgba(255,255,255,0.03)';
            card.style.border = '1px solid rgba(255,255,255,0.1)';
            card.style.borderRadius = '6px';
            card.style.padding = '10px 12px';
            card.style.position = 'relative';
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.gap = '6px';

            // Header (Date - Title - Entitlement - Delete)
            const header = document.createElement('div');
            header.style.display = 'flex';
            header.style.alignItems = 'baseline'; // Align text baselines
            header.style.gap = '10px';
            header.style.flexWrap = 'wrap';
            header.style.paddingRight = '20px'; // Space for delete button

            // Date
            const dateDisplay = document.createElement('span');
            try {
                const dateObj = new Date(entry.date + 'T12:00:00');
                const localeMap = { 'en': 'en-US', 'es': 'es-ES', 'jp': 'ja-JP', 'pt': 'pt-BR' };
                const locale = localeMap[window.currentLanguage] || 'pt-BR';
                dateDisplay.textContent = dateObj.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
            } catch (e) {
                dateDisplay.textContent = entry.date;
            }
            dateDisplay.style.fontSize = '0.8rem';
            dateDisplay.style.color = '#0069AA';
            dateDisplay.style.fontWeight = 'bold';
            header.appendChild(dateDisplay);

            // Title
            const titleEl = document.createElement('span');
            titleEl.textContent = entry.title;
            titleEl.contentEditable = 'true';
            titleEl.style.fontWeight = '700';
            titleEl.style.fontSize = '0.95rem';
            titleEl.style.color = 'white';
            titleEl.style.flexGrow = '1';
            titleEl.onblur = (e) => {
                const originalIndex = window.dashboardData.logbook.entries.findIndex(e => e.id === entry.id);
                if (originalIndex !== -1) {
                    window.dashboardData.logbook.entries[originalIndex].title = e.target.textContent;
                    window.saveData();
                }
            };
            header.appendChild(titleEl);

            // Entitlement
            if (entry.entitlement) {
                const entDisplay = document.createElement('span');
                entDisplay.style.fontSize = '0.75rem';
                entDisplay.style.color = 'rgba(255,255,255,0.7)';
                entDisplay.style.padding = '1px 5px';
                entDisplay.style.background = 'rgba(255,255,255,0.1)';
                entDisplay.style.borderRadius = '3px';
                entDisplay.textContent = entry.entitlement;
                header.appendChild(entDisplay);
            }

            card.appendChild(header);

            // Content
            if (entry.content) {
                const contentEl = document.createElement('div');
                contentEl.textContent = entry.content;
                contentEl.contentEditable = 'true';
                contentEl.style.color = 'rgba(255,255,255,0.7)';
                contentEl.style.whiteSpace = 'pre-wrap';
                contentEl.style.fontSize = '0.85rem';
                contentEl.style.lineHeight = '1.4';
                contentEl.style.marginTop = '2px';
                contentEl.onblur = (e) => {
                    const originalIndex = window.dashboardData.logbook.entries.findIndex(e => e.id === entry.id);
                    if (originalIndex !== -1) {
                        window.dashboardData.logbook.entries[originalIndex].content = e.target.textContent;
                        window.saveData();
                    }
                };
                card.appendChild(contentEl);
            }

            // Delete Btn (Absolute to card)
            const btnDel = document.createElement('button');
            btnDel.innerHTML = '🗑️';
            btnDel.style.position = 'absolute';
            btnDel.style.top = '8px';
            btnDel.style.right = '8px';
            btnDel.style.background = 'none';
            btnDel.style.border = 'none';
            btnDel.style.cursor = 'pointer';
            btnDel.style.opacity = '0.4';
            btnDel.style.fontSize = '0.9rem';
            btnDel.title = window.getUIText ? window.getUIText('delete') : 'Excluir';
            btnDel.onmouseover = () => btnDel.style.opacity = '1';
            btnDel.onmouseout = () => btnDel.style.opacity = '0.4';
            btnDel.onclick = () => {
                const msg = window.getUIText ? window.getUIText('confirmDelete') : 'Excluir?';
                window.showConfirm(msg, () => deleteEntry(entry.id));
            };
            card.appendChild(btnDel);

            item.appendChild(card);
            timelineSection.appendChild(item);
        });

        // Helper for deletion since we're inside renderEntries which is inside renderLogbook
        const deleteEntry = (id) => {
            const originalIndex = window.dashboardData.logbook.entries.findIndex(e => e.id === id);
            if (originalIndex !== -1) {
                window.dashboardData.logbook.entries.splice(originalIndex, 1);
                window.saveData();
                renderEntries();
            }
        };
    };

    renderEntries();
    container.appendChild(timelineSection);

    return container;
};
