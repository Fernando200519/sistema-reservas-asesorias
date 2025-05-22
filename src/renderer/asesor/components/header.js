// src/main/components/header.js
export function loadHeader(title = '') {
    const headerHTML = `
      <div class="header">
        <h1>CAA</h1>
        <button class="active-tab">${title}</button>
      </div>
    `;
    
    const headerContainer = document.getElementById('header');
    if (headerContainer) {
      headerContainer.innerHTML = headerHTML;
    }
  }