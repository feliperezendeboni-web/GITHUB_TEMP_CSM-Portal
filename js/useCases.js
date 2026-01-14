
window.renderUseCases = function () {
    const container = document.createElement('div');
    container.className = 'use-cases-container fade-in';

    // Internal State
    let selectedUseCaseId = null;

    // Ensure Data Structure
    if (!window.dashboardData.useCases) {
        window.dashboardData.useCases = [];
    }

    // --- Helper: Format Date ---
    const formatDate = (isoString) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        const localeMap = { 'en': 'en-US', 'es': 'es-ES', 'jp': 'ja-JP', 'pt': 'pt-BR' };
        const locale = localeMap[window.currentLanguage] || 'pt-BR';
        return d.toLocaleDateString(locale, {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    // --- Components ---

    // 1. Header & Timeline Section
    const topSection = document.createElement('div');
    topSection.style.marginBottom = '30px';

    const headerRow = document.createElement('div');
    headerRow.className = 'section-header'; // Reusing existing class
    headerRow.style.marginBottom = '20px';

    const title = document.createElement('h2');
    title.textContent = window.getUIText ? window.getUIText('useCases') : 'Casos de Uso';
    title.style.color = 'var(--text-white)';
    title.style.borderBottom = '2px solid var(--status-blue)';
    title.style.paddingBottom = '8px';
    title.style.display = 'inline-block';
    title.style.margin = '0';

    const btnNew = document.createElement('button');
    btnNew.textContent = '+ New Use Case';
    btnNew.className = 'btn-premium primary';

    btnNew.onclick = () => {
        selectedUseCaseId = null;
        renderTimeline();
        renderForm();
    };

    headerRow.appendChild(title);
    headerRow.appendChild(btnNew);
    topSection.appendChild(headerRow);

    // Timeline / List Container
    const timelineContainer = document.createElement('div');
    timelineContainer.style.display = 'flex';
    timelineContainer.style.gap = '15px';
    timelineContainer.style.overflowX = 'auto'; // Horizontal scroll if many
    timelineContainer.style.paddingBottom = '15px';
    timelineContainer.style.borderBottom = '1px solid rgba(255,255,255,0.1)';

    topSection.appendChild(headerRow);

    // Search Filter
    const searchContainer = document.createElement('div');
    searchContainer.style.marginBottom = '15px';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = window.getUIText ? (window.getUIText('searchUseCases') || 'Search Use Cases...') : 'Search Use Cases...';
    searchInput.className = 'use-case-search';
    searchInput.style.width = '100%';
    searchInput.style.padding = '10px';
    searchInput.style.borderRadius = '8px';
    searchInput.style.border = '1px solid rgba(255,255,255,0.1)';
    searchInput.style.background = 'rgba(255,255,255,0.05)';
    searchInput.style.color = 'white';
    searchInput.style.fontSize = '0.95rem';

    searchInput.onfocus = () => {
        searchInput.style.background = 'rgba(255, 255, 255, 0.1)';
        searchInput.style.outline = '1px solid var(--status-blue)';
    };
    searchInput.onblur = () => {
        searchInput.style.background = 'rgba(255, 255, 255, 0.05)';
        searchInput.style.outline = 'none';
    };

    searchInput.oninput = (e) => {
        renderTimeline(e.target.value);
    };

    searchContainer.appendChild(searchInput);
    topSection.appendChild(searchContainer);

    topSection.appendChild(timelineContainer);
    container.appendChild(topSection);

    // 2. Form Section
    const formContainer = document.createElement('div');
    formContainer.className = 'use-case-form card-premium'; // Use premium card style

    container.appendChild(formContainer);

    // --- Render Functions ---

    const renderTimeline = (filterText = '') => {
        timelineContainer.innerHTML = '';
        let useCases = window.dashboardData.useCases || [];

        // Apply Filter
        if (filterText) {
            const lowerFilter = filterText.toLowerCase();
            useCases = useCases.filter(uc => {
                const title = (uc.title || '').toLowerCase();
                const summary = (uc.executiveSummary || '').toLowerCase();
                return title.includes(lowerFilter) || summary.includes(lowerFilter);
            });
        }

        // Sort by updatedAt desc
        const sorted = [...useCases].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

        if (sorted.length === 0) {
            timelineContainer.innerHTML = '<div style="color:rgba(255,255,255,0.5); font-style:italic;">Nenhum caso de uso criado ainda. Clique em "+ New Use Case".</div>';
            return;
        }

        sorted.forEach(uc => {
            const card = document.createElement('div');
            const isSelected = uc.id === selectedUseCaseId;

            card.style.minWidth = '220px';
            card.style.maxWidth = '280px';
            // Use glass styling via inline/classes combination or specific styling here to distinguish from main card
            card.style.background = isSelected ? 'rgba(0, 105, 170, 0.25)' : 'var(--glass-bg)';
            card.style.border = isSelected ? '1px solid var(--status-blue)' : '1px solid var(--glass-border)';
            card.style.borderRadius = '12px';
            card.style.padding = '16px';
            card.style.cursor = 'pointer';
            card.style.transition = 'all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1)';

            // Hover effect
            card.onmouseover = () => {
                if (!isSelected) {
                    card.style.transform = 'translateY(-3px)';
                    card.style.background = 'var(--glass-hover)';
                }
            };
            card.onmouseout = () => {
                if (!isSelected) {
                    card.style.transform = 'translateY(0)';
                    card.style.background = 'var(--glass-bg)';
                }
            };

            card.onclick = () => {
                selectedUseCaseId = uc.id;
                renderTimeline(); // Re-render to update highlight
                renderForm();
            };

            const cardTitle = document.createElement('div');
            cardTitle.textContent = uc.title || '(Sem Título)';
            cardTitle.style.fontWeight = 'bold';
            cardTitle.style.marginBottom = '6px';
            cardTitle.style.color = isSelected ? 'var(--status-blue)' : 'var(--text-white)';
            cardTitle.style.whiteSpace = 'nowrap';
            cardTitle.style.overflow = 'hidden';
            cardTitle.style.textOverflow = 'ellipsis';
            cardTitle.style.fontSize = '1.05rem';

            const cardDate = document.createElement('div');
            cardDate.textContent = formatDate(uc.updatedAt || uc.createdAt);
            cardDate.style.fontSize = '0.8rem';
            cardDate.style.color = 'rgba(255,255,255,0.6)';

            card.appendChild(cardTitle);
            card.appendChild(cardDate);
            timelineContainer.appendChild(card);
        });
    };

    const createField = (labelText, key, isTextArea = true) => {
        const wrapper = document.createElement('div');
        wrapper.style.marginBottom = '8px';

        const label = document.createElement('label');
        label.textContent = labelText;
        label.style.display = 'block';
        label.style.marginBottom = '4px';
        label.style.color = 'var(--status-blue)';
        label.style.fontWeight = '600';
        label.style.fontSize = '0.9rem';
        label.style.textTransform = 'uppercase';
        label.style.letterSpacing = '1px';

        const input = isTextArea ? document.createElement('textarea') : document.createElement('input');

        // Premium Input Styles
        input.style.width = '100%';
        input.style.background = 'rgba(255,255,255,0.05)';
        input.style.border = '1px solid rgba(255,255,255,0.1)';
        input.style.borderRadius = '8px';
        input.style.padding = '8px';
        input.style.color = 'var(--text-white)';
        input.style.fontFamily = 'inherit';
        input.style.boxSizing = 'border-box';
        input.style.fontSize = '1rem';
        input.style.transition = 'border-color 0.2s, background 0.2s';

        input.onfocus = () => {
            input.style.borderColor = 'var(--status-blue)';
            input.style.background = 'rgba(255,255,255,0.1)';
            input.style.outline = 'none';
        };
        input.onblur = () => {
            input.style.borderColor = 'rgba(255,255,255,0.1)';
            input.style.background = 'rgba(255,255,255,0.05)';
        };

        if (isTextArea) {
            input.style.minHeight = '50px';
            input.style.resize = 'vertical';
        } else {
            input.type = 'text';
        }

        input.dataset.key = key;

        wrapper.appendChild(label);
        wrapper.appendChild(input);
        return { wrapper, input };
    };

    const renderForm = () => {
        formContainer.innerHTML = '';

        // Mode Label
        const modeLabel = document.createElement('h3');
        if (selectedUseCaseId) {
            modeLabel.textContent = window.getUIText ? window.getUIText('editUseCase') : 'Editar Caso de Uso';
        } else {
            modeLabel.textContent = window.getUIText ? window.getUIText('createUseCase') : 'Criar Novo Caso de Uso';
        }
        modeLabel.style.marginBottom = '24px';
        modeLabel.style.color = 'rgba(255,255,255,0.9)';
        modeLabel.style.fontSize = '1.2rem';
        modeLabel.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
        modeLabel.style.paddingBottom = '12px';
        formContainer.appendChild(modeLabel);

        // Get data if editing
        let data = {};
        if (selectedUseCaseId) {
            data = window.dashboardData.useCases.find(u => u.id === selectedUseCaseId) || {};
        }

        // Layout Grid

        // Date & Title Row
        const dateTitleRow = document.createElement('div');
        dateTitleRow.style.display = 'grid';
        dateTitleRow.style.gridTemplateColumns = '1fr 3fr';
        dateTitleRow.style.gap = '15px';

        // Date
        const dateField = createField('Data', 'date', false);
        dateField.input.type = 'date';
        // Default to today if no date or new
        if (data.date) {
            dateField.input.value = data.date;
        } else {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            dateField.input.value = `${year}-${month}-${day}`;
        }

        // Title
        const titleField = createField('Use Case Title', 'title', false); // Input
        titleField.input.value = data.title || '';

        dateTitleRow.appendChild(dateField.wrapper);
        dateTitleRow.appendChild(titleField.wrapper);
        formContainer.appendChild(dateTitleRow);

        // Executive Summary
        const summaryField = createField('Executive Summary', 'executiveSummary');
        summaryField.input.value = data.executiveSummary || '';
        formContainer.appendChild(summaryField.wrapper);

        // Problem & Solution Row
        const row1 = document.createElement('div');
        row1.style.display = 'grid';
        row1.style.gridTemplateColumns = '1fr 1fr';
        row1.style.gap = '15px';

        const problemField = createField('Problem', 'problem');
        problemField.input.value = data.problem || '';

        const solutionField = createField('Solution', 'solution');
        solutionField.input.value = data.solution || '';

        row1.appendChild(problemField.wrapper);
        row1.appendChild(solutionField.wrapper);
        formContainer.appendChild(row1);

        // Product & Value Row (Product smaller)
        const row2 = document.createElement('div');
        row2.style.display = 'grid';
        row2.style.gridTemplateColumns = '1fr 3fr'; // 1/4 and 3/4
        row2.style.gap = '15px';

        const productField = createField('Product', 'product', true);
        productField.input.value = data.product || '';
        productField.input.style.minHeight = '60px';

        const valueField = createField('Value', 'value');
        valueField.input.value = data.value || '';
        valueField.input.style.minHeight = '60px';

        row2.appendChild(productField.wrapper);
        row2.appendChild(valueField.wrapper);
        formContainer.appendChild(row2);

        // Future Ambitions
        const futureField = createField('Future Ambitions', 'futureAmbitions');
        futureField.input.value = data.futureAmbitions || '';
        formContainer.appendChild(futureField.wrapper);

        // Save Button
        const btnSave = document.createElement('button');
        btnSave.textContent = 'Save Use Case';
        btnSave.className = 'btn-premium';
        // Green save button logic manually applied or use a specific class
        btnSave.style.background = 'var(--status-green)';
        btnSave.style.color = '#000';
        btnSave.style.marginTop = '10px';
        // btnSave hover
        btnSave.onmouseover = () => btnSave.style.opacity = '0.9';
        btnSave.onmouseout = () => btnSave.style.opacity = '1';

        btnSave.onclick = () => {
            saveUseCase(
                dateField.input.value,
                titleField.input.value,
                summaryField.input.value,
                problemField.input.value,
                solutionField.input.value,
                productField.input.value,
                valueField.input.value,
                futureField.input.value
            );
        };

        formContainer.appendChild(btnSave);
    };

    const saveUseCase = (date, title, summary, problem, solution, product, value, ambitions) => {
        if (!title) {
            if (window.showAlert) {
                window.showAlert('Por favor, adicione um título ao Caso de Uso.');
            } else {
                alert('Por favor, adicione um título ao Caso de Uso.');
            }
            return;
        }

        const now = new Date().toISOString();

        if (selectedUseCaseId) {
            // Update
            const index = window.dashboardData.useCases.findIndex(u => u.id === selectedUseCaseId);
            if (index !== -1) {
                window.dashboardData.useCases[index] = {
                    ...window.dashboardData.useCases[index],
                    title,
                    date,
                    executiveSummary: summary,
                    problem,
                    solution,
                    product,
                    value,
                    futureAmbitions: ambitions,
                    updatedAt: now
                };
            }
        } else {
            // Create
            const newId = Date.now();
            window.dashboardData.useCases.push({
                id: newId,
                title,
                date,
                executiveSummary: summary,
                problem,
                solution,
                product,
                value,
                futureAmbitions: ambitions,
                createdAt: now,
                updatedAt: now
            });
            selectedUseCaseId = newId; // Select the new one
        }

        // Save to LocalStorage
        if (window.saveData) {
            window.saveData();
        }

        // Refresh view
        renderTimeline();
        renderForm(); // Re-render form to show "Success" state or update title in view if needed

        // Visual feedback
        if (window.showToast) {
            window.showToast('Caso de uso salvo com sucesso!');
        } else {
            if (window.showAlert) {
                window.showAlert('Salvo com sucesso!');
            } else {
                alert('Salvo com sucesso!');
            }
        }
    };

    // Initialize
    renderTimeline();
    renderForm(); // Default to "New"

    return container;
};
