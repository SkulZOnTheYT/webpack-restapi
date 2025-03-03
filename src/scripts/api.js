const BASE_URL = 'https://notes-api.dicoding.dev/v2'

const api = {
    async getAllNotes() {
        const response = await fetch(`${BASE_URL}/notes`);
        const responseJson = await response.json();
        return responseJson.data || [];
    },

    async addNotes(note) {
        const response = await fetch(`${BASE_URL}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(note),
        });
        const responseJson = await response.json();
        return responseJson;
    },

    async deleteNotes(id) {
        const response = await fetch(`${BASE_URL}/notes/${id}`, {
            method: 'DELETE',
        });
        const responseJson = await response.json();
        return responseJson;
    },
    async archiveNote(id) {
        try {
          const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
            method: 'POST',
          });
          const responseJson = await response.json();
          
          if (!response.ok) {
            throw new Error(responseJson.message);
          }
          
          return responseJson;
        } catch (error) {
          console.error('Error archiving note:', error);
          throw error;
        }
      },
    
      async unarchiveNote(id) {
        try {
          const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
            method: 'POST',
          });
          const responseJson = await response.json();
          
          if (!response.ok) {
            throw new Error(responseJson.message);
          }
          
          return responseJson;
        } catch (error) {
          console.error('Error unarchiving note:', error);
          throw error;
        }
      },
}

export default api;