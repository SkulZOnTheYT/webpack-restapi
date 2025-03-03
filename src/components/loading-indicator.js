class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s, visibility 0.3s;
        }

        :host([active]) {
          opacity: 1;
          visibility: visible;
        }

        .loader-container {
          background: rgba(255, 255, 255, 0.9);
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          animation: slideUp 0.5s ease;
        }

        .loader {
          width: 48px;
          height: 48px;
          display: inline-block;
          position: relative;
        }

        .loader::after,
        .loader::before {
          content: '';  
          box-sizing: border-box;
          width: 48px;
          height: 48px;
          border: 4px solid #FFF;
          position: absolute;
          left: 0;
          top: 0;
          animation: rotationBreak 3s ease-in-out infinite;
        }

        .loader::after {
          border-color: #FF9800;
          animation-delay: 1.5s;
        }

        .loading-text {
          color: #333;
          font-size: 1rem;
          font-weight: 500;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes rotationBreak {
          0% {
            transform: rotate(0);
          }
          25% {
            transform: rotate(90deg);
          }
          50% { 
            transform: rotate(180deg);
          }
          75% {
            transform: rotate(270deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      </style>
      <div class="loader-container">
        <div class="loader"></div>
        <div class="loading-text">Loading...</div>
      </div>
    `;
  }

  show() {
    this.setAttribute('active', '');
  }

  hide() {
    this.removeAttribute('active');
  }
}

customElements.define('loading-indicator', LoadingIndicator);