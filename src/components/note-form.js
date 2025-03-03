import api from '../scripts/api';
import { showError, showSuccess } from '../scripts/utils';

class NoteForm extends HTMLElement {
  connectedCallback() {
    this.loading = document.querySelector('loading-indicator');
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const form = this.querySelector('form');
    if (form) {
      form.addEventListener('submit', this.handleSubmit.bind(this));
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const title = form.querySelector('#title').value;
    const body = form.querySelector('#body').value;

    try {
      this.loading.show();
      await api.addNotes({ title, body });
      form.reset();
      showSuccess('Note added successfully');
      window.dispatchEvent(new Event('notes-updated'));
    } catch (error) {
      showError(error.message || 'Failed to add note');
    } finally {
      this.loading.hide();
    }
  }

  render() {
    this.innerHTML = `
      <form class="note-form">
        <input type="text" id="title" placeholder="Note Title" required>
        <textarea id="body" placeholder="Write your note here..." rows="4" required></textarea>
        <button type="submit">Add Note</button>
      </form>
    `;
  }
}

customElements.define('note-form', NoteForm);