const clerkState = {
  activeSection: "count",
  items: [
    { sku: "BK-URB-001", name: "Bike Urban Flex", category: "Bike", system: 5, physical: 5, treatment: "Sem divergência." },
    { sku: "BAT-48V-002", name: "Bateria 48V 15Ah", category: "Bateria", system: 4, physical: 3, treatment: "1 unidade em análise na oficina." },
    { sku: "RVD-202-XL", name: "Bike RVD Trail 202", category: "Bike RVD", system: 2, physical: 2, treatment: "Sem divergência." },
    { sku: "ONN-LITE-01", name: "ONN Lite Cinza", category: "ONN", system: 3, physical: 4, treatment: "Recebimento não baixado no sistema." },
  ],
  checklist: [
    { id: "ck1", label: "Verificar organização do estoque 3005", done: true, before: true, after: true },
    { id: "ck2", label: "Conferir área de baterias e pontos de carga", done: true, before: true, after: true },
    { id: "ck3", label: "Validar bikes em separação e etiquetagem", done: false, before: true, after: false },
  ],
  history: [
    { id: "h1", date: "07/07/2026", store: "Loja Pinheiros", status: "Finalizada", accuracy: "100%", responsible: "Ana Teste Estoque" },
    { id: "h2", date: "06/07/2026", store: "Loja Moema", status: "Com divergência", accuracy: "75%", responsible: "Bruno Teste Estoque" },
    { id: "h3", date: "05/07/2026", store: "Loja Paulista", status: "Reaberta", accuracy: "82%", responsible: "Carla Teste Supervisor" },
  ],
};

const supervisorState = {
  activeSection: "dashboard",
  assignments: [
    { name: "Ana Teste Estoque", cpf: "123.456.789-09", role: "Estoquista 1", store: "Loja Pinheiros" },
    { name: "Bruno Teste Estoque", cpf: "987.654.321-00", role: "Estoquista 2", store: "Loja Moema" },
  ],
  searchResults: [
    { name: "Carla Teste Supervisor", cpf: "246.813.579-28", role: "Estoquista 3" },
    { name: "Diego Apoio Operacional", cpf: "302.440.880-12", role: "Estoquista 2" },
  ],
  dashboard: [
    { store: "Loja Pinheiros", status: "Concluída", accuracy: "100%", responsible: "Ana", detail: "Operação estável, checklist completo e sem divergência." },
    { store: "Loja Moema", status: "Em andamento", accuracy: "67%", responsible: "Bruno", detail: "Divergência aberta em bateria e ONN Lite." },
    { store: "Loja Paulista", status: "Reaberta", accuracy: "82%", responsible: "Carla", detail: "Nova revisão pendente por tratativa offline." },
  ],
  counts: [
    { store: "Loja Moema", date: "06/07/2026", accuracy: "75%", status: "Finalizada", responsible: "Bruno" },
    { store: "Loja Paulista", date: "05/07/2026", accuracy: "82%", status: "Reaberta", responsible: "Carla" },
    { store: "Loja Pinheiros", date: "07/07/2026", accuracy: "100%", status: "Finalizada", responsible: "Ana" },
  ],
};

const demoModes = {
  estoquista: {
    sidebarTitle: "Mesa do estoquista",
    title: {
      count: "Contagem da loja",
      checklist: "Checklist da loja",
      history: "Histórico de contagens",
    },
    sections: [
      { id: "count", label: "Contagem", subtitle: "Sistema x físico com tratativa" },
      { id: "checklist", label: "Checklist", subtitle: "Tarefas com foto antes/depois" },
      { id: "history", label: "Histórico", subtitle: "Revisões já executadas" },
    ],
  },
  supervisor: {
    sidebarTitle: "Mesa do supervisor",
    title: {
      dashboard: "Dashboard operacional",
      assignments: "Gerenciar estoquistas",
      checklist: "Gerenciar checklist",
      history: "Contagens realizadas",
    },
    sections: [
      { id: "dashboard", label: "Dashboard", subtitle: "Status do dia por loja" },
      { id: "assignments", label: "Estoquistas", subtitle: "Busca por nome ou CPF" },
      { id: "checklist", label: "Checklist", subtitle: "Template vigente da operação" },
      { id: "history", label: "Contagens", subtitle: "Histórico consolidado" },
    ],
  },
};

let demoMode = "estoquista";

const sidebarList = document.getElementById("demo-sidebar-list");
const sidebarTitle = document.getElementById("demo-sidebar-title");
const demoTitle = document.getElementById("demo-title");
const demoSummary = document.getElementById("demo-summary");
const demoPanel = document.getElementById("demo-panel");
const drawer = document.getElementById("demo-drawer");
const drawerContent = document.getElementById("drawer-content");

const render = () => {
  renderTabs();
  renderSidebar();
  renderSummary();
  renderPanel();
};

const renderTabs = () => {
  document.querySelectorAll("[data-demo-mode]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.demoMode === demoMode);
  });
};

const renderSidebar = () => {
  const config = demoModes[demoMode];
  const activeSection = demoMode === "estoquista" ? clerkState.activeSection : supervisorState.activeSection;

  sidebarTitle.textContent = config.sidebarTitle;
  sidebarList.innerHTML = config.sections
    .map(
      (section) => `
        <button class="sidebar-item ${section.id === activeSection ? "is-active" : ""}" type="button" data-section="${section.id}">
          <strong>${section.label}</strong>
          <small>${section.subtitle}</small>
        </button>
      `,
    )
    .join("");

  sidebarList.querySelectorAll("[data-section]").forEach((button) => {
    button.addEventListener("click", () => {
      if (demoMode === "estoquista") {
        clerkState.activeSection = button.dataset.section;
      } else {
        supervisorState.activeSection = button.dataset.section;
      }
      render();
    });
  });
};

const renderSummary = () => {
  if (demoMode === "estoquista") {
    const total = clerkState.items.length;
    const matched = clerkState.items.filter((item) => item.system === item.physical).length;
    const evidence = clerkState.checklist.filter((item) => item.before && item.after).length;
    const divergentUnits = clerkState.items.reduce((sum, item) => sum + Math.abs(item.system - item.physical), 0);

    demoSummary.innerHTML = `
      <article class="mini-stat">
        <span>Acurácia</span>
        <strong>${Math.round((matched / total) * 100)}%</strong>
      </article>
      <article class="mini-stat">
        <span>Itens puxados</span>
        <strong>${total}</strong>
      </article>
      <article class="mini-stat">
        <span>Unidades divergentes</span>
        <strong>${divergentUnits}</strong>
      </article>
      <article class="mini-stat">
        <span>Checklist com prova</span>
        <strong>${evidence}/${clerkState.checklist.length}</strong>
      </article>
    `;
    demoTitle.textContent = demoModes.estoquista.title[clerkState.activeSection];
    return;
  }

  const completed = supervisorState.dashboard.filter((item) => item.status === "Concluída").length;
  const reopened = supervisorState.dashboard.filter((item) => item.status === "Reaberta").length;

  demoSummary.innerHTML = `
    <article class="mini-stat">
      <span>Lojas no painel</span>
      <strong>${supervisorState.dashboard.length}</strong>
    </article>
    <article class="mini-stat">
      <span>Concluídas</span>
      <strong>${completed}</strong>
    </article>
    <article class="mini-stat">
      <span>Reabertas</span>
      <strong>${reopened}</strong>
    </article>
    <article class="mini-stat">
      <span>Vínculos ativos</span>
      <strong>${supervisorState.assignments.length}</strong>
    </article>
  `;
  demoTitle.textContent = demoModes.supervisor.title[supervisorState.activeSection];
};

const renderPanel = () => {
  if (demoMode === "estoquista") {
    if (clerkState.activeSection === "count") {
      renderClerkCount();
      return;
    }
    if (clerkState.activeSection === "checklist") {
      renderClerkChecklist();
      return;
    }
    renderClerkHistory();
    return;
  }

  if (supervisorState.activeSection === "dashboard") {
    renderSupervisorDashboard();
    return;
  }
  if (supervisorState.activeSection === "assignments") {
    renderSupervisorAssignments();
    return;
  }
  if (supervisorState.activeSection === "checklist") {
    renderSupervisorChecklist();
    return;
  }
  renderSupervisorHistory();
};

const renderClerkCount = () => {
  demoPanel.innerHTML = `
    <div class="demo-grid two-col">
      <section class="demo-card">
        <h4>Itens da contagem</h4>
        <div class="demo-table-wrap">
          <table class="demo-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Sistema</th>
                <th>Físico</th>
                <th>Delta</th>
                <th>Tratativa</th>
              </tr>
            </thead>
            <tbody>
              ${clerkState.items
                .map((item, index) => {
                  const delta = item.physical - item.system;
                  const deltaClass = delta === 0 ? "status-neutral" : delta > 0 ? "delta-positive" : "delta-negative";
                  const deltaLabel = delta > 0 ? `+${delta}` : `${delta}`;
                  return `
                    <tr>
                      <td>
                        <strong>${item.name}</strong><br />
                        <span>${item.sku} • ${item.category}</span>
                      </td>
                      <td>${item.system}</td>
                      <td>
                        <div class="qty-control">
                          <button type="button" data-qty-action="dec" data-index="${index}">-</button>
                          <strong>${item.physical}</strong>
                          <button type="button" data-qty-action="inc" data-index="${index}">+</button>
                        </div>
                      </td>
                      <td><span class="${deltaClass}">${deltaLabel}</span></td>
                      <td>${item.treatment}</td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </section>

      <section class="demo-card">
        <h4>Leitura operacional</h4>
        <p>
          A contagem foi desenhada para que o estoquista enxergue sistema x físico com rapidez, sem
          perder a necessidade de justificar qualquer diferença antes do fechamento.
        </p>
        <div class="timeline-list">
          <article class="timeline-item">
            <strong>Loja ativa</strong>
            <span>Loja Moema • Janela 09:00 às 15:00</span>
          </article>
          <article class="timeline-item">
            <strong>Resultado atual</strong>
            <span>1 divergência negativa e 1 divergência positiva abertas.</span>
            <button class="action-button" type="button" data-open-drawer="count-detail">Abrir detalhe lateral</button>
          </article>
          <article class="timeline-item">
            <strong>Status do fechamento</strong>
            <span>Bloqueado até concluir o checklist obrigatório com provas.</span>
          </article>
        </div>
      </section>
    </div>
  `;

  attachQtyControls();
  attachDrawerOpeners();
};

const renderClerkChecklist = () => {
  demoPanel.innerHTML = `
    <section class="demo-grid">
      <article class="demo-card">
        <h4>Checklist aplicado à loja</h4>
        <div class="checklist-stack">
          ${clerkState.checklist
            .map(
              (item) => `
                <div class="checklist-item">
                  <div class="checklist-head">
                    <div>
                      <strong>${item.label}</strong>
                      <span>${item.done ? "Tarefa marcada como concluída." : "Tarefa ainda pendente na apresentação."}</span>
                    </div>
                    <span class="status-badge ${item.done ? "status-complete" : "status-alert"}">
                      ${item.done ? "Concluída" : "Pendente"}
                    </span>
                  </div>
                  <div class="checklist-actions">
                    <button class="toggle-button ${item.before ? "is-on" : ""}" type="button" data-toggle-check="${item.id}" data-slot="before">
                      Foto antes
                    </button>
                    <button class="toggle-button ${item.after ? "is-on" : ""}" type="button" data-toggle-check="${item.id}" data-slot="after">
                      Foto depois
                    </button>
                    <button class="toggle-button ${item.done ? "is-on" : ""}" type="button" data-toggle-check="${item.id}" data-slot="done">
                      Marcar tarefa
                    </button>
                  </div>
                  <div class="evidence-row">
                    <div class="evidence-box">
                      <strong>Antes</strong>
                      <div class="evidence-placeholder">${item.before ? "Imagem mock anexada" : "Ainda sem foto antes"}</div>
                    </div>
                    <div class="evidence-box">
                      <strong>Depois</strong>
                      <div class="evidence-placeholder">${item.after ? "Imagem mock anexada" : "Ainda sem foto depois"}</div>
                    </div>
                  </div>
                </div>
              `,
            )
            .join("")}
        </div>
      </article>
    </section>
  `;

  attachChecklistToggles();
};

const renderClerkHistory = () => {
  demoPanel.innerHTML = `
    <section class="demo-grid">
      <article class="demo-card">
        <h4>Histórico do estoquista</h4>
        <div class="history-list">
          ${clerkState.history
            .map(
              (item) => `
                <div class="timeline-item">
                  <strong>${item.store} • ${item.date}</strong>
                  <span>${item.status} • ${item.accuracy} • ${item.responsible}</span>
                  <button class="action-button" type="button" data-open-drawer="count-detail">Abrir contagem</button>
                </div>
              `,
            )
            .join("")}
        </div>
      </article>
    </section>
  `;

  attachDrawerOpeners();
};

const renderSupervisorDashboard = () => {
  demoPanel.innerHTML = `
    <section class="demo-grid">
      <article class="demo-card">
        <h4>Dashboard do dia</h4>
        <div class="demo-table-wrap">
          <table class="demo-table">
            <thead>
              <tr>
                <th>Loja</th>
                <th>Status</th>
                <th>Acurácia</th>
                <th>Responsável</th>
                <th>Detalhe</th>
              </tr>
            </thead>
            <tbody>
              ${supervisorState.dashboard
                .map(
                  (item) => `
                    <tr>
                      <td>${item.store}</td>
                      <td><span class="status-badge ${item.status === "Concluída" ? "status-complete" : item.status === "Reaberta" ? "status-alert" : "status-progress"}">${item.status}</span></td>
                      <td>${item.accuracy}</td>
                      <td>${item.responsible}</td>
                      <td>
                        <button class="action-button" type="button" data-open-drawer="dashboard:${item.store}">
                          Abrir
                        </button>
                      </td>
                    </tr>
                  `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `;

  attachDrawerOpeners();
};

const renderSupervisorAssignments = () => {
  demoPanel.innerHTML = `
    <div class="demo-grid two-col">
      <article class="demo-form-card">
        <h4>Buscar estoquista</h4>
        <div class="search-row">
          <input type="text" value="Carla" aria-label="Buscar por nome ou CPF" />
          <button class="search-button" type="button">Buscar</button>
        </div>
        <div class="search-results">
          ${supervisorState.searchResults
            .map(
              (person) => `
                <div class="search-result">
                  <div>
                    <strong>${person.name}</strong>
                    <span>${person.role} • CPF ${person.cpf}</span>
                  </div>
                  <button class="action-button" type="button">Adicionar à loja</button>
                </div>
              `,
            )
            .join("")}
        </div>
      </article>
      <article class="demo-card">
        <h4>Agregados à loja</h4>
        <div class="assignment-list">
          ${supervisorState.assignments
            .map(
              (person) => `
                <div class="assignment-person">
                  <div>
                    <strong>${person.name}</strong>
                    <span>${person.role} • ${person.store}</span>
                  </div>
                  <button class="action-button" type="button">Remover</button>
                </div>
              `,
            )
            .join("")}
        </div>
      </article>
    </div>
  `;
};

const renderSupervisorChecklist = () => {
  demoPanel.innerHTML = `
    <div class="demo-grid two-col">
      <article class="demo-form-card">
        <h4>Template vigente</h4>
        <label>
          Nome do checklist
          <input type="text" value="Checklist padrão de contagem" />
        </label>
        <label>
          Itens do checklist
          <textarea>Verificar organização do estoque 3005
Conferir área de baterias e pontos de carga
Validar bikes em separação e etiquetagem
Registrar foto antes e foto depois de cada etapa obrigatória</textarea>
        </label>
      </article>
      <article class="demo-card">
        <h4>Como esse módulo agrega</h4>
        <div class="template-list">
          <div class="timeline-item">
            <strong>Padroniza a loja</strong>
            <span>Evita que cada unidade execute a rotina de uma forma diferente.</span>
          </div>
          <div class="timeline-item">
            <strong>Exige prova da tarefa</strong>
            <span>Antes e depois ficam visíveis tanto para operação quanto para gestão.</span>
          </div>
          <div class="timeline-item">
            <strong>Alimenta o histórico</strong>
            <span>O detalhe da contagem passa a mostrar não só números, mas contexto real de execução.</span>
          </div>
        </div>
      </article>
    </div>
  `;
};

const renderSupervisorHistory = () => {
  demoPanel.innerHTML = `
    <section class="demo-grid">
      <article class="demo-card">
        <h4>Contagens realizadas</h4>
        <div class="demo-table-wrap">
          <table class="demo-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Loja</th>
                <th>Acurácia</th>
                <th>Status</th>
                <th>Responsável</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              ${supervisorState.counts
                .map(
                  (item) => `
                    <tr>
                      <td>${item.date}</td>
                      <td>${item.store}</td>
                      <td>${item.accuracy}</td>
                      <td>${item.status}</td>
                      <td>${item.responsible}</td>
                      <td><button class="action-button" type="button" data-open-drawer="count-detail">Abrir detalhe</button></td>
                    </tr>
                  `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `;

  attachDrawerOpeners();
};

const attachQtyControls = () => {
  demoPanel.querySelectorAll("[data-qty-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      const item = clerkState.items[index];
      if (!item) {
        return;
      }
      item.physical += button.dataset.qtyAction === "inc" ? 1 : -1;
      if (item.physical < 0) {
        item.physical = 0;
      }
      render();
    });
  });
};

const attachChecklistToggles = () => {
  demoPanel.querySelectorAll("[data-toggle-check]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = clerkState.checklist.find((entry) => entry.id === button.dataset.toggleCheck);
      if (!item) {
        return;
      }

      const slot = button.dataset.slot;
      if (slot === "before") {
        item.before = !item.before;
      }
      if (slot === "after") {
        item.after = !item.after;
      }
      if (slot === "done") {
        item.done = !item.done;
      }
      render();
    });
  });
};

const attachDrawerOpeners = () => {
  demoPanel.querySelectorAll("[data-open-drawer]").forEach((button) => {
    button.addEventListener("click", () => {
      openDrawer(button.dataset.openDrawer);
    });
  });
};

const openDrawer = (context) => {
  if (!drawer || !drawerContent) {
    return;
  }

  const divergent = clerkState.items.filter((item) => item.system !== item.physical);
  drawerContent.innerHTML = `
    <span class="eyebrow">Detalhe da contagem</span>
    <h4>Revisão apresentada no mock</h4>
    <p>
      Esta visualização representa a lateral clicável do módulo real. Aqui o gestor ou o estoquista
      revisa a contagem inteira sem sair da tela principal.
    </p>
    <div class="drawer-metric-grid">
      <div class="drawer-metric">
        <strong>Loja</strong>
        <span>Loja Moema</span>
      </div>
      <div class="drawer-metric">
        <strong>Acurácia</strong>
        <span>${Math.round((clerkState.items.filter((item) => item.system === item.physical).length / clerkState.items.length) * 100)}%</span>
      </div>
      <div class="drawer-metric">
        <strong>Contexto</strong>
        <span>${context?.startsWith("dashboard:") ? context.replace("dashboard:", "") : "Histórico detalhado"}</span>
      </div>
    </div>
    <div class="demo-card">
      <h4>Itens com divergência</h4>
      <ul>
        ${divergent
          .map(
            (item) =>
              `<li><strong>${item.name}</strong>: sistema ${item.system}, físico ${item.physical}, tratativa: ${item.treatment}</li>`,
          )
          .join("")}
      </ul>
    </div>
    <div class="demo-card">
      <h4>Checklist e evidências</h4>
      <ul>
        ${clerkState.checklist
          .map(
            (item) =>
              `<li><strong>${item.label}</strong> • ${item.done ? "Concluída" : "Pendente"} • antes ${item.before ? "ok" : "não"} • depois ${item.after ? "ok" : "não"}</li>`,
          )
          .join("")}
      </ul>
    </div>
  `;
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
};

const closeDrawer = () => {
  if (!drawer) {
    return;
  }
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
};

document.querySelectorAll("[data-demo-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    demoMode = button.dataset.demoMode;
    render();
  });
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.dataset.closeDrawer === "true") {
    closeDrawer();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDrawer();
  }
});

render();
