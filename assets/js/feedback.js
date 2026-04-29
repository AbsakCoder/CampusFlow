/* CampusFlow Feedback and Facility Issues Module */

(function () {
  const page = document.getElementById("feedbackPage");
  if (!page) return;

  const locationMap = {
    "CSIT Block": {
      "Basement": ["Lab-1", "Lab-2", "Lab-3", "Office"],
      "Ground Floor": ["CR-1", "CR-2", "CR-3", "LT-1", "LT-2", "Seminar Hall"],
      "First Floor": ["CR-4", "CR-5", "CR-6", "CR-7", "LT-3", "LT-4", "LT-5", "Lab-4", "Lab-5"],
      "Second Floor": ["CR-8", "CR-9", "CR-10", "LT-6", "LT-7", "LT-8", "Lab-6", "Lab-7"],
      "Third Floor": ["CR-11", "CR-12", "LT-9", "LT-10", "LT-11"]
    },
    "K.P. Nautiyal Block": {
      "Ground Floor": ["CR-1", "LT-1"],
      "First Floor": ["CR-2", "CR-3", "CR-4", "LT-2"],
      "Second Floor": ["CR-5", "CR-6", "CR-7", "LT-3"]
    }
  };

  const issues = [
    { id: 1, type: "Broken AC", block: "CSIT Block", floor: "Second Floor", room: "CR-8", description: "AC not cooling", date: "2026-04-01", status: "Pending" },
    { id: 2, type: "Electrical Issue", block: "CSIT Block", floor: "Basement", room: "Lab-2", description: "Sparking near switch", date: "2026-04-01", status: "Pending" },
    { id: 3, type: "Washroom Problem", block: "K.P. Nautiyal Block", floor: "First Floor", room: "CR-3", description: "Water leakage", date: "2026-03-31", status: "Pending" },
    { id: 4, type: "Furniture Damage", block: "CSIT Block", floor: "Ground Floor", room: "CR-2", description: "Broken desk", date: "2026-03-30", status: "Pending" },
    { id: 5, type: "Internet Issue", block: "K.P. Nautiyal Block", floor: "Ground Floor", room: "LT-1", description: "No network", date: "2026-03-30", status: "In Progress" },
    { id: 6, type: "Projector Not Working", block: "CSIT Block", floor: "First Floor", room: "LT-3", description: "Display flicker", date: "2026-03-29", status: "In Progress" },
    { id: 7, type: "Electrical Issue", block: "CSIT Block", floor: "Third Floor", room: "CR-11", description: "Lights not turning on", date: "2026-03-29", status: "In Progress" },
    { id: 8, type: "Broken AC", block: "K.P. Nautiyal Block", floor: "Second Floor", room: "CR-5", description: "Compressor issue", date: "2026-03-28", status: "Resolved" },
    { id: 9, type: "Other", block: "CSIT Block", floor: "Second Floor", room: "Lab-6", description: "Fan noise", date: "2026-03-27", status: "Resolved" },
    { id: 10, type: "Washroom Problem", block: "CSIT Block", floor: "Third Floor", room: "CR-12", description: "Drain blockage", date: "2026-03-26", status: "Resolved" }
  ];

  const blockSelect = document.getElementById("issueBlock");
  const floorSelect = document.getElementById("issueFloor");
  const roomSelect = document.getElementById("issueRoom");
  const board = document.getElementById("issueBoard");

  let activeStatus = "All";

  function updateFloors() {
    const floors = Object.keys(locationMap[blockSelect.value] || {});
    floorSelect.innerHTML = floors.map(function (floor) {
      return '<option value="' + floor + '">' + floor + '</option>';
    }).join("");
    updateRooms();
  }

  function updateRooms() {
    const rooms = (locationMap[blockSelect.value] || {})[floorSelect.value] || [];
    roomSelect.innerHTML = rooms.map(function (room) {
      return '<option value="' + room + '">' + room + '</option>';
    }).join("");
  }

  function badgeClass(status) {
    if (status === "Pending") return "badge-pending";
    if (status === "In Progress") return "badge-progress";
    return "badge-resolved";
  }

  function renderBoard() {
    const filtered = issues.filter(function (issue) {
      return activeStatus === "All" || issue.status === activeStatus;
    });

    if (!filtered.length) {
      board.innerHTML = '<p class="empty-state card">No issues in this status.</p>';
      return;
    }

    const role = (localStorage.getItem("campusflowRole") || "").toLowerCase();

    board.innerHTML = filtered.map(function (issue) {
      const adminControl = role === "admin"
        ? '<select data-status-id="' + issue.id + '"><option ' + (issue.status === "Pending" ? "selected" : "") + '>Pending</option><option ' + (issue.status === "In Progress" ? "selected" : "") + '>In Progress</option><option ' + (issue.status === "Resolved" ? "selected" : "") + '>Resolved</option></select>'
        : "";

      return '' +
      '<article class="card">' +
        '<h3 class="card-title">' + issue.type + '</h3>' +
        '<p>' + issue.block + ', ' + issue.floor + ', ' + issue.room + '</p>' +
        '<p>' + issue.description + '</p>' +
        '<p>Reported: ' + issue.date + '</p>' +
        '<span class="badge ' + badgeClass(issue.status) + '">' + issue.status + '</span>' +
        '<div class="mt-3">' + adminControl + '</div>' +
      '</article>';
    }).join("");
  }

  document.getElementById("issueStatusFilter").addEventListener("change", function () {
    activeStatus = this.value;
    renderBoard();
  });

  board.addEventListener("change", function (event) {
    const select = event.target.closest("select[data-status-id]");
    if (!select) return;
    const id = Number(select.dataset.statusId);
    const issue = issues.find(function (entry) { return entry.id === id; });
    if (!issue) return;
    issue.status = select.value;
    showToast("Issue status updated.", "success");
    renderBoard();
  });

  document.getElementById("feedbackForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const issueType = document.getElementById("issueType").value;
    const desc = document.getElementById("issueDescription").value.trim();

    if (!issueType || !desc) {
      showToast("Issue type and description are required.", "error");
      return;
    }

    issues.unshift({
      id: Date.now(),
      type: issueType,
      block: blockSelect.value,
      floor: floorSelect.value,
      room: roomSelect.value,
      description: desc,
      date: new Date().toISOString().split("T")[0],
      status: "Pending"
    });

    showToast("Thank you! Issue submitted anonymously.", "success");
    this.reset();
    updateFloors();
    renderBoard();
  });

  blockSelect.addEventListener("change", updateFloors);
  floorSelect.addEventListener("change", updateRooms);

  updateFloors();
  renderBoard();
})();
