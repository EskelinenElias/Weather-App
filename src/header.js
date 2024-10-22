// Load page
document.addEventListener("DOMContentLoaded", () => {
  // Event listener to toggle the search bar on mobile when the search icon is clicked
  document.getElementById("search-button").addEventListener("click", function () {
    const mobileSearchForm = document.getElementById("search-form-mobile");
    const mainContent = document.querySelector('main'); 
    const searchInput = document.getElementById("search-input-mobile"); 
    const overflowMenu = document.getElementById("overflow-menu-dropdown"); 
    // Hide overflow menu if it is visible
    if (overflowMenu.classList.contains("open")) {
      overflowMenu.classList.remove("open"); 
    }
    mobileSearchForm.classList.toggle("open");
    if (mobileSearchForm.classList.contains("open")) {
      mainContent.classList.add("hidden"); 
      searchInput.focus(); 
    } else {
      mainContent.classList.remove("hidden");
    }
  });          
  // Event listener to toggle the overflow menu
  document.getElementById("overflow-menu").addEventListener("click", function() {
    const overflowMenu = document.getElementById("overflow-menu-dropdown");
    const searchForm = document.getElementById("search-form-mobile");
    const mainContent = document.querySelector('main'); 
    if (overflowMenu.classList.contains("open")) {
      overflowMenu.classList.remove("open"); 
    } else {
      overflowMenu.classList.add("open"); 
      if (searchForm.classList.contains("open")) {
        searchForm.classList.remove("open"); 
        mainContent.classList.remove("hidden");
      }
    }                
  });
}); 
