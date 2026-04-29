/* CampusFlow Booking Module */

(function () {
  const bookingPage = document.getElementById("bookingPage");
  const myBookingsPage = document.getElementById("myBookingsPage");

  const roomData = [
    // CSIT Block
    { code: "CSIT-CR1", block: "CSIT Block", type: "Classroom", capacity: 100 },
    { code: "CSIT-CR3", block: "CSIT Block", type: "Classroom", capacity: 100 },
    { code: "CSIT-CR6", block: "CSIT Block", type: "Classroom", capacity: 100 },
    { code: "CSIT-LT1", block: "CSIT Block", type: "Lecture Theatre", capacity: 300 },
    { code: "CSIT-LT4", block: "CSIT Block", type: "Lecture Theatre", capacity: 300 },
    { code: "CSIT-LT8", block: "CSIT Block", type: "Lecture Theatre", capacity: 300 },
    { code: "CSIT-LAB2", block: "CSIT Block", type: "Lab", capacity: 100 },
    { code: "CSIT-LAB5", block: "CSIT Block", type: "Lab", capacity: 50 },
    { code: "CSIT-LAB6", block: "CSIT Block", type: "Lab", capacity: 65 },
    { code: "CSIT-SH", block: "CSIT Block", type: "Seminar Hall", capacity: 200 },
    // K.P. Nautiyal Block
    { code: "KPN-CR1", block: "K.P. Nautiyal Block", type: "Classroom", capacity: 100 },
    { code: "KPN-CR3", block: "K.P. Nautiyal Block", type: "Classroom", capacity: 100 },
    { code: "KPN-CR5", block: "K.P. Nautiyal Block", type: "Classroom", capacity: 100 },
    { code: "KPN-LT1", block: "K.P. Nautiyal Block", type: "Lecture Theatre", capacity: 100 },
    { code: "KPN-LT2", block: "K.P. Nautiyal Block", type: "Lecture Theatre", capacity: 100 }
  ];

  if (bookingPage) {
    initBookingWizard();
  }
  if (myBookingsPage) {
    initMyBookings();
  }

  function initBookingWizard() {
    let currentStep = 1;
    let selectedRoom = null;

    const state = {
      block: "All",
      type: "All",
      date: "",
      startTime: "",
      endTime: "",
      purpose: "",
      recurringMode: "one-time",
      recurringEndDate: ""
    };

    const progressFill = document.getElementById("progressFill");
    const steps = document.querySelectorAll(".booking-step");
    const roomGrid = document.getElementById("availableRoomsGrid");
    const recurringToggle = document.getElementById("recurringMode");
    const recurringFields = document.getElementById("recurringFields");
    const recurringPreview = document.getElementById("recurringPreview");
    const conflictResult = document.getElementById("conflictResult");

    populateTimeOptions();
    renderRoomSelection();

    function goToStep(step) {
      currentStep = step;
      steps.forEach(function (panel) {
        panel.classList.toggle("active", Number(panel.dataset.step) === step);
      });
      progressFill.style.width = (step * 33.33) + "%";
      if (step === 3) {
        renderSummary();
      }
    }

    function populateTimeOptions() {
      const startSelect = document.getElementById("startTime");
      const endSelect = document.getElementById("endTime");
      const options = [];
      for (let hour = 8; hour <= 20; hour++) {
        options.push(formatTime(hour, 0));
        if (hour !== 20) options.push(formatTime(hour, 30));
      }
      options.forEach(function (time) {
        const startOption = document.createElement("option");
        startOption.value = time;
        startOption.textContent = time;
        const endOption = document.createElement("option");
        endOption.value = time;
        endOption.textContent = time;
        startSelect.appendChild(startOption);
        endSelect.appendChild(endOption);
      });
    }

    function formatTime(hour24, minute) {
      const suffix = hour24 >= 12 ? "PM" : "AM";
      const hour12 = hour24 % 12 || 12;
      return String(hour12).padStart(2, "0") + ":" + String(minute).padStart(2, "0") + " " + suffix;
    }

    function renderRoomSelection() {
      const selectedBlock = document.getElementById("bookBlock").value;
      const selectedType = document.getElementById("bookType").value;
      const availableRooms = roomData.filter(function (room) {
        const blockOk = selectedBlock === "All" || room.block === selectedBlock;
        const typeOk = selectedType === "All" || room.type === selectedType;
        return blockOk && typeOk;
      });

      roomGrid.innerHTML = availableRooms.map(function (room) {
        return '<article class="select-room-card"><h4>' + room.code + '</h4><p>' + room.block + ' | ' + room.type + '</p><p>Capacity: ' + room.capacity + '</p><button class="btn btn-primary" data-select-room="' + room.code + '">Select</button></article>';
      }).join("");

      if (!availableRooms.length) {
        roomGrid.innerHTML = '<p class="empty-state">No available rooms for selected filter.</p>';
      }
    }

    function renderSummary() {
      const summary = document.getElementById("bookingSummary");
      summary.innerHTML = '' +
        '<div class="summary-item"><span>Room</span><strong>' + (selectedRoom || "-") + '</strong></div>' +
        '<div class="summary-item"><span>Date</span><strong>' + (state.date || "-") + '</strong></div>' +
        '<div class="summary-item"><span>Time</span><strong>' + (state.startTime || "-") + ' - ' + (state.endTime || "-") + '</strong></div>' +
        '<div class="summary-item"><span>Purpose</span><strong>' + (state.purpose || "-") + '</strong></div>' +
        '<div class="summary-item"><span>Recurring</span><strong>' + state.recurringMode + '</strong></div>';
    }

    document.getElementById("bookBlock").addEventListener("change", renderRoomSelection);
    document.getElementById("bookType").addEventListener("change", renderRoomSelection);

    roomGrid.addEventListener("click", function (event) {
      const button = event.target.closest("button[data-select-room]");
      if (!button) return;
      selectedRoom = button.getAttribute("data-select-room");
      showToast(selectedRoom + " selected", "success");
    });

    document.getElementById("toStep2").addEventListener("click", function () {
      if (!selectedRoom) {
        showToast("Please select a room first.", "error");
        return;
      }
      goToStep(2);
    });

    document.getElementById("toStep1").addEventListener("click", function () {
      goToStep(1);
    });

    document.getElementById("toStep3").addEventListener("click", function () {
      state.date = document.getElementById("bookDate").value;
      state.startTime = document.getElementById("startTime").value;
      state.endTime = document.getElementById("endTime").value;
      state.purpose = document.getElementById("purpose").value.trim();
      state.recurringMode = recurringToggle.value;
      state.recurringEndDate = document.getElementById("recurringEndDate").value;

      if (!state.date || !state.startTime || !state.endTime || !state.purpose) {
        showToast("Fill all step 2 fields.", "error");
        return;
      }
      goToStep(3);
    });

    recurringToggle.addEventListener("change", function () {
      const recurring = recurringToggle.value === "weekly";
      recurringFields.classList.toggle("hidden", !recurring);
      if (!recurring) {
        recurringPreview.textContent = "No recurring dates for one-time booking.";
      } else {
        renderRecurringPreview();
      }
    });

    document.getElementById("recurringEndDate").addEventListener("change", renderRecurringPreview);
    document.getElementById("bookDate").addEventListener("change", renderRecurringPreview);

    function renderRecurringPreview() {
      if (recurringToggle.value !== "weekly") return;
      const start = document.getElementById("bookDate").value;
      const end = document.getElementById("recurringEndDate").value;
      if (!start || !end) {
        recurringPreview.textContent = "Select start and end date to preview recurring bookings.";
        return;
      }
      const startDate = new Date(start);
      const endDate = new Date(end);
      const dates = [];
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 7)) {
        dates.push(d.toISOString().split("T")[0]);
      }
      recurringPreview.textContent = "Weekly booking dates: " + dates.join(", ");
    }

    document.getElementById("checkConflictBtn").addEventListener("click", function () {
      const date = new Date(state.date);
      const day = date.toLocaleDateString("en-US", { weekday: "long" });
      if (selectedRoom === "CSE-101" && day === "Monday" && state.startTime === "09:00 AM" && state.endTime === "10:00 AM") {
        conflictResult.innerHTML = '<span class="badge badge-occupied">Conflict</span> Regular DBMS class - Sem 5 CSE-A';
      } else {
        conflictResult.innerHTML = '<span class="badge badge-free">Available</span> Slot is available for booking';
      }
    });

    document.getElementById("confirmBookingBtn").addEventListener("click", function () {
      const bookingId = "BK-" + Math.floor(1000 + Math.random() * 9000);
      const bookingRecord = {
        id: bookingId,
        room: selectedRoom,
        date: state.date,
        time: state.startTime + " - " + state.endTime,
        purpose: state.purpose,
        status: "Pending"
      };
      const existing = JSON.parse(localStorage.getItem("campusflowBookings") || "[]");
      existing.push(bookingRecord);
      localStorage.setItem("campusflowBookings", JSON.stringify(existing));
      document.getElementById("successBookingId").textContent = bookingId;
      openModal("bookingSuccessModal");
    });

    document.getElementById("closeSuccessModalBtn").addEventListener("click", function () {
      closeModal("bookingSuccessModal");
      window.location.href = "my_bookings.html";
    });
  }

  function initMyBookings() {
    const upcomingTab = document.getElementById("tabUpcoming");
    const pastTab = document.getElementById("tabPast");
    const tbody = document.getElementById("myBookingBody");

    const staticBookings = [
      { id: "BK-2201", room: "CSE-102", date: "2026-04-07", time: "10:00-11:00", purpose: "Project meet", status: "Pending" },
      { id: "BK-2202", room: "COM-201", date: "2026-04-08", time: "12:00-13:00", purpose: "Seminar prep", status: "Confirmed" },
      { id: "BK-2203", room: "MGT-301", date: "2026-04-09", time: "14:00-15:00", purpose: "Case discussion", status: "Confirmed" },
      { id: "BK-2101", room: "ME-205", date: "2026-03-15", time: "09:00-10:00", purpose: "Workshop", status: "Cancelled" },
      { id: "BK-2102", room: "CIV-202", date: "2026-03-12", time: "11:00-12:00", purpose: "Model review", status: "Confirmed" },
      { id: "BK-2103", room: "COM-101", date: "2026-03-10", time: "15:00-16:00", purpose: "Club presentation", status: "Cancelled" }
    ];

    const fromStorage = JSON.parse(localStorage.getItem("campusflowBookings") || "[]");
    const allBookings = fromStorage.concat(staticBookings);
    let activeTab = "upcoming";

    function renderTable() {
      const now = new Date("2026-04-03");
      const filtered = allBookings.filter(function (booking) {
        const bookingDate = new Date(booking.date);
        return activeTab === "upcoming" ? bookingDate >= now : bookingDate < now;
      });

      if (!filtered.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No ' + activeTab + ' bookings found.</td></tr>';
        return;
      }

      tbody.innerHTML = filtered.map(function (booking) {
        const badge = booking.status === "Confirmed"
          ? "badge-free"
          : booking.status === "Cancelled"
          ? "badge-occupied"
          : "badge-booked";

        const actionCell = activeTab === "upcoming" && booking.status !== "Cancelled"
          ? '<button class="btn btn-danger" data-cancel-booking="' + booking.id + '">Cancel</button>'
          : "-";

        return '<tr><td>' + booking.id + '</td><td>' + booking.room + '</td><td>' + booking.date + '</td><td>' + booking.time + '</td><td>' + booking.purpose + '</td><td><span class="badge ' + badge + '">' + booking.status + '</span></td><td>' + actionCell + '</td></tr>';
      }).join("");
    }

    upcomingTab.addEventListener("click", function () {
      activeTab = "upcoming";
      upcomingTab.classList.add("active");
      pastTab.classList.remove("active");
      renderTable();
    });

    pastTab.addEventListener("click", function () {
      activeTab = "past";
      pastTab.classList.add("active");
      upcomingTab.classList.remove("active");
      renderTable();
    });

    tbody.addEventListener("click", function (event) {
      const btn = event.target.closest("button[data-cancel-booking]");
      if (!btn) return;
      const bookingId = btn.getAttribute("data-cancel-booking");
      document.getElementById("cancelBookingId").textContent = bookingId;
      document.getElementById("confirmCancelBtn").dataset.cancelId = bookingId;
      openModal("cancelBookingModal");
    });

    document.getElementById("confirmCancelBtn").addEventListener("click", function () {
      const id = this.dataset.cancelId;
      const booking = allBookings.find(function (row) { return row.id === id; });
      if (booking) booking.status = "Cancelled";
      closeModal("cancelBookingModal");
      showToast("Booking cancelled.", "warning");
      renderTable();
    });

    renderTable();
  }
})();
