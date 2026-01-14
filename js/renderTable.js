function getStatusColorClass(text) {
    if (!text) return '';
    const t = text.toLowerCase();

    // Green (Success/Healthy)
    if (t.includes('concluí') || t.includes('finalizado') || t.includes('ok') || t.includes('🟢') || t.includes('alto') || t.includes('alta') || t.includes('healthy') || t.includes('sucesso') || t.includes('entregue')) return 'green';

    // Orange/Yellow (Warning/Progress)
    if (t.includes('andamento') || t.includes('progresso') || t.includes('iniciado') || t.includes('🟡') || t.includes('médio') || t.includes('média') || t.includes('attention') || t.includes('warning')) return 'orange';

    // Yellow (Pending/Waiting)
    if (t.includes('pendente') || t.includes('aguardando') || t.includes('validação') || t.includes('revisão') || t.includes('pausado')) return 'yellow';

    // Red (Danger/Risk/Not Approved)
    if (t.includes('atrasado') || t.includes('risco') || t.includes('crítico') || t.includes('parado') || t.includes('paraliz') || t.includes('🔴') || t.includes('baixo') || t.includes('baixa') || t.includes('risk') || t.includes('erro') || t.includes('bloqueado') || t.includes('impedimento') ||
        t.includes('não aprovado') || t.includes('not approved')) return 'red';

    // Blue (Info/Planned)
    if (t.includes('planejado') || t.includes('preparação') || t.includes('agendado') || t.includes('🔵') || t.includes('novo') || t.includes('compartilhado') || t.includes('info') || t.includes('discussão') || t.includes('briefing')) return 'blue';

    // Purple (Governance/Recurring)
    if (t.includes('recorrente') || t.includes('semanal') || t.includes('mensal') || t.includes('governança') || t.includes('alinhamento') || t.includes('estratégico')) return 'purple';

    // Gray (On Hold/Cancelled/Not Planned)
    if (t.includes('on hold') || t.includes('espera') || t.includes('standby') || t.includes('cancelado') || t.includes('cancelled') || t.includes('não planejado') || t.includes('not planned')) return 'gray';

    return '';
}

window.renderTable = function (sectionData, sectionKey) {
    if (!sectionData || !sectionData.headers) {
        console.warn(`Section data missing for ${sectionKey}`);
        return document.createElement('div');
    }
    const container = document.createElement('div');
    container.className = 'data-section card-premium'; // Apply premium card style
    container.dataset.section = sectionKey;

    // Create Section Header with Toggle Button
    const sectionHeader = document.createElement('div');
    sectionHeader.className = 'section-header';

    const titleWrapper = document.createElement('div');
    titleWrapper.className = 'section-title-wrapper';

    const title = document.createElement('h3');
    title.className = 'section-title';
    // Use translated title if available, otherwise use sectionData.title or sectionKey
    const translatedTitle = window.getSectionTitle ? window.getSectionTitle(sectionKey) : (sectionData.title || sectionKey);
    title.textContent = translatedTitle;
    title.style.margin = '0';

    titleWrapper.appendChild(title);

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'btn-toggle-section';
    toggleBtn.innerHTML = '<span class="toggle-icon">▼</span>';
    toggleBtn.title = window.getUIText ? window.getUIText('minimizeSection') : 'Minimizar seção';
    toggleBtn.onclick = () => {
        const content = container.querySelector('.section-content');
        const isCollapsed = content.classList.contains('collapsed');

        if (isCollapsed) {
            content.classList.remove('collapsed');
            toggleBtn.innerHTML = '<span class="toggle-icon">▼</span>';
            toggleBtn.title = window.getUIText ? window.getUIText('minimizeSection') : 'Minimizar seção';
            toggleBtn.classList.remove('collapsed');
        } else {
            content.classList.add('collapsed');
            toggleBtn.innerHTML = '<span class="toggle-icon">▲</span>';
            toggleBtn.title = window.getUIText ? window.getUIText('maximizeSection') : 'Maximizar seção';
            toggleBtn.classList.add('collapsed');
        }
    };

    sectionHeader.appendChild(titleWrapper);
    sectionHeader.appendChild(toggleBtn);
    container.appendChild(sectionHeader);

    // Create content wrapper
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'section-content';

    // Create table element
    const table = document.createElement('table');
    table.className = 'status-table';

    // Table Header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    sectionData.headers.forEach((text, index) => {
        const th = document.createElement('th');
        th.textContent = window.t ? window.t(text) : text;
        th.dataset.section = sectionKey;
        th.dataset.headerIndex = index;

        // Apply saved column width if exists
        const widthKey = `${sectionKey}_col_${index}`;
        if (window.dashboardData.columnWidths && window.dashboardData.columnWidths[widthKey]) {
            th.style.width = window.dashboardData.columnWidths[widthKey];
            th.style.minWidth = window.dashboardData.columnWidths[widthKey];
        }

        // Add column resizer
        const resizer = document.createElement('div');
        resizer.className = 'column-resizer';
        resizer.dataset.columnIndex = index;

        let startX, startWidth;

        resizer.onmousedown = (e) => {
            e.preventDefault();
            e.stopPropagation();

            startX = e.pageX;
            startWidth = th.offsetWidth;
            resizer.classList.add('resizing');

            const onMouseMove = (e) => {
                const width = startWidth + (e.pageX - startX);
                if (width > 50) { // Minimum width
                    th.style.width = width + 'px';
                    th.style.minWidth = width + 'px';
                }
            };

            const onMouseUp = () => {
                resizer.classList.remove('resizing');
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                // Save the new width
                const widthKey = `${sectionKey}_col_${index}`;
                if (!window.dashboardData.columnWidths) {
                    window.dashboardData.columnWidths = {};
                }
                window.dashboardData.columnWidths[widthKey] = th.style.width;
                const saveEvent = new CustomEvent('saveData');
                document.dispatchEvent(saveEvent);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        th.appendChild(resizer);
        headerRow.appendChild(th);
    });
    // Add Actions Header
    const thActions = document.createElement('th');
    thActions.textContent = window.getUIText ? window.getUIText('actions') : 'Ações';
    thActions.style.width = "1%"; // Shrink to fit content
    thActions.style.whiteSpace = "nowrap";
    thActions.style.textAlign = "center"; // Center the text
    headerRow.appendChild(thActions);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Table Body
    const tbody = document.createElement('tbody');
    let archivedCount = 0;

    sectionData.rows.forEach((rowData, index) => {
        const tr = document.createElement('tr');

        // Handle archived state
        if (rowData.archived) {
            tr.className = 'row-archived';
            archivedCount++;
        }

        // Iterate through rowData values, skipping 'statusColor' and 'archived'
        const keysToRender = sectionData.columns ? sectionData.columns : Object.keys(rowData);

        keysToRender.forEach(key => {
            if (key === 'statusColor' || key === 'archived') return;

            const cellValue = rowData[key];
            const td = document.createElement('td');

            // Make cell editable and add binding attributes
            td.dataset.section = sectionKey;
            td.dataset.row = index;
            td.dataset.key = key;

            // Handle Date Columns
            if (key === 'startDate' || key === 'endDate') {
                const dateInput = document.createElement('input');
                dateInput.type = 'date';

                // Convert DD/MM/YYYY to YYYY-MM-DD for the input value
                if (cellValue && /^\d{2}\/\d{2}\/\d{4}$/.test(cellValue)) {
                    const parts = cellValue.split('/');
                    dateInput.value = `${parts[2]}-${parts[1]}-${parts[0]}`;
                } else {
                    dateInput.value = '';
                }

                dateInput.style.border = 'none';
                dateInput.style.background = 'transparent';
                dateInput.style.fontFamily = 'inherit';
                dateInput.style.width = '100%';
                dateInput.style.colorScheme = 'dark'; // ensure icon is visible on dark bg

                // Bind changes specifically for input
                dateInput.dataset.section = sectionKey;
                dateInput.dataset.row = index;
                dateInput.dataset.key = key;

                dateInput.onchange = function (e) {
                    // Convert YYYY-MM-DD back to DD/MM/YYYY for storage
                    const val = this.value;
                    if (val) {
                        const parts = val.split('-');
                        // parts[0] is year, parts[1] is month, parts[2] is day
                        const formatted = `${parts[2]}/${parts[1]}/${parts[0]}`;

                        // We need to update the data manually or dispatch an event that handles the raw value?
                        // The main.js likely listens to 'input' or 'change'. 
                        // If we just bubble the event, main.js reads e.target.value.
                        // But we want main.js to receive the DD/MM/YYYY format.
                        // We can override the value getter?! No, that's messy.

                        // Best approach: Update dashboardData directly here or fire a custom update.
                        // But renderTable doesn't have easy access to dashboardData updates logic (it emits events?).
                        // renderTable relies on bubbling 'input' events usually?
                        // "dateInput.dataset.section = ..." suggests main.js uses these to map.

                        // Hack: Create a hidden property or intercepted event?
                        // Let's use a custom property on the element that main.js might respect? No.

                        // Let's fire a custom event 'updateCell' which main.js might not listen to yet.
                        // Let's look at main.js listeners.
                        // main.js usually listens to 'focusout' or 'input'.

                        // If I can't change main.js easily in this step, I'll do this:
                        // When onchange fires, I immediately modify the underlying dataset? 
                        // No, I can just dispatch a synthetic 'input' event with the formatted text?
                        // But the input type is date, it won't accept dd/mm/yyyy.

                        // ALTERNATIVE: Use type='text' but on focus type='date'? No, messy.

                        // PROPOSAL: Use type='date'. In main.js, when reading the value, detect if it's YYYY-MM-DD and convert.
                        // But I'm editing renderTable.js only right now.

                        // Let's try to update window.dashboardData directly from here if possible?
                        // window.dashboardData[sectionKey].rows[index][key] = formatted;
                        // const saveEvent = new CustomEvent('saveData');
                        // document.dispatchEvent(saveEvent);

                        // This seems safest to ensure data consistency without relying on main.js parsing quirks.
                        if (window.dashboardData && window.dashboardData[sectionKey] && window.dashboardData[sectionKey].rows[index]) {
                            window.dashboardData[sectionKey].rows[index][key] = formatted;
                            const saveEvent = new CustomEvent('saveData');
                            document.dispatchEvent(saveEvent);
                        }
                    }
                };

                td.appendChild(dateInput);
                td.contentEditable = "false"; // Input handles editing

                // Special handling for Status column
            } else if (key === 'status') {
                // If it's initiatives, use a dropdown to equalise with Success Plan
                if (sectionKey === 'initiatives') {
                    const statusSelect = document.createElement('select');
                    statusSelect.className = 'milestone-status-select'; // Reuse style
                    statusSelect.style.width = '100%';
                    statusSelect.style.color = '#ffffff'; // Force white text for better contrast
                    statusSelect.style.backgroundColor = getStatusColorClass(cellValue) === 'green' ? 'rgba(46, 204, 64, 0.3)' :
                        getStatusColorClass(cellValue) === 'orange' ? 'rgba(255, 133, 27, 0.3)' :
                            getStatusColorClass(cellValue) === 'blue' || cellValue === 'planned' || cellValue === 'Planejado' ? 'rgba(0, 105, 170, 0.3)' : // Blue for planned
                                (cellValue === 'notPlanned' || cellValue === 'Não Planejado' || cellValue === 'Cancelled' ? 'rgba(100, 100, 100, 0.3)' : '#1a3a52'); // Better gray for inactive

                    statusSelect.innerHTML = `
                        <option value="planned" ${(cellValue === 'planned' || cellValue === 'Planejado' || cellValue === 'Planned') ? 'selected' : ''}>${window.getUIText ? window.getUIText('planned') : 'Planejado'}</option>
                        <option value="active" ${(cellValue === 'active' || cellValue === 'Em Andamento' || cellValue === 'In Progress' || cellValue === 'Em Progresso') ? 'selected' : ''}>${window.getUIText ? window.getUIText('inProgress') : 'Em Andamento'}</option>
                        <option value="completed" ${(cellValue === 'completed' || cellValue === 'Concluído' || cellValue === 'Completed') ? 'selected' : ''}>${window.getUIText ? window.getUIText('completed') : 'Concluído'}</option>
                        <option value="notPlanned" ${(cellValue === 'notPlanned' || cellValue === 'Não Planejado' || cellValue === 'Not Planned') ? 'selected' : ''}>${window.getUIText ? window.getUIText('notPlanned') : 'Não Planejado'}</option>
                        <option value="notApproved" ${(cellValue === 'notApproved' || cellValue === 'Não Aprovado' || cellValue === 'Not Approved') ? 'selected' : ''}>${window.getUIText ? window.getUIText('notApproved') : 'Não Aprovado'}</option>
                        <option value="cancelled" ${(cellValue === 'cancelled' || cellValue === 'Cancelado' || cellValue === 'Cancelled') ? 'selected' : ''}>${window.getUIText ? window.getUIText('cancelled') : 'Cancelado'}</option>
                    `;

                    // Bind change
                    statusSelect.dataset.section = sectionKey;
                    statusSelect.dataset.row = index;
                    statusSelect.dataset.key = key;

                    statusSelect.onchange = (e) => {
                        // Native event listener in main.js will catch 'input' or 'change'? 
                        // main.js listens to 'input' on grid. Select fires 'input' or 'change'. 
                        // We can force dispatch or let the event bubble.
                        // But main.js 'input' listener covers INPUT and innerText. 
                        // Let's ensure it handles SELECT 'change'.
                        // Actually main.js logic handles INPUT values. So we just need to ensure bubbling.
                    };

                    td.appendChild(statusSelect);
                    td.contentEditable = "false";


                } else {
                    // Default Badge for other tables
                    const badge = document.createElement('span');
                    const statusColor = getStatusColorClass(cellValue);
                    badge.className = `badge ${statusColor}`;
                    const translatedStatus = window.translateStatus ? window.translateStatus(cellValue) : cellValue;
                    badge.textContent = translatedStatus;

                    td.contentEditable = "false";
                    badge.contentEditable = "true";
                    badge.dataset.section = sectionKey;
                    badge.dataset.row = index;
                    badge.dataset.key = key;
                    td.appendChild(badge);
                }

            } else if (key === 'involvement' && sectionKey === 'initiatives') {
                const invSelect = document.createElement('select');
                invSelect.className = 'milestone-status-select';
                invSelect.style.width = '100%';
                invSelect.innerHTML = `
                    <option value="Alteryx" ${cellValue === 'Alteryx' ? 'selected' : ''}>${window.getUIText ? window.getUIText('alteryx') : 'Alteryx'}</option>
                    <option value="Cliente" ${cellValue === 'Cliente' || cellValue === 'Client' ? 'selected' : ''}>${window.getUIText ? window.getUIText('client') : 'Cliente'}</option>
                    <option value="Ambos" ${cellValue === 'Ambos' || cellValue === 'Both' ? 'selected' : ''}>${window.getUIText ? window.getUIText('both') : 'Ambos'}</option>
                `;
                invSelect.dataset.section = sectionKey;
                invSelect.dataset.row = index;
                invSelect.dataset.key = key;
                invSelect.disabled = true; // Read-only in Overview
                invSelect.style.opacity = '0.7';
                invSelect.style.cursor = 'default';
                td.appendChild(invSelect);
                td.contentEditable = "false";

            } else {
                // Default text cell behavior
                td.contentEditable = "true";

                // USER REQUEST: In Overview tab (initiatives), only STATUS and PLANNED MONTH are editable.
                if (sectionKey === 'initiatives') {
                    // Check if it's one of the allowed editable fields
                    if (key !== 'plannedMonth') {
                        td.contentEditable = "false";
                        td.style.backgroundColor = "rgba(0,0,0,0.2)"; // Visual cue for read-only
                        td.style.color = "rgba(255,255,255,0.7)";
                    }
                }

                td.textContent = cellValue;
            }
            tr.appendChild(td);
        });

        // Add Actions Cell
        const tdActions = document.createElement('td');
        tdActions.style.textAlign = 'center';
        tdActions.style.display = 'flex';
        tdActions.style.justifyContent = 'center';
        tdActions.style.gap = '5px';
        tdActions.style.alignItems = 'center';
        tdActions.style.height = '100%'; // Ensure full height usage if needed

        const btnArchive = document.createElement('button');
        // Disable Archive for Initiatives (Delete handles logical removal), or keep it but ensure it works? 
        // User feedback implies Archive is broken/"trapping" items. Safe to hide it.
        if (sectionKey !== 'initiatives') {
            if (rowData.archived) {
                btnArchive.className = 'btn-unarchive';
                btnArchive.title = window.getUIText ? window.getUIText('unarchive') : 'Restaurar (Desarquivar)';
                btnArchive.innerHTML = '&#8634;'; // Undo arrow
            } else {
                btnArchive.className = 'btn-archive';
                btnArchive.title = window.getUIText ? window.getUIText('archive') : 'Inibir (Arquivar no Backlog)';
                btnArchive.innerHTML = '&#128230;'; // Package / Archive icon
            }

            btnArchive.onclick = () => {
                const event = new CustomEvent('toggleArchive', { detail: { section: sectionKey, row: index } });
                document.dispatchEvent(event);
            };
            tdActions.appendChild(btnArchive);
        }

        const btnDelete = document.createElement('button');
        btnDelete.className = 'btn-delete';
        btnDelete.title = window.getUIText ? window.getUIText('deletePermanently') : 'Excluir Permanentemente';
        btnDelete.innerHTML = '&#10006;'; // X mark for Delete
        btnDelete.onclick = () => {
            const event = new CustomEvent('deleteRow', { detail: { section: sectionKey, row: index } });
            document.dispatchEvent(event);
        };
        tdActions.appendChild(btnDelete);

        tr.appendChild(tdActions);

        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    contentWrapper.appendChild(table);

    // Toggle Backlog Button (only if there are archived items)
    if (archivedCount > 0) {
        const btnBacklog = document.createElement('button');
        btnBacklog.className = 'btn-toggle-backlog';
        const showText = window.getUIText ? window.getUIText('showBacklog') : 'Mostrar Backlog';
        btnBacklog.textContent = `${showText} (${archivedCount})`;
        btnBacklog.onclick = () => {
            container.classList.toggle('show-backlog');
            if (container.classList.contains('show-backlog')) {
                const hideText = window.getUIText ? window.getUIText('hideBacklog') : 'Ocultar Backlog';
                btnBacklog.textContent = hideText;
            } else {
                const showText = window.getUIText ? window.getUIText('showBacklog') : 'Mostrar Backlog';
                btnBacklog.textContent = `${showText} (${archivedCount})`;
            }
        };
        contentWrapper.appendChild(btnBacklog);
    }

    // Add Row Button
    const btnAdd = document.createElement('button');
    btnAdd.textContent = '+';
    btnAdd.title = window.getUIText ? window.getUIText('addNewRow') : 'Adicionar nova linha';
    btnAdd.className = 'btn-add-row btn-premium';
    // Removed inline styles for cleaner CSS control, keeping functional overrides
    btnAdd.style.marginTop = '15px'; // Adjust spacing
    btnAdd.style.float = 'right';
    btnAdd.innerHTML = '+'; // Ensure icon is simple

    btnAdd.onclick = () => {
        // Dispatch event or call global function
        const event = new CustomEvent('addRow', { detail: { section: sectionKey } });
        document.dispatchEvent(event);
    };

    contentWrapper.appendChild(btnAdd);

    // Clear float
    const clearfix = document.createElement('div');
    clearfix.style.clear = 'both';
    contentWrapper.appendChild(clearfix);

    // Append content wrapper to container
    container.appendChild(contentWrapper);

    return container;
}

// Export renderTable as window.render for global access
window.render = renderTable;
