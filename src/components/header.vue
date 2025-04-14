<template>
    <header class="main-header">
      <div class="header-container">
        <RouterLink to="/authorization" class="logo-link">
          <svg class="logo-icon" viewBox="0 0 24 24">
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
          </svg>
          <span class="logo-text">IThub Magas</span>
        </RouterLink>
        
        <nav class="nav-links">
          <RouterLink to="/authorization" class="nav-link active">
            <svg class="nav-icon" viewBox="0 0 24 24">
              <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 15.22 14.47 17 12 17s-4.52-1.78-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V21c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
            </svg>
            Авторизация
          </RouterLink>
          <RouterLink to="/dev" class="nav-link">
            <svg class="nav-icon" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
           Разработчики
          </RouterLink>
        </nav>
      </div>
    </header>
  </template>
  
  <script>
  import { RouterLink } from 'vue-router';
  export default {
    name: 'MainHeader',
    components: { RouterLink }
  }
  </script>
  
  <style scoped>
  .main-header {
    height: 70px;
    width: 100%;
    background-color: #6a1b9a; 

    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  }
  
  .header-container {
    max-width: 1200px;
    height: 100%;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: white;
    font-weight: 600;
    font-size: 1.1rem;
    transition: opacity 0.3s ease;
  }
  
  .logo-link:hover {
    opacity: 0.9;
  }
  
  .logo-icon {
    width: 28px;
    height: 28px;
    fill: currentColor;
    margin-right: 10px;
  }
  
  .logo-text {
    font-family: 'Roboto', sans-serif;
    letter-spacing: 0.5px;
  }
  
  .nav-links {
    display: flex;
    gap: 20px;
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
    padding: 8px 12px;
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  
  .nav-link:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.15);
  }
  
  .nav-link.active {
    color: white;
    background-color: rgba(255, 255, 255, 0.25);
    font-weight: 600;
  }
  
  .nav-icon {
    width: 20px;
    height: 20px;
    fill: currentColor;
    margin-right: 8px;
  }
  
  @media (max-width: 768px) {
    .header-container {
      padding: 0 15px;
    }
    
    .logo-text {
      display: none;
    }
    
    .nav-links {
      gap: 10px;
    }
    
    .nav-link {
      font-size: 0;
      padding: 8px;
    }
    
    .nav-icon {
      margin-right: 0;
    }
  }
  </style>