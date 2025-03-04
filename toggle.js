document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("toggletheme");
    const darkTheme = "dark";
    const lightTheme = "light";
  
    // Retrieve the saved theme from localStorage (default to dark if none is found)
    const savedTheme = localStorage.getItem("theme") || darkTheme;
    setTheme(savedTheme);
  
    // Toggle theme on button click
    toggleButton.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") === lightTheme ? lightTheme : darkTheme;
      const newTheme = currentTheme === darkTheme ? lightTheme : darkTheme;
      setTheme(newTheme);
    });
  
    // Function to apply theme and update localStorage and button icon
    function setTheme(theme) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
      // Update the toggle button icon: sun for light mode, moon for dark mode
      toggleButton.textContent = theme === darkTheme ? "🌙" : "☀️";
    }
  });
  