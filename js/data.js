window.dashboardData = {
    healthScore: null,
    adoptionLevel: null,
    licenseLevel: null,
    supportStatus: null,
    execEngagement: null,
    entitlementUsage: null,
    orgMap: {
        root: {
            id: "root",
            name: "Suzano",
            role: "",
            notes: "",
            type: "root",
            children: []
        }
    },
    tasks: {
        title: "Tarefas",
        headers: ["N.", "Tarefas", "Responsável", "Data Início", "Data Fim", "Status"],
        columns: ["id", "task", "owner", "startDate", "endDate", "status"],
        rows: [
            { id: 1, task: "Reunião Mentoria Alteryx", owner: "Adilson / Boni", startDate: "", endDate: "", status: "Recorrente Semanal", statusColor: "green" },
            { id: 2, task: "Reunião Semanal – Alteryx Power UP", owner: "ALL", startDate: "", endDate: "", status: "Recorrente Semanal", statusColor: "green" },
            { id: 3, task: "Revisão Success Plan para 2026", owner: "Boni/Eduardo + Suzano", startDate: "", endDate: "", status: "Em Preparação", statusColor: "blue" },
            { id: 4, task: "Upgrade Plataforma Alteryx 2025.1 ou 2025.2", owner: "Eduardo/TBD", startDate: "", endDate: "", status: "A retomar", statusColor: "orange" },
            { id: 5, task: "Vulnerabilidade MongoDB - Orientação", owner: "Boni/Eduardo + Suzano", startDate: "", endDate: "", status: "Compartilhado 02/01", statusColor: "blue" }
        ]
    },
    support: {
        title: "Casos de Suporte Escalados",
        headers: ["N. Caso", "Descrição", "Responsável", "Status"],
        columns: ["case", "desc", "owner", "status"],
        rows: [
            // Empty rows as placeholders
            { id: "", case: "", desc: "", owner: "", status: "" }
        ]
    },
    initiatives: {
        title: "Entitlement - Horas/Tokens CX",
        headers: ["Iniciativa / Projeto", "Categoria", "Envolvimento", "Horas/Tokens", "Mês Planejado", "Status"],
        columns: ["tactic", "category", "involvement", "estHours", "plannedMonth", "status"],
        totalHoursPool: 80,
        rows: [] // Dynamically populated from tacticalRoadmap
    },
    opportunities: {
        title: "Oportunidades",
        headers: ["N.", "Oportunidade", "Contato", "Comentário", "Status"],
        columns: ["id", "name", "contact", "comment", "status"],
        rows: [
            { id: 1, name: "Modernização com Alteryx One", contact: "Raphael/Boni", comment: "Em negociação", status: "Em Andamento" }
        ]
    },
    engagement: {
        title: "Engajamento Parceiro",
        headers: ["N.", "Engajamento Parceiro", "Contato", "Comentário", "Status"],
        columns: ["id", "name", "contact", "comment", "status"],
        rows: [
            { id: 1, name: "Novo Engajamento", contact: "-", comment: "-", status: "Planejado" }
        ]
    },
    risks: {
        title: "Riscos",
        headers: ["Risco", "Categoria", "Impacto", "Mitigação em andamento", "Status"],
        columns: ["risk", "category", "impact", "mitigation", "status"],
        rows: [
            { risk: "", category: "", impact: "", mitigation: "", status: "", statusColor: "" }
        ]
    },
    strategicGoals: {
        cards: [
            {
                title: "Q1 2026",
                content: "Aumentar adoção em 20%\nImplementar 3 novos use cases\nTreinar 30 novos usuários"
            },
            {
                title: "Q2 2026",
                content: "Expandir para novos departamentos\nOtimizar processos existentes\nRealizar workshop executivo"
            },
            {
                title: "Q3 2026",
                content: "Atingir 90% de adoção\nImplementar automações avançadas\nCertificar power users"
            },
            {
                title: "Q4 2026",
                content: "Avaliar ROI e expansão\nPlanejar renovação\nIdentificar novas oportunidades"
            }
        ]
    },
    milestones: {
        items: [
            {
                title: "Kickoff do Projeto",
                date: "Janeiro 2026",
                status: "completed"
            },
            {
                title: "Treinamento Inicial",
                date: "Janeiro 2026",
                status: "completed"
            },
            {
                title: "Implementação Use Cases",
                date: "Fevereiro 2026",
                status: "active"
            },
            {
                title: "Business Review",
                date: "Março 2026",
                status: "planned"
            }
        ]
    },

    // Success Metrics
    successMetrics: [
        { id: 1, label: 'TAXA DE ADOÇÃO', value: '75%', trend: '↑ 5% vs mês anterior' },
        { id: 2, label: 'NPS SCORE', value: '8.5', trend: '↑ 0.5 vs mês anterior' },
        { id: 3, label: 'USUÁRIOS ATIVOS', value: '120', trend: '↑ 15 vs mês anterior' },
        { id: 4, label: 'WORKFLOWS CRIADOS', value: '45', trend: '↑ 8 vs mês anterior' }
    ],

    // Success Plan - Detailed Tactical Roadmap
    tacticalRoadmap: {
        headers: ["Tática / Ação", "Área", "Categoria", "Envolvimento", "Horas/Tokens Est.", "Mês Planejado", "Status", "Justificativa", "Ações"],
        columns: ["tactic", "area", "category", "involvement", "estHours", "plannedMonth", "status", "justification"],
        rows: [
            { tactic: "Implementação de Resident Architect", area: "Arquitetura", category: "Arquitetura", involvement: "Alteryx", estHours: "40", plannedMonth: "Janeiro", status: "Em Andamento", justification: "Iniciado conforme plano", archived: false },
            { tactic: "Sessões de Orientação (Onboarding)", area: "Enablement", category: "Enablement", involvement: "Ambos", estHours: "10", plannedMonth: "Fevereiro", status: "Planejado", justification: "", archived: false },
            { tactic: "Avaliação de Governança (AGB)", area: "Governança", category: "Governança", involvement: "Cliente", estHours: "5", plannedMonth: "Março", status: "Planejado", justification: "", archived: false }
        ]
    },

    // Executive Summary Strategy
    executiveSummary: {
        period: "2024-2028",
        mission: "Um Banco de Capital Aberto, Inteligente e Rumo a + 100 anos",
        purpose: "Promover o desenvolvimento econômico e social do Rio Grande do Sul sendo o agente financeiro e transformador na vida das pessoas",
        vision: "Ser um banco público, sólido, rentável e competitivo, conectado às comunidades e oferecendo soluções com excelência",
        drivers: [
            { title: "Atitude Digital", kpi: "NPS Interno (e-NPS) / Jornada do Colaborador" },
            { title: "Eficiência Operacional", kpi: "Índice de Eficiência Ajustada ao Risco / ROE" },
            { title: "Inovação", kpi: "#Projetos" },
            { title: "Sustentabilidade", kpi: "#Clientes / Market Share / Margem / RWA" },
            { title: "Experiência do Cliente", kpi: "NPS / Principalidade" }
        ],
        enablers: [
            "Cultura focada em gerar atitude digital e de constante aprendizado",
            "Uso estratégico de dados e IA para aprimorar a eficiência, inovação e tomada de decisões",
            "Modernização de sistemas para gerar soluções rápidas e seguras",
            "Melhores práticas de gestão visando negócios sustentáveis que impulsionem",
            "Experiências personalizadas de acordo com a necessidade e objetivo do cliente"
        ],
        ambition: [
            "Geração de Valor e Resultados",
            "Atendimento de Excelência",
            "Participação de Mercado"
        ],
        priorities: [
            { title: "Retomar o lucro líquido", desc: "Acima de R$1Bi" },
            { title: "Alavancar a margem financeira", desc: "25% a 30%" },
            { title: "Agenda de redução de custos", desc: "6% a 10%" },
            { title: "Gestão organizacional e mudança", desc: "" },
            { title: "Agilidade e modernização tecnológica", desc: "66 Iniciativas TI + R$495M Investimentos" }
        ]
    },

    // Logbook
    logbook: {
        entries: [
            { id: 1, date: "2026-01-05", title: "Kickoff Meeting", content: "Alinhamento inicial de objetivos e cronograma." },
            { id: 2, date: "2026-01-06", title: "Review de Acesso", content: "Verificação de permissões de usuário no ambiente Alteryx." }
        ]
    },

    // Column widths for resizable columns (stored as percentages or pixels)
    columnWidths: {}
};
