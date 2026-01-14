// Auto-translation mapping for section titles
window.sectionTitles = {
    pt: {
        'tasks': 'Tarefas',
        'support': 'Casos de Suporte Escalados',
        'initiatives': 'Entitlements',
        'opportunities': 'Oportunidades',
        'engagement': 'Engajamento Parceiro',
        'risks': 'Riscos',
        'entitlement': 'Entitlement - Horas/Tokens CX'
    },
    en: {
        'tasks': 'Tasks',
        'support': 'Escalated Support Cases',
        'initiatives': 'Entitlements',
        'opportunities': 'Opportunities',
        'engagement': 'Partner Engagement',
        'risks': 'Risks',
        'entitlement': 'Entitlement - CX Hours/Tokens'
    },
    es: {
        'tasks': 'Tareas',
        'support': 'Casos de Soporte Escalados',
        'initiatives': 'Entitlements',
        'opportunities': 'Oportunidades',
        'engagement': 'Compromiso del Socio',
        'risks': 'Riesgos',
        'entitlement': 'Entitlement - Horas/Tokens CX'
    },
    jp: {
        'tasks': 'タスク',
        'support': 'エスカレーションされたサポートケース',
        'initiatives': 'エンタイトルメント',
        'opportunities': '機会',
        'engagement': 'パートナーエンゲージメント',
        'risks': 'リスク',
        'entitlement': 'エンタイトルメント - CX時間/トークン'
    }
};

// Get translated section title
window.getSectionTitle = function (sectionKey) {
    const lang = window.currentLanguage || 'pt';
    return window.sectionTitles[lang][sectionKey] || sectionKey;
};

// UI Text translations
window.uiTexts = {
    pt: {
        // Buttons
        'saveChanges': 'Salvar Alterações',
        'exportPPT': 'Exportar PPT',
        'exporting': 'Gerando PPT...',
        'printReport': 'Imprimir em PDF',
        'actions': 'Ações',
        'addNewRow': 'Adicionar nova linha',
        'archive': 'Inibir (Arquivar no Backlog)',
        'unarchive': 'Restaurar (Desarquivar)',
        'deletePermanently': 'Excluir Permanentemente',
        'showBacklog': 'Mostrar Backlog',
        'hideBacklog': 'Ocultar Backlog',
        'minimizeSection': 'Minimizar seção',
        'maximizeSection': 'Maximizar seção',

        // Tabs
        'statusIndicators': 'Indicadores de Status - Visão Alteryx/Cliente',
        'overview': 'Overview',
        'successPlan': 'Success Plan',

        // Indicators
        'healthScore': 'Status Geral (Health Score):',
        'adoptionLevel': 'Nível de Adoção:',
        'licenseUtilization': 'Aproveitamento das Licenças:',
        'supportCases': 'Casos de Suporte:',
        'executiveEngagement': 'Engajamento Executivo:',
        'entitlementUsage': 'Utilização dos Entitlements:',

        // Health Score Options
        'healthy': 'Saudável',
        'attention': 'Atenção',
        'risk': 'Em Risco',

        // Adoption Options
        'high': 'Alto',
        'medium': 'Médio',
        'low': 'Baixo',

        // Support Options
        'underControl': 'Sob controle',
        'critical': 'Crítico',

        // Engagement Options
        'yes': 'Sim',
        'partial': 'Parcial',
        'no': 'Não',

        // Success Plan
        'successPlanTitle': 'Success Plan',
        'strategicPlanning': 'Planejamento estratégico para garantir o sucesso contínuo do cliente',
        'successMetrics': 'Métricas de Sucesso',
        'adoptionRate': 'TAXA DE ADOÇÃO',
        'npsScore': 'NPS SCORE',
        'activeUsers': 'USUÁRIOS ATIVOS',
        'workflowsCreated': 'WORKFLOWS CRIADOS',
        'vsPreviousMonth': 'vs mês anterior',
        'strategicGoals': 'Objetivos Estratégicos',
        'addGoal': 'Adicionar Objetivo',
        'milestones': 'Marcos Importantes (Milestones)',
        'addMilestone': 'Adicionar Milestone',
        'actionPlan': 'Plano de Ação',
        'next30Days': 'Próximos 30 dias:',
        'next60Days': 'Próximos 60 dias:',
        'next90Days': 'Próximos 90 dias:',

        // Logbook
        'logbook': 'Diario de a Bordo',
        'addLog': 'Agregar Entrada',
        'logDate': 'Fecha',
        'logTitle': 'Asunto/Título',
        'logNotes': 'Notas/Observaciones',

        // Logbook
        'logbook': 'Diário de Bordo',
        'addLog': 'Adicionar Registro',
        'logDate': 'Data',
        'logTitle': 'Assunto/Título',
        'logNotes': 'Observações/Anotações',
        'searchUseCases': 'Buscar Casos de Uso...',

        // Status Labels
        'completed': 'Concluído',
        'inProgress': 'Em Andamento',
        'planned': 'Planejado',
        'onHold': 'On Hold',
        'recurring': 'Recorrente Semanal',
        'shared': 'Compartilhado',

        // Executive Summary
        // Executive Summary
        'execSummaryTitle': 'Resumo Executivo – Estratégia',
        'mission': 'Missão',
        'purpose': 'Propósito',
        'vision': 'Visão',
        'guidingPrinciples': 'NORTEADORES',
        'strategicDrivers': 'DIRECIONADORES ESTRATÉGICOS',
        'businessCapabilities': 'HABILITADORES DE NEGÓCIO', // Changed from generic Enablers to match context
        'ambition': 'AMBIÇÃO',
        'execPriorities': 'PRIORIDADES EXECUÇÃO DIRETORIA',

        // Entitlement Labels
        'totalHoursTokens': 'Total Horas/Tokens:',
        'balance': 'Saldo:',
        'percentUsed': 'Utilizado',

        // Detailed Roadmap
        'tacticalRoadmap': 'Roadmap Tático de Sucesso',
        'tacticalRoadmap': 'Roadmap Tático de Sucesso',
        'tactic': 'Tática / Ação',
        'area': 'Área',
        'category': 'Categoria',
        'estHours': 'Horas/Tokens Est.',
        'plannedMonth': 'Mês Planejado',
        'involvement': 'Envolvimento',
        'justification': 'Justificativa',
        'alteryx': 'Alteryx',
        'client': 'Cliente',
        'both': 'Ambos',
        'plannedTotal': 'Total Planejado:',
        'availablePool': 'Total Disponível:',
        'plannedUtilization': 'Utilização Planejada',
        'statusDistribution': 'Distribuição por Status',
        'hoursByStatus': 'Consumo de Horas/Tokens por Status',
        'hours': 'Horas',
        'notPlanned': 'Não Planejado',
        'notApproved': 'Não Aprovado',
        'cancelled': 'Cancelado',

        // Messages
        'confirmDelete': 'Deseja realmente excluir esta linha permanentemente? Esta ação não pode ser desfeita.',
        'dataSaved': 'Dados salvos com sucesso!',
        'opportunity': 'Oportunidade',
        'partner': 'Parceiro',
        'contact': 'Contato',
        'comment': 'Comentário',
        'status': 'Status',
        'designedBy': 'Desenvolvido por',
        'N. Caso': 'N. Caso',
        'Descrição': 'Descrição'
    },
    en: {
        // Buttons
        'saveChanges': 'Save Changes',
        'exportPPT': 'Export to PPT',
        'exporting': 'Generating PPT...',
        'printReport': 'Print to PDF',
        'actions': 'Actions',
        'Responsável': 'Owner', // Explicit Header Translation
        'addNewRow': 'Add new row',
        'archive': 'Archive to Backlog',
        'unarchive': 'Restore (Unarchive)',
        'deletePermanently': 'Delete Permanently',
        'showBacklog': 'Show Backlog',
        'hideBacklog': 'Hide Backlog',
        'minimizeSection': 'Minimize section',
        'maximizeSection': 'Maximize section',

        // Tabs
        'statusIndicators': 'Status Indicators - Alteryx/Customer View',
        'overview': 'Overview',
        'successPlan': 'Success Plan',

        // Indicators
        'healthScore': 'Overall Health Score:',
        'adoptionLevel': 'Adoption Level:',
        'licenseUtilization': 'License Utilization:',
        'supportCases': 'Support Cases:',
        'executiveEngagement': 'Executive Engagement:',
        'entitlementUsage': 'Entitlement Usage:',

        // Health Score Options
        'healthy': 'Healthy',
        'attention': 'Attention',
        'risk': 'At Risk',

        // Adoption Options
        'high': 'High',
        'medium': 'Medium',
        'low': 'Low',

        // Support Options
        'underControl': 'Under Control',
        'critical': 'Critical',

        // Engagement Options
        'yes': 'Yes',
        'partial': 'Partial',
        'no': 'No',

        // Success Plan
        'successPlanTitle': 'Success Plan',
        'strategicPlanning': 'Strategic planning to ensure continued customer success',
        'successMetrics': 'Success Metrics',
        'adoptionRate': 'ADOPTION RATE',
        'npsScore': 'NPS SCORE',
        'activeUsers': 'ACTIVE USERS',
        'workflowsCreated': 'WORKFLOWS CREATED',
        'vsPreviousMonth': 'vs previous month',
        'strategicGoals': 'Strategic Goals',
        'addGoal': 'Add Goal',
        'milestones': 'Important Milestones',
        'addMilestone': 'Add Milestone',
        'actionPlan': 'Action Plan',
        'next30Days': 'Next 30 days:',
        'next60Days': 'Next 60 days:',
        'next90Days': 'Next 90 days:',

        // Logbook
        'logbook': 'Logbook',
        'addLog': 'Add Entry',
        'logDate': 'Date',
        'logTitle': 'Subject/Title',
        'logNotes': 'Notes/Observations',
        'searchUseCases': 'Search Use Cases...',

        // Status Labels
        'completed': 'Completed',
        'inProgress': 'In Progress',
        'planned': 'Planned',
        'onHold': 'On Hold',
        'recurring': 'Weekly Recurring',
        'shared': 'Shared',

        // Executive Summary
        // Executive Summary
        'execSummaryTitle': 'Executive Summary – Strategy',
        'mission': 'Mission',
        'purpose': 'Purpose',
        'vision': 'Vision',
        'guidingPrinciples': 'GUIDING PRINCIPLES',
        'strategicDrivers': 'STRATEGIC DRIVERS',
        'businessCapabilities': 'BUSINESS CAPABILITIES',
        'ambition': 'AMBITION',
        'execPriorities': 'EXECUTIVE PRIORITIES',

        // Entitlement Labels
        'totalHoursTokens': 'Total Hours/Tokens:',
        'balance': 'Balance:',
        'percentUsed': 'Used',

        // Detailed Roadmap
        'tacticalRoadmap': 'Tactical Success Roadmap',
        'tacticalRoadmap': 'Tactical Success Roadmap',
        'tactic': 'Tactic / Action',
        'area': 'Area',
        'category': 'Category',
        'estHours': 'Est. Hours/Tokens',
        'plannedMonth': 'Planned Month',
        'involvement': 'Involvement',
        'justification': 'Justification',
        'alteryx': 'Alteryx',
        'client': 'Client',
        'both': 'Both',
        'plannedTotal': 'Total Planned:',
        'availablePool': 'Total Available:',
        'plannedUtilization': 'Planned Utilization',
        'statusDistribution': 'Status Distribution',
        'hoursByStatus': 'Hours/Tokens Consumption by Status',
        'hours': 'Hours',
        'notPlanned': 'Not Planned',
        'notApproved': 'Not Approved',
        'cancelled': 'Cancelled',

        // Messages
        'confirmDelete': 'Do you really want to permanently delete this row? This action cannot be undone.',
        'dataSaved': 'Data saved successfully!',
        'opportunity': 'Opportunity',
        'partner': 'Partner',
        'contact': 'Contact',
        'comment': 'Comment',
        'status': 'Status',
        'designedBy': 'Designed by',
        'N. Caso': 'Case #',
        'Descrição': 'Description'
    },
    es: {
        // Buttons
        'saveChanges': 'Guardar Cambios',
        'exportPPT': 'Exportar a PPT',
        'exporting': 'Generando PPT...',
        'printReport': 'Imprimir en PDF',
        'actions': 'Acciones',
        'addNewRow': 'Agregar nueva fila',
        'archive': 'Archivar en Backlog',
        'unarchive': 'Restaurar (Desarchivar)',
        'deletePermanently': 'Eliminar Permanentemente',
        'showBacklog': 'Mostrar Backlog',
        'hideBacklog': 'Ocultar Backlog',
        'minimizeSection': 'Minimizar sección',
        'maximizeSection': 'Maximizar sección',

        // Tabs
        'statusIndicators': 'Indicadores de Estado - Visión Alteryx/Cliente',
        'overview': 'Resumen',
        'successPlan': 'Plan de Éxito',

        // Indicators
        'healthScore': 'Estado General (Health Score):',
        'adoptionLevel': 'Nivel de Adopción:',
        'licenseUtilization': 'Aprovechamiento de Licencias:',
        'supportCases': 'Casos de Soporte:',
        'executiveEngagement': 'Compromiso Ejecutivo:',
        'entitlementUsage': 'Uso de Entitlements:',

        // Health Score Options
        'healthy': 'Saludable',
        'attention': 'Atención',
        'risk': 'En Riesgo',

        // Adoption Options
        'high': 'Alto',
        'medium': 'Medio',
        'low': 'Bajo',

        // Support Options
        'underControl': 'Bajo Control',
        'critical': 'Crítico',

        // Engagement Options
        'yes': 'Sí',
        'partial': 'Parcial',
        'no': 'No',

        // Success Plan
        'successPlanTitle': 'Plan de Éxito',
        'strategicPlanning': 'Planificación estratégica para garantizar el éxito continuo del cliente',
        'successMetrics': 'Métricas de Éxito',
        'adoptionRate': 'TASA DE ADOPCIÓN',
        'npsScore': 'PUNTUACIÓN NPS',
        'activeUsers': 'USUARIOS ACTIVOS',
        'workflowsCreated': 'WORKFLOWS CREADOS',
        'vsPreviousMonth': 'vs mes anterior',
        'strategicGoals': 'Objetivos Estratégicos',
        'addGoal': 'Agregar Objetivo',
        'milestones': 'Hitos Importantes',
        'addMilestone': 'Agregar Hito',
        'actionPlan': 'Plan de Acción',
        'next30Days': 'Próximos 30 días:',
        'next60Days': 'Próximos 60 días:',
        'next90Days': 'Próximos 90 días:',

        // Status Labels
        'completed': 'Completado',
        'inProgress': 'En Progreso',
        'planned': 'Planificado',
        'onHold': 'En Espera',
        'recurring': 'Recurrente Semanal',
        'shared': 'Compartido',

        // Executive Summary
        // Executive Summary
        'execSummaryTitle': 'Resumen Ejecutivo – Estrategia',
        'mission': 'Misión',
        'purpose': 'Propósito',
        'vision': 'Visión',
        'guidingPrinciples': 'PRINCIPIOS REXCTORES',
        'strategicDrivers': 'IMPULSORES ESTRATÉGICOS',
        'businessCapabilities': 'CAPACIDADES DE NEGOCIO',
        'ambition': 'AMBICIÓN',
        'execPriorities': 'PRIORIDADES EJECUTIVAS',

        // Entitlement Labels
        'totalHoursTokens': 'Total de Horas/Tokens:',
        'balance': 'Saldo:',
        'percentUsed': 'Utilizado',

        // Detailed Roadmap
        'tacticalRoadmap': 'Hoja de Ruta Táctica de Éxito',
        'tacticalRoadmap': 'Hoja de Ruta Táctica de Éxito',
        'tactic': 'Tática / Acción',
        'area': 'Área',
        'category': 'Categoría',
        'estHours': 'Horas/Tokens Est.',
        'plannedMonth': 'Mes Planificado',
        'involvement': 'Involucramiento',
        'justification': 'Justificación',
        'alteryx': 'Alteryx',
        'client': 'Cliente',
        'both': 'Ambos',
        'plannedTotal': 'Total Planificado:',
        'availablePool': 'Total Disponible:',
        'plannedUtilization': 'Utilización Planificada',
        'statusDistribution': 'Distribución por Estado',
        'hoursByStatus': 'Consumo de Horas/Tokens por Estado',
        'hours': 'Horas',
        'notPlanned': 'No Planificado',
        'notApproved': 'No Aprobado',
        'cancelled': 'Cancelado',

        // Messages
        'confirmDelete': '¿Realmente desea eliminar esta fila permanentemente? Esta acción no se puede deshacer.',
        'dataSaved': '¡Datos guardados con éxito!',
        'opportunity': 'Oportunidad',
        'partner': 'Socio',
        'contact': 'Contacto',
        'comment': 'Comentario',
        'status': 'Estado',
        'designedBy': 'Diseñado por',
        'N. Caso': 'N. Caso',
        'Descrição': 'Descripción',
        'searchUseCases': 'Buscar Casos de Uso...'
    },
    jp: {
        // Buttons
        'saveChanges': '変更を保存',
        'exportPPT': 'PPTへのエクスポート',
        'exporting': 'PPTを生成中...',
        'printReport': 'PDFへの印刷',
        'actions': 'アクション',
        'addNewRow': '新しい行を追加',
        'archive': 'バックログにアーカイブ',
        'unarchive': '復元 (アーカイブ解除)',
        'deletePermanently': '完全に削除',
        'showBacklog': 'バックログを表示',
        'hideBacklog': 'バックログを非表示',
        'minimizeSection': 'セクションを最小化',
        'maximizeSection': 'セクションを最大化',

        // Tabs
        'statusIndicators': 'ステータスインジケーター - Alteryx/顧客ビュー',
        'overview': '概要',
        'successPlan': 'サクセスプラン',

        // Indicators
        'healthScore': '全体的なヘルススコア:',
        'adoptionLevel': '採用レベル:',
        'licenseUtilization': 'ライセンス使用率:',
        'supportCases': 'サポートケース:',
        'executiveEngagement': 'エグゼクティブエンゲージメント:',
        'entitlementUsage': 'エンタイトルメント使用量:',

        // Health Score Options
        'healthy': '健全',
        'attention': '注意',
        'risk': 'リスクあり',

        // Adoption Options
        'high': '高',
        'medium': '中',
        'low': '低',

        // Support Options
        'underControl': '管理下',
        'critical': '重要',

        // Engagement Options
        'yes': 'はい',
        'partial': '部分的',
        'no': 'いいえ',

        // Success Plan
        'successPlanTitle': 'サクセスプラン',
        'strategicPlanning': '継続的な顧客の成功を確実にするための戦略的計画',
        'successMetrics': 'サクセスメトリクス',
        'adoptionRate': '採用率',
        'npsScore': 'NPSスコア',
        'activeUsers': 'アクティブユーザー',
        'workflowsCreated': '作成されたワークフロー',
        'vsPreviousMonth': '対前月比',
        'strategicGoals': '戦略的目標',
        'addGoal': '目標を追加',
        'milestones': '重要なマイルストーン',
        'addMilestone': 'マイルストーンを追加',
        'actionPlan': 'アクションプラン',
        'next30Days': '次の30日:',
        'next60Days': '次の60日:',
        'next90Days': '次の90日:',

        // Status Labels
        'completed': '完了',
        'inProgress': '進行中',
        'planned': '計画済み',
        'onHold': '保留中',
        'recurring': '毎週の繰り返し',
        'shared': '共有',

        // Executive Summary
        'execSummaryTitle': 'エグゼクティブサマリー – 戦略',
        'mission': 'ミッション',
        'purpose': '目的',
        'vision': 'ビジョン',
        'guidingPrinciples': '指針',
        'strategicDrivers': '戦略的ドライバー',
        'businessCapabilities': 'ビジネス能力',
        'ambition': '野心',
        'execPriorities': 'エグゼクティブの優先事項',

        // Entitlement Labels
        'totalHoursTokens': '合計時間/トークン:',
        'balance': '残高:',
        'percentUsed': '使用済み',

        // Detailed Roadmap
        'tacticalRoadmap': '戦術的サクセスロードマップ',
        'tactic': '戦術 / アクション',
        'area': 'エリア',
        'category': 'カテゴリ',
        'estHours': '推定時間/トークン',
        'plannedMonth': '計画月',
        'involvement': '関与',
        'justification': '正当化',
        'alteryx': 'Alteryx',
        'client': 'クライアント',
        'both': '両方',
        'plannedTotal': '計画合計:',
        'availablePool': '利用可能合計:',
        'plannedUtilization': '計画使用率',
        'statusDistribution': 'ステータス分布',
        'hoursByStatus': 'ステータス別の時間/トークン消費',
        'hours': '時間',
        'notPlanned': '未計画',
        'notApproved': '未承認',
        'cancelled': 'キャンセル',

        // Messages
        'confirmDelete': '本当にこの行を完全に削除しますか？この操作は元に戻せません。',
        'dataSaved': 'データが正常に保存されました！',
        'opportunity': '機会',
        'partner': 'パートナー',
        'contact': '連絡先',
        'comment': 'コメント',
        'status': 'ステータス',
        'designedBy': '設計者',
        'N. Caso': 'ケース番号',
        'Descrição': '説明',
        'searchUseCases': 'ユースケースを検索...'
    }
};

// Get translated UI text
// Get translated UI text
window.getUIText = function (key) {
    const lang = window.currentLanguage || 'pt';
    // 1. Try UI Texts (from autoTranslate.js)
    if (window.uiTexts[lang][key]) {
        return window.uiTexts[lang][key];
    }
    // 2. Try Translations (from translations.js)
    if (window.translations && window.translations[lang] && window.translations[lang][key]) {
        return window.translations[lang][key];
    }
    return key;
};

// Translate status badges in table content
window.translateStatus = function (statusText) {
    if (!statusText) return statusText;

    const lang = window.currentLanguage || 'pt';
    const text = statusText.toLowerCase().trim();

    // Status mappings
    const statusMap = {
        // Completed variations
        'concluído': { en: 'Completed', es: 'Completado', jp: '完了' },
        'completed': { pt: 'Concluído', es: 'Completado', jp: '完了' },
        'completado': { pt: 'Concluído', en: 'Completed', jp: '完了' },
        '完了': { pt: 'Concluído', en: 'Completed', es: 'Completado' },

        // In Progress variations
        'em andamento': { en: 'In Progress', es: 'En Progreso', jp: '進行中' },
        'andamento': { en: 'In Progress', es: 'En Progreso', jp: '進行中' },
        'in progress': { pt: 'Em Andamento', es: 'En Progreso', jp: '進行中' },
        'en progreso': { pt: 'Em Andamento', en: 'In Progress', jp: '進行中' },
        '進行中': { pt: 'Em Andamento', en: 'In Progress', es: 'En Progreso' },

        // Planned variations
        'planejado': { en: 'Planned', es: 'Planificado', jp: '計画済み' },
        'planned': { pt: 'Planejado', es: 'Planificado', jp: '計画済み' },
        'planificado': { pt: 'Planejado', en: 'Planned', jp: '計画済み' },
        '計画済み': { pt: 'Planejado', en: 'Planned', es: 'Planificado' },

        // On Hold
        'on hold': { pt: 'On Hold', es: 'En Espera', jp: '保留中' },
        'en espera': { pt: 'On Hold', en: 'On Hold', jp: '保留中' },
        '保留中': { pt: 'On Hold', en: 'On Hold', es: 'En Espera' },

        // Recurring
        'recorrente semanal': { en: 'Weekly Recurring', es: 'Recurrente Semanal', jp: '毎週の繰り返し' },
        'weekly recurring': { pt: 'Recorrente Semanal', es: 'Recurrente Semanal', jp: '毎週の繰り返し' },
        'recurrente semanal': { pt: 'Recorrente Semanal', en: 'Weekly Recurring', jp: '毎週の繰り返し' },
        '毎週の繰り返し': { pt: 'Recorrente Semanal', en: 'Weekly Recurring', es: 'Recurrente Semanal' },

        // Shared
        'compartilhado': { en: 'Shared', es: 'Compartido', jp: '共有' },
        'shared': { pt: 'Compartilhado', es: 'Compartido', jp: '共有' },
        'compartido': { pt: 'Compartilhado', en: 'Shared', jp: '共有' },
        '共有': { pt: 'Compartilhado', en: 'Shared', es: 'Compartido' },

        // New Statuses
        'cancelado': { en: 'Cancelled', es: 'Cancelado', jp: 'キャンセル' },
        'cancelled': { pt: 'Cancelado', es: 'Cancelado', jp: 'キャンセル' },
        'キャンセル': { pt: 'Cancelado', en: 'Cancelled', es: 'Cancelado' },

        'não planejado': { en: 'Not Planned', es: 'No Planificado', jp: '未計画' },
        'nao planejado': { en: 'Not Planned', es: 'No Planificado', jp: '未計画' },
        'not planned': { pt: 'Não Planejado', es: 'No Planificado', jp: '未計画' },
        'no planificado': { pt: 'Não Planejado', en: 'Not Planned', jp: '未計画' },
        '未計画': { pt: 'Não Planejado', en: 'Not Planned', es: 'No Planificado' },

        'não aprovado': { en: 'Not Approved', es: 'No Aprobado', jp: '未承認' },
        'nao aprovado': { en: 'Not Approved', es: 'No Aprobado', jp: '未承認' },
        'not approved': { pt: 'Não Aprovado', es: 'No Aprobado', jp: '未承認' },
        'no aprobado': { pt: 'Não Aprovado', en: 'Not Approved', jp: '未承認' },
        '未承認': { pt: 'Não Aprovado', en: 'Not Approved', es: 'No Aprobado' }
    };

    // Find matching status
    for (const [key, translations] of Object.entries(statusMap)) {
        if (text.includes(key)) {
            return translations[lang] || statusText;
        }
    }

    return statusText;
};

// Table Header Translations
window.tableHeaders = {
    pt: {
        // Common headers
        'task': 'Tarefa',
        'responsible': 'Responsável',
        'startDate': 'Data Início',
        'endDate': 'Data Fim',
        'status': 'Status',
        'category': 'Categoria',
        'risk': 'Risco',
        'impact': 'Impacto',
        'mitigation': 'Mitigação',
        'opportunity': 'Oportunidade',
        'value': 'Valor',
        'probability': 'Probabilidade',
        'contact': 'Contato',
        'lastInteraction': 'Última Interação',
        'nextSteps': 'Próximos Passos',
        'hoursNeeded': 'Horas/Tokens Necessários',
        'hoursUsed': 'Horas/Tokens Utilizados',
        'balance': 'Saldo'
    },
    en: {
        // Common headers
        'task': 'Task',
        'responsible': 'Owner',
        'startDate': 'Start Date',
        'endDate': 'End Date',
        'status': 'Status',
        'category': 'Category',
        'risk': 'Risk',
        'impact': 'Impact',
        'mitigation': 'Mitigation',
        'opportunity': 'Opportunity',
        'value': 'Value',
        'probability': 'Probability',
        'contact': 'Contact',
        'lastInteraction': 'Last Interaction',
        'nextSteps': 'Next Steps',
        'hoursNeeded': 'Hours/Tokens Needed',
        'hoursUsed': 'Hours/Tokens Used',
        'balance': 'Balance'
    },
    es: {
        // Common headers
        'task': 'Tarea',
        'responsible': 'Responsable',
        'startDate': 'Fecha Inicio',
        'endDate': 'Fecha Fin',
        'status': 'Estado',
        'category': 'Categoría',
        'risk': 'Riesgo',
        'impact': 'Impacto',
        'mitigation': 'Mitigación',
        'opportunity': 'Oportunidad',
        'value': 'Valor',
        'probability': 'Probabilidad',
        'contact': 'Contacto',
        'lastInteraction': 'Última Interacción',
        'nextSteps': 'Próximos Pasos',
        'hoursNeeded': 'Horas/Tokens Necesarios',
        'hoursUsed': 'Horas/Tokens Utilizados',
        'balance': 'Saldo'
    },
    jp: {
        // Common headers
        'task': 'タスク',
        'responsible': '所有者',
        'startDate': '開始日',
        'endDate': '終了日',
        'status': 'ステータス',
        'category': 'カテゴリ',
        'risk': 'リスク',
        'impact': '影響',
        'mitigation': '緩和策',
        'opportunity': '機会',
        'value': '値',
        'probability': '確率',
        'contact': '連絡先',
        'lastInteraction': '最後のやり取り',
        'nextSteps': '次のステップ',
        'hoursNeeded': '必要な時間/トークン',
        'hoursUsed': '使用された時間/トークン',
        'balance': '残高'
    }
};

// Get default headers for a section based on current language
window.getDefaultHeaders = function (sectionKey) {
    const lang = window.currentLanguage || 'pt';

    // Default header mappings by section
    const sectionHeaderKeys = {
        'tasks': ['task', 'responsible', 'startDate', 'endDate', 'status'],
        'support': ['task', 'responsible', 'startDate', 'endDate', 'status'],
        'initiatives': ['name', 'hoursNeeded', 'status'], // Fixed initiatives key
        'opportunities': ['opportunity', 'contact', 'comment', 'status'],
        'engagement': ['engagement', 'contact', 'comment', 'status'], // Updated to match data.js structure
        'risks': ['risk', 'category', 'impact', 'mitigation', 'status'],
        'entitlement': ['name', 'hoursNeeded', 'status'] // Fixed entitlement key
    };

    const headerKeys = sectionHeaderKeys[sectionKey] || [];
    return headerKeys.map(key => window.tableHeaders[lang][key] || key);
};

// Global Translation Helper
window.t = function (key) {
    if (!key) return '';
    const lang = window.currentLanguage || 'pt'; // Default to PT

    // 1. Try Translations (from translations.js)
    if (window.translations && window.translations[lang] && window.translations[lang][key]) {
        return window.translations[lang][key];
    }

    // 2. Try UI Texts (from autoTranslate.js)
    if (window.uiTexts && window.uiTexts[lang] && window.uiTexts[lang][key]) {
        return window.uiTexts[lang][key];
    }

    // 3. Try to use key as index for Translations (Reverse lookup for Headers)
    // Example: key='Tarefas', lang='en'. translations['en']['Tarefas'] = 'Tasks'
    if (window.translations && window.translations[lang] && window.translations[lang][key]) {
        return window.translations[lang][key];
    }

    return key;
};

