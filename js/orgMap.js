window.renderOrgMap = function () {
    const container = document.createElement('div');
    container.className = 'org-map-container';

    // Toolbar (Add Root Child if empty?)
    const toolbar = document.createElement('div');
    toolbar.className = 'org-toolbar';
    toolbar.innerHTML = `
        <div class="org-legend">
            <span class="legend-item"><span class="dot root"></span> ${window.getUIText ? window.getUIText('root') : 'Diretoria'}</span>
            <span class="legend-item"><span class="dot area"></span> ${window.getUIText ? window.getUIText('orgArea') : 'Área'}</span>
            <span class="legend-item"><span class="dot person"></span> ${window.getUIText ? window.getUIText('orgPerson') : 'Pessoa'}</span>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
            <p class="org-hint" style="margin: 0; margin-right: 15px;">${window.t ? window.t('orgHint') : '* Clique no nome para editar...'}</p>
            <button class="btn-save-org" style="background: var(--status-blue); border: none; padding: 6px 16px; border-radius: 4px; color: #fff; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 1.2em;">💾</span> ${window.t ? window.t('saveChanges') : 'Salvar'}
            </button>
        </div>
    `;

    // Bind Save Button Event
    setTimeout(() => {
        const btnSave = container.querySelector('.btn-save-org');
        if (btnSave) {
            btnSave.onclick = () => {
                if (window.saveData) {
                    window.saveData();
                    const msg = window.t ? window.t('dataSaved') : 'Dados salvos com sucesso!';
                    if (window.showToast) window.showToast(msg);
                    else alert(msg);
                }
            };
        }
    }, 0);
    container.appendChild(toolbar);

    const mapWrapper = document.createElement('div');
    mapWrapper.className = 'org-tree-wrapper';
    container.appendChild(mapWrapper);

    const data = window.dashboardData.orgMap;

    function createNode(node, parentNode) {
        const nodeEl = document.createElement('div');
        nodeEl.className = 'org-node-wrapper';

        const card = document.createElement('div');
        card.className = `org-card type-${node.type}`;
        card.dataset.id = node.id;

        // Content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'org-card-content';

        const nameInput = document.createElement('div');
        nameInput.className = 'org-name';
        nameInput.contentEditable = true;
        nameInput.textContent = node.name || (node.type === 'root' ? 'Organization' : 'New Node');

        const roleInput = document.createElement('div');
        roleInput.className = 'org-role';
        roleInput.contentEditable = true;
        roleInput.textContent = node.role || '';
        roleInput.placeholder = 'Role/Details';

        contentDiv.appendChild(nameInput);
        contentDiv.appendChild(roleInput);
        card.appendChild(contentDiv);

        // Actions
        const actions = document.createElement('div');
        actions.className = 'org-actions';

        const btnAdd = document.createElement('button');
        btnAdd.innerHTML = '+';
        btnAdd.title = 'Add Child';
        btnAdd.className = 'btn-org-add';

        const btnRemove = document.createElement('button');
        btnRemove.innerHTML = '×';
        btnRemove.title = 'Remove';
        btnRemove.className = 'btn-org-remove';

        actions.appendChild(btnAdd);
        if (node.type !== 'root') {
            actions.appendChild(btnRemove);
        }
        card.appendChild(actions);

        nodeEl.appendChild(card);

        // Events
        const saveNode = () => {
            node.name = nameInput.textContent;
            node.role = roleInput.textContent;
            if (window.saveData) window.saveData();
        };
        nameInput.onblur = saveNode;
        roleInput.onblur = saveNode;

        btnAdd.onclick = (e) => {
            e.stopPropagation();
            addChild(node);
        };

        btnRemove.onclick = (e) => {
            e.stopPropagation();
            if (confirm(`Remove ${node.name} and all its children ? `)) {
                removeChild(parentNode, node.id);
            }
        };

        // Recursion for children
        if (node.children && node.children.length > 0) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'org-children';
            node.children.forEach(child => {
                childrenContainer.appendChild(createNode(child, node));
            });
            nodeEl.appendChild(childrenContainer);
        }

        return nodeEl;
    }

    function addChild(parentNode) {
        const typeOrder = { 'root': 'area', 'area': 'person', 'person': 'person' };

        // Allow choosing type if root? No, root always adds area. Area always adds person? 
        // Based on user request: "Preciso conseguir adicionar mais de uma area, de um root".
        // Current logic already pushes to children array, which renders horizontally via flexbox.
        // We just need to ensure the type flow is correct.

        const newType = typeOrder[parentNode.type] || 'person';

        const newId = 'node_' + Date.now();
        const newNode = {
            id: newId,
            name: newType === 'area' ? 'Nova Área' : 'Nova Pessoa',
            role: '',
            notes: '',
            type: newType,
            children: []
        };

        parentNode.children.push(newNode);
        if (window.saveData) window.saveData();
        render(); // Re-render tree
    }

    function removeChild(parentNode, childId) {
        if (!parentNode || !parentNode.children) return;
        const idx = parentNode.children.findIndex(c => c.id === childId);
        if (idx !== -1) {
            parentNode.children.splice(idx, 1);
            if (window.saveData) window.saveData();
            render();
        }
    }

    function render() {
        mapWrapper.innerHTML = '';
        if (window.dashboardData.orgMap && window.dashboardData.orgMap.root) {
            mapWrapper.appendChild(createNode(window.dashboardData.orgMap.root, null));
        }
    }

    render();
    return container;
};
