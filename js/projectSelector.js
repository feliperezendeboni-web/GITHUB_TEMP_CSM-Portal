window.renderProjectSelector = async function (container) {
    container.innerHTML = '';

    const currentLang = localStorage.getItem('dashboard_language') || 'pt';

    // --- Localization Dictionary ---
    const i18n = {
        pt: {
            customerExperience: "Experiência do Cliente",
            myProjects: "Meus Projetos",
            selectProject: "Selecione um projeto para continuar ou crie um novo para começar",
            newProject: "Novo Projeto",
            projectValues: "Valores do Projeto",
            updated: "Atualizado em",
            archivedProjects: "Projetos Arquivados",
            rename: "Renomear",
            archive: "Arquivar",
            unarchive: "Desarquivar",
            delete: "Excluir",
            confirmDelete: "Tem certeza que deseja excluir o projeto",
            confirmUnarchive: "Deseja desarquivar este projeto para abri-lo?",
            createModalTitle: "Novo Projeto",
            renameModalTitle: "Renomear Projeto",
            placeholderProjectName: "Nome do Projeto",
            cancel: "Cancelar",
            create: "Criar",
            save: "Salvar",
            designedBy: "Desenvolvido por",
            // Context Section
            contextTitle: "Workspace do Projeto",
            searchProjects: "Buscar projetos ou Account ID...",
            // Feedback
            feedbackBtn: "Feedback POC",
            feedbackTitle: "Mural de Feedback POC",
            feedbackIntro: "Compartilhe suas sugestões, bugs ou ideias para melhorar esta ferramenta.",
            feedbackPlaceholderName: "Seu Nome (Opcional)",
            feedbackPlaceholderMsg: "Descreva sua sugestão ou problema...",
            submit: "Enviar Feedback",
            typeFeature: "Sugestão",
            typeBug: "Bug / Erro",
            typeOther: "Outro",
            importProject: "Importar Projeto",
            importSuccess: "Projeto importado com sucesso!",
            importError: "Erro ao importar: Arquivo inválido."
        },
        en: {
            customerExperience: "Customer Experience",
            myProjects: "My Projects",
            selectProject: "Select a project to continue or create a new one to start",
            newProject: "New Project",
            projectValues: "Project Values",
            updated: "Updated on",
            archivedProjects: "Archived Projects",
            rename: "Rename",
            archive: "Archive",
            unarchive: "Unarchive",
            delete: "Delete",
            confirmDelete: "Are you sure you want to delete project",
            confirmUnarchive: "Do you want to unarchive this project to open it?",
            createModalTitle: "New Project",
            renameModalTitle: "Rename Project",
            placeholderProjectName: "Project Name",
            cancel: "Cancel",
            create: "Create",
            save: "Save",
            designedBy: "Designed by",
            // Context Section
            contextTitle: "Project Workspace",
            searchProjects: "Search projects or Account ID...",
            // Feedback
            feedbackBtn: "Feedback POC",
            feedbackTitle: "POC Feedback Wall",
            feedbackIntro: "Share your suggestions, bugs, or ideas to improve this tool.",
            feedbackPlaceholderName: "Your Name (Optional)",
            feedbackPlaceholderMsg: "Describe your suggestion or issue...",
            submit: "Submit Feedback",
            typeFeature: "Suggestion",
            typeBug: "Bug / Issue",
            typeOther: "Other",
            importProject: "Import Project",
            importSuccess: "Project imported successfully!",
            importError: "Error importing: Invalid file."
        },
        es: {
            customerExperience: "Experiencia del Cliente",
            myProjects: "Mis Proyectos",
            selectProject: "Seleccione un proyecto para continuar o cree uno nuevo para comenzar",
            newProject: "Nuevo Proyecto",
            projectValues: "Valores del Proyecto",
            updated: "Actualizado en",
            archivedProjects: "Proyectos Archivados",
            rename: "Renombrar",
            archive: "Archivar",
            unarchive: "Desarchivar",
            delete: "Eliminar",
            confirmDelete: "¿Está seguro de que desea eliminar el proyecto",
            confirmUnarchive: "¿Desea desarchivar este proyecto para abrirlo?",
            createModalTitle: "Nuevo Proyecto",
            renameModalTitle: "Renombrar Proyecto",
            placeholderProjectName: "Nombre del Proyecto",
            cancel: "Cancelar",
            create: "Crear",
            save: "Guardar",
            designedBy: "Desarrollado por",
            // Context Section
            contextTitle: "Espacio de Trabajo del Proyecto",
            searchProjects: "Buscar proyectos o Account ID...",
            // Feedback
            feedbackBtn: "Feedback POC",
            feedbackTitle: "Muro de Feedback POC",
            feedbackIntro: "Comparta sus sugerencias, errores o ideas para mejorar esta herramienta.",
            feedbackPlaceholderName: "Su Nombre (Opcional)",
            feedbackPlaceholderMsg: "Describa su sugerencia o problema...",
            submit: "Enviar Feedback",
            typeFeature: "Sugerencia",
            typeBug: "Error / Bug",
            typeOther: "Otro",
            importProject: "Importar Proyecto",
            importSuccess: "¡Proyecto importado con éxito!",
            importError: "Error al importar: Archivo inválido."
        },
        jp: {
            customerExperience: "カスタマーエクスペリエンス",
            myProjects: "マイプロジェクト",
            selectProject: "続行するプロジェクトを選択するか、新しいプロジェクトを作成してください",
            newProject: "新しいプロジェクト",
            projectValues: "プロジェクトの値",
            updated: "更新日",
            archivedProjects: "アーカイブされたプロジェクト",
            rename: "名前を変更",
            archive: "アーカイブ",
            unarchive: "アーカイブ解除",
            delete: "削除",
            confirmDelete: "プロジェクトを削除してもよろしいですか",
            confirmUnarchive: "このプロジェクトをアーカイブ解除して開きますか？",
            createModalTitle: "新しいプロジェクト",
            renameModalTitle: "プロジェクト名を変更",
            placeholderProjectName: "プロジェクト名",
            cancel: "キャンセル",
            create: "作成",
            save: "保存",
            designedBy: "設計者",
            // Context Section
            contextTitle: "プロジェクトワークスペース",
            searchProjects: "プロジェクトまたはアカウントIDを検索...",
            // Feedback
            feedbackBtn: "フィードバック POC",
            feedbackTitle: "POCフィードバックウォール",
            feedbackIntro: "このツールを改善するための提案、バグ、またはアイデアを共有してください。",
            feedbackPlaceholderName: "あなたの名前（任意）",
            feedbackPlaceholderMsg: "提案や問題を説明してください...",
            submit: "フィードバックを送信",
            typeFeature: "提案",
            typeBug: "バグ / エラー",
            typeOther: "その他",
            importProject: "プロジェクトをインポート",
            importSuccess: "プロジェクトが正常にインポートされました！",
            importError: "インポートエラー：無効なファイル。"
        }
    };

    const t = i18n[currentLang] || i18n.pt;

    // Create styles for selector
    const style = document.createElement('style');
    style.textContent = `
        .project-selector-container {
            max-width: 1000px; /* Constrain width for centered look */
            margin: 0 auto;
            text-align: center;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            padding: 10px 20px;
        }

        /* HEADER */
        .selector-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 0px;
            width: 100%;
        }
        .selector-logo img {
            height: 60px; /* Slightly smaller to match reference */
        }
        
        .main-title-block {
            text-align: center;
            margin-bottom: 20px;
        }
        .main-title-block h1 {
            font-size: 3.5rem;
            font-weight: 700;
            color: white;
            margin: 0 0 10px 0;
            line-height: 1.1;
        }
        .main-title-block p {
            font-size: 1.25rem;
            color: var(--status-blue);
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: 600;
            opacity: 0.9;
            margin: 0;
        }
        
        .intro-text {
            color: rgba(255,255,255,0.7);
            font-size: 1rem;
            max-width: 700px;
            margin: 0 auto 50px auto;
            line-height: 1.6;
        }

        /* PROJECTS GRID */
        .projects-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); /* Wider cards */
            gap: 30px;
            width: 100%;
            margin-bottom: 60px;
        }

        /* CARD STYLES */
        .project-card {
            background: rgba(0, 18, 38, 0.6); /* Darker blue bg */
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 30px;
            text-align: left;
            position: relative;
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            min-height: 220px;
            display: flex;
            flex-direction: column;
        }
        
        /* New Project Card */
        .project-card.create-new {
            background: rgba(255, 255, 255, 0.02);
            border: 2px dashed rgba(0, 163, 196, 0.5); /* Alteryx Teal dashed */
            align-items: center;
            justify-content: center;
            cursor: pointer;
            text-align: center;
        }
        .project-card.create-new:hover {
            background: rgba(57, 204, 204, 0.05);
            border-color: var(--status-blue);
            transform: translateY(-5px);
        }
        .create-icon {
            font-size: 3rem;
            font-weight: 300;
            color: white;
            margin-bottom: 10px;
        }
        .create-title {
            font-size: 1.4rem;
            font-weight: bold;
            color: white;
            margin-bottom: 5px;
        }
        .create-subtitle {
            font-size: 0.9rem;
            color: rgba(255,255,255,0.5);
        }

        /* Existing Project Card */
        .project-card-link {
            /* Inherits flex from .project-card */
        }
        .project-card-link:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            border-color: rgba(255,255,255,0.2);
        }

        .project-name {
            font-size: 1.5rem;
            font-weight: bold;
            color: white;
            margin-bottom: 5px;
        }
        .project-date {
            font-size: 0.9rem;
            color: rgba(255,255,255,0.5);
            margin-bottom: 30px;
        }

        .btn-open-project {
            background: var(--table-header-bg); /* Alteryx Blue */
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            width: fit-content;
            transition: background 0.2s;
            text-decoration: none;
            align-self: flex-start;
            margin-top: auto;
        }
        .btn-open-project:hover {
            background: #00558F;
        }

        /* Secondary Actions (Bottom Right) */
        .card-actions {
            position: absolute;
            bottom: 25px;
            right: 25px;
            top: auto; /* Override previous */
            display: flex;
            gap: 8px;
            opacity: 1; /* Always visible or hover? Ref suggests visible */
        }
        .btn-icon-action {
            width: 32px;
            height: 32px;
            border-radius: 6px;
            background: rgba(255,255,255,0.1);
            border: none;
            color: rgba(255,255,255,0.7);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        .btn-icon-action:hover {
            background: rgba(255,255,255,0.2);
            color: white;
        }
        .btn-icon-action.delete:hover {
            background: var(--status-red);
        }

        /* What is this workspace (Collapsible) */
        .info-bar {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            width: 100%;
            overflow: hidden;
            text-align: left;
            transition: all 0.3s ease;
        }
        .info-header {
            padding: 15px 25px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
        }
        .info-header:hover {
            background: rgba(255,255,255,0.02);
        }
        .info-title {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
            color: rgba(255,255,255,0.9);
        }
        .info-icon {
            background: rgba(255,255,255,0.2);
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-style: italic;
            font-family: serif;
            font-weight: bold;
        }
        .info-content {
            padding: 0 25px 25px 25px;
            color: rgba(255,255,255,0.7);
            line-height: 1.6;
            display: none; /* Collapsed by default */
            font-size: 0.95rem;
        }
        .info-content p { margin-bottom: 10px; }

        .project-footer {
            margin-top: 50px;
            color: rgba(255,255,255,0.2);
            font-size: 0.8rem;
        }
    `;
    container.appendChild(style);

    const wrapper = document.createElement('div');
    wrapper.className = 'project-selector-container';

    // --- Top Bar (Logo + Lang) ---
    const topBar = document.createElement('div');
    topBar.className = 'selector-header';

    // 1. Alteryx Logo (Left)
    const logoDiv = document.createElement('div');
    logoDiv.className = 'selector-logo';
    logoDiv.innerHTML = '<img src="images/alteryx_logo_v3.jpg" alt="Alteryx">';
    topBar.appendChild(logoDiv);

    // 3. Right Group (Feedback + Language)
    const rightGroup = document.createElement('div');
    rightGroup.style.display = 'flex';
    rightGroup.style.gap = '15px';
    rightGroup.style.alignItems = 'center';

    // Feedback Button
    const btnFeedback = document.createElement('button');
    btnFeedback.innerHTML = `<span>💬</span> ${t.feedbackBtn}`;
    btnFeedback.className = 'btn-premium'; // Reuse existing class if available or define inline styles
    btnFeedback.style.cssText = `
        background: rgba(255, 165, 0, 0.15); 
        color: #ffca28; 
        border: 1px solid rgba(255, 165, 0, 0.3);
        padding: 6px 12px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s;
        font-size: 0.9rem;
    `;
    btnFeedback.onmouseover = () => {
        btnFeedback.style.background = 'rgba(255, 165, 0, 0.25)';
        btnFeedback.style.borderColor = '#ffca28';
    };
    btnFeedback.onmouseout = () => {
        btnFeedback.style.background = 'rgba(255, 165, 0, 0.15)';
        btnFeedback.style.borderColor = 'rgba(255, 165, 0, 0.3)';
    };
    btnFeedback.onclick = () => showFeedbackModal();
    rightGroup.appendChild(btnFeedback);



    // Helper for Import Logic
    const handleImportFlow = () => {
        const importInput = document.createElement('input');
        importInput.type = 'file';
        importInput.accept = '.json';
        importInput.style.display = 'none';
        importInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (ev) => {
                try {
                    const json = JSON.parse(ev.target.result);
                    if (!json) throw new Error("Empty JSON");
                    const name = (json.projectName || file.name.replace('.json', '')) + " (Import)";
                    const accountId = json.accountId || "";
                    const engagement = json.engagementType || "Lite";

                    const newId = await window.ProjectManager.createProject(name, accountId, engagement);

                    // Ensure the ID in the data matches the new project ID?
                    // Not strictly necessary as dashboardData usually doesn't store its own ID, ProjectManager maps ID to Data.
                    // But let's check.

                    await window.ProjectManager.saveProjectData(newId, json);

                    window.renderProjectSelector(container);
                    alert(t.importSuccess);
                } catch (err) {
                    console.error(err);
                    alert(t.importError);
                }
            };
            reader.readAsText(file);
        };
        // Ensure input is part of DOM so it works? Usually not needed but safe.
        // document.body.appendChild(importInput); 

        importInput.click();
    };



    // Language Selector (Right) - Updated to match main.js style
    const langDiv = document.createElement('div');
    langDiv.className = 'selector-lang';
    langDiv.style.cssText = 'display: flex; align-items: center; gap: 5px; background: rgba(255, 255, 255, 0.05); padding: 4px 8px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.2);';

    // Globe Icon
    const globe = document.createElement('label');
    globe.textContent = '🌐';
    globe.style.marginRight = '5px';
    langDiv.appendChild(globe);

    ['pt', 'en', 'es', 'jp'].forEach(lang => {
        const btn = document.createElement('button');
        btn.textContent = lang.toUpperCase();

        const isActive = currentLang === lang;
        btn.style.cssText = `
            background: ${isActive ? 'var(--table-header-bg)' : 'transparent'};
            color: white;
            border: 1px solid ${isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'};
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-size: 0.8rem;
            transition: all 0.2s;
        `;

        if (!isActive) {
            btn.onclick = () => {
                localStorage.setItem('dashboard_language', lang);
                window.location.reload();
            };
        }

        langDiv.appendChild(btn);
    });

    rightGroup.appendChild(langDiv);



    topBar.appendChild(rightGroup);
    wrapper.appendChild(topBar);

    // --- Main Title & Intro ---
    const titleBlock = document.createElement('div');
    titleBlock.className = 'main-title-block';
    titleBlock.innerHTML = `
        <h1>${t.myProjects}</h1>
        <p>${t.customerExperience} <span style="color: var(--status-blue); font-weight: bold;">POC</span></p>
        <div style="font-size: 0.75rem; color: rgba(255, 255, 255, 0.3); margin-top: 8px; font-weight: 300; letter-spacing: 1px;">Designed by Felipe Boni - Customer Success Manager</div>
    `;
    wrapper.appendChild(titleBlock);

    const introText = document.createElement('div');
    introText.className = 'intro-text';
    // Use the first paragraph of context body or full? 
    // Reference image has "Project Workspace - CX Proof of Concept" then a short paragraph.
    // Let's adapt contextBody content slightly or use it as is but centered.
    // We'll strip HTML tags for the clean center text or just render it.
    introText.innerHTML = `
        <div style="font-weight:600; font-size:1.1rem; color:white; margin-bottom:10px;">${t.contextTitle}</div>
        ${t.contextBody}
    `;
    // wrapper.appendChild(introText); // User's ref image puts this at the bottom inside "What is this workspace?".
    // Wait, ref image has "Project Workspace - CX..." under title. Let's place it here.
    // Actually the image shows: "Project Workspace - CX Proof of Concept" centered under My Projects.
    // Then the grid.
    // Then "What is this workspace?" bar at bottom.

    // Let's follow the image closely:
    // Header -> My Projects / Customer Experience POC
    // Sub-header -> Project Workspace - CX Proof of Concept
    // Text -> "This POC explores..." (short)
    // Grid
    // Collapsible "What is this workspace?" (maybe full details there?)

    const subIntro = document.createElement('div');
    subIntro.className = 'intro-text';
    subIntro.innerHTML = `
        <div style="opacity:0.8;">${t.selectProject}</div>
    `;
    wrapper.appendChild(subIntro);


    // --- Search / Filter ---
    const searchContainer = document.createElement('div');
    searchContainer.style.cssText = 'margin: 0 auto 40px auto; max-width: 500px; position: relative;';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '🔍 ' + (t.searchProjects || "Search projects or Account ID...");
    searchInput.style.cssText = `
        width: 100%;
        padding: 12px 20px;
        border-radius: 30px;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        color: white;
        font-size: 1rem;
        outline: none;
        transition: all 0.3s;
        text-align: center;
    `;
    searchInput.onfocus = () => searchInput.style.background = 'rgba(255,255,255,0.1)';
    searchInput.onblur = () => searchInput.style.background = 'rgba(255,255,255,0.05)';

    searchContainer.appendChild(searchInput);
    wrapper.appendChild(searchContainer);


    // --- Projects Data ---
    const projects = await window.ProjectManager.getProjects();
    projects.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified)); // Sort desc

    // --- Projects Grid ---
    const projectsList = document.createElement('div');
    projectsList.className = 'projects-list';

    // Function to render the grid content
    const renderGrid = (filterText = '') => {
        projectsList.innerHTML = '';
        const lowerFilter = filterText.toLowerCase();

        // 1. Create New Card (Always visible unless strict filter? Let's keep it)
        const createCard = document.createElement('div');
        createCard.className = 'project-card create-new';
        createCard.innerHTML = `
            <div class="create-icon">+</div>
            <div class="create-title">${t.newProject}</div>
            <div class="create-subtitle">Create a new customer workspace</div>
        `;
        createCard.onclick = () => showCreateModal();
        projectsList.appendChild(createCard);

        const filteredProjects = projects.filter(p => {
            const matchName = (p.name || '').toLowerCase().includes(lowerFilter);
            const matchId = String(p.accountId || '').toLowerCase().includes(lowerFilter);
            return matchName || matchId;
        });

        const activeProjects = filteredProjects.filter(p => !p.archived);
        const archivedProjects = filteredProjects.filter(p => p.archived);

        activeProjects.forEach(p => projectsList.appendChild(renderProjectCard(p, false)));
        archivedProjects.forEach(p => projectsList.appendChild(renderProjectCard(p, true)));
    };

    // 2. renderProjectCard
    const renderProjectCard = (p, isArchived) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        if (isArchived) {
            card.style.opacity = '0.7';
            card.style.background = 'rgba(255,255,255,0.03)';
        }

        const localeMap = { 'en': 'en-US', 'es': 'es-ES', 'jp': 'ja-JP', 'pt': 'pt-BR' };
        const locale = localeMap[currentLang] || 'pt-BR';
        const dateStr = new Date(p.lastModified).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
        const accountIdHtml = p.accountId ? `<div style="font-size: 0.85rem; color: var(--status-blue); margin-top: -2px; margin-bottom: 8px;">ID: ${p.accountId}</div>` : '';

        card.innerHTML = `
            <div class="project-name">${p.name}</div>
            ${accountIdHtml}
            <div class="project-date">Updated: ${dateStr}</div>
            ${!isArchived ? `<button class="btn-open-project">Open Project</button>` : ''}
            
            <div class="card-actions">
                 <button class="btn-icon-action" title="${t.rename}" data-action="rename">✏️</button>
                 <button class="btn-icon-action archive" title="${isArchived ? t.unarchive : t.archive}" data-action="archive">${isArchived ? '📂' : '📋'}</button>
                 ${isArchived ? `<button class="btn-icon-action delete" title="${t.delete}" data-action="delete">🗑️</button>` : ''}
            </div>
        `;

        // Click Handler (Open Project)
        const openBtn = card.querySelector('.btn-open-project');
        if (openBtn) {
            openBtn.onclick = (e) => {
                e.stopPropagation();
                window.ProjectManager.setCurrentProjectId(p.id);
                location.reload();
            };
        }

        // Card Body Click (optional, maybe same as open?)
        card.onclick = async (e) => {
            if (e.target.closest('button')) return;
            if (isArchived) {
                if (confirm(t.confirmUnarchive)) {
                    await window.ProjectManager.toggleArchiveProject(p.id);
                    window.renderProjectSelector(container);
                }
            } else {
                window.ProjectManager.setCurrentProjectId(p.id);
                location.reload();
            }
        };

        // Actions
        const actions = card.querySelector('.card-actions');

        actions.querySelector('[data-action="rename"]').onclick = (e) => {
            e.stopPropagation();
            showRenameModal(p);
        };
        actions.querySelector('[data-action="archive"]').onclick = async (e) => {
            e.stopPropagation();
            await window.ProjectManager.toggleArchiveProject(p.id);
            window.renderProjectSelector(container);
        };

        const deleteBtn = actions.querySelector('[data-action="delete"]');
        if (deleteBtn) {
            deleteBtn.onclick = async (e) => {
                e.stopPropagation();
                if (confirm(`${t.confirmDelete} "${p.name}"?`)) {
                    await window.ProjectManager.deleteProject(p.id);
                    window.renderProjectSelector(container);
                }
            };
        }

        return card;
    };

    // Initial Render
    renderGrid();

    // Search Handler
    searchInput.oninput = (e) => {
        renderGrid(e.target.value);
    };

    wrapper.appendChild(projectsList);

    // --- Bottom Action Area (Import) ---
    const bottomActions = document.createElement('div');
    bottomActions.style.cssText = 'display: flex; justify-content: center; margin-bottom: 40px;';

    const btnBottomImport = document.createElement('button');
    btnBottomImport.innerHTML = `<span>📂</span> ${t.importProject}`;
    btnBottomImport.className = 'btn-premium';
    btnBottomImport.style.cssText = `
        background: rgba(255, 255, 255, 0.05);
        color: rgba(255, 255, 255, 0.8);
        border: 1px dashed rgba(255, 255, 255, 0.3);
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s;
        font-size: 0.95rem;
    `;
    btnBottomImport.onmouseover = () => {
        btnBottomImport.style.background = 'rgba(255, 255, 255, 0.1)';
        btnBottomImport.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        btnBottomImport.style.color = 'white';
    };
    btnBottomImport.onmouseout = () => {
        btnBottomImport.style.background = 'rgba(255, 255, 255, 0.05)';
        btnBottomImport.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        btnBottomImport.style.color = 'rgba(255, 255, 255, 0.8)';
    };
    btnBottomImport.onclick = handleImportFlow;

    bottomActions.appendChild(btnBottomImport);
    wrapper.appendChild(bottomActions);

    // --- Info Bar (What is this workspace?) ---
    const infoBar = document.createElement('div');
    infoBar.className = 'info-bar';

    const infoHeader = document.createElement('div');
    infoHeader.className = 'info-header';
    infoHeader.innerHTML = `
        <div class="info-title">
            <div class="info-icon">i</div>
            ${window.getUIText('readMeTitle')}
        </div>
        <div class="toggle-icon">▶</div>
    `;

    const infoContent = document.createElement('div');
    infoContent.className = 'info-content';
    infoContent.innerHTML = window.getUIText('readMeContent');

    infoHeader.onclick = () => {
        const isClosed = infoContent.style.display === 'none' || infoContent.style.display === '';
        infoContent.style.display = isClosed ? 'block' : 'none';
        infoHeader.querySelector('.toggle-icon').textContent = isClosed ? '▼' : '▶';
    };

    infoBar.appendChild(infoHeader);
    infoBar.appendChild(infoContent);
    wrapper.appendChild(infoBar);


    // --- Footer ---
    const footer = document.createElement('footer');
    footer.className = 'project-footer';
    // Use saved suzano logo or default if available, but for selector maybe just default?
    // Main page footer uses default suzano logo mostly.
    footer.innerHTML = `
        <span>${t.designedBy} Felipe Boni</span>
    `;
    wrapper.appendChild(footer);

    container.appendChild(wrapper);

    // --- Modals ---
    function showCreateModal() {
        removeExistingModal();
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <h3 class="modal-title">${t.createModalTitle}</h3>
                
                <div class="modal-input-group">
                    <label class="modal-label">Project Name</label>
                    <input type="text" id="input-name" class="modal-input" placeholder="${t.placeholderProjectName}">
                </div>

                <div class="modal-input-group">
                    <label class="modal-label">CSM Engagement</label>
                    <select id="input-engagement" class="modal-input" style="cursor: pointer;">
                        <option value="Lite">Lite</option>
                        <option value="Premier Success">Premier Success</option>
                        <option value="Premier Success Plus">Premier Success Plus</option>
                    </select>
                </div>
                
                <div class="modal-input-group">
                    <label class="modal-label">Account ID</label>
                    <input type="text" id="input-account-id" class="modal-input" placeholder="Ex: 123456">
                </div>

                <div class="modal-footer">
                    <button class="btn btn-secondary" id="btn-cancel">${t.cancel}</button>
                    <button class="btn btn-primary" id="btn-confirm">${t.create}</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const inputName = modal.querySelector('#input-name');
        const inputId = modal.querySelector('#input-account-id');
        const inputEngagement = modal.querySelector('#input-engagement');
        const btnConfirm = modal.querySelector('#btn-confirm');

        inputName.focus();

        const handleCreate = async () => {
            const name = inputName.value.trim();
            const accountId = inputId.value.trim();
            const engagement = inputEngagement.value;
            if (name) {
                const id = await window.ProjectManager.createProject(name, accountId, engagement);
                window.ProjectManager.setCurrentProjectId(id);
                location.reload();
            }
        };

        btnConfirm.onclick = handleCreate;

        modal.querySelector('#btn-cancel').onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        inputName.onkeypress = (e) => { if (e.key === 'Enter') btnConfirm.click(); };
        inputId.onkeypress = (e) => { if (e.key === 'Enter') btnConfirm.click(); };
    }

    function showRenameModal(project) {
        removeExistingModal();
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
             <div class="modal-content">
                <h3 class="modal-title">Edit Project</h3>
                
                <div class="modal-input-group">
                    <label class="modal-label">Project Name</label>
                    <input type="text" id="edit-name" class="modal-input" placeholder="${t.placeholderProjectName}" value="${project.name}">
                </div>

                <div class="modal-input-group">
                    <label class="modal-label">Account ID</label>
                    <input type="text" id="edit-account-id" class="modal-input" placeholder="Account ID" value="${project.accountId || ''}">
                </div>

                <div class="modal-footer">
                    <button class="btn btn-secondary" id="btn-cancel">${t.cancel}</button>
                    <button class="btn btn-primary" id="btn-confirm">${t.save}</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const inputName = modal.querySelector('#edit-name');
        const inputId = modal.querySelector('#edit-account-id');
        const btnConfirm = modal.querySelector('#btn-confirm');

        inputName.focus();

        btnConfirm.onclick = async () => {
            const name = inputName.value.trim();
            const accountId = inputId.value.trim();
            if (name) {
                await window.ProjectManager.updateProject(project.id, {
                    name: name,
                    accountId: accountId
                });
                window.renderProjectSelector(container);
                modal.remove();
            }
        };

        modal.querySelector('#btn-cancel').onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        inputName.onkeypress = (e) => { if (e.key === 'Enter') btnConfirm.click(); };
        inputId.onkeypress = (e) => { if (e.key === 'Enter') btnConfirm.click(); };
    }

    function removeExistingModal() {
        const existing = document.querySelector('.modal-overlay');
        if (existing) existing.remove();
    }

    function showFeedbackModal() {
        removeExistingModal();
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        // Inline styles for feedback specific layout
        const modalStyle = `
            width: 800px;
            max-width: 95%;
            background: #001f3f;
            display: grid;
            grid-template-rows: auto 1fr;
            max-height: 85vh;
            padding: 0;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.15);
            box-shadow: 0 10px 50px rgba(0,0,0,0.8);
        `;

        modal.innerHTML = `
             <div class="modal-content" style="${modalStyle}">
                <div style="padding: 25px 25px 15px 25px; border-bottom: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <h3 class="modal-title" style="margin:0; font-size: 1.5rem; display:flex; align-items:center; gap:10px;">
                            <span style="font-size:1.8rem;">💡</span> ${t.feedbackTitle}
                        </h3>
                        <button id="btn-close-fb" style="background:none; border:none; color:white; font-size:1.5rem; cursor:pointer;">&times;</button>
                    </div>
                    <p style="color:rgba(255,255,255,0.6); margin:0;">${t.feedbackIntro}</p>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1.5fr; gap:0; overflow:hidden; height:100%;">
                    <!-- Left: Form -->
                    <div style="padding: 25px; border-right: 1px solid rgba(255,255,255,0.1); overflow-y:auto; background: rgba(255,255,255,0.02);">
                        <div class="modal-input-group">
                            <label class="modal-label">${t.feedbackPlaceholderName}</label>
                            <input type="text" id="fb-name" class="modal-input" placeholder="Ex: Felipe Boni">
                        </div>

                        <div class="modal-input-group">
                            <label class="modal-label">Type</label>
                            <div style="display:flex; gap:10px;">
                                <label style="cursor:pointer; display:flex; align-items:center; gap:5px; color:white; background:rgba(255,255,255,0.05); padding:8px 12px; border-radius:4px; border:1px solid rgba(255,255,255,0.1);">
                                    <input type="radio" name="fb-type" value="Suggestion" checked> ${t.typeFeature}
                                </label>
                                <label style="cursor:pointer; display:flex; align-items:center; gap:5px; color:white; background:rgba(255,255,255,0.05); padding:8px 12px; border-radius:4px; border:1px solid rgba(255,255,255,0.1);">
                                    <input type="radio" name="fb-type" value="Bug"> ${t.typeBug}
                                </label>
                            </div>
                        </div>

                        <div class="modal-input-group">
                            <label class="modal-label">Message</label>
                            <textarea id="fb-msg" class="modal-input" style="min-height:150px; resize:vertical; background: rgba(0,0,0,0.2);" placeholder="${t.feedbackPlaceholderMsg}"></textarea>
                        </div>

                        <button class="btn btn-primary" id="btn-submit-fb" style="width:100%; margin-top:10px; padding:12px;">${t.submit}</button>
                    </div>

                    <!-- Right: List -->
                    <div style="background: rgba(0,0,0,0.15); display:flex; flex-direction:column; overflow:hidden;">
                        <div style="padding: 15px 20px; background: rgba(0,0,0,0.1); border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <strong style="color:white; text-transform:uppercase; letter-spacing:1px; font-size:0.8rem; opacity:0.7;">Latest Feedback</strong>
                        </div>
                        <div id="fb-list" style="padding:20px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:15px;">
                            <!-- Items go here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Elements
        const listContainer = modal.querySelector('#fb-list');
        const btnSubmit = modal.querySelector('#btn-submit-fb');
        const btnClose = modal.querySelector('#btn-close-fb');
        const inName = modal.querySelector('#fb-name');
        const inMsg = modal.querySelector('#fb-msg');

        const renderList = async () => {
            let list = [];
            if (window.ProjectManager && window.ProjectManager.getFeedback) {
                list = await window.ProjectManager.getFeedback();
            }

            // Ensure list is an array (handle potential null/undefined from DataService)
            if (!Array.isArray(list)) list = [];

            // Sort by date desc
            list.sort((a, b) => new Date(b.date) - new Date(a.date));

            listContainer.innerHTML = '';
            if (list.length === 0) {
                listContainer.innerHTML = `<div style="text-align:center; color:rgba(255,255,255,0.3); margin-top:50px; font-style:italic;">No feedback yet. Be the first!</div>`;
                return;
            }

            list.forEach(item => {
                const el = document.createElement('div');
                el.style.cssText = `
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 8px;
                    padding: 15px;
                `;

                const dateStr = new Date(item.date).toLocaleDateString();
                const typeColor = item.type === 'Bug' ? '#FF4136' : '#2ECC40';
                const typeLabel = item.type === 'Bug' ? 'BUG' : 'IDEA';

                el.innerHTML = `
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.85rem;">
                        <span style="color:rgba(255,255,255,0.8); font-weight:bold;">${item.name}</span>
                        <span style="color:rgba(255,255,255,0.4);">${dateStr}</span>
                    </div>
                    <div style="display:flex; gap:12px; align-items:flex-start;">
                        <span style="background:${typeColor}; color:#001f3f; font-size:0.75rem; padding:3px 8px; border-radius:4px; font-weight:bold; height:fit-content; margin-top:2px; min-width:45px; text-align:center;">
                            ${typeLabel}
                        </span>
                        <div style="color:rgba(255,255,255,0.9); line-height:1.5; font-size:0.95rem; white-space:pre-wrap;">${item.message}</div>
                    </div>
                `;
                listContainer.appendChild(el);
            });
        };

        renderList();

        btnSubmit.onclick = () => {
            const msg = inMsg.value.trim();
            if (!msg) {
                alert('Please enter a message.');
                return;
            }
            const name = inName.value.trim() || 'Anonymous';
            // Get checked radio
            const selectedRadio = modal.querySelector('input[name="fb-type"]:checked');
            const typeValue = selectedRadio ? selectedRadio.value : 'Suggestion';

            // We need to map localized value back to code key if we want consistency, 
            // but here we used 'value="Suggestion"' hardcoded in HTML so it's fine.
            // Wait, I used localizable text for LABELS, but values are hardcoded in my HTML string above.
            // value="Suggestion", value="Bug". Correct.

            window.ProjectManager.addFeedback({
                name: name,
                type: typeValue,
                message: msg
            });

            // Clear and reload
            inMsg.value = '';
            renderList();
        };

        btnClose.onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    }

};
