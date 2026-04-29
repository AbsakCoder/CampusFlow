/* CampusFlow Equipment Module */

(function () {
  const page = document.getElementById("equipmentPage");
  if (!page) return;

  const equipmentItems = [
    { id: 1, name: "Dell Latitude Laptop", category: "Laptops", total: 5, available: 3 },
    { id: 2, name: "HP ProBook Laptop", category: "Laptops", total: 6, available: 4 },
    { id: 3, name: "MacBook Air", category: "Laptops", total: 2, available: 1 },
    { id: 4, name: "Lenovo ThinkPad", category: "Laptops", total: 4, available: 2 },
    { id: 5, name: "Epson Projector X1", category: "Projectors", total: 3, available: 1 },
    { id: 6, name: "BenQ Projector", category: "Projectors", total: 2, available: 0 },
    { id: 7, name: "Sony Laser Projector", category: "Projectors", total: 2, available: 1 },
    { id: 8, name: "Digital Microscope A", category: "Microscopes", total: 3, available: 2 },
    { id: 9, name: "Biology Microscope", category: "Microscopes", total: 2, available: 1 },
    { id: 10, name: "Lab Scope Premium", category: "Microscopes", total: 4, available: 3 },
    { id: 11, name: "Portable Speaker", category: "Other", total: 4, available: 2 },
    { id: 12, name: "Wireless Mic Set", category: "Other", total: 3, available: 1 }
  ];

  let activeCategory = "All";
  let activeSearch = "";
  let selectedItemId = null;

  const grid = document.getElementById("equipmentGrid");
  const searchInput = document.getElementById("equipmentSearch");

  function getStatus(item) {
    if (item.available === 0) return { text: "Fully Checked Out", className: "badge-occupied" };
    if (item.available < item.total) return { text: "Partially Available", className: "badge-booked" };
    return { text: "Available", className: "badge-free" };
  }

  function render() {
    const filtered = equipmentItems.filter(function (item) {
      const categoryOk = activeCategory === "All" || item.category === activeCategory;
      const searchOk = item.name.toLowerCase().includes(activeSearch.toLowerCase());
      return categoryOk && searchOk;
    });

    if (!filtered.length) {
      grid.innerHTML = '<p class="empty-state card">No equipment items found.</p>';
      return;
    }

    grid.innerHTML = filtered.map(function (item) {
      const percent = Math.round((item.available / item.total) * 100);
      const status = getStatus(item);
      return '' +
        '<article class="card">' +
          '<h3 class="card-title">' + item.name + '</h3>' +
          '<p>Category: ' + item.category + '</p>' +
          '<p>Total: ' + item.total + ' | Available: ' + item.available + '</p>' +
          '<div class="equipment-bar">' +
            '<div class="equipment-bar-fill" data-fill-width="' + percent + '"></div>' +
          '</div>' +
          '<span class="badge ' + status.className + '">' + status.text + '</span>' +
          '<div class="mt-3"><button class="btn btn-primary" data-request-id="' + item.id + '">Request</button></div>' +
        '</article>';
    }).join("");

    grid.querySelectorAll(".equipment-bar-fill").forEach(function (bar) {
      bar.style.width = bar.getAttribute("data-fill-width") + "%";
    });
  }

  document.querySelectorAll(".eq-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".eq-tab").forEach(function (node) { node.classList.remove("active"); });
      tab.classList.add("active");
      activeCategory = tab.dataset.category;
      render();
    });
  });

  searchInput.addEventListener("input", function () {
    activeSearch = searchInput.value.trim();
    render();
  });

  grid.addEventListener("click", function (event) {
    const btn = event.target.closest("button[data-request-id]");
    if (!btn) return;
    selectedItemId = Number(btn.dataset.requestId);
    document.getElementById("equipmentRequestForm").reset();
    openModal("equipmentRequestModal");
  });

  document.getElementById("equipmentRequestForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const purpose = document.getElementById("eqPurpose").value.trim();
    const requiredDate = document.getElementById("eqRequiredDate").value;
    const returnDate = document.getElementById("eqReturnDate").value;

    if (!purpose || !requiredDate || !returnDate) {
      showToast("All fields are required.", "error");
      return;
    }

    const item = equipmentItems.find(function (row) { return row.id === selectedItemId; });
    if (!item || item.available <= 0) {
      showToast("Selected equipment is not available.", "error");
      return;
    }

    item.available -= 1;
    closeModal("equipmentRequestModal");
    showToast("Equipment request submitted.", "success");
    render();
  });

  render();
})();
