import { gsap } from 'gsap';
import api from '../scripts/api';
import { showError, showSuccess } from '../scripts/utils';

class NoteCard extends HTMLElement {
    constructor() {
        super();
        this.loading = document.querySelector('loading-indicator');
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.animateEntry();
    }

    setupEventListeners() {
        this.querySelector('.delete-button').addEventListener('click', this.handleDelete.bind(this));
        this.querySelector('.archive-button').addEventListener('click', this.handleArchive.bind(this));
    }

    animateEntry() {
        gsap.from(this, {
            duration: 0.5,
            opacity: 0,
            y: 20,
            ease: 'power2.out',
        });
    }
  
    async handleArchive(e) {
        e.preventDefault();
        const loading = document.querySelector('loading-indicator');
        const id = this.getAttribute('id');
        const isArchived = this.getAttribute('archived') === 'true';
  
        try {
            loading.style.display = 'block';
            if (isArchived) {
                await api.unarchiveNote(id);
            } else {
                await api.archiveNote(id);
            }
  
            gsap.to(this, {
                duration: 0.3,
                opacity: 0,
                scale: 0.8,
                ease: 'power2.in',
                onComplete: () => {
                    this.remove();
                    showSuccess(`Note ${isArchived ? 'unarchived' : 'archived'} successfully`);
                    window.dispatchEvent(new Event('notes-updated'));
                },
            });
        } catch (error) {
            showError(error.message || 'Failed to update note');
        } finally {
            loading.style.display = 'none';
        }
    }
  
    async handleDelete(e) {
        e.preventDefault();
        const loading = document.querySelector('loading-indicator');
        const id = this.getAttribute('id');
  
        try {
            loading.show();
            await api.deleteNotes(id);
  
            gsap.to(this, {
                duration: 0.3,
                opacity: 0,
                scale: 0.8,
                ease: 'power2.in',
                onComplete: () => {
                    this.remove();
                    showSuccess('Note deleted successfully');
                    window.dispatchEvent(new Event('notes-updated'));
                },
            });
        } catch (error) {
            showError(error.message || 'Failed to delete note');
        } finally {
            loading.hide();
        }
    }
    
    render() {
        const title = this.getAttribute('title');
        const body = this.getAttribute('body');
        const createdAt = new Date(this.getAttribute('created-at')).toLocaleString();
        const isArchived = this.getAttribute('archived') === 'true';
    
        this.innerHTML = `
            <div class="note-card">
                <h3>${title}</h3>
                <p>${body}</p>
                <div class="note-footer">
                    <span class="date">${createdAt}</span>
                    <div class="note-actions">
                        <button class="archive-button ${isArchived ? 'unarchive' : 'archive'}">
                            <span class="button-icon">${isArchived ? '📥' : '📤'}</span>
                            <span class="button-text">${isArchived ? 'Unarchive' : 'Archive'}</span>
                        </button>
                        <button class="delete-button">
                            <span class="button-icon">🗑️</span>
                            <span class="button-text">Delete</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}
    
customElements.define('note-card', NoteCard);