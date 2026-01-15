// Success Plan Tab Content

// GLOBAL: Render Milestones Component (Moved from Success Plan to Overview)
window.renderMilestonesComponent = function () {
    const milestonesSection = document.createElement('div');
    milestonesSection.className = 'data-section';
    // Style adjustments for Overview context
    // milestonesSection.style.marginBottom = 'var(--spacing-lg)';

    // Controls Container for Milestones
    const milestonesSectionTitle = document.createElement('h3');
    milestonesSectionTitle.className = 'section-title';
    milestonesSectionTitle.textContent = window.getUIText ? window.getUIText('milestones') : 'Marcos Importantes (Milestones)';

    const milestonesControls = document.createElement('div');
    milestonesControls.style.cssText = 'display: flex; gap: 10px; align-items: center; float: right;';

    // Toggle Button for Milestones
    const toggleMilestonesBtn = document.createElement('button');
    toggleMilestonesBtn.className = 'btn-toggle-section';
    toggleMilestonesBtn.innerHTML = '<span class="toggle-icon">▼</span>';
    toggleMilestonesBtn.onclick = () => {
        if (milestonesContent.style.maxHeight === '0px') {
            milestonesContent.style.maxHeight = '2000px';
            milestonesContent.style.opacity = '1';
            toggleMilestonesBtn.innerHTML = '<span class="toggle-icon">▼</span>';
        } else {
            milestonesContent.style.maxHeight = '0px';
            milestonesContent.style.opacity = '0';
            toggleMilestonesBtn.innerHTML = '<span class="toggle-icon">▶</span>';
        }
    };

    // Add Milestone Button
    const addMilestoneBtn = document.createElement('button');
    addMilestoneBtn.className = 'btn-add-milestone btn-premium primary';
    addMilestoneBtn.innerHTML = '+ ' + (window.getUIText ? window.getUIText('addMilestone') : 'Adicionar Milestone');
    // Hover and styles handled by class

    milestonesControls.appendChild(addMilestoneBtn);
    milestonesControls.appendChild(toggleMilestonesBtn);
    milestonesSectionTitle.appendChild(milestonesControls);
    milestonesSection.appendChild(milestonesSectionTitle);

    // Collapsible Content Wrapper
    const milestonesContent = document.createElement('div');
    milestonesContent.style.transition = 'max-height 0.3s ease-out, opacity 0.3s ease-out';
    milestonesContent.style.overflow = 'hidden';
    milestonesContent.style.maxHeight = '2000px';
    milestonesContent.style.opacity = '1';
    milestonesSection.appendChild(milestonesContent);

    const timeline = document.createElement('div');
    timeline.className = 'timeline';
    milestonesContent.appendChild(timeline);

    // Initial Data Check
    if (!window.dashboardData.milestones) {
        window.dashboardData.milestones = { items: [] };
    }

    // Function to render milestones
    const renderMilestones = () => {
        timeline.innerHTML = '';
        const milestones = window.dashboardData.milestones.items;

        milestones.forEach((milestone, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = `timeline-item ${milestone.status}`;
            // Compact margins
            timelineItem.style.marginBottom = '10px';

            const marker = document.createElement('div');
            marker.className = 'timeline-marker';
            timelineItem.appendChild(marker);

            const content = document.createElement('div');
            content.className = 'timeline-content';
            // Flex row layout for compactness
            content.style.cssText = `
                position: relative;
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 10px 15px;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
            `;

            // 1. Title (Flex Grow)
            const titleInput = document.createElement('input');
            titleInput.type = 'text';
            titleInput.value = milestone.title;
            titleInput.placeholder = window.getUIText ? window.getUIText('milestoneTitle') : 'Título do Marco';
            titleInput.style.cssText = `
                background: transparent;
                border: none;
                color: var(--text-white);
                font-size: 1rem;
                font-weight: 600;
                font-family: inherit;
                flex-grow: 1;
                min-width: 150px;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s;
            `;
            titleInput.onfocus = () => {
                titleInput.style.background = 'rgba(255, 255, 255, 0.05)';
                titleInput.style.outline = 'none';
            };
            titleInput.onblur = () => {
                titleInput.style.background = 'transparent';
            };
            titleInput.oninput = (e) => {
                window.dashboardData.milestones.items[index].title = e.target.value;
                if (window.saveData) window.saveData();
            };
            content.appendChild(titleInput);

            // 2. Date Input
            const dateInput = document.createElement('input');
            dateInput.type = 'text';
            dateInput.value = milestone.date;
            dateInput.placeholder = window.getUIText ? window.getUIText('datePlaceholder') : 'Data (ex: Jan 2026)';
            dateInput.style.cssText = `
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 4px;
                color: rgba(255, 255, 255, 0.7);
                font-size: 0.85rem;
                font-family: inherit;
                padding: 6px 10px;
                width: 120px;
                text-align: center;
                transition: all 0.2s;
            `;
            dateInput.oninput = (e) => {
                window.dashboardData.milestones.items[index].date = e.target.value;
                if (window.saveData) window.saveData();
            };
            content.appendChild(dateInput);

            // 3. Status Select
            const statusSelect = document.createElement('select');
            statusSelect.innerHTML = `
                <option value="planned" ${(milestone.status === 'planned' || milestone.status === 'Planejado') ? 'selected' : ''}>${window.getUIText ? window.getUIText('planned') : 'Planejado'}</option>
                <option value="active" ${(milestone.status === 'active' || milestone.status === 'Em Andamento') ? 'selected' : ''}>${window.getUIText ? window.getUIText('inProgress') : 'Em Andamento'}</option>
                <option value="completed" ${(milestone.status === 'completed' || milestone.status === 'Concluído') ? 'selected' : ''}>${window.getUIText ? window.getUIText('completed') : 'Concluído'}</option>
            `;
            statusSelect.style.cssText = `
                background: #ffffff;
                border: none;
                border-radius: 4px;
                color: #333;
                font-size: 0.85rem;
                padding: 6px 10px;
                font-weight: 600;
                cursor: pointer;
                width: 130px;
            `;
            statusSelect.onchange = (e) => {
                window.dashboardData.milestones.items[index].status = e.target.value;
                if (window.saveData) window.saveData();
                renderMilestones();
            };
            content.appendChild(statusSelect);

            // 4. Delete Button
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '🗑️';
            deleteBtn.title = window.getUIText ? window.getUIText('delete') : 'Excluir';
            deleteBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                font-size: 1.1rem;
                opacity: 0.5;
                transition: opacity 0.2s;
                padding: 4px;
            `;
            deleteBtn.onmouseover = () => deleteBtn.style.opacity = '1';
            deleteBtn.onmouseout = () => deleteBtn.style.opacity = '0.5';
            deleteBtn.onclick = () => {
                const msg = window.t ? window.t('confirmDelete') : 'Excluir?';
                window.showConfirm(msg, () => {
                    window.dashboardData.milestones.items.splice(index, 1);
                    if (window.saveData) window.saveData();
                    renderMilestones();
                });
            };
            content.appendChild(deleteBtn);

            timelineItem.appendChild(content);
            timeline.appendChild(timelineItem);
        });
    };

    // Add Milestone Handler
    addMilestoneBtn.onclick = () => {
        window.dashboardData.milestones.items.push({
            title: window.getUIText ? window.getUIText('newMilestone') : "Novo Milestone",
            date: "",
            status: "planned"
        });
        if (window.saveData) window.saveData();
        renderMilestones();
    };

    // Initial render
    renderMilestones();
    return milestonesSection;
};

// Success Plan Tab Content
window.renderSuccessPlan = function () {
    const container = document.createElement('div');
    container.className = 'success-plan-container';
    // container.style.padding = '20px'; // Removed for alignment

    // Success Plan Header Container
    const headerContainer = document.createElement('div');
    headerContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 30px;
    `;

    // Title and Description


    // Action Buttons (Save & Print)
    const buttonsBlock = document.createElement('div');
    buttonsBlock.style.cssText = `
        display: flex;
        gap: 10px;
    `;

    const btnPrint = document.createElement('button');
    btnPrint.className = 'btn-print btn-premium';
    btnPrint.textContent = window.getUIText ? window.getUIText('printReport') : 'Imprimir em PDF';
    btnPrint.style.background = '#2ECC40'; // Specific color
    btnPrint.style.border = 'none';
    btnPrint.onclick = () => window.print();

    // Save Button Removed (Auto-Save)
    buttonsBlock.appendChild(btnPrint);
    headerContainer.appendChild(buttonsBlock);

    container.appendChild(headerContainer);

    // Success Metrics Section - Dynamic
    const metricsSection = document.createElement('div');
    metricsSection.className = 'data-section';

    // Header with Add Button
    const metricsHeader = document.createElement('div');
    metricsHeader.style.display = 'flex';
    metricsHeader.style.justifyContent = 'space-between';
    metricsHeader.style.alignItems = 'center';
    metricsHeader.style.marginBottom = '15px';

    const metricsTitle = document.createElement('h3');
    metricsTitle.className = 'section-title';
    metricsTitle.style.marginBottom = '0';
    metricsTitle.textContent = window.getUIText ? window.getUIText('successMetrics') : 'Métricas de Sucesso';

    const btnAddMetric = document.createElement('button');
    btnAddMetric.textContent = '+';
    btnAddMetric.className = 'btn-add-row'; // Reuse existing class
    btnAddMetric.style.padding = '0';
    btnAddMetric.style.width = '30px';
    btnAddMetric.style.height = '30px';
    btnAddMetric.style.fontSize = '1.2rem';
    btnAddMetric.style.display = 'flex';
    btnAddMetric.style.alignItems = 'center';
    btnAddMetric.style.justifyContent = 'center';
    btnAddMetric.title = window.getUIText ? window.getUIText('addMetric') : "Adicionar métrica";
    btnAddMetric.onclick = () => {
        if (!window.dashboardData.successMetrics) window.dashboardData.successMetrics = [];
        window.dashboardData.successMetrics.push({
            id: Date.now(),
            label: window.getUIText ? window.getUIText('newMetric') : 'Nova Métrica',
            value: '0',
            trend: '0% vs anterior'
        });
        if (window.saveData) window.saveData();
        renderMetricsGrid(); // Refresh
    };

    // COLLAPSIBLE WRAPPER FOR METRICS
    const metricsContent = document.createElement('div');
    metricsContent.style.transition = 'max-height 0.3s ease-out, opacity 0.3s ease-out';
    metricsContent.style.overflow = 'hidden';
    metricsContent.style.maxHeight = '2000px';
    metricsContent.style.opacity = '1';
    metricsSection.appendChild(metricsContent);

    // Add Toggle Button to Metrics Header
    const toggleMetricsBtn = document.createElement('button');
    toggleMetricsBtn.className = 'btn-toggle-section';
    toggleMetricsBtn.innerHTML = '<span class="toggle-icon">▼</span>';
    toggleMetricsBtn.onclick = () => {
        if (metricsContent.style.maxHeight === '0px') {
            metricsContent.style.maxHeight = '2000px';
            metricsContent.style.opacity = '1';
            toggleMetricsBtn.innerHTML = '<span class="toggle-icon">▼</span>';
        } else {
            metricsContent.style.maxHeight = '0px';
            metricsContent.style.opacity = '0';
            toggleMetricsBtn.innerHTML = '<span class="toggle-icon">▶</span>';
        }
    };

    // Group Controls
    const metricsControls = document.createElement('div');
    metricsControls.style.cssText = 'display: flex; gap: 10px; align-items: center;';
    metricsControls.appendChild(btnAddMetric);
    metricsControls.appendChild(toggleMetricsBtn);

    metricsHeader.appendChild(metricsTitle);
    metricsHeader.appendChild(metricsControls);
    metricsSection.appendChild(metricsHeader);
    metricsSection.appendChild(metricsContent);

    // Grid Container
    const metricsGrid = document.createElement('div');
    metricsContent.appendChild(metricsGrid);
    metricsGrid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;';

    const renderMetricsGrid = () => {
        metricsGrid.innerHTML = '';
        // Initialize if empty (fallback)
        if (!window.dashboardData.successMetrics) {
            window.dashboardData.successMetrics = [
                { id: 1, label: 'ADOPTION RATE', value: '75%', trend: '↑ 5% vs prev month' },
                { id: 2, label: 'NPS SCORE', value: '8.5', trend: '↑ 0.5 vs prev month' },
                { id: 3, label: 'ACTIVE USERS', value: '120', trend: '↑ 15 vs prev month' }
            ];
        }

        const metrics = window.dashboardData.successMetrics;

        metrics.forEach((metric, index) => {
            const card = document.createElement('div');
            card.className = 'metric-card';
            card.style.position = 'relative';

            // Delete Button (visible on hover)
            const btnDelete = document.createElement('span');
            btnDelete.innerHTML = '&times;';
            btnDelete.title = window.getUIText ? window.getUIText('deleteMetric') : "Excluir métrica";
            btnDelete.style.cssText = 'position: absolute; top: 5px; right: 10px; cursor: pointer; color: rgba(255,255,255,0.2); font-size: 1.5rem; line-height: 1; transition: color 0.2s;';
            btnDelete.onclick = (e) => {
                e.stopPropagation();
                const msg = window.t ? window.t('confirmDelete') : 'Excluir esta métrica?';
                window.showConfirm(msg, () => {
                    metrics.splice(index, 1);
                    if (window.saveData) window.saveData();
                    renderMetricsGrid();
                });
            };
            btnDelete.onmouseover = () => btnDelete.style.color = '#ff4d4d';
            btnDelete.onmouseout = () => btnDelete.style.color = 'rgba(255,255,255,0.2)';
            card.appendChild(btnDelete);

            // Label
            const labelDiv = document.createElement('div');
            labelDiv.className = 'metric-label';
            labelDiv.contentEditable = 'true';
            labelDiv.textContent = metric.label;
            labelDiv.onblur = () => {
                metric.label = labelDiv.textContent;
                if (window.saveData) window.saveData();
            };
            card.appendChild(labelDiv);

            // Value
            const valueDiv = document.createElement('div');
            valueDiv.className = 'metric-value';
            valueDiv.contentEditable = 'true';
            valueDiv.textContent = metric.value;
            valueDiv.onblur = () => {
                metric.value = valueDiv.textContent;
                if (window.saveData) window.saveData();
            };
            card.appendChild(valueDiv);

            // Trend
            const trendDiv = document.createElement('div');
            trendDiv.className = 'metric-trend';
            trendDiv.contentEditable = 'true';
            trendDiv.textContent = metric.trend;
            trendDiv.onblur = () => {
                metric.trend = trendDiv.textContent;
                if (window.saveData) window.saveData();
            };
            card.appendChild(trendDiv);

            metricsGrid.appendChild(card);
        });
    };

    renderMetricsGrid();
    container.appendChild(metricsSection);



    // Executive Summary Section
    const execSummarySection = document.createElement('div');
    execSummarySection.className = 'data-section';
    // execSummarySection.style.marginBottom = '30px';

    // Header
    const execHeader = document.createElement('h3');
    execHeader.className = 'section-title';
    execHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';

    // Left container for Title and Period
    const titleContainer = document.createElement('div');
    titleContainer.style.display = 'flex';
    titleContainer.style.alignItems = 'center';
    titleContainer.style.gap = '10px';

    // Title
    const titleSpan = document.createElement('span');
    titleSpan.textContent = window.getUIText ? window.getUIText('execSummaryTitle') : 'Resumo Executivo – Estratégia';
    titleContainer.appendChild(titleSpan);

    // Period
    const periodSpan = document.createElement('span');
    periodSpan.contentEditable = 'true';
    periodSpan.textContent = window.dashboardData.executiveSummary.period || "2024-2028";
    periodSpan.style.cssText = 'border-bottom: 1px dashed rgba(255,255,255,0.3); color: inherit; transition: border-color 0.3s; margin-left: 5px;';
    periodSpan.onblur = (e) => {
        window.dashboardData.executiveSummary.period = e.target.innerText;
        if (window.saveData) window.saveData();
    };
    periodSpan.onfocus = () => {
        periodSpan.style.borderBottomColor = 'var(--status-blue)';
        periodSpan.style.outline = 'none';
    };
    titleContainer.appendChild(periodSpan);

    execHeader.appendChild(titleContainer);

    // Add Toggle for Executive Summary
    const toggleExecBtn = document.createElement('button');
    toggleExecBtn.className = 'btn-toggle-section';
    toggleExecBtn.innerHTML = '<span class="toggle-icon">▼</span>';
    toggleExecBtn.onclick = () => {
        if (execContent.style.maxHeight === '0px') {
            execContent.style.maxHeight = '4000px';
            execContent.style.opacity = '1';
            toggleExecBtn.innerHTML = '<span class="toggle-icon">▼</span>';
        } else {
            execContent.style.maxHeight = '0px';
            execContent.style.opacity = '0';
            toggleExecBtn.innerHTML = '<span class="toggle-icon">▶</span>';
        }
    };
    execHeader.appendChild(toggleExecBtn);
    execSummarySection.appendChild(execHeader);

    // COLLAPSIBLE WRAPPER FOR EXECUTIVE SUMMARY
    const execContent = document.createElement('div');
    execContent.style.transition = 'max-height 0.3s ease-out, opacity 0.3s ease-out';
    execContent.style.overflow = 'hidden';
    execContent.style.maxHeight = '4000px';
    execContent.style.opacity = '1';
    execSummarySection.appendChild(execContent);

    // Guiding Principles (Norteadores) - Static Structure (Fields are editable)
    const guidingDiv = document.createElement('div');
    guidingDiv.style.marginBottom = '20px';
    guidingDiv.innerHTML = `<h4 style="color:white; border-bottom: 2px solid var(--status-blue); padding-bottom:5px; margin-bottom:10px;">${window.getUIText('guidingPrinciples')}</h4>`;

    const principlesContainer = document.createElement('div');
    principlesContainer.style.cssText = 'display: grid; grid-template-columns: 100px 1fr; gap: 10px; font-size: 0.9rem; align-items: center;';

    ['mission', 'purpose', 'vision'].forEach(key => {
        const label = document.createElement('div');
        label.style.fontWeight = 'bold';
        label.style.color = '#00ffcc'; // Evaluation text color
        label.textContent = window.getUIText(key) + ':';

        const content = document.createElement('div');
        content.contentEditable = 'true';
        content.textContent = window.dashboardData.executiveSummary[key];
        content.style.cssText = 'background: rgba(255,255,255,0.05); padding: 5px; border-radius: 4px;';
        content.onblur = (e) => {
            window.dashboardData.executiveSummary[key] = e.target.innerText;
            if (window.saveData) window.saveData();
        };

        principlesContainer.appendChild(label);
        principlesContainer.appendChild(content);
    });
    guidingDiv.appendChild(principlesContainer);
    execContent.appendChild(guidingDiv);

    // Helper to create Header with Add Button AND Toggle
    const createHeaderWithAdd = (text, onClickAdd, targetContent) => {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--status-blue); padding-bottom:5px; margin-bottom:10px; margin-top:20px;';

        const leftGroup = document.createElement('div');
        leftGroup.style.display = 'flex';
        leftGroup.style.alignItems = 'center';
        leftGroup.style.gap = '10px';

        const h4 = document.createElement('h4');
        h4.style.cssText = 'color:white; margin:0; text-align:left;';
        h4.textContent = text;
        leftGroup.appendChild(h4);

        const rightGroup = document.createElement('div');
        rightGroup.style.display = 'flex';
        rightGroup.style.alignItems = 'center';
        rightGroup.style.gap = '10px';

        const addBtn = document.createElement('button');
        addBtn.innerHTML = '+';
        addBtn.title = window.getUIText ? window.getUIText('addItem') : 'Adicionar item';
        addBtn.style.cssText = 'background: var(--status-blue); color: white; border: none; border-radius: 4px; width: 24px; height: 24px; cursor: pointer; font-weight: bold; display: flex; align-items: center; justify-content: center;';
        addBtn.onclick = onClickAdd;

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'btn-toggle-section';
        toggleBtn.innerHTML = '<span class="toggle-icon">▼</span>';
        toggleBtn.style.background = 'transparent';
        toggleBtn.style.border = 'none';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.onclick = () => {
            if (targetContent.style.display === 'none') {
                targetContent.style.display = 'grid'; // Restore grid
                toggleBtn.innerHTML = '<span class="toggle-icon">▼</span>';
            } else {
                targetContent.style.display = 'none';
                toggleBtn.innerHTML = '<span class="toggle-icon">▶</span>';
            }
        };

        rightGroup.appendChild(addBtn);
        // rightGroup.appendChild(toggleBtn); // Toggle on small blocks might be overkill/cluttered, but requested. Clean way is right side.
        // Actually user requested "faltou o minimize e maximeze deste bloco" pointing to "Strategic Goals".
        // Let's add it.
        rightGroup.appendChild(toggleBtn);

        wrapper.appendChild(leftGroup);
        wrapper.appendChild(rightGroup);
        return wrapper;
    };


    // 1. Strategic Drivers Container
    const driversContainer = document.createElement('div');
    driversContainer.style.cssText = 'display: grid; grid-template-columns: 1fr; gap: 10px; text-align: center; margin-bottom: 20px;';

    const renderDriversBlock = () => {
        driversContainer.innerHTML = '';
        // Create content wrapper to be toggled
        const contentDiv = document.createElement('div');
        contentDiv.style.cssText = 'grid-column: 1/-1; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; width: 100%;';

        const header = createHeaderWithAdd(window.getUIText('strategicDrivers'), () => {
            window.dashboardData.executiveSummary.drivers.push({ title: window.getUIText ? window.getUIText('newDriver') : "Novo Direcionador", kpi: "KPI" });
            if (window.saveData) window.saveData();
            renderDriversBlock();
        }, contentDiv);
        driversContainer.appendChild(header);

        window.dashboardData.executiveSummary.drivers.forEach((driver, idx) => {
            const cell = document.createElement('div');
            cell.style.cssText = 'position: relative; border: 1px solid rgba(255,255,255,0.2); padding: 10px; border-radius: 4px; background: rgba(0,0,0,0.2); min-height: 80px; display: flex; flex-direction: column; justify-content: center;';

            const delBtn = document.createElement('span');
            delBtn.innerHTML = '×';
            delBtn.style.cssText = 'position: absolute; top: 2px; right: 5px; cursor: pointer; color: #ff4d4d; font-size: 1.2rem; font-weight:bold; opacity:0; transition:opacity 0.2s;';
            cell.onmouseenter = () => delBtn.style.opacity = '1';
            cell.onmouseleave = () => delBtn.style.opacity = '0';
            delBtn.onclick = () => {
                const msg = window.getUIText ? window.getUIText('confirmDelete') : 'Excluir este item?';
                window.showConfirm(msg, () => {
                    window.dashboardData.executiveSummary.drivers.splice(idx, 1);
                    if (window.saveData) window.saveData();
                    renderDriversBlock();
                });
            };

            const title = document.createElement('div');
            title.contentEditable = 'true';
            title.style.fontWeight = 'bold';
            title.style.marginBottom = '5px';
            title.textContent = driver.title;
            title.onblur = (e) => {
                window.dashboardData.executiveSummary.drivers[idx].title = e.target.innerText;
                if (window.saveData) window.saveData();
            };

            const kpi = document.createElement('div');
            kpi.contentEditable = 'true';
            kpi.style.fontSize = '0.8rem';
            kpi.style.color = '#aaa';
            kpi.textContent = driver.kpi;
            kpi.onblur = (e) => {
                window.dashboardData.executiveSummary.drivers[idx].kpi = e.target.innerText;
                if (window.saveData) window.saveData();
            };

            cell.appendChild(delBtn);
            cell.appendChild(title);
            cell.appendChild(kpi);
            contentDiv.appendChild(cell);
        });
        driversContainer.appendChild(contentDiv);
    };
    renderDriversBlock();
    execContent.appendChild(driversContainer);


    // 2. Enablers Container
    const enablersContainer = document.createElement('div');
    enablersContainer.style.cssText = 'display: grid; grid-template-columns: 1fr; gap: 10px; text-align: center; margin-bottom: 20px;';

    const renderEnablersBlock = () => {
        enablersContainer.innerHTML = '';
        const contentDiv = document.createElement('div');
        contentDiv.style.cssText = 'grid-column: 1/-1; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; width: 100%;';

        const header = createHeaderWithAdd(window.getUIText('businessCapabilities'), () => {
            window.dashboardData.executiveSummary.enablers.push({ text: window.getUIText ? window.getUIText('newCapability') : "Nova Capacidade" });
            if (window.saveData) window.saveData();
            renderEnablersBlock();
        }, contentDiv);
        enablersContainer.appendChild(header);

        window.dashboardData.executiveSummary.enablers.forEach((item, idx) => {
            const cell = document.createElement('div');
            cell.contentEditable = 'true';
            cell.style.cssText = 'position: relative; border: 1px solid rgba(255,255,255,0.2); padding: 10px; border-radius: 4px; background: rgba(0,0,0,0.2); font-size: 0.85rem; min-height: 60px; display: flex; align-items: center; justify-content: center; color: var(--text-white);';
            cell.textContent = item.text;

            const delBtn = document.createElement('span');
            delBtn.innerHTML = '×';
            delBtn.contentEditable = 'false';
            delBtn.style.cssText = 'position: absolute; top: 0px; right: 5px; cursor: pointer; color: #ff4d4d; font-size: 1.2rem; font-weight:bold; opacity:0; transition:opacity 0.2s; z-index:10;';

            cell.onmouseenter = () => delBtn.style.opacity = '1';
            cell.onmouseleave = () => delBtn.style.opacity = '0';
            delBtn.onclick = (e) => {
                e.stopPropagation();
                const msg = window.t ? window.t('confirmDelete') : 'Excluir este item?';
                window.showConfirm(msg, () => {
                    window.dashboardData.executiveSummary.enablers.splice(idx, 1);
                    if (window.saveData) window.saveData();
                    renderEnablersBlock();
                });
            };

            cell.onblur = (e) => {
                window.dashboardData.executiveSummary.enablers[idx].text = e.target.innerText.replace('×', '').trim();
                if (window.saveData) window.saveData();
            };

            cell.appendChild(delBtn);
            contentDiv.appendChild(cell);
        });
        enablersContainer.appendChild(contentDiv);
    };
    renderEnablersBlock();
    execContent.appendChild(enablersContainer);


    // 3. Ambition Section
    const ambitionContainer = document.createElement('div');
    ambitionContainer.style.cssText = 'display: grid; grid-template-columns: 1fr; gap: 10px; text-align: center; margin-bottom: 20px;';

    const renderAmbitionBlock = () => {
        ambitionContainer.innerHTML = '';
        const contentDiv = document.createElement('div');
        contentDiv.style.cssText = 'grid-column: 1/-1; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; width: 100%;';

        const header = createHeaderWithAdd(window.getUIText('ambition'), () => {
            window.dashboardData.executiveSummary.ambition.push({ text: window.getUIText ? window.getUIText('newAmbition') : "Nova Ambição" });
            if (window.saveData) window.saveData();
            renderAmbitionBlock();
        }, contentDiv);
        ambitionContainer.appendChild(header);

        const ambitionColors = ['#00C853', '#00B0FF', '#D50000'];
        window.dashboardData.executiveSummary.ambition.forEach((item, idx) => {
            const wrapper = document.createElement('div');
            wrapper.style.cssText = `position: relative; border: 1px solid ${ambitionColors[idx % 3]}; color: var(--text-white); border-radius: 4px; font-weight: bold; min-height: 50px; display:flex; align-items:center; justify-content:center;`;

            const cell = document.createElement('div');
            cell.contentEditable = 'true';
            cell.style.cssText = 'padding: 10px; width: 100%; height: 100%; display:flex; align-items:center; justify-content:center; outline:none;';
            cell.textContent = item.text;
            cell.onblur = (e) => {
                window.dashboardData.executiveSummary.ambition[idx].text = e.target.innerText;
                if (window.saveData) window.saveData();
            };

            const delBtn = document.createElement('span');
            delBtn.innerHTML = '×';
            delBtn.style.cssText = 'position: absolute; top: 0px; right: 5px; cursor: pointer; color: #ff4d4d; font-size: 1.2rem; font-weight:bold; opacity:0; transition:opacity 0.2s;';
            wrapper.onmouseenter = () => delBtn.style.opacity = '1';
            wrapper.onmouseleave = () => delBtn.style.opacity = '0';
            delBtn.onclick = () => {
                const msg = window.t ? window.t('confirmDelete') : 'Excluir?';
                window.showConfirm(msg, () => {
                    window.dashboardData.executiveSummary.ambition.splice(idx, 1);
                    if (window.saveData) window.saveData();
                    renderAmbitionBlock();
                });
            };

            wrapper.appendChild(cell);
            wrapper.appendChild(delBtn);
            contentDiv.appendChild(wrapper);
        });
        ambitionContainer.appendChild(contentDiv);
    };
    renderAmbitionBlock();
    execContent.appendChild(ambitionContainer);


    // 4. Executive Priorities
    const prioritiesContainer = document.createElement('div');
    prioritiesContainer.style.cssText = 'display: grid; grid-template-columns: 1fr; gap: 10px; text-align: center; margin-bottom: 20px;';

    const renderPrioritiesBlock = () => {
        prioritiesContainer.innerHTML = '';
        const contentDiv = document.createElement('div');
        contentDiv.style.cssText = 'grid-column: 1/-1; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; width: 100%;';

        const header = createHeaderWithAdd(window.getUIText('execPriorities'), () => {
            window.dashboardData.executiveSummary.priorities.push({ title: window.getUIText ? window.getUIText('newPriority') : "Prioridade / Iniciativa", desc: window.getUIText ? window.getUIText('metaValue') : "Meta / Valor" });
            if (window.saveData) window.saveData();
            renderPrioritiesBlock();
        }, contentDiv);
        prioritiesContainer.appendChild(header);

        window.dashboardData.executiveSummary.priorities.forEach((item, idx) => {
            const cell = document.createElement('div');
            cell.style.cssText = 'position: relative; border: 1px solid rgba(255,255,255,0.2); padding: 10px; border-radius: 4px; background: rgba(0,0,0,0.2); min-height: 80px; display: flex; flex-direction: column; justify-content: center;';

            const delBtn = document.createElement('span');
            delBtn.innerHTML = '×';
            delBtn.style.cssText = 'position: absolute; top: 0px; right: 5px; cursor: pointer; color: #ff4d4d; font-size: 1.2rem; font-weight:bold; opacity:0; transition:opacity 0.2s;';
            cell.onmouseenter = () => delBtn.style.opacity = '1';
            cell.onmouseleave = () => delBtn.style.opacity = '0';
            delBtn.onclick = () => {
                const msg = window.getUIText ? window.getUIText('confirmDelete') : 'Excluir este item?';
                window.showConfirm(msg, () => {
                    window.dashboardData.executiveSummary.priorities.splice(idx, 1);
                    if (window.saveData) window.saveData();
                    renderPrioritiesBlock();
                });
            };

            const title = document.createElement('div');
            title.contentEditable = 'true';
            title.style.fontWeight = 'bold';
            title.style.fontSize = '0.9rem';
            title.style.marginBottom = '5px';
            title.textContent = item.title;
            title.onblur = (e) => {
                window.dashboardData.executiveSummary.priorities[idx].title = e.target.innerText;
                if (window.saveData) window.saveData();
            };

            const desc = document.createElement('div');
            desc.contentEditable = 'true';
            desc.style.fontSize = '0.9rem';
            desc.style.color = '#ff6600'; // Orange highlight
            desc.textContent = item.desc;
            desc.onblur = (e) => {
                window.dashboardData.executiveSummary.priorities[idx].desc = e.target.innerText;
                if (window.saveData) window.saveData();
            };

            cell.appendChild(delBtn);
            cell.appendChild(title);
            cell.appendChild(desc);
            prioritiesContainer.appendChild(cell);
        });
    };
    renderPrioritiesBlock();
    renderPrioritiesBlock();
    execContent.appendChild(prioritiesContainer);

    container.appendChild(execSummarySection);




    // Tactical Roadmap Section (Replaces Action Plan)
    const roadmapSection = document.createElement('div');
    roadmapSection.className = 'data-section';
    roadmapSection.style.position = 'relative';

    const roadmapHeaderContainer = document.createElement('div');
    roadmapHeaderContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    `;

    const roadmapTitle = document.createElement('h3');
    roadmapTitle.className = 'section-title';
    roadmapTitle.style.margin = '0';
    roadmapTitle.textContent = window.getUIText ? window.getUIText('tacticalRoadmap') : 'Roadmap Tático de Sucesso';

    const roadmapControls = document.createElement('div');
    roadmapControls.style.display = 'flex';
    roadmapControls.style.gap = '10px';

    // showBacklogBtn removed per user request. Backlog functionality hidden/disabled.
    // Defaulting showBacklog to false so archived items remain hidden.
    let showBacklog = false;

    // ... showBacklogBtn code removed ...

    const addRowBtn = document.createElement('button');
    addRowBtn.className = 'btn-add-goal';
    addRowBtn.innerHTML = '+ ' + (window.getUIText ? window.getUIText('addNewRow') : 'Adicionar linha');
    addRowBtn.style.cssText = `
        padding: 6px 12px;
        background: var(--table-header-bg);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        font-size: 0.85rem;
    `;

    // Catalog Button
    const btnCatalog = document.createElement('button');
    btnCatalog.className = 'btn-premium';
    btnCatalog.style.cssText = 'padding: 6px 12px; font-size: 0.85rem; display: flex; align-items: center; gap: 5px; margin-right: 5px; background: rgba(0, 163, 196, 0.2); border: 1px solid rgba(0, 163, 196, 0.5);';
    btnCatalog.innerHTML = '📚 ' + (window.getUIText ? window.getUIText('refCatalogShort') : 'Catálogo');
    btnCatalog.title = window.getUIText ? window.getUIText('refCatalog') : "Catálogo de Referência";
    btnCatalog.onclick = () => { if (window.openReferenceCatalog) window.openReferenceCatalog(); };
    roadmapControls.appendChild(btnCatalog);


    roadmapControls.appendChild(addRowBtn);
    roadmapHeaderContainer.appendChild(roadmapTitle);
    roadmapHeaderContainer.appendChild(roadmapControls);
    roadmapSection.appendChild(roadmapHeaderContainer);

    // Reuse the renderTable logic or create a specific one for Success Plan
    const roadmapTableContainer = document.createElement('div');
    // COLLAPSIBLE WRAPPER FOR ROADMAP
    const roadmapContent = document.createElement('div');
    roadmapContent.style.transition = 'max-height 0.3s ease-out, opacity 0.3s ease-out';
    roadmapContent.style.overflow = 'hidden';
    roadmapContent.style.maxHeight = '5000px';
    roadmapContent.style.opacity = '1';

    roadmapContent.appendChild(roadmapTableContainer);
    roadmapSection.appendChild(roadmapContent);

    // Add Toggle to Header
    const toggleRoadmapBtn = document.createElement('button');
    toggleRoadmapBtn.className = 'btn-toggle-section';
    toggleRoadmapBtn.innerHTML = '<span class="toggle-icon">▼</span>';
    toggleRoadmapBtn.style.marginLeft = '10px';
    toggleRoadmapBtn.onclick = () => {
        if (roadmapContent.style.maxHeight === '0px') {
            roadmapContent.style.maxHeight = '5000px';
            roadmapContent.style.opacity = '1';
            toggleRoadmapBtn.innerHTML = '<span class="toggle-icon">▼</span>';
            toggleRoadmapBtn.classList.remove('collapsed');
        } else {
            roadmapContent.style.maxHeight = '0px';
            roadmapContent.style.opacity = '0';
            toggleRoadmapBtn.innerHTML = '<span class="toggle-icon">▶</span>';
            toggleRoadmapBtn.classList.add('collapsed');
        }
    };
    roadmapHeaderContainer.insertBefore(toggleRoadmapBtn, roadmapHeaderContainer.firstChild); // Add to left or right? User image shows right mostly or standard. Let's put it next to title or floating right.
    // Actually standard usually right. Let's append to controls or header.
    // Let's refine placement: Title Left, Controls Right. Toggle can be with controls.
    roadmapControls.appendChild(toggleRoadmapBtn);

    const renderTacticalTable = () => {
        roadmapTableContainer.innerHTML = '';
        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'table-responsive';

        const table = document.createElement('table');
        table.className = 'status-table tactical-table';

        // Prepare DataList for Tactic (Entitlements)
        const datalistId = 'dl-entitlements-' + Date.now();
        let datalist = document.getElementById('dl-entitlements-shared');
        if (!datalist) {
            datalist = document.createElement('datalist');
            datalist.id = 'dl-entitlements-shared';
            document.body.appendChild(datalist);

            // Async load options
            if (window.ReferenceData) {
                // Assuming 'master_entitlements' file and 'Entitlement Name' column from header check
                window.ReferenceData.getOptions('master_entitlements', 'Entitlement Name').then(opts => {
                    datalist.innerHTML = '';
                    opts.forEach(opt => {
                        const option = document.createElement('option');
                        option.value = opt;
                        datalist.appendChild(option);
                    });
                });
            }
        }

        // Header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        const headers = [
            window.getUIText ? window.getUIText('tactic') : 'Tática / Ação',
            window.getUIText ? window.getUIText('area') : 'Área',
            window.getUIText ? window.getUIText('category') : 'Categoria',
            window.getUIText ? window.getUIText('involvement') : 'Envolvimento',
            window.getUIText ? window.getUIText('estHours') : 'Horas/Credits Est.',
            window.getUIText ? window.getUIText('plannedMonth') : 'Mês Planejado',
            window.getUIText ? window.getUIText('status') : 'Status',
            window.getUIText ? window.getUIText('justification') : 'Justificativa',
            window.getUIText ? window.getUIText('actions') : 'Ações'
        ];

        headers.forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Body
        const tbody = document.createElement('tbody');
        const rows = window.dashboardData.tacticalRoadmap.rows;

        let subtotalPlanned = 0;

        rows.forEach((row, rowIndex) => {
            if (!showBacklog && row.archived) return;
            if (showBacklog && !row.archived) return;

            const tr = document.createElement('tr');
            if (row.archived) tr.style.opacity = '0.6';

            // Tactic cell
            // Tactic cell - Converted to Input for Datalist support
            const tdTactic = document.createElement('td');
            tdTactic.style.padding = '0'; // Removing padding so input fills cell

            const tacticInput = document.createElement('input');
            tacticInput.type = 'text';
            tacticInput.value = row.tactic;
            tacticInput.setAttribute('list', 'dl-entitlements-shared');
            tacticInput.style.cssText = 'width: 100%; border: none; background: transparent; color: inherit; padding: 12px 15px; font-family: inherit; font-size: inherit; outline: none;';

            tacticInput.onchange = (e) => {
                window.dashboardData.tacticalRoadmap.rows[rowIndex].tactic = e.target.value;
                window.saveData();
            };
            tdTactic.appendChild(tacticInput);
            tr.appendChild(tdTactic);

            // Area cell (New)
            const tdArea = document.createElement('td');
            tdArea.contentEditable = 'true';
            tdArea.textContent = row.area || '';
            tdArea.onblur = (e) => {
                window.dashboardData.tacticalRoadmap.rows[rowIndex].area = e.target.textContent;
                window.saveData();
            };
            tr.appendChild(tdArea);


            // Category cell
            const tdCat = document.createElement('td');
            tdCat.contentEditable = 'true';
            tdCat.textContent = row.category;
            tdCat.onblur = (e) => {
                window.dashboardData.tacticalRoadmap.rows[rowIndex].category = e.target.textContent;
                window.saveData();
            };
            tr.appendChild(tdCat);

            // Involvement cell
            const tdInv = document.createElement('td');
            const invSelect = document.createElement('select');
            invSelect.className = 'milestone-status-select'; // Reuse styling
            invSelect.innerHTML = `
                <option value="Alteryx" ${row.involvement === 'Alteryx' ? 'selected' : ''}>${window.getUIText ? window.getUIText('alteryx') : 'Alteryx'}</option>
                <option value="Cliente" ${row.involvement === 'Cliente' ? 'selected' : ''}>${window.getUIText ? window.getUIText('client') : 'Cliente'}</option>
                <option value="Ambos" ${row.involvement === 'Ambos' ? 'selected' : ''}>${window.getUIText ? window.getUIText('both') : 'Ambos'}</option>
            `;
            invSelect.onchange = (e) => {
                window.dashboardData.tacticalRoadmap.rows[rowIndex].involvement = e.target.value;
                window.saveData();
            };
            tdInv.appendChild(invSelect);
            tr.appendChild(tdInv);



            // Hours cell
            const tdHours = document.createElement('td');
            tdHours.contentEditable = 'true';
            tdHours.textContent = row.estHours;
            tdHours.style.textAlign = 'center';
            tdHours.onblur = (e) => {
                const val = parseFloat(e.target.textContent) || 0;
                window.dashboardData.tacticalRoadmap.rows[rowIndex].estHours = val.toString();
                window.saveData();
                renderConsolidation(); // Update consolidation
            };
            tr.appendChild(tdHours);

            if (!row.archived) {
                subtotalPlanned += parseFloat(row.estHours) || 0;
            }

            // Month cell
            const tdMonth = document.createElement('td');
            tdMonth.contentEditable = 'true';
            tdMonth.textContent = row.plannedMonth;
            tdMonth.onblur = (e) => {
                window.dashboardData.tacticalRoadmap.rows[rowIndex].plannedMonth = e.target.textContent;
                window.saveData();
            };
            tr.appendChild(tdMonth);

            // Status cell
            const tdStatus = document.createElement('td');
            const statusSelect = document.createElement('select');
            statusSelect.className = 'milestone-status-select';
            statusSelect.innerHTML = `
                <option value="planned" ${(row.status === 'planned' || row.status === 'Planejado' || row.status === 'Planned' || row.status === 'Planificado') ? 'selected' : ''}>${window.getUIText ? window.getUIText('planned') : 'Planejado'}</option>
                <option value="active" ${(row.status === 'active' || row.status === 'Em Andamento' || row.status === 'In Progress' || row.status === 'En Progreso') ? 'selected' : ''}>${window.getUIText ? window.getUIText('inProgress') : 'Em Andamento'}</option>
                <option value="completed" ${(row.status === 'completed' || row.status === 'Concluído' || row.status === 'Completed' || row.status === 'Completado') ? 'selected' : ''}>${window.getUIText ? window.getUIText('completed') : 'Concluído'}</option>
                <option value="notPlanned" ${(row.status === 'notPlanned' || row.status === 'Não Planejado' || row.status === 'Not Planned') ? 'selected' : ''}>${window.getUIText ? window.getUIText('notPlanned') : 'Não Planejado'}</option>
                <option value="notApproved" ${(row.status === 'notApproved' || row.status === 'Não Aprovado' || row.status === 'Not Approved') ? 'selected' : ''}>${window.getUIText ? window.getUIText('notApproved') : 'Não Aprovado'}</option>
                <option value="cancelled" ${(row.status === 'cancelled' || row.status === 'Cancelado' || row.status === 'Cancelled') ? 'selected' : ''}>${window.getUIText ? window.getUIText('cancelled') : 'Cancelado'}</option>
            `;
            // USER REQUEST: Status is read-only in Success Plan tab. Edited only in Overview.
            statusSelect.disabled = true;
            statusSelect.style.opacity = '0.7';
            statusSelect.style.cursor = 'not-allowed';
            statusSelect.title = "Status must be updated in Overview tab";
            statusSelect.onchange = (e) => {
                window.dashboardData.tacticalRoadmap.rows[rowIndex].status = e.target.value;
                window.saveData();
                renderConsolidation(); // Update charts and balance
            };
            tdStatus.appendChild(statusSelect);
            tr.appendChild(tdStatus);

            // Justification cell (New)
            const tdJustification = document.createElement('td');
            tdJustification.contentEditable = 'true';
            tdJustification.textContent = row.justification || '';
            tdJustification.onblur = (e) => {
                window.dashboardData.tacticalRoadmap.rows[rowIndex].justification = e.target.textContent;
                window.saveData();
            };
            tr.appendChild(tdJustification);

            // Actions cell
            const tdActions = document.createElement('td');
            tdActions.style.textAlign = 'center';
            tdActions.style.whiteSpace = 'nowrap';



            const delBtn = document.createElement('button');
            delBtn.innerHTML = '🗑️';
            delBtn.title = window.getUIText ? window.getUIText('deletePermanently') : 'Excluir';
            delBtn.style.cssText = 'background:none; border:none; cursor:pointer; font-size:1.1rem; padding:4px;';
            delBtn.onclick = () => {
                const msg = window.t ? window.t('confirmDeletePermanent') : 'Deseja excluir?';
                if (window.showConfirm) {
                    window.showConfirm(msg, () => {
                        window.dashboardData.tacticalRoadmap.rows.splice(rowIndex, 1);
                        window.saveData();
                        renderTacticalTable();
                        renderConsolidation();
                    });
                } else if (confirm(msg)) {
                    window.dashboardData.tacticalRoadmap.rows.splice(rowIndex, 1);
                    window.saveData();
                    renderTacticalTable();
                    renderConsolidation();
                }
            };



            tdActions.appendChild(delBtn);
            tr.appendChild(tdActions);

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        tableWrapper.appendChild(table);
        roadmapTableContainer.appendChild(tableWrapper);
    };

    // Consolidation Summary Section
    const consolidationContainer = document.createElement('div');
    roadmapSection.appendChild(consolidationContainer);

    // Charts Container
    const chartsContainer = document.createElement('div');
    chartsContainer.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 20px;
        margin-top: 30px;
    `;
    roadmapSection.appendChild(chartsContainer);

    // Chart Canvases
    const createChartWrapper = (titleKey, defaultTitle) => {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'background: rgba(255,255,255,0.03); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; align-items: center; min-height: 350px;';

        const title = document.createElement('h4');
        title.style.cssText = 'color: rgba(255,255,255,0.9); margin-top: 0; margin-bottom: 15px; width: 100%; text-align: left; font-weight: 500; font-size: 0.95rem;';
        title.textContent = window.getUIText ? window.getUIText(titleKey) : defaultTitle;

        const canvasContainer = document.createElement('div');
        canvasContainer.style.cssText = 'position: relative; height: 250px; width: 100%; display: flex; justify-content: center;';

        const canvas = document.createElement('canvas');
        canvasContainer.appendChild(canvas);
        wrapper.appendChild(title);
        wrapper.appendChild(canvasContainer);
        return { wrapper, canvas };
    };

    const statusChartObj = createChartWrapper('statusDistribution', 'Distribuição por Status');
    const hoursChartObj = createChartWrapper('hoursByStatus', 'Horas/Tokens por Status');

    chartsContainer.appendChild(statusChartObj.wrapper);
    chartsContainer.appendChild(hoursChartObj.wrapper);

    let statusChartInstance = null;
    let hoursChartInstance = null;

    const renderCharts = () => {
        if (typeof Chart === 'undefined') return;

        const rows = window.dashboardData.tacticalRoadmap.rows.filter(r => !r.archived);

        // Data Processing
        const labels = [
            window.getUIText ? window.getUIText('planned') : 'Planejado',
            window.getUIText ? window.getUIText('inProgress') : 'Em Andamento',
            window.getUIText ? window.getUIText('completed') : 'Concluído',
            window.getUIText ? window.getUIText('cancelled') : 'Cancelado/Outros'
        ];

        // Map internal values to index 0, 1, 2, 3
        const getIndex = (s) => {
            s = (s || '').toLowerCase();
            if (s.includes('conclu') || s === 'completed') return 2;
            if (s.includes('anda') || s.includes('active') || s.includes('prog')) return 1;
            if (s.includes('cancel') || s.includes('approv') || s.includes('aprov') || (s.includes('not') && s.includes('plan')) || s.includes('não plan')) return 3;
            return 0; // Default to planned
        };

        const counts = [0, 0, 0, 0];
        const hours = [0, 0, 0, 0];

        rows.forEach(r => {
            const idx = getIndex(r.status);
            counts[idx]++;
            // Only add hours if not cancelled/rejected (index 3)
            // Or should we show the hours burned/allocated even if cancelled?
            // Usually cancelled = 0 impact on plan usage, but here we show distribution.
            // Let's hide hours for cancelled to avoid summing them up in the chart bar for now, or match consolidation logic.
            // If consolidation logic subtracts them, chart should probably reflect that or show them separately.
            // User request is simple: consider status.
            hours[idx] += parseFloat(r.estHours) || 0;
        });

        const colors = ['#2196F3', '#FFC107', '#4CAF50', '#F44336']; // Blue, Amber, Green, Red
        const bgColors = colors.map(c => c + 'aa'); // Transparent
        const borderColors = colors;

        // Register DataLabels Plugin (if loaded)
        if (typeof ChartDataLabels !== 'undefined') {
            Chart.register(ChartDataLabels);
        }

        // Common Chart Options
        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: 'rgba(255,255,255,0.7)', padding: 20, usePointStyle: true }
                },
                datalabels: {
                    color: '#ffffff',
                    font: {
                        weight: 'bold',
                        size: 13
                    },
                    textShadowColor: 'rgba(0,0,0,0.5)',
                    textShadowBlur: 4,
                    display: function (context) {
                        return context.dataset.data[context.dataIndex] > 0; // Hide if 0
                    }
                }
            }
        };

        // 1. Status Distribution (Doughnut)
        if (statusChartInstance) statusChartInstance.destroy();
        statusChartInstance = new Chart(statusChartObj.canvas, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: counts,
                    backgroundColor: bgColors,
                    borderColor: 'rgba(0,0,0,0.2)',
                    borderWidth: 1
                }]
            },
            options: {
                ...commonOptions,
                cutout: '60%'
            }
        });

        // 2. Hours by Status (Bar)
        if (hoursChartInstance) hoursChartInstance.destroy();
        hoursChartInstance = new Chart(hoursChartObj.canvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: window.getUIText ? window.getUIText('hours') : 'Horas/Credits',
                    data: hours,
                    backgroundColor: bgColors,
                    borderColor: borderColors,
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                ...commonOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: 'rgba(255,255,255,0.6)' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: 'rgba(255,255,255,0.6)' }
                    }
                },
                plugins: {
                    legend: { display: false }, // Hide legend for single dataset bar
                    datalabels: {
                        color: '#ffffff',
                        anchor: 'end',
                        align: 'top',
                        font: { weight: 'bold' },
                        formatter: function (value) {
                            return Math.round(value);
                        }
                    }
                }
            }
        });
    };

    const renderConsolidation = () => {
        consolidationContainer.innerHTML = '';

        const totalPool = window.dashboardData.initiatives.totalHoursPool || 80;
        const totalPlanned = window.dashboardData.tacticalRoadmap.rows
            .filter(r => !r.archived)
            .filter(r => {
                const s = (r.status || '').toLowerCase();
                // Exclude cancelled, not approved, not planned (if desired) from Total Utilized
                // If 'Not Planned' means 'Backlog', maybe exclude. If 'Cancelled', definitely exclude.
                // If 'Not Approved', exclude.
                if (s.includes('cancel') || s.includes('approv') || s.includes('aprov')) return false;
                // Included 'Not Planned' (Backlog) items for simulation purposes per user request.
                return true;
            })
            .reduce((sum, r) => sum + (parseFloat(r.estHours) || 0), 0);

        const balance = totalPool - totalPlanned;
        const percent = Math.min((totalPlanned / totalPool) * 100, 100).toFixed(1);

        const summary = document.createElement('div');
        summary.className = 'entitlement-container';
        summary.style.marginTop = '20px';
        summary.style.background = 'rgba(255, 255, 255, 0.03)';
        summary.style.padding = '15px';
        summary.style.borderRadius = '8px';
        summary.style.border = '1px solid rgba(255, 255, 255, 0.1)';

        summary.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-weight: 600; align-items: center;">
                <div style="display: flex; align-items: center; gap: 8px;">
                     <span style="color: rgba(255,255,255,0.7);">${window.getUIText('availablePool')}</span>
                     <input type="number" class="input-total-pool" value="${totalPool}" style="width: 80px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); color: white; border-radius: 4px; padding: 2px 5px; font-weight: bold;">
                </div>
                <span style="color: rgba(255,255,255,0.7);">${window.getUIText('plannedTotal')} <span style="color: white; font-weight: bold; margin-left: 5px;">${totalPlanned}</span></span>
                <span style="color: rgba(255,255,255,0.7);">${window.getUIText('balance')} <span style="color: ${balance >= 0 ? '#4CAF50' : '#FF5252'}; font-weight: bold; margin-left: 5px;">${balance.toFixed(1)}</span></span>
            </div>
            <div class="progress-container" style="height: 12px; background: rgba(255,255,255,0.1); border-radius: 6px; overflow: hidden; position: relative;">
                <div class="progress-bar" style="width: ${percent}%; height: 100%; background: ${totalPlanned > totalPool ? 'var(--status-risk)' : 'var(--status-healthy)'}; transition: width 0.5s ease;"></div>
            </div>
            <div style="text-align: right; margin-top: 5px; font-size: 0.85rem; color: rgba(255,255,255,0.7);">
                ${percent}% ${window.getUIText('plannedUtilization')}
            </div>
        `;

        // Bind Input Event
        const inputPool = summary.querySelector('.input-total-pool');
        if (inputPool) {
            inputPool.onchange = (e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val >= 0) {
                    window.dashboardData.initiatives.totalHoursPool = val;
                    window.saveData(); // Assuming this calls global saveData or persists
                    renderConsolidation(); // Update UI immediately
                }
            };
        }

        consolidationContainer.appendChild(summary);

        // Update charts whenever consolidation updates (which is whenever data changes)
        renderCharts();
    };

    addRowBtn.onclick = () => {
        window.dashboardData.tacticalRoadmap.rows.push({
            tactic: window.getUIText ? window.getUIText('newTactic') : "Nova Tática",
            area: "-",
            category: "-",
            involvement: "Ambos",
            estHours: "0",
            plannedMonth: "-",
            status: "notPlanned",
            justification: "",
            archived: false
        });
        window.saveData();
        renderTacticalTable();
        renderConsolidation();
    };



    renderTacticalTable();
    renderConsolidation();
    container.appendChild(roadmapSection);

    return container;
};
