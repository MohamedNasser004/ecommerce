import axios from 'axios';

class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(file => {
      const data = new FormData();
      data.append('upload', file);
      data.append('type', 'ckeditor');

      return axios.post('http://localhost:3001/image/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          if (!response.data.url) {
            throw new Error('Image upload failed: no URL returned');
          }
          return {
            default: response.data.url
          };
        })
        .catch(error => {
          console.error("Upload Error:", error);
          throw error;
        });
    });
  }

  abort() {
    // Optional: handle abort
  }
}

export function uploadPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}