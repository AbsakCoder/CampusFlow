/* CampusFlow Lost and Found Module */

(function () {
  const page = document.getElementById("lostFoundPage");
  if (!page) return;

  const items = [
    { id: 1, type: "lost", name: "Samsung Phone", category: "Phone", description: "Black phone with blue cover.", location: "CSE Block Lobby", date: "2026-04-01", postedBy: "Anonymous", contact: "studenthelp@campusflow.edu", image: "" },
    { id: 2, type: "lost", name: "College ID Card", category: "ID Card", description: "ID card for student A. Sharma.", location: "Library", date: "2026-03-30", postedBy: "Aarav", contact: "aarav@campusflow.edu", image: "" },
    { id: 3, type: "lost", name: "Grey Backpack", category: "Bag", description: "Laptop bag with notebooks inside.", location: "Mechanical Block", date: "2026-03-29", postedBy: "Anonymous", contact: "helpdesk@campusflow.edu", image: "" },
    { id: 4, type: "lost", name: "Car Keys", category: "Keys", description: "Keychain with red strap.", location: "Parking Lot", date: "2026-04-02", postedBy: "Ritika", contact: "ritika@campusflow.edu", image: "" },
    { id: 5, type: "found", name: "Brown Wallet", category: "Wallet", description: "Wallet with some cards.", location: "Main Canteen", date: "2026-04-01", postedBy: "Anonymous", contact: "security@campusflow.edu", image: "" },
    { id: 6, type: "found", name: "Laptop Charger", category: "Laptop", description: "65W adapter found near lab.", location: "CSE Lab 2", date: "2026-03-31", postedBy: "Lab Assistant", contact: "lab@campusflow.edu", image: "" },
    { id: 7, type: "found", name: "Set of Keys", category: "Keys", description: "Three keys on steel ring.", location: "Civil Block", date: "2026-03-28", postedBy: "Anonymous", contact: "security@campusflow.edu", image: "" },
    { id: 8, type: "found", name: "Blue Water Bottle", category: "Other", description: "Metal water bottle.", location: "Auditorium", date: "2026-04-02", postedBy: "Volunteer", contact: "events@campusflow.edu", image: "" }
  ];

  let activeTab = "lost";
  let activeCategory = "All";
  let searchTerm = "";

  const list = document.getElementById("lostFoundGrid");

  function cardImage(url) {
    if (url) {
      return '<img src="' + url + '" alt="Item" class="item-image" />';
    }
    return '<div class="item-image-placeholder">Image</div>';
  }

  function render() {
    const filtered = items.filter(function (item) {
      const tabOk = item.type === activeTab;
      const categoryOk = activeCategory === "All" || item.category === activeCategory;
      const searchOk = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return tabOk && categoryOk && searchOk;
    });

    if (!filtered.length) {
      list.innerHTML = '<p class="empty-state card">No items match current filters.</p>';
      return;
    }

    list.innerHTML = filtered.map(function (item) {
      return '' +
      '<article class="card">' +
        cardImage(item.image) +
        '<h3 class="card-title mt-3">' + item.name + '</h3>' +
        '<span class="badge badge-booked">' + item.category + '</span>' +
        '<p class="mt-2 line-clamp-2">' + item.description + '</p>' +
        '<p class="mt-2">' + item.location + ' | ' + item.date + '</p>' +
        '<p>Posted by: ' + item.postedBy + '</p>' +
        '<button class="btn btn-primary mt-3" data-contact-id="' + item.id + '">' + (item.type === "lost" ? "This is Mine" : "I Found This") + '</button>' +
      '</article>';
    }).join("");
  }

  document.getElementById("tabLost").addEventListener("click", function () {
    activeTab = "lost";
    this.classList.add("active");
    document.getElementById("tabFound").classList.remove("active");
    render();
  });

  document.getElementById("tabFound").addEventListener("click", function () {
    activeTab = "found";
    this.classList.add("active");
    document.getElementById("tabLost").classList.remove("active");
    render();
  });

  document.getElementById("lostFoundSearch").addEventListener("input", function () {
    searchTerm = this.value.trim();
    render();
  });

  document.getElementById("lostFoundCategory").addEventListener("change", function () {
    activeCategory = this.value;
    render();
  });

  list.addEventListener("click", function (event) {
    const btn = event.target.closest("button[data-contact-id]");
    if (!btn) return;
    const id = Number(btn.dataset.contactId);
    const item = items.find(function (row) { return row.id === id; });
    if (!item) return;
    document.getElementById("contactModalTitle").textContent = item.name;
    document.getElementById("contactModalInfo").textContent = "Contact: " + item.contact;
    openModal("contactInfoModal");
  });

  document.getElementById("postItemBtn").addEventListener("click", function () {
    openModal("postItemModal");
  });

  document.getElementById("itemPhoto").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function () {
      document.getElementById("itemPreview").src = reader.result;
      document.getElementById("itemPreview").classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("postItemForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("itemName").value.trim();
    const category = document.getElementById("itemCategory").value;
    const description = document.getElementById("itemDescription").value.trim();
    const location = document.getElementById("itemLocation" ).value.trim();
    const date = document.getElementById("itemDate").value;
    const contact = document.getElementById("itemContact").value.trim();
    const anonymous = document.getElementById("itemAnonymous").checked;
    const img = document.getElementById("itemPreview").src;

    if (!name || !category || !description || !location || !date || !contact) {
      showToast("Please complete all required fields.", "error");
      return;
    }

    items.unshift({
      id: Date.now(),
      type: activeTab,
      name: name,
      category: category,
      description: description,
      location: location,
      date: date,
      postedBy: anonymous ? "Anonymous" : "You",
      contact: contact,
      image: img.includes("data:") ? img : ""
    });

    closeModal("postItemModal");
    showToast("Item posted successfully.", "success");
    document.getElementById("postItemForm").reset();
    document.getElementById("itemPreview").classList.add("hidden");
    render();
  });

  render();
})();
