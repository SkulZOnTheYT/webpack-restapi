import './styles/style.css';
import './components/note-form';
import './components/note-card';
import './components/loading-indicator';
import api from './scripts/api';
import { showError } from './scripts/utils';
import { gsap } from 'gsap';

class NotesApp {
  constructor() {
    this.loading = document.querySelector('loading-indicator');
    this.showArchived = false;
    this.init();
  }

  showLoading() {
    this.loading.show();
  }

  hideLoading() {
    this.loading.hide();
  }

  async init() {
    this.setupEventListeners();
    await this.displayNotes();
  }

  setupEventListeners() {
    const toggleButton = document.getElementById('toggle-archived');
    if (toggleButton) {
        toggleButton.textContent = this.showArchived ? 'Show Active Notes' : 'Show Archived Notes';
        toggleButton.classList.toggle('archived', this.showArchived);
        
        toggleButton.addEventListener('click', () => {
            this.showArchived = !this.showArchived;
            
            gsap.to(toggleButton, {
                duration: 0.3,
                opacity: 0,
                onComplete: () => {
                    toggleButton.textContent = this.showArchived ? 'Show Active Notes' : 'Show Archived Notes';
                    toggleButton.classList.toggle('archived', this.showArchived);
                    gsap.to(toggleButton, {
                        duration: 0.3,
                        opacity: 1
                    });
                }
            });
            
            this.displayNotes();
        });
    }
}

  async displayNotes() {
    try {
      this.showLoading();
      const notes = await api.getAllNotes();
      const notesGrid = document.getElementById('notes-grid');

      if (!Array.isArray(notes)) {
        console.error('Notes is not an array:', notes);
        return;
      }

      gsap.to(notesGrid, {
        duration: 0.3,
        opacity: 0,
        onComplete: () => {
          notesGrid.innerHTML = '';
          const filteredNotes = notes.filter(note => note.archived === this.showArchived);

          filteredNotes.forEach(note => {
            const noteCard = document.createElement('note-card');
            noteCard.setAttribute('id', note.id);
            noteCard.setAttribute('title', note.title);
            noteCard.setAttribute('body', note.body);
            noteCard.setAttribute('created-at', note.createdAt);
            noteCard.setAttribute('archived', note.archived.toString());
            notesGrid.appendChild(noteCard);
          });

          gsap.to(notesGrid, {
            duration: 0.3,
            opacity: 1,
          });
        },
      });
    } catch (error) {
      showError(error.message || 'Failed to load notes');
      console.error('Error loading notes:', error);
    } finally {
      this.hideLoading();
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new NotesApp();
});


