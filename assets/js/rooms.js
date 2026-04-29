/* CampusFlow Rooms Module */

(function () {
  const rooms = [
    // CSIT Block - Basement
    { id: 1, code: "CSIT-LAB1", name: "Lab-1", block: "CSIT Block", floor: "B", type: "Lab", capacity: 100, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 2, code: "CSIT-LAB2", name: "Lab-2", block: "CSIT Block", floor: "B", type: "Lab", capacity: 100, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 3, code: "CSIT-LAB3", name: "Lab-3", block: "CSIT Block", floor: "B", type: "Lab", capacity: 100, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    // CSIT Block - Ground
    { id: 4, code: "CSIT-CR1", name: "CR-1", block: "CSIT Block", floor: "G", type: "Classroom", capacity: 100, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 5, code: "CSIT-CR2", name: "CR-2", block: "CSIT Block", floor: "G", type: "Classroom", capacity: 100, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 6, code: "CSIT-CR3", name: "CR-3", block: "CSIT Block", floor: "G", type: "Classroom", capacity: 100, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 7, code: "CSIT-LT1", name: "LT-1", block: "CSIT Block", floor: "G", type: "Lecture Theatre", capacity: 300, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 8, code: "CSIT-LT2", name: "LT-2", block: "CSIT Block", floor: "G", type: "Lecture Theatre", capacity: 300, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 9, code: "CSIT-SH", name: "Seminar Hall", block: "CSIT Block", floor: "G", type: "Seminar Hall", capacity: 200, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    // CSIT Block - First Floor
    { id: 10, code: "CSIT-CR4", name: "CR-4", block: "CSIT Block", floor: "1", type: "Classroom", capacity: 100, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 11, code: "CSIT-CR5", name: "CR-5", block: "CSIT Block", floor: "1", type: "Classroom", capacity: 100, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 12, code: "CSIT-CR6", name: "CR-6", block: "CSIT Block", floor: "1", type: "Classroom", capacity: 100, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 13, code: "CSIT-CR7", name: "CR-7", block: "CSIT Block", floor: "1", type: "Classroom", capacity: 100, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 14, code: "CSIT-LT3", name: "LT-3", block: "CSIT Block", floor: "1", type: "Lecture Theatre", capacity: 300, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 15, code: "CSIT-LT4", name: "LT-4", block: "CSIT Block", floor: "1", type: "Lecture Theatre", capacity: 300, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 16, code: "CSIT-LT5", name: "LT-5", block: "CSIT Block", floor: "1", type: "Lecture Theatre", capacity: 300, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 17, code: "CSIT-LAB4", name: "Lab-4", block: "CSIT Block", floor: "1", type: "Lab", capacity: 50, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 18, code: "CSIT-LAB5", name: "Lab-5", block: "CSIT Block", floor: "1", type: "Lab", capacity: 50, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    // CSIT Block - Second Floor
    { id: 19, code: "CSIT-CR8", name: "CR-8", block: "CSIT Block", floor: "2", type: "Classroom", capacity: 100, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 20, code: "CSIT-CR9", name: "CR-9", block: "CSIT Block", floor: "2", type: "Classroom", capacity: 100, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 21, code: "CSIT-CR10", name: "CR-10", block: "CSIT Block", floor: "2", type: "Classroom", capacity: 100, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 22, code: "CSIT-LT6", name: "LT-6", block: "CSIT Block", floor: "2", type: "Lecture Theatre", capacity: 300, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 23, code: "CSIT-LT7", name: "LT-7", block: "CSIT Block", floor: "2", type: "Lecture Theatre", capacity: 300, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 24, code: "CSIT-LT8", name: "LT-8", block: "CSIT Block", floor: "2", type: "Lecture Theatre", capacity: 300, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 25, code: "CSIT-LAB6", name: "Lab-6", block: "CSIT Block", floor: "2", type: "Lab", capacity: 65, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 26, code: "CSIT-LAB7", name: "Lab-7", block: "CSIT Block", floor: "2", type: "Lab", capacity: 65, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    // CSIT Block - Third Floor
    { id: 27, code: "CSIT-CR11", name: "CR-11", block: "CSIT Block", floor: "3", type: "Classroom", capacity: 100, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 28, code: "CSIT-CR12", name: "CR-12", block: "CSIT Block", floor: "3", type: "Classroom", capacity: 100, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 29, code: "CSIT-LT9", name: "LT-9", block: "CSIT Block", floor: "3", type: "Lecture Theatre", capacity: 300, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 30, code: "CSIT-LT10", name: "LT-10", block: "CSIT Block", floor: "3", type: "Lecture Theatre", capacity: 300, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 31, code: "CSIT-LT11", name: "LT-11", block: "CSIT Block", floor: "3", type: "Lecture Theatre", capacity: 300, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    // K.P. Nautiyal Block - Ground
    { id: 32, code: "KPN-CR1", name: "CR-1", block: "K.P. Nautiyal Block", floor: "G", type: "Classroom", capacity: 100, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 33, code: "KPN-LT1", name: "LT-1", block: "K.P. Nautiyal Block", floor: "G", type: "Lecture Theatre", capacity: 100, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    // K.P. Nautiyal Block - First Floor
    { id: 34, code: "KPN-CR2", name: "CR-2", block: "K.P. Nautiyal Block", floor: "1", type: "Classroom", capacity: 100, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 35, code: "KPN-CR3", name: "CR-3", block: "K.P. Nautiyal Block", floor: "1", type: "Classroom", capacity: 100, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 36, code: "KPN-CR4", name: "CR-4", block: "K.P. Nautiyal Block", floor: "1", type: "Classroom", capacity: 100, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 37, code: "KPN-LT2", name: "LT-2", block: "K.P. Nautiyal Block", floor: "1", type: "Lecture Theatre", capacity: 100, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    // K.P. Nautiyal Block - Second Floor
    { id: 38, code: "KPN-CR5", name: "CR-5", block: "K.P. Nautiyal Block", floor: "2", type: "Classroom", capacity: 100, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 39, code: "KPN-CR6", name: "CR-6", block: "K.P. Nautiyal Block", floor: "2", type: "Classroom", capacity: 100, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 40, code: "KPN-CR7", name: "CR-7", block: "K.P. Nautiyal Block", floor: "2", type: "Classroom", capacity: 100, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" },
    { id: 41, code: "KPN-LT3", name: "LT-3", block: "K.P. Nautiyal Block", floor: "2", type: "Lecture Theatre", capacity: 100, hasAC: true, hasProjector: true, hasWifi: true, status: "free", statusDetail: "Available" }
  ];

  const grid = document.getElementById("roomGrid");
  if (!grid) return;

  const blockFilter = document.getElementById("filterBlock");
  const typeFilter = document.getElementById("filterType");
  const capacityFilter = document.getElementById("filterCapacity");
  const acFilter = document.getElementById("amenityAC");
  const projectorFilter = document.getElementById("amenityProjector");
  const wifiFilter = document.getElementById("amenityWifi");
  const resultCount = document.getElementById("resultCount");
  const countdownEl = document.getElementById("refreshCountdown");

  let filtered = rooms.slice();
  let countdown = 60;

  function renderRooms(items) {
    if (!items.length) {
      grid.innerHTML = '<p class="empty-state card">No rooms matched the selected filters.</p>';
      resultCount.textContent = "Showing 0 free rooms out of 41";
      return;
    }

    grid.innerHTML = items.map(function (room) {
      const statusBadge = room.status === "free"
        ? '<span class="badge badge-free">Free</span>'
        : room.status === "occupied"
        ? '<span class="badge badge-occupied">Occupied</span>'
        : '<span class="badge badge-booked">Booked</span>';

      const detail = room.status === "free" ? "Ready to reserve" : room.statusDetail;
      const bookBtn = room.status === "free"
        ? '<button class="btn btn-success" data-room="' + room.code + '">Book Now</button>'
        : "";

      return '' +
        '<article class="room-card ' + room.status + '">' +
          '<div class="room-title"><h3>' + room.code + ' - ' + room.name + '</h3>' + statusBadge + '</div>' +
          '<p class="room-meta">' + room.block + ' | Floor ' + room.floor + '</p>' +
          '<p class="room-meta">Capacity: ' + room.capacity + ' people</p>' +
          '<div class="amenity-row">' +
            (room.hasAC ? '<span class="amenity-pill">AC</span>' : '') +
            (room.hasProjector ? '<span class="amenity-pill">Projector</span>' : '') +
            (room.hasWifi ? '<span class="amenity-pill">WiFi</span>' : '') +
          '</div>' +
          '<p class="room-meta">' + detail + '</p>' +
          bookBtn +
        '</article>';
    }).join("");

    const freeCount = items.filter(function (room) { return room.status === "free"; }).length;
    resultCount.textContent = "Showing " + freeCount + " free rooms out of 41";
  }

  function applyFilters() {
    const selectedBlock = blockFilter.value;
    const selectedType = typeFilter.value;
    const minCapacity = Number(capacityFilter.value || 0);

    filtered = rooms.filter(function (room) {
      const blockOk = selectedBlock === "All" || room.block === selectedBlock;
      const typeOk = selectedType === "All" || room.type === selectedType;
      const capacityOk = room.capacity >= minCapacity;
      const acOk = !acFilter.checked || room.hasAC;
      const projectorOk = !projectorFilter.checked || room.hasProjector;
      const wifiOk = !wifiFilter.checked || room.hasWifi;
      return blockOk && typeOk && capacityOk && acOk && projectorOk && wifiOk;
    });

    renderRooms(filtered);
  }

  function resetFilters() {
    blockFilter.value = "All";
    typeFilter.value = "All";
    capacityFilter.value = "";
    acFilter.checked = false;
    projectorFilter.checked = false;
    wifiFilter.checked = false;
    filtered = rooms.slice();
    renderRooms(filtered);
  }

  function tickRefresh() {
    countdown -= 1;
    if (countdown < 0) {
      countdown = 60;
      randomizeStatuses();
      applyFilters();
    }
    countdownEl.textContent = "Refreshing in " + countdown + "s";
  }

  function randomizeStatuses() {
    rooms.forEach(function (room) {
      const roll = Math.random();
      if (roll < 0.2) {
        room.status = "occupied";
        room.statusDetail = "Class in progress";
      } else if (roll < 0.35) {
        room.status = "booked";
        room.statusDetail = "Booked by Faculty";
      } else {
        room.status = "free";
        room.statusDetail = "Available";
      }
    });
  }

  document.getElementById("applyFilterBtn").addEventListener("click", applyFilters);
  document.getElementById("resetFilterBtn").addEventListener("click", resetFilters);

  grid.addEventListener("click", function (event) {
    const btn = event.target.closest("button[data-room]");
    if (!btn) return;
    showToast("Redirecting to booking for " + btn.getAttribute("data-room"), "success");
    setTimeout(function () {
      window.location.href = "../booking/index.html";
    }, 650);
  });

  renderRooms(filtered);
  setInterval(tickRefresh, 1000);
})();
