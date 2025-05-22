document.addEventListener("DOMContentLoaded", () => {
  // Load side-nav
  const sideNav = document.querySelector(".side-nav");
  fetch("side-nav.html")
    .then(response => {
      if (!response.ok) throw new Error(`Failed to load side-nav.html: ${response.status}`);
      return response.text();
    })
    .then(html => {
      sideNav.innerHTML = html;

      // After side-nav loads, add click handler for nav links
      setupNavClickHandler();
    })
    .catch(error => console.error(error));

  // Load dashboard as default in .content
  const contentDiv = document.querySelector(".content");
  fetch("dashboard.html")
    .then(response => {
      if (!response.ok) throw new Error(`Failed to load dashboard.html: ${response.status}`);
      return response.text();
    })
    .then(html => {
      contentDiv.innerHTML = html;

      // Optional: initialize dashboard scripts here
      if (typeof updateDateTime === "function") updateDateTime();
    })
    .catch(error => console.error(error));

  function setupNavClickHandler() {
    document.body.addEventListener("click", (e) => {
      const target = e.target;
      if (target.tagName === "A" && target.dataset.page) {
        e.preventDefault();

        // Update active class
        document.querySelectorAll(".side-nav-menu ul li a").forEach(link => {
          link.classList.remove("active");
        });
        target.classList.add("active");

        // Load clicked page
        const page = target.dataset.page;
        fetch(`${page}.html`)
          .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${page}.html: ${response.status}`);
            return response.text();
          })
          .then(html => {
            contentDiv.innerHTML = html;

            // Init page-specific scripts
            if (page === "dashboard" && typeof updateDateTime === "function") {
              updateDateTime();
            }
          })
          .catch(error => console.error(error));
      }
    });
  }
});
