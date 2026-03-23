// ---------------- State Management ----------------
let tasks = JSON.parse(localStorage.getItem('taskManager_tasks')) || [];
let purchases = JSON.parse(localStorage.getItem('taskManager_purchases')) || [];
let targets = JSON.parse(localStorage.getItem('taskManager_targets')) || [];
let projectBudgets = JSON.parse(localStorage.getItem('taskManager_projectBudgets')) || {};
let currentFilterStatus = 'all';
let currentFilterProject = 'all';
let currentFilterAssignee = 'all';
let currentFilterTimeframe = 'all';
let currentPurchaseFilterStatus = 'all';
let currentPurchaseFilterProject = 'all';
let currentPurchaseFilterTimeframe = 'all';
let searchQuery = '';

// New toggles state
let hideCompletedTasks = false;
let hideArrivedPurchases = false;
let reportHideCompletedTasks = false;
let reportHideArrivedPurchases = false;
let reportFilterManager = false;
let reportFilterCTO = false;

// Tasks View Mode
let tasksViewMode = 'cards'; // 'cards' or 'table'

// Gantt Calendar State
let ganttCurrentMonth = new Date();
let ganttFilterProject = 'all';

// File System Persistence
let fileHandle = null;
let isFileSystemSupported = 'showOpenFilePicker' in window;

// Chart Instances
let statusChartInstance = null;
let projectChartInstance = null;

// ---------------- DOM Elements ----------------
// Navigation
const navItems = document.querySelectorAll('.nav-links li[data-target]');
const views = document.querySelectorAll('.view');
const btnNewTaskNav = document.getElementById('open-new-task-modal');
const btnNewPurchaseNav = document.getElementById('open-new-purchase-modal');

// Import / Export Elements
const btnExportData = document.getElementById('btn-export-data');
const btnImportData = document.getElementById('btn-import-data');
const fileImportInput = document.getElementById('file-import-input');
const btnConnectFS = document.getElementById('btn-connect-fs');
const btnSaveData = document.getElementById('btn-save-data');
const syncStatusIndicator = document.getElementById('sync-status');

// Restore Connection Modal
const restoreConnectionModal = document.getElementById('restore-connection-modal');
const btnRestoreFromJS = document.getElementById('restore-from-js-btn');
const btnRestoreFromExcel = document.getElementById('restore-from-excel-btn');
const btnRestoreConnection = document.getElementById('btn-restore-connection');

// Task Modal
const modal = document.getElementById('task-modal');
const btnCloseModal = document.getElementById('close-modal-btn');
const btnCancelTask = document.getElementById('cancel-task-btn');
const taskForm = document.getElementById('task-form');

// Purchase Modal
const purchaseModal = document.getElementById('purchase-modal');
const btnClosePurchaseModal = document.getElementById('close-purchase-modal-btn');
const btnCancelPurchase = document.getElementById('cancel-purchase-btn');
const purchaseForm = document.getElementById('purchase-form');

// Form Inputs (Tasks)
const inputId = document.getElementById('task-id');
const inputTitle = document.getElementById('task-title');
const inputProject = document.getElementById('task-project');
const inputAssignee = document.getElementById('task-assignee');
const inputDate = document.getElementById('task-date');
const inputStatus = document.getElementById('task-status');
const inputStatusText = document.getElementById('task-status-text');
const inputShowstopper = document.getElementById('task-showstopper');
const inputManager = document.getElementById('task-manager');
const inputCTO = document.getElementById('task-cto');
const inputPriority = document.getElementById('task-priority');
const inputSubtaskTitle = document.getElementById('new-subtask-title');
const btnAddSubtask = document.getElementById('add-subtask-btn');
const modalSubtaskList = document.getElementById('modal-subtask-list');

let currentSubtasks = []; // Temporary state during modal editing

// Form Inputs (Purchases)
const inputPurchaseId = document.getElementById('purchase-id');
const inputPurchaseTitle = document.getElementById('purchase-title');
const inputPurchaseSku = document.getElementById('purchase-sku');
const inputPurchaseProject = document.getElementById('purchase-project');
const inputPurchaseQuantity = document.getElementById('purchase-quantity');
const inputPurchasePrice = document.getElementById('purchase-price');
const inputPurchaseDate = document.getElementById('purchase-date');
const inputPurchaseDelivery = document.getElementById('purchase-delivery');
const inputPurchaseStatus = document.getElementById('purchase-status');

// Datalists
const dlProject = document.getElementById('project-list');
const dlAssignee = document.getElementById('assignee-list');

// Tasks View Filters & Container
const tasksContainer = document.getElementById('tasks-container');
const selectFilterStatus = document.getElementById('filter-status');
const selectFilterProject = document.getElementById('filter-project');
const selectFilterAssignee = document.getElementById('filter-assignee');
const selectFilterTimeframe = document.getElementById('filter-timeframe');
const cbHideCompletedTasks = document.getElementById('hide-completed-tasks');
const inputSearch = document.getElementById('global-search');

// Purchases View Filters & Container
const purchasesContainer = document.getElementById('purchases-container');
const selectPurchaseFilterStatus = document.getElementById('filter-purchase-status');
const selectPurchaseFilterProject = document.getElementById('filter-purchase-project');
const selectPurchaseFilterTimeframe = document.getElementById('filter-purchase-timeframe');
const cbHideArrivedPurchases = document.getElementById('hide-arrived-purchases');

// Report View
const selectReportProject = document.getElementById('report-project-select');
const cbReportHideCompletedTasks = document.getElementById('report-hide-completed-tasks');
const cbReportHideArrivedPurchases = document.getElementById('report-hide-arrived-purchases');
const cbReportFilterManager = document.getElementById('report-filter-manager');
const cbReportFilterCTO = document.getElementById('report-filter-cto');
const reportContent = document.getElementById('report-content');
const reportEmptyState = document.getElementById('report-empty-state');
const reportTasksContainer = document.getElementById('report-tasks-container');
const reportPurchasesContainer = document.getElementById('report-purchases-container');
const reportTargetsContainer = document.getElementById('report-targets-container');
const btnPrintReport = document.getElementById('btn-print-report');

// Targets Elements
const targetsContainer = document.getElementById('targets-container');
const targetModal = document.getElementById('target-modal');
const btnAddTarget = document.getElementById('btn-add-target');
const btnCloseTargetModal = document.getElementById('close-target-modal-btn');
const btnCancelTarget = document.getElementById('cancel-target-btn');
const targetForm = document.getElementById('target-form');
const inputTargetId = document.getElementById('target-id');
const inputTargetTitle = document.getElementById('target-title');
const inputTargetProject = document.getElementById('target-project');
const inputTargetDate = document.getElementById('target-date');
const inputTargetStatus = document.getElementById('target-status');
const selectTargetTrackingType = document.getElementById('target-tracking-type');
const targetQuantitativeFields = document.getElementById('target-quantitative-fields');
const inputTargetValue = document.getElementById('target-value');
const inputTargetActual = document.getElementById('target-actual');
const selectTargetYear = document.getElementById('select-target-year');
const selectTargetViewType = document.getElementById('select-target-view-type');

let currentTargetYear = new Date().getFullYear();
let currentTargetViewType = 'month'; // 'quarter', 'month', 'week'

// Dashboards Stats
const statTotal = document.getElementById('stat-total');
const statActive = document.getElementById('stat-active');
const statCompleted = document.getElementById('stat-completed');
const statShowstoppers = document.getElementById('stat-showstoppers');
const btnTogglePresentation = document.getElementById('toggle-presentation-mode');
const btnExitPresentation = document.getElementById('exit-presentation-btn');
const btnThemeToggle = document.getElementById('theme-toggle');

// Initialize Theme
if (localStorage.getItem('taskManager_theme') === 'light') {
    document.body.classList.add('light-theme');
    updateThemeToggleUI(true);
}

// Get day of week in Hebrew
function getDayOfWeekHebrew(date) {
    const daysOfWeek = [
        'יום ראשון',      // Sunday
        'יום שני',        // Monday
        'יום שלישי',      // Tuesday
        'יום רביעי',      // Wednesday
        'יום חמישי',      // Thursday
        'יום שישי',       // Friday
        'יום שבת'        // Saturday
    ];
    return daysOfWeek[date.getDay()];
}

// Setup current date in header
const today = new Date();
const formattedToday = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getFullYear()).slice(-2)}`;
const dayOfWeek = getDayOfWeekHebrew(today);
document.getElementById('current-date').textContent = `${formattedToday} • ${dayOfWeek}`;

// ---------------- Initialization ----------------
function init() {
    setupEventListeners();

    updateDatalists();
    updateFilterOptions();
    updateTargetYearOptions();
    renderTasks();
    renderPurchases();
    renderTargets();
    renderBudgets();
    updateDashboard();
}

function switchToView(targetId) {
    // Remove active class
    navItems.forEach(nav => nav.classList.remove('active'));
    views.forEach(view => view.classList.remove('active-view'));

    // Add active class to nav item
    const navItem = Array.from(navItems).find(nav => nav.getAttribute('data-target') === targetId);
    if (navItem) navItem.classList.add('active');

    // Show view
    const viewEl = document.getElementById(targetId);
    if (viewEl) viewEl.classList.add('active-view');

    // If switching to dashboard, re-render charts to ensure they fit correctly
    if (targetId === 'dashboard') {
        updateCharts();
    }
}

// ---------------- Event Listeners ----------------
function setupEventListeners() {
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            if (targetId) switchToView(targetId);
        });
    });

    // Task Modal
    btnNewTaskNav.addEventListener('click', () => openModal('task'));
    btnCloseModal.addEventListener('click', () => closeModal('task'));
    btnCancelTask.addEventListener('click', () => closeModal('task'));

    // Purchase Modal
    btnNewPurchaseNav.addEventListener('click', () => openModal('purchase'));
    btnClosePurchaseModal.addEventListener('click', () => closeModal('purchase'));
    btnCancelPurchase.addEventListener('click', () => closeModal('purchase'));

    // Close modals on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal('task');
    });
    purchaseModal.addEventListener('click', (e) => {
        if (e.target === purchaseModal) closeModal('purchase');
    });
    targetModal.addEventListener('click', (e) => {
        if (e.target === targetModal) closeModal('target');
    });

    // Theme Toggle
    if (btnThemeToggle) {
        btnThemeToggle.addEventListener('click', toggleTheme);
    }

    // Presentation Mode
    btnTogglePresentation.addEventListener('click', togglePresentationMode);
    btnExitPresentation.addEventListener('click', togglePresentationMode);

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('presentation-mode')) {
            togglePresentationMode();
        }
    });

    // Import / Export
    btnExportData.addEventListener('click', exportData);
    btnImportData.addEventListener('click', () => fileImportInput.click());
    fileImportInput.addEventListener('change', importData);
    if (btnSaveData) {
        btnSaveData.addEventListener('click', saveAllData);
    }

    // Restore Connection
    if (btnRestoreConnection) {
        btnRestoreConnection.addEventListener('click', showRestoreConnectionDialog);
    }
    if (btnRestoreFromJS) {
        btnRestoreFromJS.addEventListener('click', restoreFromLocalStorage);
    }
    if (btnRestoreFromExcel) {
        btnRestoreFromExcel.addEventListener('click', restoreFromExcelFile);
    }

    // Sync
    if (btnConnectFS) {
        btnConnectFS.addEventListener('click', connectFile);
    }

    // Form Submissions
    taskForm.addEventListener('submit', handleTaskSubmit);
    purchaseForm.addEventListener('submit', handlePurchaseSubmit);
    targetForm.addEventListener('submit', handleTargetSubmit);

    // Subtasks in Modal
    btnAddSubtask.addEventListener('click', addSubtask);
    inputSubtaskTitle.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSubtask();
        }
    });

    if (btnAddTarget) {
        btnAddTarget.addEventListener('click', () => openModal('target'));
    }

    if (selectTargetYear) {
        selectTargetYear.addEventListener('change', (e) => {
            currentTargetYear = parseInt(e.target.value);
            renderTargets();
        });
    }

    if (selectTargetViewType) {
        selectTargetViewType.addEventListener('change', (e) => {
            currentTargetViewType = e.target.value;
            renderTargets();
        });
    }
    if (btnCloseTargetModal) {
        btnCloseTargetModal.addEventListener('click', () => closeModal('target'));
    }
    if (btnCancelTarget) {
        btnCancelTarget.addEventListener('click', () => closeModal('target'));
    }

    if (selectTargetTrackingType) {
        selectTargetTrackingType.addEventListener('change', (e) => {
            targetQuantitativeFields.style.display = e.target.value === 'quantitative' ? 'flex' : 'none';
        });
    }

    // Filters & Search (Tasks)
    selectFilterStatus.addEventListener('change', (e) => {
        currentFilterStatus = e.target.value;
        renderTasks();
    });

    selectFilterProject.addEventListener('change', (e) => {
        currentFilterProject = e.target.value;
        renderTasks();
    });

    selectFilterAssignee.addEventListener('change', (e) => {
        currentFilterAssignee = e.target.value;
        renderTasks();
    });

    selectFilterTimeframe.addEventListener('change', (e) => {
        currentFilterTimeframe = e.target.value;
        renderTasks();
    });

    // Filters (Purchases)
    selectPurchaseFilterStatus.addEventListener('change', (e) => {
        currentPurchaseFilterStatus = e.target.value;
        renderPurchases();
    });

    selectPurchaseFilterProject.addEventListener('change', (e) => {
        currentPurchaseFilterProject = e.target.value;
        renderPurchases();
    });

    selectPurchaseFilterTimeframe.addEventListener('change', (e) => {
        currentPurchaseFilterTimeframe = e.target.value;
        renderPurchases();
    });

    // Reports
    selectReportProject.addEventListener('change', (e) => {
        renderReport();
    });

    cbReportHideCompletedTasks.addEventListener('change', (e) => {
        reportHideCompletedTasks = e.target.checked;
        if (selectReportProject.value) renderReport();
    });

    cbReportHideArrivedPurchases.addEventListener('change', (e) => {
        reportHideArrivedPurchases = e.target.checked;
        if (selectReportProject.value) renderReport();
    });

    cbReportFilterManager.addEventListener('change', (e) => {
        reportFilterManager = e.target.checked;
        if (selectReportProject.value) renderReport();
    });

    cbReportFilterCTO.addEventListener('change', (e) => {
        reportFilterCTO = e.target.checked;
        if (selectReportProject.value) renderReport();
    });

    btnPrintReport.addEventListener('click', () => {
        window.print();
    });

    // Toggles
    cbHideCompletedTasks.addEventListener('change', (e) => {
        hideCompletedTasks = e.target.checked;
        renderTasks();
    });

    cbHideArrivedPurchases.addEventListener('change', (e) => {
        hideArrivedPurchases = e.target.checked;
        renderPurchases();
    });

    // Dashboard Card Clicks
    document.getElementById('card-stat-total').addEventListener('click', () => {
        currentFilterStatus = 'all';
        selectFilterStatus.value = 'all';
        switchToView('tasks-view');
        renderTasks();
    });

    document.getElementById('card-stat-active').addEventListener('click', () => {
        currentFilterStatus = 'active';
        selectFilterStatus.value = 'active';
        switchToView('tasks-view');
        renderTasks();
    });

    document.getElementById('card-stat-completed').addEventListener('click', () => {
        currentFilterStatus = 'completed';
        selectFilterStatus.value = 'completed';
        switchToView('tasks-view');
        renderTasks();
    });

    document.getElementById('card-stat-showstoppers').addEventListener('click', () => {
        currentFilterStatus = 'showstopper';
        selectFilterStatus.value = 'showstopper';
        switchToView('tasks-view');
        renderTasks();
    });

    // Global Search
    inputSearch.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderTasks();
        renderPurchases();
    });

    // Budget Modal
    const btnOpenBudgetModal = document.getElementById('open-new-budget-modal');
    const budgetModal = document.getElementById('budget-modal');
    const btnCloseBudgetModal = document.getElementById('close-budget-modal-btn');
    const btnCancelBudget = document.getElementById('cancel-budget-btn');
    const budgetForm = document.getElementById('budget-form');

    if (btnOpenBudgetModal) {
        btnOpenBudgetModal.addEventListener('click', () => openBudgetModal());
    }

    if (budgetModal) {
        budgetModal.addEventListener('click', (e) => {
            if (e.target === budgetModal) closeModal('budget');
        });
    }

    if (btnCloseBudgetModal) {
        btnCloseBudgetModal.addEventListener('click', () => closeModal('budget'));
    }

    if (btnCancelBudget) {
        btnCancelBudget.addEventListener('click', () => closeModal('budget'));
    }

    if (budgetForm) {
        budgetForm.addEventListener('submit', handleBudgetSubmit);
    }

    // Tasks View Toggle (Cards vs Table)
    const btnTasksViewCards = document.getElementById('tasks-view-cards');
    const btnTasksViewTable = document.getElementById('tasks-view-table');

    if (btnTasksViewCards) {
        btnTasksViewCards.addEventListener('click', () => {
            tasksViewMode = 'cards';
            updateTasksViewToggle();
            renderTasks();
        });
    }

    if (btnTasksViewTable) {
        btnTasksViewTable.addEventListener('click', () => {
            tasksViewMode = 'table';
            updateTasksViewToggle();
            renderTasks();
        });
    }

}

function updateTasksViewToggle() {
    const btnTasksViewCards = document.getElementById('tasks-view-cards');
    const btnTasksViewTable = document.getElementById('tasks-view-table');

    if (btnTasksViewCards && btnTasksViewTable) {
        if (tasksViewMode === 'cards') {
            btnTasksViewCards.classList.add('active');
            btnTasksViewTable.classList.remove('active');
        } else {
            btnTasksViewCards.classList.remove('active');
            btnTasksViewTable.classList.add('active');
        }
    }
}

// ---------------- Modal Logic ----------------
function openModal(type, id = null) {
    if (type === 'task') {
        if (typeof id === 'string') {
            // Edit mode task
            const task = tasks.find(t => t.id === id);
            if (task) {
                document.querySelector('#task-modal .modal-header h2').textContent = 'עריכת משימה';
                inputId.value = task.id;
                inputTitle.value = task.title;
                inputProject.value = task.project;
                inputAssignee.value = task.assignee;
                inputDate.value = task.dueDate;
                inputStatus.value = task.status;
                inputStatusText.value = task.statusText || '';
                inputShowstopper.checked = task.showstopper || false;
                inputManager.checked = task.isManager || false;
                inputCTO.checked = task.isCTO || false;
                inputPriority.value = task.priority || 'medium';
                currentSubtasks = task.subtasks ? JSON.parse(JSON.stringify(task.subtasks)) : [];
                renderModalSubtasks();
            }
        } else {
            // Create mode task
            document.querySelector('#task-modal .modal-header h2').textContent = 'יצירת משימה חדשה';
            taskForm.reset();
            inputId.value = '';
            inputStatus.value = 'pending';
            inputStatusText.value = '';
            inputDate.value = new Date().toISOString().split('T')[0];
            inputManager.checked = false;
            inputCTO.checked = false;
            inputPriority.value = 'medium';
            currentSubtasks = [];
            renderModalSubtasks();
        }
        modal.classList.add('active');
    } else if (type === 'purchase') {
        if (typeof id === 'string') {
            // Edit mode purchase
            const purchase = purchases.find(p => p.id === id);
            if (purchase) {
                document.querySelector('#purchase-modal .modal-header h2').textContent = 'עריכת פריט רכש';
                inputPurchaseId.value = purchase.id;
                inputPurchaseTitle.value = purchase.title;
                inputPurchaseSku.value = purchase.sku || '';
                inputPurchaseProject.value = purchase.project;
                inputPurchaseQuantity.value = purchase.quantity || 1;
                inputPurchasePrice.value = purchase.price || 0;
                inputPurchaseDate.value = purchase.date;
                document.getElementById('purchase-promised').value = purchase.promisedDate || '';
                inputPurchaseDelivery.value = purchase.estimatedDeliveryDate || purchase.deliveryDate || '';
                inputPurchaseStatus.value = purchase.status;
            }
        } else {
            // Create mode purchase
            document.querySelector('#purchase-modal .modal-header h2').textContent = 'פריט רכש חדש';
            purchaseForm.reset();
            inputPurchaseId.value = '';
            inputPurchaseStatus.value = 'request_sent';
            inputPurchaseQuantity.value = 1;
            inputPurchasePrice.value = 0;
            inputPurchaseDate.value = new Date().toISOString().split('T')[0];
            document.getElementById('purchase-promised').value = '';
            document.getElementById('purchase-delivery').value = '';
        }
        purchaseModal.classList.add('active');
    } else if (type === 'target') {
        if (typeof id === 'string') {
            const target = targets.find(t => t.id === id);
            if (target) {
                document.querySelector('#target-modal .modal-header h2').textContent = 'עריכת יעד';
                inputTargetId.value = target.id;
                inputTargetTitle.value = target.title;
                inputTargetProject.value = target.project;
                inputTargetDate.value = target.dueDate;
                inputTargetStatus.value = target.status;
                selectTargetTrackingType.value = target.trackingType || 'tasks';
                inputTargetValue.value = target.targetValue || 0;
                inputTargetActual.value = target.actualValue || 0;
                targetQuantitativeFields.style.display = selectTargetTrackingType.value === 'quantitative' ? 'flex' : 'none';
            }
        } else {
            document.querySelector('#target-modal .modal-header h2').textContent = 'יצירת יעד חדש';
            targetForm.reset();
            inputTargetId.value = '';
            inputTargetDate.value = new Date().toISOString().split('T')[0];
            targetQuantitativeFields.style.display = 'none';
        }
        targetModal.classList.add('active');
    }
}

function closeModal(type) {
    if (type === 'task') {
        modal.classList.remove('active');
        setTimeout(() => taskForm.reset(), 300);
    } else if (type === 'purchase') {
        purchaseModal.classList.remove('active');
        setTimeout(() => purchaseForm.reset(), 300);
    } else if (type === 'target') {
        targetModal.classList.remove('active');
        setTimeout(() => targetForm.reset(), 300);
    } else if (type === 'budget') {
        const budgetModal = document.getElementById('budget-modal');
        const budgetForm = document.getElementById('budget-form');
        if (budgetModal) {
            budgetModal.classList.remove('active');
            setTimeout(() => budgetForm?.reset(), 300);
        }
    }
}

// ---------------- Subtask Logic ----------------
function addSubtask() {
    const title = inputSubtaskTitle.value.trim();
    if (title) {
        currentSubtasks.push({
            id: 'sub_' + Date.now() + Math.random().toString(36).substr(2, 9),
            title: title,
            completed: false
        });
        inputSubtaskTitle.value = '';
        renderModalSubtasks();
    }
}

function removeSubtask(index) {
    currentSubtasks.splice(index, 1);
    renderModalSubtasks();
}

function renderModalSubtasks() {
    modalSubtaskList.innerHTML = currentSubtasks.map((sub, index) => `
        <li class="modal-subtask-item">
            <div style="flex: 1; display: flex; align-items: center; gap: 0.8rem;">
                <i class="fa-solid fa-circle-dot" style="font-size: 0.6rem; opacity: 0.5;"></i>
                ${sub.isEditing ?
            `<input type="text" class="subtask-edit-input" value="${sub.title}" onblur="saveSubtaskEdit(${index}, this.value)" onkeydown="if(event.key==='Enter') this.blur()">` :
            `<span onclick="editSubtask(${index})">${sub.title}</span>`
        }
            </div>
            <div class="subtask-controls">
                <button type="button" class="btn-subtask-action" onclick="moveSubtask(${index}, -1)" title="למעלה">
                    <i class="fa-solid fa-chevron-up"></i>
                </button>
                <button type="button" class="btn-subtask-action" onclick="moveSubtask(${index}, 1)" title="למטה">
                    <i class="fa-solid fa-chevron-down"></i>
                </button>
                <button type="button" class="btn-subtask-action" onclick="editSubtask(${index})" title="ערוך">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button type="button" class="btn-subtask-action delete" onclick="removeSubtask(${index})" title="מחק">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        </li>
    `).join('');
}

function editSubtask(index) {
    currentSubtasks[index].isEditing = true;
    renderModalSubtasks();
    const input = modalSubtaskList.querySelectorAll('.subtask-edit-input')[0];
    if (input) {
        input.focus();
        input.select();
    }
}

function saveSubtaskEdit(index, newTitle) {
    if (newTitle.trim()) {
        const oldTitle = currentSubtasks[index].title;
        currentSubtasks[index].title = newTitle.trim();
    }
    delete currentSubtasks[index].isEditing;
    renderModalSubtasks();
}

function moveSubtask(index, direction) {
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < currentSubtasks.length) {
        const temp = currentSubtasks[index];
        currentSubtasks[index] = currentSubtasks[newIndex];
        currentSubtasks[newIndex] = temp;
        renderModalSubtasks();
    }
}

function toggleTheme() {
    const isLight = document.body.classList.toggle('light-theme');
    localStorage.setItem('taskManager_theme', isLight ? 'light' : 'dark');
    updateThemeToggleUI(isLight);
}

function updateThemeToggleUI(isLight) {
    if (!btnThemeToggle) return;
    const icon = btnThemeToggle.querySelector('i');
    const text = btnThemeToggle.querySelector('span');
    if (isLight) {
        icon.className = 'fa-solid fa-sun';
        text.textContent = 'מצב יום';
    } else {
        icon.className = 'fa-solid fa-moon';
        text.textContent = 'מצב לילה';
    }
}

function toggleSubtaskStatus(taskId, subtaskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.subtasks) {
        const sub = task.subtasks.find(s => s.id === subtaskId);
        if (sub) {
            sub.completed = !sub.completed;
            saveTasks();
            renderTasks();
            if (selectReportProject.value) renderReport();
        }
    }
}

// ---------------- Task Logic ----------------
function handleTaskSubmit(e) {
    e.preventDefault();

    const taskData = {
        title: inputTitle.value.trim(),
        project: inputProject.value.trim(),
        assignee: inputAssignee.value.trim(),
        dueDate: inputDate.value,
        status: inputStatus.value,
        statusText: inputStatusText.value.trim(),
        showstopper: inputShowstopper.checked,
        isManager: inputManager.checked,
        isCTO: inputCTO.checked,
        priority: inputPriority.value || 'medium',
        subtasks: currentSubtasks,
        updatedAt: new Date().toISOString()
    };

    if (inputId.value) {
        // Update existing task
        const index = tasks.findIndex(t => t.id === inputId.value);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...taskData };
        }
    } else {
        // Add new task
        const newTask = {
            id: 'task_' + Date.now().toString(),
            createdAt: new Date().toISOString(),
            ...taskData
        };
        tasks.push(newTask);
    }

    saveTasks();

    updateDatalists();
    updateFilterOptions();
    renderTasks();
    updateDashboard();
    if (selectReportProject.value) renderReport();
    closeModal('task');
}

function handlePurchaseSubmit(e) {
    e.preventDefault();

    const purchaseData = {
        title: inputPurchaseTitle.value.trim(),
        sku: inputPurchaseSku.value.trim(),
        project: inputPurchaseProject.value.trim(),
        quantity: inputPurchaseQuantity.value,
        price: parseFloat(inputPurchasePrice.value) || 0,
        date: inputPurchaseDate.value,
        promisedDate: document.getElementById('purchase-promised').value,
        estimatedDeliveryDate: document.getElementById('purchase-delivery').value,
        status: inputPurchaseStatus.value,
        updatedAt: new Date().toISOString()
    };

    if (inputPurchaseId.value) {
        const index = purchases.findIndex(p => p.id === inputPurchaseId.value);
        if (index !== -1) {
            purchases[index] = { ...purchases[index], ...purchaseData };
        }
    } else {
        const newPurchase = {
            id: 'purchase_' + Date.now().toString(),
            createdAt: new Date().toISOString(),
            ...purchaseData
        };
        purchases.push(newPurchase);
    }

    savePurchases();

    updateDatalists();
    updateFilterOptions();
    renderPurchases();
    renderBudgets();
    updateDashboard();
    if (selectReportProject.value) renderReport();
    closeModal('purchase');
}

function handleTargetSubmit(e) {
    e.preventDefault();

    const targetData = {
        title: inputTargetTitle.value.trim(),
        project: inputTargetProject.value.trim(),
        dueDate: inputTargetDate.value,
        status: inputTargetStatus.value,
        trackingType: selectTargetTrackingType.value,
        targetValue: parseInt(inputTargetValue.value) || 0,
        actualValue: parseInt(inputTargetActual.value) || 0,
        updatedAt: new Date().toISOString()
    };

    if (inputTargetId.value) {
        const index = targets.findIndex(t => t.id === inputTargetId.value);
        if (index !== -1) {
            targets[index] = { ...targets[index], ...targetData };
        }
    } else {
        const newTarget = {
            id: 'target_' + Date.now().toString(),
            createdAt: new Date().toISOString(),
            ...targetData
        };
        targets.push(newTarget);
    }

    saveTargets();

    updateDatalists();
    updateFilterOptions();
    updateTargetYearOptions();
    renderTargets();
    if (selectReportProject.value) renderReport();
    closeModal('target');
}

function deleteTarget(id) {
    if (confirm('האם אתה בטוח שברצונך למחוק יעד זה?')) {
        targets = targets.filter(t => t.id !== id);
        saveTargets();
        updateDatalists();
        updateFilterOptions();
        updateTargetYearOptions();
        renderTargets();
        if (selectReportProject.value) renderReport();
    }
}

function deleteTask(id) {
    if (confirm('האם אתה בטוח שברצונך למחוק משימה זו?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        updateDatalists();
        updateFilterOptions();
        renderTasks();
        updateDashboard();
        if (selectReportProject.value) renderReport();
    }
}

function deletePurchase(id) {
    if (confirm('האם אתה בטוח שברצונך למחוק פריט רכש זה?')) {
        purchases = purchases.filter(p => p.id !== id);
        savePurchases();
        updateDatalists();
        updateFilterOptions();
        renderPurchases();
        updateDashboard();
        if (selectReportProject.value) renderReport();
    }
}

async function toggleTaskStatus(id) {
    // Find the item (task or target)
    let item = tasks.find(t => t.id === id);
    let isTargetItem = false;

    if (!item) {
        item = targets.find(t => t.id === id);
        isTargetItem = true;
    }

    if (item) {
        // Store old status for logging
        const oldStatus = item.status;

        // Toggle status
        if (item.status === 'completed') {
            item.status = 'in_progress';
        } else {
            item.status = 'completed';
        }
        item.updatedAt = new Date().toISOString();

        if (isTargetItem) {
            saveTargets();
            renderTargets();
        } else {
            saveTasks();
        }

        renderTasks(); // Re-render tasks (which includes targets)
        updateDashboard();
        if (selectReportProject.value) renderReport();
    }
}

async function togglePurchaseStatus(id) {
    const purchase = purchases.find(p => p.id === id);
    if (purchase) {
        const oldStatus = purchase.status;

        if (purchase.status === 'request_sent') {
            purchase.status = 'ordered';
        } else if (purchase.status === 'ordered') {
            purchase.status = 'arrived';
        } else {
            purchase.status = 'request_sent';
        }
        purchase.updatedAt = new Date().toISOString();

        savePurchases();
        renderPurchases();
        if (selectReportProject.value) renderReport();
    }
}

function saveTasks() {
    localStorage.setItem('taskManager_tasks', JSON.stringify(tasks));
}

function savePurchases() {
    localStorage.setItem('taskManager_purchases', JSON.stringify(purchases));
}

function saveTargets() {
    localStorage.setItem('taskManager_targets', JSON.stringify(targets));
}

function saveProjectBudgets() {
    localStorage.setItem('taskManager_projectBudgets', JSON.stringify(projectBudgets));
}

// ---------------- File System Sync Logic ----------------

async function connectFile() {
    if (!isFileSystemSupported) {
        alert('הדפדפן שלך אינו תומך בגישה ישירה לקבצים. מומלץ להשתמש ב-Chrome או Edge.');
        return;
    }

    try {
        const [handle] = await window.showOpenFilePicker({
            types: [{
                description: 'JSON Data File',
                accept: { 'application/json': ['.json'] },
            }],
            multiple: false
        });

        fileHandle = handle;

        // Verify permissions
        const options = { mode: 'readwrite' };
        if ((await fileHandle.queryPermission(options)) !== 'granted') {
            if ((await fileHandle.requestPermission(options)) !== 'granted') {
                alert('נדרשת הרשאת כתיבה כדי לסנכרן נתונים.');
                return;
            }
        }

        await loadFromFile();
        updateSyncUI(true);
        alert('מחובר לקובץ בהצלחה! הנתונים נטענו ומסתנכרנים כעת.');

    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error(err);
            alert('שגיאה בחיבור לקובץ.');
        }
    }
}

async function loadFromFile() {
    if (!fileHandle) return;
    try {
        const file = await fileHandle.getFile();
        const content = await file.text();
        if (content.trim()) {
            const data = JSON.parse(content);
            if (data.tasks) {
                tasks = data.tasks;
                localStorage.setItem('taskManager_tasks', JSON.stringify(tasks));
            }
            if (data.purchases) {
                purchases = data.purchases;
                localStorage.setItem('taskManager_purchases', JSON.stringify(purchases));
            }
            if (data.targets) {
                targets = data.targets;
                localStorage.setItem('taskManager_targets', JSON.stringify(targets));
            }

            // Refresh UI
            updateDatalists();
            updateFilterOptions();
            renderTasks();
            renderPurchases();
            renderTargets();
            updateDashboard();
        }
    } catch (err) {
        console.error('Error reading from file:', err);
    }
}

async function saveToFile() {
    if (!fileHandle) return;
    try {
        const writable = await fileHandle.createWritable();
        const data = {
            tasks,
            purchases,
            targets,
            lastSync: new Date().toISOString()
        };
        await writable.write(JSON.stringify(data, null, 2));
        await writable.close();
        console.log('Saved to shared file');
    } catch (err) {
        console.error('Error writing to file:', err);
        // If we lost permission, reset UI
        updateSyncUI(false);
        fileHandle = null;
    }
}

function updateSyncUI(isConnected, isPending = false) {
    if (isConnected) {
        btnConnectFS.innerHTML = '<i class="fa-solid fa-link"></i> <span>מחובר</span>';
        btnConnectFS.classList.add('is-connected');
        btnConnectFS.classList.remove('is-pending');
        syncStatusIndicator.style.display = 'flex';
    } else if (isPending) {
        btnConnectFS.innerHTML = '<i class="fa-solid fa-link-slash"></i> <span>שחזר חיבור</span>';
        btnConnectFS.classList.remove('is-connected');
        btnConnectFS.classList.add('is-pending');
        syncStatusIndicator.style.display = 'none';
    } else {
        btnConnectFS.innerHTML = '<i class="fa-solid fa-link-slash"></i> <span>חיבור לסנכרון</span>';
        btnConnectFS.classList.remove('is-connected');
        btnConnectFS.classList.remove('is-pending');
        syncStatusIndicator.style.display = 'none';
    }
}

// ---------------- Import / Export (Excel) ----------------

function exportData() {
    // 1. Prepare Tasks Data
    const taskRows = tasks.map(t => ({
        'מזהה': t.id,
        'כותרת': t.title,
        'פרויקט': t.project,
        'אחראי': t.assignee,
        'תאריך יעד': t.dueDate,
        'עדיפות': t.priority === 'high' ? 'גבוהה' : t.priority === 'low' ? 'נמוכה' : t.priority === 'none' ? 'ללא' : 'בינונית',
        'סטטוס': getStatusLabel(t.status),
        'סטטוס חופשי': t.statusText || '',
        'קריטי (Showstopper)': t.showstopper ? 'כן' : 'לא',
        'מנהל פרויקט': t.isManager ? 'כן' : 'לא',
        'CTO': t.isCTO ? 'כן' : 'לא',
        'תאריך יצירה': t.createdAt,
        'עדכון אחרון': t.updatedAt,
        'תת-משימות': t.subtasks ? t.subtasks.map(s => s.title).join('; ') : ''
    }));

    // 2. Prepare Purchases Data
    const purchaseRows = purchases.map(p => ({
        'מזהה': p.id,
        'שם הפריט': p.title,
        'פרויקט': p.project,
        'מק"ט': p.sku || '',
        'כמות': p.quantity || 1,
        'מחיר': p.price || 0,
        'תאריך בקשה': p.date,
        'תאריך הבטחה': p.promisedDate || '',
        'צפי הגעה מעודכן': p.estimatedDeliveryDate || p.deliveryDate || '',
        'סטטוס': getStatusLabel(p.status),
        'תאריך יצירה': p.createdAt,
        'עדכון אחרון': p.updatedAt
    }));

    // 3. Prepare Targets Data
    const targetRows = targets.map(t => ({
        'מזהה': t.id,
        'כותרת': t.title,
        'פרויקט': t.project,
        'תאריך יעד': t.dueDate,
        'סטטוס': getStatusLabel(t.status),
        'סוג מעקב': t.trackingType,
        'ערך יעד': t.targetValue,
        'ערך בפועל': t.actualValue,
        'תאריך יצירה': t.createdAt,
        'עדכון אחרון': t.updatedAt
    }));

    // 4. Prepare Project Budgets Data
    const budgetRows = Object.entries(projectBudgets).map(([project, budget]) => ({
        'פרויקט': project,
        'תקציב': budget
    }));

    // 5. Create Workbook and Sheets
    const wb = XLSX.utils.book_new();
    const wsTasks = XLSX.utils.json_to_sheet(taskRows);
    const wsPurchases = XLSX.utils.json_to_sheet(purchaseRows);
    const wsTargets = XLSX.utils.json_to_sheet(targetRows);
    const wsBudgets = XLSX.utils.json_to_sheet(budgetRows);

    // 6. Add sheets to workbook
    XLSX.utils.book_append_sheet(wb, wsTasks, "משימות");
    XLSX.utils.book_append_sheet(wb, wsPurchases, "רכש");
    XLSX.utils.book_append_sheet(wb, wsTargets, "יעדים");
    XLSX.utils.book_append_sheet(wb, wsBudgets, "תקציבים");

    // 7. Generate and download file
    XLSX.writeFile(wb, `task_manager_export_${new Date().toISOString().split('T')[0]}.xlsx`);
}

/**
 * Export data to Excel file using File System Access API
 * Allows user to select where to save the Excel file
 */
// Save all data to both localStorage and Excel
function saveAllData() {
    // Save to localStorage/database
    saveTasks();
    savePurchases();
    saveTargets();
    saveProjectBudgets();

    // Export to Excel
    exportData();

    // Show success message
    alert('הנתונים שמורים בהצלחה');
}

// ============================================================
// DATABASE FILE FUNCTIONS (JSON + Polling)
// ============================================================

/**
 * Load database from JSON file handle
 */
function importData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        let importedTasks = [];
        let importedPurchases = [];
        let importedTargets = [];
        let importedBudgets = {};

        // Parse Tasks sheet
        if (workbook.SheetNames.includes("משימות")) {
            const sheet = workbook.Sheets["משימות"];
            const rows = XLSX.utils.sheet_to_json(sheet);
            importedTasks = rows.map(row => ({
                id: row['מזהה'] || 'task_' + Date.now() + Math.random(),
                title: row['כותרת'] || '',
                project: row['פרויקט'] || 'כללי',
                assignee: row['אחראי'] || '',
                dueDate: row['תאריך יעד'] || new Date().toISOString().split('T')[0],
                priority: row['עדיפות'] === 'גבוהה' ? 'high' : row['עדיפות'] === 'נמוכה' ? 'low' : row['עדיפות'] === 'ללא' ? 'none' : 'medium',
                status: reverseStatusLabel(row['סטטוס']),
                statusText: row['סטטוס חופשי'] || '',
                showstopper: row['קריטי (Showstopper)'] === 'כן',
                isManager: row['מנהל פרויקט'] === 'כן',
                isCTO: row['CTO'] === 'כן',
                createdAt: row['תאריך יצירה'] || new Date().toISOString(),
                updatedAt: row['עדכון אחרון'] || new Date().toISOString(),
                subtasks: row['תת-משימות'] ? row['תת-משימות'].split('; ').map(s => ({ id: 'sub_' + Date.now() + Math.random(), title: s, completed: false })) : []
            }));
        }

        // Parse Purchases sheet
        if (workbook.SheetNames.includes("רכש")) {
            const sheet = workbook.Sheets["רכש"];
            const rows = XLSX.utils.sheet_to_json(sheet);
            importedPurchases = rows.map(row => ({
                id: row['מזהה'] || 'purchase_' + Date.now() + Math.random(),
                title: row['שם הפריט'] || '',
                project: row['פרויקט'] || 'כללי',
                sku: row['מק"ט'] || '',
                quantity: row['כמות'] || 1,
                price: parseFloat(row['מחיר']) || 0,
                date: row['תאריך בקשה'] || new Date().toISOString().split('T')[0],
                promisedDate: row['תאריך הבטחה'] || '',
                estimatedDeliveryDate: row['צפי הגעה מעודכן'] || row['מועד אספקה'] || '',
                status: reverseStatusLabel(row['סטטוס']),
                createdAt: row['תאריך יצירה'] || new Date().toISOString(),
                updatedAt: row['עדכון אחרון'] || new Date().toISOString()
            }));
        }

        // Parse Targets sheet
        if (workbook.SheetNames.includes("יעדים")) {
            const sheet = workbook.Sheets["יעדים"];
            const rows = XLSX.utils.sheet_to_json(sheet);
            importedTargets = rows.map(row => ({
                id: row['מזהה'] || 'target_' + Date.now() + Math.random(),
                title: row['כותרת'] || '',
                project: row['פרויקט'] || 'כללי',
                dueDate: row['תאריך יעד'] || new Date().toISOString().split('T')[0],
                status: reverseStatusLabel(row['סטטוס']),
                trackingType: row['סוג מעקב'] || 'tasks',
                targetValue: parseInt(row['ערך יעד']) || 0,
                actualValue: parseInt(row['ערך בפועל']) || 0,
                createdAt: row['תאריך יצירה'] || new Date().toISOString(),
                updatedAt: row['עדכון אחרון'] || new Date().toISOString()
            }));
        }

        // Parse Budgets sheet
        if (workbook.SheetNames.includes("תקציבים")) {
            const sheet = workbook.Sheets["תקציבים"];
            const rows = XLSX.utils.sheet_to_json(sheet);
            rows.forEach(row => {
                if (row['פרויקט']) {
                    importedBudgets[row['פרויקט']] = parseFloat(row['תקציב']) || 0;
                }
            });
        }

        if (importedTasks.length > 0 || importedPurchases.length > 0 || importedTargets.length > 0) {
            if (confirm(`נמצאו ${importedTasks.length} משימות, ${importedPurchases.length} פריטי רכש ו-${importedTargets.length} יעדים. האם לדרוס את הנתונים הקיימים?`)) {
                tasks = importedTasks;
                purchases = importedPurchases;
                targets = importedTargets;
                projectBudgets = importedBudgets;
                (async () => {
                    saveTasks();
                    savePurchases();
                    saveTargets();
                    saveProjectBudgets();
                })();

                updateDatalists();
                updateFilterOptions();
                renderTasks();
                renderPurchases();
                renderTargets();
                renderBudgets();
                updateDashboard();
                if (selectReportProject.value) renderReport();

                alert('הנתונים יובאו בהצלחה מאקסל!');
            }
        } else {
            alert('לא נמצאו נתונים תקינים בקובץ.');
        }
    };
    reader.readAsArrayBuffer(file);
    fileImportInput.value = '';
}

// Restore Connection Functions
function showRestoreConnectionDialog() {
    if (restoreConnectionModal) {
        restoreConnectionModal.classList.add('active');
    }
}

function hideRestoreConnectionDialog() {
    if (restoreConnectionModal) {
        restoreConnectionModal.classList.remove('active');
    }
}

function restoreFromLocalStorage() {
    // Simply close the dialog and use the current localStorage data
    hideRestoreConnectionDialog();
    alert('נתונים טעונים מ-localStorage (זיכרון הדפדפן)');
}

function restoreFromExcelFile() {
    // Trigger file input and close dialog after selection
    hideRestoreConnectionDialog();
    fileImportInput.click();
}

function reverseStatusLabel(label) {
    // Tasks
    if (label === 'ממתין') return 'pending';
    if (label === 'בעבודה') return 'in_progress';
    if (label === 'תקוע') return 'stuck';
    if (label === 'בוצע') return 'completed';
    // Purchases
    if (label === 'נשלחה בקשה') return 'request_sent';
    if (label === 'הוזמן') return 'ordered';
    if (label === 'הגיע') return 'arrived';
    // Targets
    if (label === 'פעיל') return 'active';
    if (label === 'הושלם') return 'completed';
    if (label === 'באיחור') return 'overdue';
    return 'pending'; // fallback
}

// ---------------- UI Rendering ----------------

function getUniqueValues(key, sourceArray = null) {
    const arr = sourceArray || tasks;
    const values = arr.map(item => item[key]).filter(v => v);
    return [...new Set(values)].sort();
}

// Helper to get week number
function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return weekNo;
}

// Helper to update Target Year dropdown
function updateTargetYearOptions() {
    if (!selectTargetYear) return;

    const years = new Set([new Date().getFullYear()]);
    targets.forEach(t => {
        if (t.dueDate) years.add(new Date(t.dueDate).getFullYear());
    });

    const sortedYears = Array.from(years).sort((a, b) => a - b);
    selectTargetYear.innerHTML = sortedYears.map(y => `
        <option value="${y}" ${y === currentTargetYear ? 'selected' : ''}>${y}</option>
    `).join('');
}

function updateDatalists() {
    const projects = new Set();
    const assignees = new Set();

    tasks.forEach(task => {
        projects.add(task.project);
        assignees.add(task.assignee);
    });
    purchases.forEach(p => projects.add(p.project));
    targets.forEach(t => projects.add(t.project));

    dlProject.innerHTML = Array.from(projects).map(p => `<option value="${p}">`).join('');
    dlAssignee.innerHTML = Array.from(assignees).map(a => `<option value="${a}">`).join('');

    // Update Project Select in Report
    const currentReportProj = selectReportProject.value;
    selectReportProject.innerHTML = '<option value="" disabled selected>בחר פרויקט להצגה...</option><option value="all">כל המשימות (גלובלי)</option>';
    Array.from(projects).sort().forEach(p => {
        selectReportProject.innerHTML += `<option value="${p}">${p}</option>`;
    });
    selectReportProject.value = currentReportProj;

    // Update Filter Selects
    const currentFilterProj = selectFilterProject.value;
    selectFilterProject.innerHTML = '<option value="all">כל הפרויקטים</option>';
    Array.from(projects).sort().forEach(p => {
        selectFilterProject.innerHTML += `<option value="${p}">${p}</option>`;
    });
    selectFilterProject.value = currentFilterProj;

    // Same for Purchases
    const currentPurProj = selectPurchaseFilterProject.value;
    selectPurchaseFilterProject.innerHTML = '<option value="all">כל הפרויקטים</option>';
    Array.from(projects).sort().forEach(p => {
        selectPurchaseFilterProject.innerHTML += `<option value="${p}">${p}</option>`;
    });
    selectPurchaseFilterProject.value = currentPurProj;
}

function updateFilterOptions() {
    const taskProjects = getUniqueValues('project');
    const purchaseProjects = getUniqueValues('project', purchases);
    const targetProjects = getUniqueValues('project', targets);
    const allProjects = [...new Set([...taskProjects, ...purchaseProjects, ...targetProjects])].sort();

    // Keep 'all' option
    selectFilterProject.innerHTML = '<option value="all">כל הפרויקטים</option>';
    selectPurchaseFilterProject.innerHTML = '<option value="all">כל הפרויקטים</option>';
    selectReportProject.innerHTML = `
        <option value="" disabled selected>בחר פרויקט להצגה...</option>
        <option value="all">כל הפרויקטים</option>
    `;

    allProjects.forEach(p => {
        const option1 = document.createElement('option');
        option1.value = p;
        option1.textContent = p;
        if (p === currentFilterProject) option1.selected = true;
        selectFilterProject.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = p;
        option2.textContent = p;
        if (p === currentPurchaseFilterProject) option2.selected = true;
        selectPurchaseFilterProject.appendChild(option2);

        const option3 = document.createElement('option');
        option3.value = p;
        option3.textContent = p;
        if (p === selectReportProject.value) option3.selected = true;
        selectReportProject.appendChild(option3);
    });

    // Assignee Filter
    selectFilterAssignee.innerHTML = '<option value="all">כל העובדים</option>';
    const assignees = getUniqueValues('assignee');
    assignees.forEach(a => {
        const option = document.createElement('option');
        option.value = a;
        option.textContent = a;
        if (a === currentFilterAssignee) option.selected = true;
        selectFilterAssignee.appendChild(option);
    });
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
}

function isOverdue(dateString, status) {
    if (status === 'completed' || status === 'arrived') return false;
    if (!dateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
}

// ---------------- UI Rendering ----------------
function isWithinTimeframe(dateString, timeframe, fieldType = 'due') {
    if (timeframe === 'all' || !dateString) return true;

    const date = new Date(dateString);
    const today = new Date();

    date.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (timeframe === 'today') {
        return date.getTime() === today.getTime();
    }

    if (timeframe === 'week') {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
        return date >= startOfWeek && date <= endOfWeek;
    }

    if (timeframe === 'month') {
        return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    }

    if (timeframe === 'year') {
        return date.getFullYear() === today.getFullYear();
    }

    return true;
}

function getStatusLabel(status) {
    switch (status) {
        // Tasks
        case 'pending': return 'ממתין';
        case 'in_progress': return 'בעבודה';
        case 'stuck': return 'תקוע';
        case 'completed': return 'בוצע';
        // Purchases
        case 'request_sent': return 'נשלחה בקשה';
        case 'ordered': return 'הוזמן';
        case 'arrived': return 'הגיע';
        default: return status;
    }
}

function getStatusColor(status) {
    switch (status) {
        // Tasks
        case 'pending': return '#3b82f6'; // blue
        case 'in_progress': return '#10b981'; // green
        case 'stuck': return '#ef4444'; // red
        case 'completed': return '#6b7280'; // gray
        // Purchases
        case 'request_sent': return '#f59e0b'; // orange
        case 'ordered': return '#3b82f6'; // blue
        case 'arrived': return '#10b981'; // green
        default: return '#6b7280'; // gray
    }
}

function renderTasks() {
    // Dispatch to either card or table view
    if (tasksViewMode === 'table') {
        return renderTasksAsTable();
    }

    // Card view rendering (default)
    tasksContainer.innerHTML = '';

    // Combine tasks and targets for the main list
    const combinedList = [
        ...tasks.map(t => ({ ...t, isItemTarget: false })),
        ...targets.map(t => ({ ...t, isItemTarget: true, assignee: '---' })) // Targets don't have assignees, but filters use it
    ];

    // Apply Filters
    let filteredTasks = combinedList.filter(t => {
        if (hideCompletedTasks && t.status === 'completed') return false;

        let matchStatus = false;
        if (currentFilterStatus === 'all') {
            matchStatus = true;
        } else if (currentFilterStatus === 'active') {
            matchStatus = (t.status === 'in_progress' || t.status === 'pending' || t.status === 'stuck');
        } else if (currentFilterStatus === 'showstopper') {
            matchStatus = t.showstopper || false;
        } else {
            matchStatus = t.status === currentFilterStatus;
        }

        const matchProject = currentFilterProject === 'all' || t.project === currentFilterProject;
        const matchAssignee = currentFilterAssignee === 'all' || t.assignee === currentFilterAssignee;
        const matchTime = isWithinTimeframe(t.dueDate, currentFilterTimeframe);

        let matchSearch = true;
        if (searchQuery) {
            const searchStr = `${t.title} ${t.project} ${t.assignee || ''}`.toLowerCase();
            matchSearch = searchStr.includes(searchQuery);
        }

        return matchStatus && matchProject && matchAssignee && matchTime && matchSearch;
    });

    // Sort: Showstoppers > Manager > CTO > Targets > Incomplete > Date
    filteredTasks.sort((a, b) => {
        if (a.showstopper !== b.showstopper) return a.showstopper ? -1 : 1;
        // Sort by priority: high > medium > low > none
        const priorityOrder = { high: 0, medium: 1, low: 2, none: 3 };
        const priorityA = priorityOrder[a.priority] !== undefined ? priorityOrder[a.priority] : 1;
        const priorityB = priorityOrder[b.priority] !== undefined ? priorityOrder[b.priority] : 1;
        if (priorityA !== priorityB) return priorityA - priorityB;
        if (a.isManager !== b.isManager) return a.isManager ? -1 : 1;
        if (a.isCTO !== b.isCTO) return a.isCTO ? -1 : 1;
        if (a.isItemTarget !== b.isItemTarget) return a.isItemTarget ? -1 : 1;
        if ((a.status === 'completed') !== (b.status === 'completed')) return a.status === 'completed' ? 1 : -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
    });

    if (filteredTasks.length === 0) {
        tasksContainer.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-clipboard-list"></i>
                <h3>לא נמצאו משימות</h3>
                <p>נסה לשנות את תנאי החיפוש/סינון או הוסף משימה חדשה.</p>
            </div>
        `;
        return;
    }

    filteredTasks.forEach(task => {
        const isCompleted = task.status === 'completed';
        const overdue = isOverdue(task.dueDate, task.status);

        // Subtasks Progress
        let subtasksHtml = '';
        let progressBadge = '';
        if (task.subtasks && task.subtasks.length > 0) {
            const completedCount = task.subtasks.filter(s => s.completed).length;
            const totalCount = task.subtasks.length;
            progressBadge = `<span class="task-progress-badge">${completedCount}/${totalCount}</span>`;

            subtasksHtml = `
                <div class="task-subtasks-container">
                    ${task.subtasks.map(sub => `
                        <div class="subtask-row">
                            <div class="subtask-checkbox ${sub.completed ? 'checked' : ''}" 
                                 onclick="toggleSubtaskStatus('${task.id}', '${sub.id}')"></div>
                            <span class="subtask-title ${sub.completed ? 'completed' : ''}">${sub.title}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        const taskEl = document.createElement('div');
        taskEl.className = `task-item ${task.showstopper ? 'is-showstopper' : ''} ${isCompleted ? 'is-completed' : ''} ${task.isItemTarget ? 'is-target' : ''}`;

        taskEl.innerHTML = `
            <div class="task-info">
                <div class="task-title-wrap">
                    <div class="status-checkbox ${isCompleted ? 'checked' : ''}" onclick="toggleTaskStatus('${task.id}')"></div>
                    <span class="task-title" style="${isCompleted ? 'text-decoration: line-through; opacity: 0.6;' : ''}">
                        ${task.isItemTarget ? '<i class="fa-solid fa-bullseye" style="margin-right: 0;" title="יעד"></i> ' : ''}
                        ${task.title}
                        ${task.isManager ? '<i class="fa-solid fa-user-tie text-accent" title="מנהל" style="margin-right: 8px;"></i>' : ''}
                        ${task.isCTO ? '<i class="fa-solid fa-microchip text-accent" title="CTO" style="margin-right: 8px;"></i>' : ''}
                        ${overdue ? '<i class="fa-solid fa-clock text-danger" title="פג תוקף" style="margin-right: 8px;"></i>' : ''}
                        ${task.status === 'stuck' ? '<i class="fa-solid fa-circle-exclamation text-danger" title="תקוע" style="margin-right: 8px;"></i>' : ''}
                    </span>
                    ${progressBadge}
                    ${task.showstopper ? '<span class="showstopper-badge"><i class="fa-solid fa-triangle-exclamation"></i> Showstopper</span>' : ''}
                </div>
                ${task.statusText ? `<div class="task-status-text" style="font-size: 0.95rem; color: var(--text-primary); margin-bottom: 0.5rem; background: var(--accent-glow); padding: 0.5rem 0.8rem; border-radius: 6px; border-right: 2px solid var(--accent-primary);"><i class="fa-regular fa-comment-dots" style="margin-left: 5px; opacity: 0.7;"></i> ${task.statusText}</div>` : ''}
                ${subtasksHtml}
                <div class="task-metadata-row">
                    <div class="meta-item" title="פרויקט">
                        <i class="fa-regular fa-folder"></i> ${task.project}
                    </div>
                    ${!task.isItemTarget ? `
                    <div class="meta-item" title="אחראי">
                        <i class="fa-regular fa-user"></i> ${task.assignee}
                    </div>` : ''}
                    <div class="meta-item ${overdue ? 'text-danger' : ''}" title="תאריך יעד">
                        <i class="fa-regular fa-calendar"></i> ${formatDate(task.dueDate)} ${overdue ? '(באיחור!)' : ''}
                    </div>
                    <div class="meta-item status-label" title="סטטוס" style="color: var(--accent-primary); font-weight: 600;">
                        <i class="fa-solid fa-signal"></i> ${getStatusLabel(task.status)}
                    </div>
                    ${task.priority && task.priority !== 'none' ? `<span class="priority-badge priority-${task.priority}" title="עדיפות: ${task.priority === 'high' ? 'גבוהה' : task.priority === 'low' ? 'נמוכה' : 'בינונית'}">
                        ${task.priority === 'high' ? '<i class="fa-solid fa-arrow-up"></i> גבוהה' : task.priority === 'low' ? '<i class="fa-solid fa-arrow-down"></i> נמוכה' : '<i class="fa-solid fa-minus"></i> בינונית'}
                    </span>` : ''}
                </div>
            </div>
            <div class="task-actions-btns">
                <button class="icon-btn edit" onclick="openModal('${task.isItemTarget ? 'target' : 'task'}', '${task.id}')" title="ערוך"><i class="fa-regular fa-pen-to-square"></i></button>
                <button class="icon-btn delete" onclick="${task.isItemTarget ? 'deleteTarget' : 'deleteTask'}('${task.id}')" title="מחק"><i class="fa-regular fa-trash-can"></i></button>
            </div>
        `;

        tasksContainer.appendChild(taskEl);
    });
}

function renderTasksAsTable() {
    tasksContainer.innerHTML = '';

    // Apply same filters as renderTasks
    const selectedStatus = selectFilterStatus.value;
    const selectedProject = selectFilterProject.value;
    const selectedAssignee = selectFilterAssignee.value;
    const selectedTimeframe = selectFilterTimeframe.value;
    const hideCompletedTasks = cbHideCompletedTasks.checked;
    const searchQuery = inputSearch.value.toLowerCase();

    const filteredTasks = tasks.filter(task => {
        if (task.isItemTarget && selectedTimeframe === 'today') return false;

        const matchStatus = selectedStatus === 'all' ? true :
            selectedStatus === 'active' ? task.status !== 'completed' :
            selectedStatus === 'showstopper' ? task.showstopper :
            task.status === selectedStatus;

        const matchProject = selectedProject === 'all' ? true : task.project === selectedProject;
        const matchAssignee = selectedAssignee === 'all' ? true : task.assignee === selectedAssignee;

        let matchTime = true;
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);

        if (selectedTimeframe !== 'all') {
            const today = new Date(now);
            let weekStart = new Date(now);
            weekStart.setDate(today.getDate() - today.getDay());
            let monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            let yearStart = new Date(now.getFullYear(), 0, 1);

            if (selectedTimeframe === 'today') matchTime = taskDate.getTime() === now.getTime();
            else if (selectedTimeframe === 'week') matchTime = taskDate >= weekStart && taskDate <= now;
            else if (selectedTimeframe === 'month') matchTime = taskDate >= monthStart && taskDate.getMonth() === now.getMonth();
            else if (selectedTimeframe === 'year') matchTime = taskDate.getFullYear() === now.getFullYear();
        }

        const matchSearch = searchQuery === '' ? true :
            task.title.toLowerCase().includes(searchQuery) ||
            task.project.toLowerCase().includes(searchQuery) ||
            task.assignee.toLowerCase().includes(searchQuery) ||
            task.statusText.toLowerCase().includes(searchQuery);

        const isCompleted = task.status === 'completed';
        if (hideCompletedTasks && isCompleted) return false;

        return matchStatus && matchProject && matchAssignee && matchTime && matchSearch;
    });

    // Sort: same as card view
    filteredTasks.sort((a, b) => {
        if (a.showstopper !== b.showstopper) return a.showstopper ? -1 : 1;
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        const priorityA = priorityOrder[a.priority] || 1;
        const priorityB = priorityOrder[b.priority] || 1;
        if (priorityA !== priorityB) return priorityA - priorityB;
        if (a.isManager !== b.isManager) return a.isManager ? -1 : 1;
        if (a.isCTO !== b.isCTO) return a.isCTO ? -1 : 1;
        if (a.isItemTarget !== b.isItemTarget) return a.isItemTarget ? -1 : 1;
        if ((a.status === 'completed') !== (b.status === 'completed')) return a.status === 'completed' ? 1 : -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
    });

    if (filteredTasks.length === 0) {
        tasksContainer.innerHTML = `
            <div class="empty-state" style="padding: 2rem; text-align: center; border: 1px dashed var(--border-glass); border-radius: 12px;">
                <i class="fa-solid fa-list" style="font-size: 2.5rem; opacity: 0.3; margin-bottom: 1rem;"></i>
                <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">אין משימות</h3>
                <p style="color: var(--text-secondary);">אין משימות תואמות את הפילטרים שלך</p>
            </div>
        `;
        return;
    }

    // Build table HTML
    let tableHTML = `
        <table class="tasks-table">
            <thead>
                <tr>
                    <th style="text-align: right; width: 35%;">שם משימה</th>
                    <th style="text-align: right; width: 15%;">פרויקט</th>
                    <th style="text-align: right; width: 15%;">אחראי</th>
                    <th style="text-align: center; width: 12%;">יעד</th>
                    <th style="text-align: center; width: 10%;">עדיפות</th>
                    <th style="text-align: center; width: 10%;">סטטוס</th>
                    <th style="text-align: center; width: 8%;">פעולות</th>
                </tr>
            </thead>
            <tbody>
    `;

    filteredTasks.forEach(task => {
        const isCompleted = task.status === 'completed';
        const overdue = isOverdue(task.dueDate, task.status);
        const priorityBadgeColor = task.priority === 'high' ? '#ef4444' :
                                   task.priority === 'medium' ? '#f59e0b' :
                                   task.priority === 'low' ? '#10b981' : '#999999';
        const priorityText = task.priority === 'high' ? 'גבוהה' :
                           task.priority === 'medium' ? 'בינונית' :
                           task.priority === 'low' ? 'נמוכה' : '—';
        const statusLabel = getStatusLabel(task.status);
        const statusColor = getStatusColor(task.status);

        tableHTML += `
            <tr style="${isCompleted ? 'opacity: 0.6;' : ''}">
                <td style="text-align: right;">
                    <span style="${isCompleted ? 'text-decoration: line-through;' : ''}">
                        ${task.isItemTarget ? '<i class="fa-solid fa-bullseye" style="margin-left: 0.5rem;"></i>' : ''}
                        ${task.title}
                        ${task.showstopper ? '<i class="fa-solid fa-triangle-exclamation" style="color: #ef4444; margin-left: 0.5rem;"></i>' : ''}
                    </span>
                </td>
                <td style="text-align: right;">${task.project}</td>
                <td style="text-align: right;">${task.assignee}</td>
                <td style="text-align: center; ${overdue ? 'color: #d32f2f;' : ''}">
                    ${formatDate(task.dueDate)} ${overdue && !isCompleted ? '<i class="fa-solid fa-clock" style="margin-left: 0.5rem;"></i>' : ''}
                </td>
                <td style="text-align: center;">
                    ${task.priority && task.priority !== 'none' ? `<span class="priority-badge priority-${task.priority}" style="background: rgba(${task.priority === 'high' ? '239,68,68' : task.priority === 'medium' ? '245,158,11' : '16,185,129'}, 0.2); color: ${priorityBadgeColor};">
                        ${priorityText}
                    </span>` : '<span style="color: #999999;">—</span>'}
                </td>
                <td style="text-align: center;">
                    <span style="background: ${statusColor}; color: white; padding: 0.3rem 0.8rem; border-radius: 4px; font-size: 0.8rem; font-weight: 600; white-space: nowrap;">
                        ${statusLabel}
                    </span>
                </td>
                <td style="text-align: center;">
                    <button class="icon-btn" onclick="openModal('${task.isItemTarget ? 'target' : 'task'}', '${task.id}')" title="ערוך" style="cursor: pointer;">
                        <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    tasksContainer.innerHTML = tableHTML;
}

function renderPurchases() {
    purchasesContainer.innerHTML = '';

    // Apply Filters
    let filteredPurchases = purchases.filter(p => {
        if (hideArrivedPurchases && p.status === 'arrived') return false;

        const matchStatus = currentPurchaseFilterStatus === 'all' || p.status === currentPurchaseFilterStatus;
        const matchProject = currentPurchaseFilterProject === 'all' || p.project === currentPurchaseFilterProject;
        const matchTime = isWithinTimeframe(p.date, currentPurchaseFilterTimeframe);

        let matchSearch = true;
        if (searchQuery) {
            const searchStr = `${p.title} ${p.project} ${p.sku}`.toLowerCase();
            matchSearch = searchStr.includes(searchQuery);
        }

        return matchStatus && matchProject && matchTime && matchSearch;
    });

    // Sort: unarrived first, then by date
    filteredPurchases.sort((a, b) => {
        if ((a.status === 'arrived') !== (b.status === 'arrived')) return a.status === 'arrived' ? 1 : -1;
        return new Date(b.date) - new Date(a.date); // Newest first
    });

    if (filteredPurchases.length === 0) {
        purchasesContainer.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-cart-shopping"></i>
                <h3>לא נמצאו פריטי רכש</h3>
                <p>נסה לשנות את תנאי החיפוש/סינון או הוסף פריט חדש.</p>
            </div>
        `;
        return;
    }

    filteredPurchases.forEach(purchase => {
        const isArrived = purchase.status === 'arrived';
        const deliveryOverdue = isOverdue(purchase.deliveryDate, purchase.status);

        const purchaseEl = document.createElement('div');
        purchaseEl.className = `task-item ${isArrived ? 'is-completed' : ''}`;

        purchaseEl.innerHTML = `
            <div class="task-info">
                <div class="task-title-wrap">
                    <span class="task-title" style="${isArrived ? 'opacity: 0.6;' : ''}">
                        ${purchase.title}
                        ${deliveryOverdue ? '<i class="fa-solid fa-clock text-danger" title="פג תוקף" style="margin-right: 8px;"></i>' : ''}
                    </span>
                    <span class="showstopper-badge" style="background: var(--accent-glow); border-color: var(--accent-primary); color: var(--accent-primary); font-weight: 600;">מק"ט: ${purchase.sku}</span>
                </div>
                <div class="task-meta">
                    <div class="meta-item" title="פרויקט">
                        <i class="fa-regular fa-folder"></i> ${purchase.project}
                    </div>
                    <div class="meta-item" title="כמות">
                        <i class="fa-solid fa-boxes-stacked"></i> כמות: ${purchase.quantity || 1}
                    </div>
                    <div class="meta-item" title="תאריך בקשה">
                        <i class="fa-regular fa-calendar-plus"></i> בקשה: ${formatDate(purchase.date)}
                    </div>
                    ${purchase.promisedDate ? `
                    <div class="meta-item" title="תאריך הבטחה (ספק)">
                        <i class="fa-solid fa-handshake"></i> הבטחה: ${formatDate(purchase.promisedDate)}
                    </div>` : ''}
                    ${(purchase.estimatedDeliveryDate || purchase.deliveryDate) ? `
                    <div class="meta-item ${deliveryOverdue ? 'text-danger' : ''}" title="צפי הגעה מעודכן">
                        <i class="fa-regular fa-calendar-check"></i> צפי: ${formatDate(purchase.estimatedDeliveryDate || purchase.deliveryDate)} ${deliveryOverdue ? '(באיחור!)' : ''}
                    </div>` : ''}
                    <div class="meta-item status-label" title="סטטוס" style="color: var(--accent-primary); font-weight: 600;">
                        <i class="fa-solid fa-truck"></i> ${getStatusLabel(purchase.status)}
                    </div>
                    ${purchase.price ? `
                    <div class="meta-item" title="מחיר כוללי">
                        <i class="fa-solid fa-shekel-sign"></i> ₪${(purchase.price * (purchase.quantity || 1)).toLocaleString('he-IL')}
                    </div>` : ''}
                </div>
            </div>
            <div class="task-actions-btns">
                <button class="icon-btn edit" onclick="togglePurchaseStatus('${purchase.id}')" title="שנה סטטוס (הוזמן -> משלוח -> הגיע)"><i class="fa-solid fa-rotate"></i></button>
                <button class="icon-btn edit" onclick="openModal('purchase', '${purchase.id}')" title="ערוך"><i class="fa-regular fa-pen-to-square"></i></button>
                <button class="icon-btn delete" onclick="deletePurchase('${purchase.id}')" title="מחק"><i class="fa-regular fa-trash-can"></i></button>
            </div>
        `;

        purchasesContainer.appendChild(purchaseEl);
    });
}

function createRadialChart(canvasId, progress, color) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [progress, 100 - progress],
                backgroundColor: [color, 'rgba(255, 255, 255, 0.05)'],
                borderWidth: 0,
                borderRadius: 10,
                cutout: '75%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { tooltip: { enabled: false }, legend: { display: false } },
            events: [],
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });
}

function renderTargets() {
    if (!targetsContainer) return;
    targetsContainer.innerHTML = '';

    const year = currentTargetYear;
    const viewType = currentTargetViewType; // 'quarter', 'month', 'week'

    const groups = [];

    if (viewType === 'quarter') {
        for (let i = 1; i <= 4; i++) {
            groups.push({ id: `Q${i}`, title: `רבעון ${i}`, targets: [] });
        }
    } else if (viewType === 'month') {
        const monthNames = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
        monthNames.forEach((name, i) => {
            groups.push({ id: `M${i + 1}`, title: name, targets: [] });
        });
    } else if (viewType === 'week') {
        for (let i = 1; i <= 52; i++) {
            groups.push({ id: `W${i}`, title: `שבוע ${i}`, targets: [] });
        }
    }

    // Filter targets for the selected year and group them
    targets.forEach(t => {
        const d = new Date(t.dueDate);
        if (d.getFullYear() !== year) return;

        if (viewType === 'quarter') {
            const q = Math.floor(d.getMonth() / 3) + 1;
            groups[q - 1].targets.push(t);
        } else if (viewType === 'month') {
            const m = d.getMonth();
            groups[m].targets.push(t);
        } else if (viewType === 'week') {
            const w = getWeekNumber(d);
            if (w >= 1 && w <= 52) groups[w - 1].targets.push(t);
        }
    });

    // Render sections
    groups.forEach(group => {
        // Optimization: In weekly view, skip empty weeks to avoid clutter, 
        // but for Quarter/Month show them to maintain the roadmap feel.
        if (viewType === 'week' && group.targets.length === 0) return;

        const section = document.createElement('div');
        section.className = 'timeframe-section';

        section.innerHTML = `
            <div class="timeframe-header">
                <h3>${group.title}</h3>
                ${group.targets.length > 0 ? `<span class="badge">${group.targets.length} יעדים</span>` : ''}
            </div>
            <div class="targets-grid" id="grid-${group.id}"></div>
        `;

        targetsContainer.appendChild(section);
        const grid = section.querySelector('.targets-grid');

        if (group.targets.length === 0) {
            grid.innerHTML = '<div class="empty-state-mini" style="padding: 1rem; border: 1px dashed var(--border-glass); border-radius: 12px; grid-column: 1/-1; opacity: 0.5; font-size: 0.9rem;">אין יעדים מוגדרים</div>';
            return;
        }

        group.targets.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        group.targets.forEach((target) => {
            let progress = 0;
            let progressText = '';

            if (target.trackingType === 'quantitative') {
                progress = target.targetValue > 0 ? Math.round((target.actualValue / target.targetValue) * 100) : 0;
                progressText = `${target.actualValue} מתוך ${target.targetValue}`;
            } else {
                const projectTasks = tasks.filter(task => task.project === target.project);
                const totalTasks = projectTasks.length;
                const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
                progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                progressText = `${completedTasks} מתוך ${totalTasks} משימות`;
            }

            const chartId = `target-chart-${target.id}`;
            const color = progress >= 100 ? '#22c55e' : (progress >= 50 ? '#3b82f6' : '#f59e0b');

            const targetEl = document.createElement('div');
            targetEl.className = 'target-card';
            targetEl.innerHTML = `
                <div class="target-card-header">
                    <span class="target-project-badge">${target.project}</span>
                    <span class="target-status-badge target-status-${target.status}">
                        ${target.status === 'pending' ? 'ממתין' : target.status === 'in_progress' ? 'בעבודה' : 'הושלם'}
                    </span>
                </div>
                <div class="target-body">
                    <div class="target-chart-container">
                        <canvas id="${chartId}"></canvas>
                        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; font-weight: 700; color: ${document.body.classList.contains('light-theme') ? '#0f172a' : 'white'}; font-size: 0.9rem;">
                            ${progress}%
                        </div>
                    </div>
                    <div class="target-info">
                        <h3 class="target-title">${target.title}</h3>
                        <div class="target-progress-label">${progressText}</div>
                    </div>
                </div>
                <div class="target-footer">
                    <div class="target-date">
                        <i class="fa-regular fa-calendar"></i>
                        יעד: ${formatDate(target.dueDate)}
                    </div>
                </div>
                <div class="target-actions">
                    <button class="icon-btn edit" onclick="openModal('target', '${target.id}')" title="ערוך"><i class="fa-regular fa-pen-to-square"></i></button>
                    <button class="icon-btn delete" onclick="deleteTarget('${target.id}')" title="מחק"><i class="fa-regular fa-trash-can"></i></button>
                </div>
            `;
            grid.appendChild(targetEl);

            setTimeout(() => createRadialChart(chartId, progress, color), 10);
        });
    });
}

// ---------------- Report Generator ----------------
function generateTaskHTML(task, inReport = false) {
    const isCompleted = task.status === 'completed';
    const overdue = isOverdue(task.dueDate, task.status);

    // Subtasks Progress
    let subtasksHtml = '';
    let progressBadge = '';
    if (task.subtasks && task.subtasks.length > 0) {
        const completedCount = task.subtasks.filter(s => s.completed).length;
        const totalCount = task.subtasks.length;
        progressBadge = `<span class="task-progress-badge">${completedCount}/${totalCount}</span>`;

        subtasksHtml = `
            <div class="task-subtasks-container" style="${inReport ? 'border-right: none;' : ''}">
                ${task.subtasks.map(sub => `
                    <div class="subtask-row">
                        <div class="subtask-checkbox ${sub.completed ? 'checked' : ''}"
                             ${!inReport ? `onclick="toggleSubtaskStatus('${task.id}', '${sub.id}')"` : ''}></div>
                        <span class="subtask-title ${sub.completed ? 'completed' : ''}">${sub.title}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    return `
        <div class="task-item ${task.showstopper ? 'is-showstopper' : ''} ${isCompleted ? 'is-completed' : ''}" style="${inReport ? 'margin-bottom: 0.5rem;' : ''}">
            <div class="task-info">
                <div class="task-title-wrap">
                    <span class="task-title" style="${isCompleted ? 'text-decoration: line-through; opacity: 0.6;' : ''}">
                        ${task.title}
                        ${task.isManager ? '<i class="fa-solid fa-user-tie text-accent" title="מנהל" style="margin-right: 8px;"></i>' : ''}
                        ${task.isCTO ? '<i class="fa-solid fa-microchip text-accent" title="CTO" style="margin-right: 8px;"></i>' : ''}
                        ${overdue ? '<i class="fa-solid fa-clock text-danger" title="פג תוקף" style="margin-right: 8px;"></i>' : ''}
                        ${task.status === 'stuck' ? '<i class="fa-solid fa-circle-exclamation text-danger" title="תקוע" style="margin-right: 8px;"></i>' : ''}
                    </span>
                    ${progressBadge}
                    ${task.showstopper ? '<span class="showstopper-badge"><i class="fa-solid fa-triangle-exclamation"></i> Showstopper</span>' : ''}
                </div>
                ${task.statusText ? `<div class="task-status-text" style="font-size: 0.95rem; color: var(--text-primary); margin-bottom: 0.5rem; background: var(--accent-glow); padding: 0.5rem 0.8rem; border-radius: 6px; border-right: 2px solid var(--accent-primary);"><i class="fa-regular fa-comment-dots" style="margin-left: 5px; opacity: 0.7;"></i> ${task.statusText}</div>` : ''}
                ${subtasksHtml}
                <div class="task-metadata-row">
                    <div class="meta-item" title="אחראי">
                        <i class="fa-regular fa-user"></i> ${task.assignee}
                    </div>
                    <div class="meta-item ${overdue ? 'text-danger' : ''}" title="תאריך יעד">
                        <i class="fa-regular fa-calendar"></i> ${formatDate(task.dueDate)}
                    </div>
                    <div class="meta-item status-label" title="סטטוס" style="color: var(--accent-primary); font-weight: 600;">
                        <i class="fa-solid fa-signal"></i> ${getStatusLabel(task.status)}
                    </div>
                </div>
            </div>
            <div class="task-actions-btns">
                <button class="icon-btn edit" onclick="openModal('task', '${task.id}')" title="ערוך"><i class="fa-regular fa-pen-to-square"></i></button>
                ${!inReport ? `<button class="icon-btn delete" onclick="deleteTask('${task.id}')" title="מחק"><i class="fa-regular fa-trash-can"></i></button>` : ''}
            </div>
        </div>
    `;
}

function generatePurchaseHTML(purchase, inReport = false) {
    const isArrived = purchase.status === 'arrived';
    const deliveryOverdue = isOverdue(purchase.deliveryDate, purchase.status);

    return `
        <div class="task-item ${isArrived ? 'is-completed' : ''}" style="${inReport ? 'margin-bottom: 0.5rem;' : ''}">
            <div class="task-info">
                <div class="task-title-wrap">
                    <span class="task-title" style="${isArrived ? 'opacity: 0.6;' : ''}">
                        ${purchase.title}
                        ${deliveryOverdue ? '<i class="fa-solid fa-clock text-danger" title="פג תוקף" style="margin-right: 8px;"></i>' : ''}
                    </span>
                    <span class="showstopper-badge" style="background: var(--accent-glow); border-color: var(--accent-primary); color: var(--accent-primary); font-weight: 600;">מק"ט: ${purchase.sku}</span>
                </div>
                <div class="task-meta">
                    <div class="meta-item" title="כמות">
                        <i class="fa-solid fa-boxes-stacked"></i> כמות: ${purchase.quantity || 1}
                    </div>
                    <div class="meta-item" title="תאריך בקשה">
                        <i class="fa-regular fa-calendar-plus"></i> בקשה: ${formatDate(purchase.date)}
                    </div>
                    ${purchase.promisedDate ? `
                    <div class="meta-item" title="תאריך הבטחה (ספק)">
                        <i class="fa-solid fa-handshake"></i> הבטחה: ${formatDate(purchase.promisedDate)}
                    </div>` : ''}
                    ${(purchase.estimatedDeliveryDate || purchase.deliveryDate) ? `
                    <div class="meta-item ${deliveryOverdue ? 'text-danger' : ''}" title="צפי הגעה מעודכן">
                        <i class="fa-regular fa-calendar-check"></i> צפי: ${formatDate(purchase.estimatedDeliveryDate || purchase.deliveryDate)} ${deliveryOverdue ? '(עיכוב!)' : ''}
                    </div>` : ''}
                    <div class="meta-item status-label" title="סטטוס" style="color: var(--accent-primary); font-weight: 600;">
                        <i class="fa-solid fa-truck"></i> ${getStatusLabel(purchase.status)}
                    </div>
                </div>
            </div>
            <div class="task-actions-btns">
                <button class="icon-btn edit" onclick="openModal('purchase', '${purchase.id}')" title="ערוך"><i class="fa-regular fa-pen-to-square"></i></button>
                ${!inReport ? `
                <button class="icon-btn edit" onclick="togglePurchaseStatus('${purchase.id}')" title="שנה סטטוס (הוזמן -> משלוח -> הגיע)"><i class="fa-solid fa-rotate"></i></button>
                <button class="icon-btn delete" onclick="deletePurchase('${purchase.id}')" title="מחק"><i class="fa-regular fa-trash-can"></i></button>
                ` : ''}
            </div>
        </div>
    `;
}

function renderReport() {
    const projName = selectReportProject.value;
    const isGlobal = reportFilterManager || reportFilterCTO || projName === 'all';

    if (!projName && !isGlobal) {
        reportEmptyState.style.display = 'block';
        reportContent.style.display = 'none';
        btnPrintReport.style.display = 'none';
        return;
    }

    reportEmptyState.style.display = 'none';
    reportContent.style.display = 'block';
    btnPrintReport.style.display = 'block';

    const reportHeaderTitle = document.querySelector('#project-report-view .header-titles h2');
    const reportHeaderDesc = document.querySelector('#project-report-view .header-titles p');

    if (isGlobal) {
        reportHeaderTitle.textContent = 'דוח ניהולי גלובלי';
        reportHeaderDesc.textContent = 'ריכוז משימות מנהל ו-CTO מכלל הפרויקטים';
    } else {
        reportHeaderTitle.textContent = 'דוח מנהלים (פרויקט)';
        reportHeaderDesc.textContent = `תצוגה רוחבית של משימות ורכש לפרויקט: ${projName}`;
    }

    let projTasks = [];
    let projPurchases = [];
    let projTargets = [];

    // If Manager or CTO filter is on, show ALL projects (global view)
    if (isGlobal) {
        projTasks = tasks;
        projPurchases = purchases;
        projTargets = targets;
    } else {
        projTasks = tasks.filter(t => t.project === projName);
        projPurchases = purchases.filter(p => p.project === projName);
        projTargets = targets.filter(t => t.project === projName);
    }

    if (reportHideCompletedTasks) {
        projTasks = projTasks.filter(t => t.status !== 'completed');
    }
    if (reportHideArrivedPurchases) {
        projPurchases = projPurchases.filter(p => p.status !== 'arrived');
    }

    if (reportFilterManager && reportFilterCTO) {
        projTasks = projTasks.filter(t => t.isManager || t.isCTO);
    } else if (reportFilterManager) {
        projTasks = projTasks.filter(t => t.isManager);
    } else if (reportFilterCTO) {
        projTasks = projTasks.filter(t => t.isCTO);
    }

    // Render Stats
    const tasksCompleted = projTasks.filter(t => t.status === 'completed').length;
    const purchasesArrived = projPurchases.filter(p => p.status === 'arrived').length;
    const projectShowstoppers = projTasks.filter(t => t.showstopper).length;

    const summaryCards = document.querySelector('.report-summary-cards');
    summaryCards.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon"><i class="fa-solid fa-list-check"></i></div>
            <div class="stat-details">
                <h3>משימות שהושלמו</h3>
                <p>${tasksCompleted} / ${projTasks.length}</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fa-solid fa-cart-shopping"></i></div>
            <div class="stat-details">
                <h3>רכש שסופק</h3>
                <p>${purchasesArrived} / ${projPurchases.length}</p>
            </div>
        </div>
        <div class="stat-card ${projectShowstoppers > 0 ? 'showstopper-stat' : ''}">
            <div class="stat-icon ${projectShowstoppers > 0 ? 'showstopper' : 'total'}"><i class="fa-solid fa-triangle-exclamation"></i></div>
            <div class="stat-details">
                <h3>Showstoppers</h3>
                <p>${projectShowstoppers}</p>
            </div>
        </div>
    `;

    // Render Targets
    reportTargetsContainer.innerHTML = '';
    if (projTargets.length === 0) {
        reportTargetsContainer.parentElement.style.display = 'none';
    } else {
        reportTargetsContainer.parentElement.style.display = 'block';
        projTargets.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        projTargets.forEach((target, index) => {
            let progress = 0;
            let progressText = '';

            if (target.trackingType === 'quantitative') {
                progress = target.targetValue > 0 ? Math.round((target.actualValue / target.targetValue) * 100) : 0;
                progressText = `${target.actualValue} / ${target.targetValue}`;
            } else if (target.trackingType === 'boolean') {
                progress = target.status === 'completed' ? 100 : 0;
                progressText = target.status === 'completed' ? 'הושלם' : 'בתהליך';
            } else {
                const projectTasks = tasks.filter(t => t.project === target.project);
                const totalTasks = projectTasks.length;
                const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
                progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                progressText = `${completedTasks} / ${totalTasks}`;
            }

            const reportChartId = `report-target-chart-${target.id}`;
            const color = progress >= 100 ? '#2e7d32' : (progress >= 50 ? '#1565c0' : '#f57c00');

            const targetItem = document.createElement('div');
            targetItem.className = 'report-target-item';
            targetItem.style.display = 'flex';
            targetItem.style.alignItems = 'center';
            targetItem.style.gap = '1rem';

            targetItem.innerHTML = `
                <div style="width: 50px; height: 50px; position: relative;">
                    <canvas id="${reportChartId}"></canvas>
                </div>
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.2rem;">
                        <span style="font-weight: 600; font-size: 1rem;">${target.title}</span>
                        <span style="font-size: 0.8rem; font-weight: 700; color: ${color};">${progress}%</span>
                    </div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">
                        ${progressText} | יעד: ${formatDate(target.dueDate)}
                    </div>
                </div>
            `;
            reportTargetsContainer.appendChild(targetItem);
            setTimeout(() => createRadialChart(reportChartId, progress, color), 10);
        });
    }

    // Render Tasks
    reportTasksContainer.innerHTML = '';
    if (projTasks.length === 0) {
        reportTasksContainer.innerHTML = '<p style="color: var(--text-muted);">אין משימות משויכות לפרויקט זה.</p>';
    } else {
        // Sort: Showstoppers > Manager > CTO > Incomplete > Date
        projTasks.sort((a, b) => {
            if (a.showstopper !== b.showstopper) return a.showstopper ? -1 : 1;
            if (a.isManager !== b.isManager) return a.isManager ? -1 : 1;
            if (a.isCTO !== b.isCTO) return a.isCTO ? -1 : 1;
            if ((a.status === 'completed') !== (b.status === 'completed')) return a.status === 'completed' ? 1 : -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
        });
        projTasks.forEach(t => {
            reportTasksContainer.innerHTML += generateTaskHTML(t, true);
        });
    }

    // Render Purchases
    reportPurchasesContainer.innerHTML = '';
    if (projPurchases.length === 0) {
        reportPurchasesContainer.innerHTML = '<p style="color: var(--text-muted);">אין פריטי רכש משויכים לפרויקט זה.</p>';
    } else {
        projPurchases.sort((a, b) => new Date(a.date) - new Date(b.date));
        projPurchases.forEach(p => {
            reportPurchasesContainer.innerHTML += generatePurchaseHTML(p, true);
        });
    }
}


// ---------------- Dashboard & Charts ----------------
function updateDashboard() {
    // Basic Stats
    const total = tasks.length;
    const active = tasks.filter(t => t.status === 'in_progress' || t.status === 'pending' || t.status === 'stuck').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const showstoppers = tasks.filter(t => t.showstopper).length;

    // Animate numbers
    animateValue(statTotal, parseInt(statTotal.textContent) || 0, total, 500);
    animateValue(statActive, parseInt(statActive.textContent) || 0, active, 500);
    animateValue(statCompleted, parseInt(statCompleted.textContent) || 0, completed, 500);
    animateValue(statShowstoppers, parseInt(statShowstoppers.textContent) || 0, showstoppers, 500);

    // Update charts if dashboard is visible
    if (document.getElementById('dashboard').classList.contains('active-view')) {
        updateCharts();
    }
}

function animateValue(obj, start, end, duration) {
    if (start === end) {
        obj.innerHTML = end;
        return;
    }
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end;
        }
    };
    window.requestAnimationFrame(step);
}

// Global chart settings for Dark UI
Chart.defaults.color = '#94a3b8';
Chart.defaults.font.family = "'Outfit', sans-serif";
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(30, 33, 48, 0.9)';
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.tooltip.borderColor = 'rgba(255, 255, 255, 0.1)';
Chart.defaults.plugins.tooltip.borderWidth = 1;

function updateCharts() {
    updateStatusChart();
    updateProjectChart();
}

function updateStatusChart() {
    const ctx = document.getElementById('statusChart').getContext('2d');

    const pending = tasks.filter(t => t.status === 'pending').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const stuck = tasks.filter(t => t.status === 'stuck').length;
    const completed = tasks.filter(t => t.status === 'completed').length;

    const data = [pending, inProgress, stuck, completed];
    const labels = ['ממתין', 'בעבודה', 'תקוע', 'בוצע'];
    const colors = ['#64748b', '#f59e0b', '#ef4444', '#10b981'];

    if (statusChartInstance) {
        statusChartInstance.data.datasets[0].data = data;
        statusChartInstance.update();
        return;
    }

    statusChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                }
            }
        }
    });
}

function updateProjectChart() {
    const ctx = document.getElementById('projectChart').getContext('2d');

    // Calculate items per project (Tasks + Purchases)
    const taskProjects = getUniqueValues('project');
    const purchaseProjects = getUniqueValues('project', purchases);
    const allProjects = [...new Set([...taskProjects, ...purchaseProjects])].sort();

    // For each project, count tasks and purchases separately
    const tasksCount = allProjects.map(p => tasks.filter(t => t.project === p).length);
    const purchasesCount = allProjects.map(p => purchases.filter(pr => pr.project === p).length);

    if (projectChartInstance) {
        projectChartInstance.data.labels = allProjects;
        projectChartInstance.data.datasets[0].data = tasksCount;
        if (projectChartInstance.data.datasets[1]) {
            projectChartInstance.data.datasets[1].data = purchasesCount;
        } else {
            projectChartInstance.data.datasets.push({
                label: 'פריטי רכש',
                data: purchasesCount,
                backgroundColor: '#10b981',
                borderRadius: 8
            });
        }
        projectChartInstance.update();
        return;
    }

    const getGradient = (ctx, chartArea) => {
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, '#6366f1'); // Indigo
        gradient.addColorStop(1, '#8b5cf6'); // Violet
        return gradient;
    };

    projectChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: allProjects,
            datasets: [
                {
                    label: 'משימות',
                    data: tasksCount,
                    backgroundColor: function (context) {
                        const chart = context.chart;
                        const { ctx, chartArea } = chart;
                        if (!chartArea) {
                            return null;
                        }
                        return getGradient(ctx, chartArea);
                    },
                    borderRadius: 8
                },
                {
                    label: 'רכש',
                    data: purchasesCount,
                    backgroundColor: '#10b981',
                    borderRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    }
                },
                x: {
                    stacked: true,
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: { color: '#94a3b8' }
                }
            }
        }
    });
}



// ---------------- IndexedDB Helper (for File Persistence) ----------------

const DB_NAME = 'TaskManagerSync';
const STORE_NAME = 'handles';
const KEY_NAME = 'syncFileHandle';

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function setStoredHandle(handle) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(handle, KEY_NAME);
    return new Promise((resolve) => {
        tx.oncomplete = () => resolve();
    });
}

async function getStoredHandle() {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).get(KEY_NAME);
    return new Promise((resolve) => {
        request.onsuccess = () => resolve(request.result);
    });
}

async function checkPreviousConnection() {
    if (!isFileSystemSupported) return;
    try {
        const handle = await getStoredHandle();
        if (handle) {
            fileHandle = handle;
            updateSyncUI(false, true); // Show "Restore Connection" state
        }
    } catch (err) {
        console.error('Failed to restore handle:', err);
    }
}

async function connectFile() {
    if (!isFileSystemSupported) {
        alert('הדפדפן שלך אינו תומך בגישה ישירה לקבצים. מומלץ להשתמש ב-Chrome או Edge.');
        return;
    }

    if (fileHandle) {
        const options = { mode: 'readwrite' };
        try {
            if ((await fileHandle.queryPermission(options)) === 'granted') {
                await loadFromFile();
                updateSyncUI(true);
                return;
            } else {
                if ((await fileHandle.requestPermission(options)) === 'granted') {
                    await loadFromFile();
                    updateSyncUI(true);
                    return;
                }
            }
        } catch (e) {
            console.log('Permission request failed, falling back to picker');
        }
    }

    try {
        const [handle] = await window.showOpenFilePicker({
            types: [{
                description: 'JSON Data File',
                accept: { 'application/json': ['.json'] },
            }],
            multiple: false
        });

        fileHandle = handle;
        await setStoredHandle(fileHandle);

        const options = { mode: 'readwrite' };
        if ((await fileHandle.queryPermission(options)) !== 'granted') {
            if ((await fileHandle.requestPermission(options)) !== 'granted') {
                alert('נדרשת הרשאת כתיבה כדי לסנכרן נתונים.');
                return;
            }
        }

        await loadFromFile();
        updateSyncUI(true);
        alert('מחובר לקובץ בהצלחה! הנתונים נטענו ומסתנכרנים כעת.');

    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error(err);
            alert('שגיאה בחיבור לקובץ.');
        }
    }
}

// ================ BUDGET MANAGEMENT ================

function navigateFromBudgetSummary(view) {
    switchToView(view);
}

function navigateToProjectView(view, projectName) {
    currentFilterProject = projectName;
    currentPurchaseFilterProject = projectName;
    selectFilterProject.value = projectName;
    selectPurchaseFilterProject.value = projectName;
    renderPurchases();
    switchToView(view);
}

function getProjectExpenses(projectName) {
    return purchases
        .filter(p => p.project === projectName)
        .reduce((sum, p) => sum + ((p.price || 0) * (p.quantity || 1)), 0);
}

function renderBudgets() {
    const budgetsContainer = document.getElementById('budgets-container');
    if (!budgetsContainer) return;

    // Get all unique projects
    const allProjects = new Set();
    tasks.forEach(t => allProjects.add(t.project));
    purchases.forEach(p => allProjects.add(p.project));
    targets.forEach(t => allProjects.add(t.project));

    if (allProjects.size === 0) {
        budgetsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-wallet"></i>
                <h3>אין פרויקטים עדיין</h3>
                <p>הוסף משימה או רכישה כדי ליצור פרויקט ראשון.</p>
            </div>
        `;
        return;
    }

    // Calculate summary statistics
    let totalBudget = 0;
    let totalExpenses = 0;
    const projectsData = [];

    Array.from(allProjects).sort().forEach(projectName => {
        const budget = projectBudgets[projectName] || 0;
        const expenses = getProjectExpenses(projectName);
        totalBudget += budget;
        totalExpenses += expenses;
        projectsData.push({ projectName, budget, expenses });
    });

    const totalRemaining = totalBudget - totalExpenses;
    const totalPercentage = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

    // Summary cards
    let html = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            <div class="stat-card" style="background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%); border: 1px solid rgba(76, 175, 80, 0.3); cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.background='linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0.1) 100%)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)'; this.style.transform='translateY(0)'" onclick="navigateFromBudgetSummary('budgets-view')">
                <div style="display: flex; align-items: center; gap: 0.8rem;">
                    <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(76, 175, 80, 0.2); display: flex; align-items: center; justify-content: center;">
                        <i class="fa-solid fa-coins" style="color: #2e7d32; font-size: 1.5rem;"></i>
                    </div>
                    <div>
                        <p style="margin: 0; color: var(--text-secondary); font-size: 0.85rem;">תקציב כולל</p>
                        <h3 style="margin: 0; color: #2e7d32; font-weight: 700;">₪${totalBudget.toLocaleString('he-IL')}</h3>
                    </div>
                </div>
            </div>

            <div class="stat-card" style="background: linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%); border: 1px solid rgba(255, 152, 0, 0.3); cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.background='linear-gradient(135deg, rgba(255, 152, 0, 0.2) 0%, rgba(255, 152, 0, 0.1) 100%)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%)'; this.style.transform='translateY(0)'" onclick="navigateFromBudgetSummary('purchases-view')">
                <div style="display: flex; align-items: center; gap: 0.8rem;">
                    <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(255, 152, 0, 0.2); display: flex; align-items: center; justify-content: center;">
                        <i class="fa-solid fa-cart-shopping" style="color: #e65100; font-size: 1.5rem;"></i>
                    </div>
                    <div>
                        <p style="margin: 0; color: var(--text-secondary); font-size: 0.85rem;">הוצאות בפועל</p>
                        <h3 style="margin: 0; color: #e65100; font-weight: 700;">₪${totalExpenses.toLocaleString('he-IL')}</h3>
                    </div>
                </div>
            </div>

            <div class="stat-card" style="background: linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%); border: 1px solid rgba(33, 150, 243, 0.3); cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.background='linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(33, 150, 243, 0.1) 100%)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)'; this.style.transform='translateY(0)'" onclick="navigateFromBudgetSummary('budgets-view')">
                <div style="display: flex; align-items: center; gap: 0.8rem;">
                    <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(33, 150, 243, 0.2); display: flex; align-items: center; justify-content: center;">
                        <i class="fa-solid fa-piggy-bank" style="color: #1565c0; font-size: 1.5rem;"></i>
                    </div>
                    <div>
                        <p style="margin: 0; color: var(--text-secondary); font-size: 0.85rem;">יתרה זמינה</p>
                        <h3 style="margin: 0; color: #1565c0; font-weight: 700;">₪${Math.max(0, totalRemaining).toLocaleString('he-IL')}</h3>
                    </div>
                </div>
            </div>

            <div class="stat-card" style="background: linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(156, 39, 176, 0.05) 100%); border: 1px solid rgba(156, 39, 176, 0.3); cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.background='linear-gradient(135deg, rgba(156, 39, 176, 0.2) 0%, rgba(156, 39, 176, 0.1) 100%)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(156, 39, 176, 0.05) 100%)'; this.style.transform='translateY(0)'" onclick="navigateFromBudgetSummary('budgets-view')">
                <div style="display: flex; align-items: center; gap: 0.8rem;">
                    <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(156, 39, 176, 0.2); display: flex; align-items: center; justify-content: center;">
                        <i class="fa-solid fa-chart-pie" style="color: #6a1b9a; font-size: 1.5rem;"></i>
                    </div>
                    <div>
                        <p style="margin: 0; color: var(--text-secondary); font-size: 0.85rem;">שימוש בתקציב</p>
                        <h3 style="margin: 0; color: #6a1b9a; font-weight: 700;">${totalPercentage.toFixed(1)}%</h3>
                    </div>
                </div>
            </div>
        </div>

        <div style="margin-bottom: 2rem;">
            <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-glass);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
                    <span style="color: var(--text-secondary); font-size: 0.9rem;">התקדמות כוללת</span>
                    <span style="color: var(--text-primary); font-weight: 600;">${totalPercentage.toFixed(1)}%</span>
                </div>
                <div style="background: rgba(255,255,255,0.08); border-radius: 6px; height: 24px; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);">
                    <div style="background: linear-gradient(90deg, #2e7d32 0%, #1565c0 100%); height: 100%; width: ${Math.min(totalPercentage, 100)}%; transition: width 0.3s ease;"></div>
                </div>
            </div>
        </div>

        <h3 style="margin: 2rem 0 1rem 0; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
            <i class="fa-solid fa-briefcase"></i> פרויקטים
        </h3>

        <div style="display: grid; gap: 1rem;">
    `;

    // Individual project cards
    projectsData.forEach(({ projectName, budget, expenses }) => {
        const remaining = budget - expenses;
        const percentage = budget > 0 ? (expenses / budget) * 100 : 0;
        const statusIcon = percentage > 100 ? '🔴' : percentage > 80 ? '⚠️' : percentage > 50 ? '📊' : '✅';
        const statusText = percentage > 100 ? `בחריגה (${percentage.toFixed(0)}%)` : percentage > 80 ? 'קרוב לחריגה' : percentage > 50 ? 'בשימוש גבוה' : 'בשליטה';
        const statusColor = percentage > 100 ? '#c62828' : percentage > 80 ? '#d32f2f' : percentage > 50 ? '#f57c00' : '#2e7d32';
        const budgetDisplay = budget > 0 ? `₪${budget.toLocaleString('he-IL')}` : '❌ לא הוגדר';

        html += `
            <div class="stat-card" style="border: 1px solid var(--border-glass); position: relative; overflow: hidden; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.3)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';" onclick="showProjectBudgetDetail('${projectName.replace(/'/g, "\\'")}')" title="הצג דאשבורד פרויקט">
                <div style="position: absolute; top: 0; right: 0; width: 4px; height: 100%; background: ${statusColor};"></div>

                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                    <div style="flex: 1;">
                        <h3 style="margin: 0 0 0.3rem 0; color: var(--text-primary); font-size: 1.1rem;">${projectName}</h3>
                        <p style="margin: 0; color: ${statusColor}; font-size: 0.85rem; font-weight: 600;">${statusIcon} ${statusText}</p>
                    </div>
                    <button class="btn-secondary btn-sm" onclick="event.stopPropagation(); openBudgetModal('${projectName.replace(/'/g, "\\'")}')" style="padding: 0.5rem 0.7rem;">
                        <i class="fa-solid fa-edit"></i>
                    </button>
                </div>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1rem; font-size: 0.85rem;">
                    <div style="background: rgba(76, 175, 80, 0.1); padding: 0.8rem; border-radius: 6px; cursor: pointer; transition: all 0.2s ease;" onmouseover="this.style.background='rgba(76, 175, 80, 0.2)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.background='rgba(76, 175, 80, 0.1)'; this.style.transform='translateY(0)';" onclick="navigateToProjectView('budgets-view', '${projectName.replace(/'/g, "\\'")}')" title="הצג בניהול תקציב">
                        <p style="margin: 0 0 0.3rem 0; color: var(--text-secondary);">תקציב</p>
                        <p style="margin: 0; color: #2e7d32; font-weight: 700; font-size: 0.95rem;">${budgetDisplay}</p>
                    </div>
                    <div style="background: rgba(255, 152, 0, 0.1); padding: 0.8rem; border-radius: 6px; cursor: pointer; transition: all 0.2s ease;" onmouseover="this.style.background='rgba(255, 152, 0, 0.2)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.background='rgba(255, 152, 0, 0.1)'; this.style.transform='translateY(0)';" onclick="navigateToProjectView('purchases-view', '${projectName.replace(/'/g, "\\'")}')" title="הצג הוצאות לפרויקט זה">
                        <p style="margin: 0 0 0.3rem 0; color: var(--text-secondary);">הוצאות</p>
                        <p style="margin: 0; color: #e65100; font-weight: 700; font-size: 0.95rem;">₪${expenses.toLocaleString('he-IL')}</p>
                    </div>
                    <div style="background: rgba(33, 150, 243, 0.1); padding: 0.8rem; border-radius: 6px; cursor: pointer; transition: all 0.2s ease;" onmouseover="this.style.background='rgba(33, 150, 243, 0.2)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.background='rgba(33, 150, 243, 0.1)'; this.style.transform='translateY(0)';" onclick="navigateToProjectView('budgets-view', '${projectName.replace(/'/g, "\\'")}')" title="הצג בניהול תקציב">
                        <p style="margin: 0 0 0.3rem 0; color: var(--text-secondary);">יתרה</p>
                        <p style="margin: 0; color: #1565c0; font-weight: 700; font-size: 0.95rem;">₪${budget > 0 ? Math.max(0, remaining).toLocaleString('he-IL') : '-'}</p>
                    </div>
                </div>

                <div style="background: rgba(255,255,255,0.05); border-radius: 6px; padding: 0.8rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.8rem;">
                        <span style="color: var(--text-secondary);">אחוז שימוש</span>
                        <span style="color: var(--text-primary); font-weight: 600;">${percentage.toFixed(1)}%</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.08); border-radius: 4px; height: 16px; overflow: hidden;">
                        <div style="background: ${statusColor}; height: 100%; width: ${Math.min(percentage, 100)}%; transition: width 0.3s ease;"></div>
                    </div>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    budgetsContainer.innerHTML = html;
}

function openBudgetModal(projectName) {
    const modal = document.getElementById('budget-modal');
    const projectSelect = document.getElementById('budget-project');
    const amountInput = document.getElementById('budget-amount');

    // Get all unique projects
    const allProjects = new Set();
    tasks.forEach(t => allProjects.add(t.project));
    purchases.forEach(p => allProjects.add(p.project));
    targets.forEach(t => allProjects.add(t.project));

    // Populate project dropdown
    projectSelect.innerHTML = '<option value="" disabled>בחר פרויקט...</option>';
    Array.from(allProjects).sort().forEach(proj => {
        const option = document.createElement('option');
        option.value = proj;
        option.textContent = proj;
        projectSelect.appendChild(option);
    });

    if (projectName) {
        projectSelect.value = projectName;
        amountInput.value = projectBudgets[projectName] || '';
    } else {
        projectSelect.value = '';
        amountInput.value = '';
    }

    modal.style.display = 'flex';
    modal.classList.add('active');
}

function handleBudgetSubmit(e) {
    e.preventDefault();

    const projectName = document.getElementById('budget-project').value.trim();
    const amount = parseFloat(document.getElementById('budget-amount').value) || 0;

    if (!projectName) {
        alert('בחר פרויקט');
        return;
    }

    projectBudgets[projectName] = amount;
    saveProjectBudgets();

    renderBudgets();
    closeModal('budget');
}

// Show detailed budget view for a single project
function showProjectBudgetDetail(projectName) {
    const detailView = document.getElementById('project-budget-detail-view');
    const detailProjectName = document.getElementById('detail-project-name');
    const detailSummary = document.getElementById('project-detail-summary');
    const detailPercentage = document.getElementById('detail-percentage');
    const detailProgressBar = document.getElementById('detail-progress-bar');
    const detailPurchasesContainer = document.getElementById('detail-purchases-container');
    const detailTasksContainer = document.getElementById('detail-tasks-container');

    // Set project name
    detailProjectName.textContent = projectName;

    // Get project data
    const budget = projectBudgets[projectName] || 0;
    const expenses = getProjectExpenses(projectName);
    const remaining = budget - expenses;
    const percentage = budget > 0 ? (expenses / budget) * 100 : 0;

    // Calculate status colors
    const statusIcon = percentage > 100 ? '🔴' : percentage > 80 ? '⚠️' : percentage > 50 ? '📊' : '✅';
    const statusText = percentage > 100 ? `בחריגה (${percentage.toFixed(0)}%)` : percentage > 80 ? 'קרוב לחריגה' : percentage > 50 ? 'בשימוש גבוה' : 'בשליטה';
    const statusColor = percentage > 100 ? '#c62828' : percentage > 80 ? '#d32f2f' : percentage > 50 ? '#f57c00' : '#2e7d32';

    // Create summary cards
    detailSummary.innerHTML = `
        <div style="background: linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0.05) 100%); border: 1px solid rgba(76, 175, 80, 0.3); border-radius: 8px; padding: 1.2rem; text-align: center;">
            <p style="color: var(--text-secondary); margin: 0 0 0.5rem 0; font-size: 0.9rem;">תקציב מתוכנן</p>
            <p style="color: #2e7d32; font-size: 1.5rem; font-weight: 700; margin: 0;">₪${budget.toLocaleString('he-IL')}</p>
        </div>
        <div style="background: linear-gradient(135deg, rgba(255, 152, 0, 0.2) 0%, rgba(255, 152, 0, 0.05) 100%); border: 1px solid rgba(255, 152, 0, 0.3); border-radius: 8px; padding: 1.2rem; text-align: center;">
            <p style="color: var(--text-secondary); margin: 0 0 0.5rem 0; font-size: 0.9rem;">הוצאות בפועל</p>
            <p style="color: #e65100; font-size: 1.5rem; font-weight: 700; margin: 0;">₪${expenses.toLocaleString('he-IL')}</p>
        </div>
        <div style="background: linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(33, 150, 243, 0.05) 100%); border: 1px solid rgba(33, 150, 243, 0.3); border-radius: 8px; padding: 1.2rem; text-align: center;">
            <p style="color: var(--text-secondary); margin: 0 0 0.5rem 0; font-size: 0.9rem;">יתרה זמינה</p>
            <p style="color: #1565c0; font-size: 1.5rem; font-weight: 700; margin: 0;">₪${budget > 0 ? Math.max(0, remaining).toLocaleString('he-IL') : '-'}</p>
        </div>
        <div style="background: linear-gradient(135deg, ${statusColor}22 0%, ${statusColor}11 100%); border: 1px solid ${statusColor}44; border-radius: 8px; padding: 1.2rem; text-align: center;">
            <p style="color: var(--text-secondary); margin: 0 0 0.5rem 0; font-size: 0.9rem;">סטטוס</p>
            <p style="color: ${statusColor}; font-size: 1.5rem; font-weight: 700; margin: 0;">${statusIcon} ${statusText}</p>
        </div>
    `;

    // Update progress bar
    detailPercentage.textContent = percentage.toFixed(1) + '%';
    detailProgressBar.style.background = statusColor;
    detailProgressBar.style.width = Math.min(percentage, 100) + '%';

    // Render purchases
    const projectPurchases = purchases.filter(p => p.project === projectName);
    if (projectPurchases.length === 0) {
        detailPurchasesContainer.innerHTML = `
            <div class="empty-state" style="padding: 2rem; text-align: center;">
                <i class="fa-solid fa-cart-shopping" style="font-size: 2rem; opacity: 0.5; margin-bottom: 1rem;"></i>
                <p style="color: var(--text-secondary);">אין רכישות לפרויקט זה</p>
            </div>
        `;
    } else {
        detailPurchasesContainer.innerHTML = `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="border-bottom: 2px solid var(--border-glass);">
                        <th style="padding: 1rem; text-align: right; color: var(--text-primary); font-weight: 700; font-size: 0.9rem;">פריט</th>
                        <th style="padding: 1rem; text-align: right; color: var(--text-primary); font-weight: 700; font-size: 0.9rem;">מק"ט</th>
                        <th style="padding: 1rem; text-align: center; color: var(--text-primary); font-weight: 700; font-size: 0.9rem;">כמות</th>
                        <th style="padding: 1rem; text-align: center; color: var(--text-primary); font-weight: 700; font-size: 0.9rem;">מחיר</th>
                        <th style="padding: 1rem; text-align: center; color: var(--text-primary); font-weight: 700; font-size: 0.9rem;">סכום</th>
                        <th style="padding: 1rem; text-align: center; color: var(--text-primary); font-weight: 700; font-size: 0.9rem;">תאריך בקשה</th>
                        <th style="padding: 1rem; text-align: center; color: var(--text-primary); font-weight: 700; font-size: 0.9rem;">סטטוס</th>
                    </tr>
                </thead>
                <tbody>
                    ${projectPurchases.map(purchase => `
                        <tr style="border-bottom: 1px solid var(--border-glass); hover: { background: var(--bg-glass); }">
                            <td style="padding: 1rem; color: var(--text-primary); font-weight: 500;">${purchase.title}</td>
                            <td style="padding: 1rem; color: var(--text-secondary); font-size: 0.9rem;">${purchase.sku || '-'}</td>
                            <td style="padding: 1rem; text-align: center; color: var(--text-secondary);">${purchase.quantity}</td>
                            <td style="padding: 1rem; text-align: center; color: var(--text-secondary);">₪${(purchase.price || 0).toLocaleString('he-IL')}</td>
                            <td style="padding: 1rem; text-align: center; color: #e65100; font-weight: 700;">₪${(purchase.price * purchase.quantity).toLocaleString('he-IL')}</td>
                            <td style="padding: 1rem; text-align: center; color: var(--text-secondary); font-size: 0.9rem;">${formatDate(purchase.date)}</td>
                            <td style="padding: 1rem; text-align: center;">
                                <span style="background: ${purchase.status === 'arrived' ? '#2e7d32' : purchase.status === 'ordered' ? '#1565c0' : '#f57c00'}; color: white; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.8rem; font-weight: 600; display: inline-block;">
                                    ${purchase.status === 'arrived' ? 'הגיע' : purchase.status === 'ordered' ? 'הוזמן' : 'נשלחה בקשה'}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // Hide tasks section - not needed in budget detail view
    const tasksSection = detailTasksContainer.closest('.project-detail-section');
    if (tasksSection) {
        tasksSection.style.display = 'none';
    }

    // Switch to detail view
    switchToView('project-budget-detail-view');
}

// ================ END BUDGET MANAGEMENT ================

// ================ GANTT CHART - CALENDAR VIEW ================

function renderGanttCalendar() {
    const view = document.getElementById('gantt-view');
    if (!view) return;

    const year = ganttCurrentMonth.getFullYear();
    const month = ganttCurrentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const monthName = firstDay.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' });

    let html = `
        <div style="padding: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h2 style="margin: 0;">${monthName}</h2>
                <div style="display: flex; gap: 0.5rem;">
                    <button onclick="changeGanttMonth(-1)" style="padding: 0.6rem 1.2rem; background: var(--accent-primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 1rem;">←</button>
                    <button onclick="changeGanttMonth(1)" style="padding: 0.6rem 1.2rem; background: var(--accent-primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 1rem;">→</button>
                </div>
            </div>

            <!-- Project Filter -->
            <div style="margin-bottom: 1.5rem;">
                <label style="color: var(--text-secondary); font-weight: 600; margin-right: 0.5rem;">סינן פרויקט:</label>
                <select onchange="changeGanttFilter(this.value)" style="
                    padding: 0.6rem 1rem;
                    border: 2px solid var(--border-glass);
                    background: var(--bg-glass);
                    color: var(--text-primary);
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                ">
                    <option value="all">כל הפרויקטים</option>
                    ${[...new Set(tasks.map(t => t.project))].sort().map(p => `<option value="${p}">${p}</option>`).join('')}
                </select>
            </div>

            <!-- Calendar Grid -->
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem;">
                <!-- Day Headers -->
                ${['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'].map(day =>
                    `<div style="text-align: center; font-weight: 700; color: var(--text-secondary); padding: 1rem; border-bottom: 2px solid var(--border-glass);">${day}</div>`
                ).join('')}

                <!-- Empty cells -->
                ${Array(startingDayOfWeek).fill('').map(() => '<div></div>').join('')}

                <!-- Days -->
                ${Array.from({length: daysInMonth}, (_, i) => {
                    const day = i + 1;
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    let dayTasks = tasks.filter(t => t.dueDate.startsWith(dateStr));
                    if (ganttFilterProject !== 'all') {
                        dayTasks = dayTasks.filter(t => t.project === ganttFilterProject);
                    }
                    const now = new Date();
                    const isToday = day === now.getDate() && month === now.getMonth();

                    return `
                        <div droppable-day data-date="${dateStr}" style="
                            min-height: 120px;
                            border: 1px solid var(--border-glass);
                            border-radius: 8px;
                            padding: 0.5rem;
                            background: ${isToday ? 'rgba(100, 150, 255, 0.15)' : 'var(--bg-glass)'};
                            overflow-y: auto;
                            transition: background 0.2s;
                        ">
                            <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; font-size: 0.95rem;">${day}</div>
                            ${dayTasks.map(task => {
                                const color = {'stuck': '#ef4444', 'in_progress': '#f59e0b', 'pending': '#3b82f6', 'completed': '#10b981'}[task.status] || '#6b7280';
                                return `
                                    <div draggable-task data-task-id="${task.id}" style="
                                        background: ${color};
                                        color: white;
                                        padding: 0.4rem 0.6rem;
                                        border-radius: 4px;
                                        font-size: 0.75rem;
                                        margin-bottom: 0.3rem;
                                        cursor: grab;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        user-select: none;
                                    " title="${task.title}" ondblclick="editTask(${task.id})">
                                        📋 ${task.title}
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- Legend -->
            <div style="display: flex; gap: 1.5rem; margin-top: 2rem; flex-wrap: wrap;">
                <div style="display: flex; align-items: center; gap: 0.5rem;"><div style="width: 16px; height: 16px; background: #ef4444; border-radius: 3px;"></div> <span style="color: var(--text-secondary);">דחוף / stuck</span></div>
                <div style="display: flex; align-items: center; gap: 0.5rem;"><div style="width: 16px; height: 16px; background: #f59e0b; border-radius: 3px;"></div> <span style="color: var(--text-secondary);">בתהליך</span></div>
                <div style="display: flex; align-items: center; gap: 0.5rem;"><div style="width: 16px; height: 16px; background: #3b82f6; border-radius: 3px;"></div> <span style="color: var(--text-secondary);">בהמתנה</span></div>
                <div style="display: flex; align-items: center; gap: 0.5rem;"><div style="width: 16px; height: 16px; background: #10b981; border-radius: 3px;"></div> <span style="color: var(--text-secondary);">הושלם</span></div>
            </div>
        </div>
    `;

    view.innerHTML = html;

    // Setup event listeners after rendering
    setTimeout(() => {
        // Month navigation buttons
        const leftBtn = view.querySelector('button:nth-of-type(1)');
        const rightBtn = view.querySelector('button:nth-of-type(2)');

        if (leftBtn) leftBtn.addEventListener('click', () => changeGanttMonth(-1));
        if (rightBtn) rightBtn.addEventListener('click', () => changeGanttMonth(1));

        // Project filter dropdown
        const filterSelect = view.querySelector('select');
        if (filterSelect) {
            filterSelect.value = ganttFilterProject;
            filterSelect.addEventListener('change', (e) => changeGanttFilter(e.target.value));
        }

        // Setup drag-drop for tasks
        const taskDivs = view.querySelectorAll('[draggable-task]');
        taskDivs.forEach(div => {
            div.draggable = true;
            div.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('taskId', div.dataset.taskId);
            });
        });

        // Setup drop zones (day cells)
        const dayCells = view.querySelectorAll('[droppable-day]');
        dayCells.forEach(cell => {
            cell.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                cell.style.backgroundColor = 'rgba(100, 150, 255, 0.3)';
            });

            cell.addEventListener('dragleave', () => {
                cell.style.backgroundColor = '';
            });

            cell.addEventListener('drop', (e) => {
                e.preventDefault();
                cell.style.backgroundColor = '';
                const taskId = parseInt(e.dataTransfer.getData('taskId'));
                const newDate = cell.dataset.date;

                const task = tasks.find(t => t.id === taskId);
                if (task) {
                    task.dueDate = newDate;
                    saveTasks();
                    renderGanttCalendar();
                }
            });
        });
    }, 0);
}

function changeGanttMonth(offset) {
    ganttCurrentMonth.setMonth(ganttCurrentMonth.getMonth() + offset);
    renderGanttCalendar();
}

function changeGanttFilter(project) {
    ganttFilterProject = project;
    renderGanttCalendar();
}

function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        inputId.value = task.id;
        inputTitle.value = task.title;
        inputProject.value = task.project;
        inputAssignee.value = task.assignee || '';
        inputDueDate.value = task.dueDate;
        inputStatus.value = task.status;
        inputPriority.value = task.priority || 'none';
        inputIsManager.checked = task.isManager || false;
        inputIsCTO.checked = task.isCTO || false;
        inputShowstopper.checked = task.showstopper || false;
        currentSubtasks = task.subtasks ? [...task.subtasks] : [];
        renderModalSubtasks();
        openModal('task');
    }
}

// ================ END GANTT CHART ================

// ---------------- Bootstrap ----------------
document.addEventListener('DOMContentLoaded', init);
function togglePresentationMode() {
    document.body.classList.toggle('presentation-mode');

    // Re-render components that might need resizing
    updateCharts();
    renderTargets();
    if (selectReportProject.value) renderReport();

    // Visual feedback
    const isPresentation = document.body.classList.contains('presentation-mode');
    if (isPresentation) {
        btnTogglePresentation.innerHTML = '<i class="fa-solid fa-compress"></i>';
        btnTogglePresentation.title = 'צא ממצב הצגה (Esc)';
    } else {
        btnTogglePresentation.innerHTML = '<i class="fa-solid fa-display"></i>';
        btnTogglePresentation.title = 'מצב הצגה (Esc)';
    }
}
