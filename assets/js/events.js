/* CampusFlow Events Module */

(function () {
  const page = document.getElementById("eventsPage");
  if (!page) return;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const events = [
    { id: 1, title: "Campus Music Fest", organizer: "Cultural Club", venue: "Open Stage", date: new Date(year, month, 4), time: "05:00 PM", category: "Cultural", attendees: 180, rsvped: false },
    { id: 2, title: "AI Hackathon", organizer: "CSE Department", venue: "CSE Lab", date: new Date(year, month, 7), time: "10:00 AM", category: "Technical", attendees: 220, rsvped: false },
    { id: 3, title: "Inter-Dept Football", organizer: "Sports Council", venue: "Ground A", date: new Date(year, month, 10), time: "04:00 PM", category: "Sports", attendees: 140, rsvped: false },
    { id: 4, title: "Startup Seminar", organizer: "Management Dept", venue: "MGT-301", date: new Date(year, month, 12), time: "11:00 AM", category: "Seminar", attendees: 95, rsvped: false },
    { id: 5, title: "IoT Workshop", organizer: "ECE Society", venue: "Innovation Lab", date: new Date(year, month, 15), time: "02:00 PM", category: "Workshop", attendees: 110, rsvped: false },
    { id: 6, title: "Debate League", organizer: "Literary Club", venue: "COM-201", date: new Date(year, month, 19), time: "01:00 PM", category: "Cultural", attendees: 70, rsvped: false },
    { id: 7, title: "Cloud Bootcamp", organizer: "IT Cell", venue: "CSE-301", date: new Date(year, month, 22), time: "09:30 AM", category: "Technical", attendees: 130, rsvped: false },
    { id: 8, title: "Research Colloquium", organizer: "R&D Cell", venue: "Auditorium", date: new Date(year, month, 26), time: "03:00 PM", category: "Seminar", attendees: 85, rsvped: false }
  ];

  let viewMode = "calendar";
  let categoryFilter = "All";
  let selectedDayEvents = [];

  const monthTitle = document.getElementById("calendarMonthTitle");
  const calendarGrid = document.getElementById("calendarGrid");
  const dayEventsPanel = document.getElementById("dayEventsPanel");
  const listWrap = document.getElementById("eventsListWrap");

  function sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  }

  function filterEvents() {
    return events.filter(function (event) {
      return categoryFilter === "All" || event.category === categoryFilter;
    });
  }

  function renderCalendar() {
    const filtered = filterEvents();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const totalDays = last.getDate();

    monthTitle.textContent = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    calendarGrid.innerHTML = "";

    for (let i = 0; i < first.getDay(); i++) {
      const empty = document.createElement("div");
      empty.className = "card";
      empty.style.opacity = "0.3";
      calendarGrid.appendChild(empty);
    }

    for (let day = 1; day <= totalDays; day++) {
      const dateObj = new Date(year, month, day);
      const dayEvents = filtered.filter(function (event) { return sameDay(event.date, dateObj); });
      const cell = document.createElement("button");
      cell.className = "card";
      cell.classList.add("text-left");
      cell.innerHTML = '<strong>' + day + '</strong><div class="event-dot-row">' + dayEvents.map(function () {
        return '<span class="event-dot"></span>';
      }).join("") + '</div>';
      cell.addEventListener("click", function () {
        selectedDayEvents = dayEvents;
        renderDayEvents(day, dateObj);
      });
      calendarGrid.appendChild(cell);
    }
  }

  function renderDayEvents(day, dateObj) {
    if (!selectedDayEvents.length) {
      dayEventsPanel.innerHTML = '<h3>Events on ' + day + '</h3><p>No events scheduled.</p>';
      return;
    }
    dayEventsPanel.innerHTML = '<h3>Events on ' + dateObj.toDateString() + '</h3>' + selectedDayEvents.map(function (event) {
      return '<article class="card mt-3"><h4>' + event.title + '</h4><p>' + event.time + ' | ' + event.venue + '</p><span class="badge badge-booked">' + event.category + '</span></article>';
    }).join("");
  }

  function renderList() {
    const filtered = filterEvents();
    if (!filtered.length) {
      listWrap.innerHTML = '<p class="empty-state card">No events in this category.</p>';
      return;
    }

    listWrap.innerHTML = filtered.map(function (event) {
      return '' +
      '<article class="card">' +
        '<div class="event-poster-placeholder"></div>' +
        '<h3 class="card-title">' + event.title + '</h3>' +
        '<p>' + event.organizer + ' | ' + event.venue + '</p>' +
        '<p>' + event.date.toDateString() + ' | ' + event.time + '</p>' +
        '<span class="badge badge-booked">' + event.category + '</span>' +
        '<div class="mt-3"><button class="btn btn-primary" data-rsvp-id="' + event.id + '">' + (event.rsvped ? "RSVP Done" : "RSVP") + '</button> <span>' + event.attendees + ' attendees</span></div>' +
      '</article>';
    }).join("");
  }

  document.getElementById("toggleCalendar").addEventListener("click", function () {
    viewMode = "calendar";
    document.getElementById("calendarView").classList.remove("hidden");
    document.getElementById("listView").classList.add("hidden");
    this.classList.add("active");
    document.getElementById("toggleList").classList.remove("active");
  });

  document.getElementById("toggleList").addEventListener("click", function () {
    viewMode = "list";
    document.getElementById("calendarView").classList.add("hidden");
    document.getElementById("listView").classList.remove("hidden");
    this.classList.add("active");
    document.getElementById("toggleCalendar").classList.remove("active");
    renderList();
  });

  document.getElementById("eventCategoryFilter").addEventListener("change", function () {
    categoryFilter = this.value;
    renderCalendar();
    renderList();
  });

  listWrap.addEventListener("click", function (event) {
    const btn = event.target.closest("button[data-rsvp-id]");
    if (!btn) return;
    const id = Number(btn.dataset.rsvpId);
    const target = events.find(function (item) { return item.id === id; });
    if (!target) return;
    target.rsvped = !target.rsvped;
    target.attendees += target.rsvped ? 1 : -1;
    renderList();
  });

  document.getElementById("postEventBtn").addEventListener("click", function () {
    openModal("postEventModal");
  });

  document.getElementById("postEventForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const title = document.getElementById("eventTitle").value.trim();
    const description = document.getElementById("eventDescription").value.trim();
    const category = document.getElementById("eventCategory").value;
    const venue = document.getElementById("eventVenue").value.trim();
    const date = document.getElementById("eventDate").value;
    const time = document.getElementById("eventTime").value;
    const expected = Number(document.getElementById("expectedAttendees").value);

    if (!title || !description || !category || !venue || !date || !time || !expected) {
      showToast("Please fill all event fields.", "error");
      return;
    }

    events.push({
      id: Date.now(),
      title: title,
      organizer: "You",
      venue: venue,
      date: new Date(date),
      time: time,
      category: category,
      attendees: expected,
      rsvped: false
    });

    closeModal("postEventModal");
    showToast("Event posted successfully.", "success");
    this.reset();
    renderCalendar();
    renderList();
  });

  renderCalendar();
  renderList();
})();
