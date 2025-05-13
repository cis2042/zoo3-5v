document.addEventListener('DOMContentLoaded', function() {
  // Tab switching
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      const tabId = button.getAttribute('data-tab');
      document.getElementById(`${tabId}-tab`).classList.add('active');
    });
  });
  
  // Search button click handler
  const searchButton = document.querySelector('.search-button');
  const addressInput = document.getElementById('address');
  
  searchButton.addEventListener('click', () => {
    if (addressInput.value.trim() === '') {
      alert('請輸入 Kaia Chain 地址');
      return;
    }
    
    // Simulate loading
    searchButton.textContent = '查詢中...';
    searchButton.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
      searchButton.textContent = '查詢';
      searchButton.disabled = false;
      alert('這是演示頁面，實際功能需要連接到 Kaia Chain。');
    }, 1500);
  });
  
  // Task button click handlers
  const taskButtons = document.querySelectorAll('.task-button:not(.completed)');
  
  taskButtons.forEach(button => {
    button.addEventListener('click', () => {
      alert('這是演示頁面，實際功能需要連接到後端。');
    });
  });
});
