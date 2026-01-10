// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed'));
    });
}

// Data Management
const STORAGE_KEY = 'dailies-links';

const defaultLinks = [
    { id: '1', name: 'Sam', url: 'https://www.cluesbysam.com/' },
    { id: '2', name: 'NYT', url: 'https://www.nytimes.com/crosswords' },
    { id: '3', name: 'Puzzmo', url: 'https://www.puzzmo.com/' }
];

let links = [];
let editingLinkId = null;
let draggedElement = null;
let draggedIndex = null;

// Initialize
function init() {
    loadLinks();
    renderMainView();
    attachEventListeners();
}

// Local Storage Functions
function loadLinks() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            links = JSON.parse(stored);
        } catch (e) {
            links = [...defaultLinks];
            saveLinks();
        }
    } else {
        links = [...defaultLinks];
        saveLinks();
    }
}

function saveLinks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

// View Management
function showMainView() {
    document.getElementById('main-view').classList.add('active');
    document.getElementById('settings-view').classList.remove('active');
    renderMainView();
}

function showSettingsView() {
    document.getElementById('main-view').classList.remove('active');
    document.getElementById('settings-view').classList.add('active');
    renderSettingsView();
}

// Render Functions
function renderMainView() {
    const grid = document.getElementById('links-grid');
    grid.innerHTML = '';

    links.forEach(link => {
        const item = createLinkElement(link);
        grid.appendChild(item);
    });
}

function createLinkElement(link) {
    const item = document.createElement('a');
    item.className = 'link-item';
    item.href = link.url;
    item.target = '_blank';
    item.rel = 'noopener noreferrer';

    const icon = document.createElement('div');
    icon.className = 'link-icon';
    icon.textContent = getInitial(link.name);

    const name = document.createElement('div');
    name.className = 'link-name';
    name.textContent = link.name;

    item.appendChild(icon);
    item.appendChild(name);

    return item;
}

function getInitial(name) {
    return name.charAt(0).toUpperCase();
}

function renderSettingsView() {
    const list = document.getElementById('links-list');
    list.innerHTML = '';

    links.forEach((link, index) => {
        const item = createLinkListElement(link, index);
        list.appendChild(item);
    });
}

function createLinkListElement(link, index) {
    const item = document.createElement('div');
    item.className = 'link-list-item';
    item.draggable = true;
    item.dataset.index = index;

    item.innerHTML = `
        <div class="drag-handle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        </div>
        <div class="link-list-info">
            <div class="link-list-name">${escapeHtml(link.name)}</div>
            <div class="link-list-url">${escapeHtml(link.url)}</div>
        </div>
        <div class="link-list-actions">
            <button class="btn btn-small btn-secondary edit-btn">Edit</button>
            <button class="btn btn-small btn-danger delete-btn">Delete</button>
        </div>
    `;

    // Edit button
    item.querySelector('.edit-btn').addEventListener('click', () => {
        editLink(link.id);
    });

    // Delete button
    item.querySelector('.delete-btn').addEventListener('click', () => {
        deleteLink(link.id);
    });

    // Drag and drop events
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('drop', handleDrop);
    item.addEventListener('dragenter', handleDragEnter);
    item.addEventListener('dragleave', handleDragLeave);

    return item;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Drag and Drop Functions
function handleDragStart(e) {
    draggedElement = this;
    draggedIndex = parseInt(this.dataset.index);
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    const items = document.querySelectorAll('.link-list-item');
    items.forEach(item => {
        item.classList.remove('drag-over');
    });
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    if (this !== draggedElement) {
        this.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (draggedElement !== this) {
        const dropIndex = parseInt(this.dataset.index);
        const draggedLink = links[draggedIndex];

        links.splice(draggedIndex, 1);
        links.splice(dropIndex, 0, draggedLink);

        saveLinks();
        renderSettingsView();
    }

    return false;
}

// Link Management Functions
function addLink() {
    editingLinkId = null;
    showEditModal('Add Link');
}

function editLink(id) {
    const link = links.find(l => l.id === id);
    if (link) {
        editingLinkId = id;
        showEditModal('Edit Link', link);
    }
}

function deleteLink(id) {
    if (confirm('Are you sure you want to delete this link?')) {
        links = links.filter(l => l.id !== id);
        saveLinks();
        renderSettingsView();
        renderMainView();
    }
}

function saveLink(name, url) {
    if (editingLinkId) {
        const link = links.find(l => l.id === editingLinkId);
        if (link) {
            link.name = name;
            link.url = url;
        }
    } else {
        const newLink = {
            id: Date.now().toString(),
            name: name,
            url: url
        };
        links.push(newLink);
    }

    saveLinks();
    renderSettingsView();
    renderMainView();
    hideEditModal();
}

// Modal Functions
function showEditModal(title, link = null) {
    const modal = document.getElementById('edit-modal');
    const modalTitle = document.getElementById('modal-title');
    const nameInput = document.getElementById('link-name');
    const urlInput = document.getElementById('link-url');

    modalTitle.textContent = title;
    nameInput.value = link ? link.name : '';
    urlInput.value = link ? link.url : '';

    modal.classList.add('active');
    nameInput.focus();
}

function hideEditModal() {
    const modal = document.getElementById('edit-modal');
    modal.classList.remove('active');
    editingLinkId = null;
}

// Export/Import Functions
function exportSettings() {
    const data = JSON.stringify(links, null, 2);
    const textarea = document.getElementById('import-export-text');
    textarea.value = data;
    textarea.select();

    // Try to copy to clipboard
    try {
        document.execCommand('copy');
        alert('Settings exported and copied to clipboard!');
    } catch (e) {
        alert('Settings exported! You can now copy the text.');
    }
}

function importSettings() {
    const textarea = document.getElementById('import-export-text');
    const data = textarea.value.trim();

    if (!data) {
        alert('Please paste your settings data first.');
        return;
    }

    try {
        const imported = JSON.parse(data);

        if (!Array.isArray(imported)) {
            throw new Error('Invalid format');
        }

        // Validate each link
        for (const link of imported) {
            if (!link.id || !link.name || !link.url) {
                throw new Error('Invalid link format');
            }
        }

        if (confirm('This will replace all your current links. Continue?')) {
            links = imported;
            saveLinks();
            renderSettingsView();
            renderMainView();
            textarea.value = '';
            alert('Settings imported successfully!');
        }
    } catch (e) {
        alert('Error importing settings. Please check the format and try again.');
    }
}

// Event Listeners
function attachEventListeners() {
    // Navigation
    document.getElementById('settings-btn').addEventListener('click', showSettingsView);
    document.getElementById('back-btn').addEventListener('click', showMainView);

    // Add link
    document.getElementById('add-link-btn').addEventListener('click', addLink);

    // Export/Import
    document.getElementById('export-btn').addEventListener('click', exportSettings);
    document.getElementById('import-btn').addEventListener('click', importSettings);

    // Modal
    document.getElementById('cancel-btn').addEventListener('click', hideEditModal);
    document.getElementById('edit-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('link-name').value.trim();
        const url = document.getElementById('link-url').value.trim();

        if (name && url) {
            saveLink(name, url);
        }
    });

    // Close modal on outside click
    document.getElementById('edit-modal').addEventListener('click', (e) => {
        if (e.target.id === 'edit-modal') {
            hideEditModal();
        }
    });
}

// Start the app
init();
