/* CampusFlow Global JavaScript */

(function () {
  const path = window.location.pathname.replace(/\\/g, "/");
  const page = path.split("/").pop() || "index.html";
  const isPublicPage = ["index.html", "login.html", "register.html", ""].includes(page);
  const role = localStorage.getItem("campusflowRole");

  // Guard inner pages from anonymous access.
  if (!isPublicPage) {
    if (!role) {
      window.location.href = getLoginPath();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyRoleBadge();
    highlightActiveLink();
    attachHamburgerToggle();
    attachSidebarToggle();
    wireGlobalModalClose();
    initAuthPages();
    initDashboardPages();
    initTimetablePage();
  });

  function getLoginPath() {
    return path.includes("/dashboard/") || path.includes("/rooms/") || path.includes("/booking/") || path.includes("/timetable/") || path.includes("/equipment/") || path.includes("/lost_found/") || path.includes("/events/") || path.includes("/feedback/")
      ? "../login.html"
      : "login.html";
  }

  function applyRoleBadge() {
    const role = localStorage.getItem("campusflowRole");
    const badge = document.getElementById("roleBadge");

    if (badge && role) {
      badge.textContent = role;
    }

    // Control role-based nav visibility with data-role-visible="Student,Admin".
    const roleGuardedItems = document.querySelectorAll("[data-role-visible]");
    roleGuardedItems.forEach(function (item) {
      const allowed = (item.getAttribute("data-role-visible") || "")
        .split(",")
        .map(function (text) {
          return text.trim().toLowerCase();
        });
      if (!role || allowed.length === 0) {
        return;
      }
      if (!allowed.includes(role.toLowerCase())) {
        item.classList.add("hidden");
      }
    });

    const welcomeName = document.getElementById("welcomeName");
    if (welcomeName) {
      const storedName = localStorage.getItem("campusflowName") || "User";
      welcomeName.textContent = storedName;
    }
  }

  function highlightActiveLink() {
    const links = document.querySelectorAll(".nav-link");
    links.forEach(function (link) {
      const href = link.getAttribute("href");
      if (!href) return;
      if (path.endsWith(href) || (href === "../index.html" && page === "index.html")) {
        link.classList.add("active");
      }
    });
  }

  function attachHamburgerToggle() {
    const hamburger = document.getElementById("hamburgerBtn");
    const navLinks = document.getElementById("navLinks");
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("open");
    });
  }

  function wireGlobalModalClose() {
    document.querySelectorAll(".modal").forEach(function (modal) {
      modal.addEventListener("click", function (event) {
        if (event.target === modal) {
          closeModal(modal.id);
        }
      });
    });
  }

  function attachSidebarToggle() {
    const toggleBtn = document.getElementById("sidebarToggle");
    const sidebar = document.querySelector(".sidebar");
    if (!toggleBtn || !sidebar) return;
    toggleBtn.addEventListener("click", function () {
      sidebar.classList.toggle("show");
    });
  }

  window.logout = function () {
    localStorage.removeItem("campusflowRole");
    localStorage.removeItem("campusflowName");
    window.location.href = getLoginPath();
  };

  window.showToast = function (message, type) {
    const toastType = type || "success";
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast " + toastType;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(function () {
      toast.remove();
    }, 3000);
  };

  window.openModal = function (id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add("open");
    }
  };

  window.closeModal = function (id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove("open");
    }
  };

  window.formatDate = function (dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  function initAuthPages() {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const selectedRole = document.getElementById("role").value;

        setError("emailError", email ? "" : "Email is required.");
        setError("passwordError", password ? "" : "Password is required.");
        setError("roleError", selectedRole ? "" : "Please select a role.");
        setError("globalError", "");

        if (!email || !password || !selectedRole) {
          setError("globalError", "Please fill all required fields.");
          return;
        }

        const btn = loginForm.querySelector("button[type=submit]");
        btn.disabled = true;
        btn.textContent = "Logging in…";

        fetch("login.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, password: password, role: selectedRole })
        })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            if (data.success) {
              localStorage.setItem("campusflowRole", data.role);
              localStorage.setItem("campusflowName", data.name);
              localStorage.setItem("campusflowEmail", data.email);
              localStorage.setItem("campusflowDept", data.dept || "");

              const target = data.role === "Student"
                ? "dashboard/student.html"
                : data.role === "Faculty"
                ? "dashboard/faculty.html"
                : "dashboard/admin.html";
              window.location.href = target;
            } else {
              setError("globalError", data.message || "Login failed. Please try again.");
              btn.disabled = false;
              btn.textContent = "Login";
            }
          })
          .catch(function () {
            setError("globalError", "Could not reach the server. Is XAMPP running?");
            btn.disabled = false;
            btn.textContent = "Login";
          });
      });
    }

    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
      registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const values = {
          fullName: document.getElementById("fullName").value.trim(),
          userId: document.getElementById("userId").value.trim(),
          email: document.getElementById("email").value.trim(),
          password: document.getElementById("password").value,
          confirmPassword: document.getElementById("confirmPassword").value,
          department: document.getElementById("department").value,
          role: document.getElementById("role").value
        };

        let valid = true;
        Object.keys(values).forEach(function (key) {
          const ok = Boolean(values[key]);
          setError(key + "Error", ok ? "" : "This field is required.");
          if (!ok) valid = false;
        });

        if (values.password && values.confirmPassword && values.password !== values.confirmPassword) {
          setError("confirmPasswordError", "Passwords do not match.");
          valid = false;
        }
        if (!valid) return;

        const btn = registerForm.querySelector("button[type=submit]");
        btn.disabled = true;
        btn.textContent = "Creating account…";

        fetch("register.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName:   values.fullName,
            userId:     values.userId,
            email:      values.email,
            password:   values.password,
            department: values.department,
            role:       values.role
          })
        })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            if (data.success) {
              const successBox = document.getElementById("registerSuccess");
              successBox.classList.remove("hidden");
              successBox.textContent = "Account created! Redirecting to login…";
              setTimeout(function () { window.location.href = "login.html"; }, 2000);
            } else {
              setError("globalError", data.message || "Registration failed.");
              btn.disabled = false;
              btn.textContent = "Create Account";
            }
          })
          .catch(function () {
            setError("globalError", "Could not reach the server. Is XAMPP running?");
            btn.disabled = false;
            btn.textContent = "Create Account";
          });
      });
    }
  }

  function setError(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function initDashboardPages() {
    if (page === "admin.html") {
      renderAdminDashboard();
    }
    if (page === "student.html") {
      renderStudentDashboard();
    }
    if (page === "faculty.html") {
      renderFacultyDashboard();
    }
  }

  function renderAdminDashboard() {
    const stats = [
      { label: "Total Rooms", value: 42, className: "" },
      { label: "Free Now", value: 18, className: "free" },
      { label: "Pending Bookings", value: 7, className: "warn" },
      { label: "Equipment Requests", value: 4, className: "" },
      { label: "Open Issues", value: 12, className: "danger" },
      { label: "Events This Week", value: 3, className: "" }
    ];

    const pendingBookings = [
      { room: "CSIT-LT1", by: "Riya Patel", date: "2026-04-06", time: "09:00-10:00", purpose: "Group Study", status: "Pending" },
      { room: "CSIT-CR3", by: "Arjun Das", date: "2026-04-06", time: "11:00-12:00", purpose: "Project Meet", status: "Pending" },
      { room: "CSIT-LAB2", by: "Neha Khan", date: "2026-04-07", time: "13:00-14:00", purpose: "Practical Session", status: "Pending" },
      { room: "KPN-CR2", by: "Karan Roy", date: "2026-04-08", time: "10:00-11:00", purpose: "Seminar", status: "Pending" },
      { room: "CSIT-SH", by: "Aditi Rao", date: "2026-04-09", time: "15:00-16:00", purpose: "Club Meet", status: "Pending" }
    ];

    const issues = [
      { location: "CSIT Block - Floor 2", type: "Projector Not Working", reported: "02 Apr", status: "Pending" },
      { location: "CSIT Block - Basement", type: "Electrical Issue", reported: "01 Apr", status: "In Progress" },
      { location: "K.P. Nautiyal Block - Floor 1", type: "Broken AC", reported: "01 Apr", status: "Pending" },
      { location: "CSIT Block - Ground Floor", type: "Furniture Damage", reported: "31 Mar", status: "Resolved" },
      { location: "K.P. Nautiyal Block - Floor 2", type: "Internet Issue", reported: "31 Mar", status: "In Progress" }
    ];

    const equipmentRequests = [
      { item: "Dell Laptop", by: "Ritesh", purpose: "Hackathon", date: "06 Apr" },
      { item: "Epson Projector", by: "Faculty - CSE", purpose: "Lecture", date: "06 Apr" },
      { item: "Digital Microscope", by: "Lab Assistant", purpose: "Practical", date: "07 Apr" },
      { item: "Portable Speaker", by: "Cultural Club", purpose: "Practice", date: "07 Apr" },
      { item: "HP Laptop", by: "Aman", purpose: "Presentation", date: "08 Apr" }
    ];

    const statWrap = document.getElementById("adminStats");
    if (statWrap) {
      statWrap.innerHTML = stats.map(function (item) {
        return '<article class="stat-card ' + item.className + '"><p>' + item.label + '</p><h3>' + item.value + '</h3></article>';
      }).join("");
    }

    const bookingBody = document.getElementById("pendingBookingBody");
    if (bookingBody) {
      bookingBody.innerHTML = pendingBookings.map(function (row, index) {
        return '<tr data-row="' + index + '"><td>' + row.room + '</td><td>' + row.by + '</td><td>' + row.date + '</td><td>' + row.time + '</td><td>' + row.purpose + '</td><td><span class="badge badge-pending js-booking-status">' + row.status + '</span></td><td><button class="btn btn-success js-approve">Approve</button> <button class="btn btn-danger js-reject">Reject</button></td></tr>';
      }).join("");
      bookingBody.addEventListener("click", function (event) {
        const row = event.target.closest("tr");
        if (!row) return;
        const statusEl = row.querySelector(".js-booking-status");
        if (event.target.classList.contains("js-approve")) {
          statusEl.textContent = "Approved";
          statusEl.className = "badge badge-free js-booking-status";
          showToast("Booking approved.", "success");
        }
        if (event.target.classList.contains("js-reject")) {
          statusEl.textContent = "Rejected";
          statusEl.className = "badge badge-occupied js-booking-status";
          showToast("Booking rejected.", "error");
        }
      });
    }

    const issuesBody = document.getElementById("facilityIssueBody");
    if (issuesBody) {
      issuesBody.innerHTML = issues.map(function (row) {
        const badge = row.status === "Resolved" ? "badge-resolved" : row.status === "In Progress" ? "badge-progress" : "badge-pending";
        return '<tr><td>' + row.location + '</td><td>' + row.type + '</td><td>' + row.reported + '</td><td><span class="badge ' + badge + '">' + row.status + '</span></td><td><button class="btn btn-secondary js-update-status">Update Status</button></td></tr>';
      }).join("");
      issuesBody.addEventListener("click", function (event) {
        if (!event.target.classList.contains("js-update-status")) return;
        const badge = event.target.closest("tr").querySelector(".badge");
        if (badge.textContent === "Pending") {
          badge.textContent = "In Progress";
          badge.className = "badge badge-progress";
        } else {
          badge.textContent = "Resolved";
          badge.className = "badge badge-resolved";
        }
        showToast("Issue status updated.", "success");
      });
    }

    const eqBody = document.getElementById("equipmentRequestBody");
    if (eqBody) {
      eqBody.innerHTML = equipmentRequests.map(function (row) {
        return '<tr><td>' + row.item + '</td><td>' + row.by + '</td><td>' + row.purpose + '</td><td>' + row.date + '</td><td><button class="btn btn-success">Approve</button></td></tr>';
      }).join("");
    }
  }

  function renderStudentDashboard() {
    const actions = [
      ["Check Room Availability", "../rooms/index.html"],
      ["Book a Room", "../booking/index.html"],
      ["Request Equipment", "../equipment/index.html"],
      ["Report Issue", "../feedback/index.html"],
      ["Lost and Found", "../lost_found/index.html"],
      ["View Events", "../events/index.html"]
    ];
    const bookingRows = [
      { id: "BK-2401", room: "CSIT-CR3", date: "2026-04-05", time: "10:00-11:00", status: "Confirmed" },
      { id: "BK-2402", room: "CSIT-LT2", date: "2026-04-07", time: "14:00-15:00", status: "Pending" },
      { id: "BK-2403", room: "KPN-CR2", date: "2026-04-09", time: "12:00-13:00", status: "Confirmed" }
    ];
    const events = [
      { title: "Innovation Summit", date: "08 Apr", venue: "Main Auditorium" },
      { title: "Hack Sprint", date: "10 Apr", venue: "CSE Lab 2" },
      { title: "Cultural Eve", date: "12 Apr", venue: "Open Stage" }
    ];

    const actionWrap = document.getElementById("studentQuickActions");
    if (actionWrap) {
      actionWrap.innerHTML = actions.map(function (item) {
        return '<a href="' + item[1] + '" class="quick-action"><h4>' + item[0] + '</h4><p>Open module</p></a>';
      }).join("");
    }

    const bookingBody = document.getElementById("studentBookingBody");
    if (bookingBody) {
      bookingBody.innerHTML = bookingRows.map(function (row) {
        const badge = row.status === "Confirmed" ? "badge-free" : "badge-booked";
        return '<tr><td>' + row.id + '</td><td>' + row.room + '</td><td>' + formatDate(row.date) + '</td><td>' + row.time + '</td><td><span class="badge ' + badge + '">' + row.status + '</span></td></tr>';
      }).join("");
    }

    const eventWrap = document.getElementById("studentEventGrid");
    if (eventWrap) {
      eventWrap.innerHTML = events.map(function (event) {
        return '<article class="event-mini-card"><h3>' + event.title + '</h3><p>' + event.date + ' | ' + event.venue + '</p></article>';
      }).join("");
    }
  }

  function renderFacultyDashboard() {
    const timetable = [
      { time: "09:55-10:50", subject: "TCS-408", room: "CSIT-CR3", batch: "Sem 4 CSE-A" },
      { time: "11:10-12:05", subject: "TCS-409", room: "CSIT-LT2", batch: "Sem 4 CSE-A" },
      { time: "01:55-02:50", subject: "TCS-402", room: "CSIT-LT1", batch: "Sem 4 CSE-B" },
      { time: "03:10-04:05", subject: "TCS-403", room: "CSIT-LT5", batch: "Sem 4 CSE-A" }
    ];
    const approvals = [
      { id: "BK-2381", room: "CSIT-CR3", date: "2026-04-06", purpose: "Project Discussion", status: "Pending" },
      { id: "BK-2382", room: "CSIT-LT2", date: "2026-04-07", purpose: "Workshop", status: "Approved" },
      { id: "BK-2383", room: "KPN-CR2", date: "2026-04-08", purpose: "Seminar", status: "Pending" },
      { id: "BK-2384", room: "CSIT-LAB4", date: "2026-04-09", purpose: "Practical Demo", status: "Rejected" }
    ];
    const quickActions = [
      ["Book Room", "../booking/index.html"],
      ["View Timetable", "../timetable/index.html"],
      ["Request Equipment", "../equipment/index.html"],
      ["Report Issue", "../feedback/index.html"]
    ];

    const tbody = document.getElementById("facultyTimetableBody");
    if (tbody) {
      tbody.innerHTML = timetable.map(function (row) {
        return '<tr><td>' + row.time + '</td><td>' + row.subject + '</td><td>' + row.room + '</td><td>' + row.batch + '</td></tr>';
      }).join("");
    }

    const actionWrap = document.getElementById("facultyQuickActions");
    if (actionWrap) {
      actionWrap.innerHTML = quickActions.map(function (item) {
        return '<a href="' + item[1] + '" class="quick-action"><h4>' + item[0] + '</h4><p>Open module</p></a>';
      }).join("");
    }

    const approvalBody = document.getElementById("facultyApprovalBody");
    if (approvalBody) {
      approvalBody.innerHTML = approvals.map(function (row) {
        const badge = row.status === "Approved" ? "badge-free" : row.status === "Rejected" ? "badge-occupied" : "badge-booked";
        return '<tr><td>' + row.id + '</td><td>' + row.room + '</td><td>' + formatDate(row.date) + '</td><td>' + row.purpose + '</td><td><span class="badge ' + badge + '">' + row.status + '</span></td></tr>';
      }).join("");
    }
  }

  function initTimetablePage() {
    const tbody = document.getElementById("timetableBody");
    if (!tbody) return;

    const blockSelect = document.getElementById("ttBlock");
    const departmentSelect = document.getElementById("ttDepartment");
    const uploadBtn = document.getElementById("uploadTimetableBtn");

    const slots = [
      "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-01:00",
      "01:00-02:00", "02:00-03:00", "03:00-04:00", "04:00-05:00"
    ];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const timetableEntries = [
      // Section A
      { day: "Tuesday", time: "08:00-09:00", subject: "Microprocessors Lab", room: "CSIT-LAB1", section: "A", dept: "CSE" },
      { day: "Tuesday", time: "10:00-11:00", subject: "TCS-409", room: "CSIT-LT2", section: "A", dept: "CSE" },
      { day: "Tuesday", time: "11:00-12:00", subject: "TCS-408", room: "CSIT-CR3", section: "A", dept: "CSE" },
      { day: "Tuesday", time: "02:00-03:00", subject: "TCS-402", room: "CSIT-LT1", section: "A", dept: "CSE" },
      { day: "Wednesday", time: "08:00-09:00", subject: "TCS-465", room: "CSIT-LT1", section: "A", dept: "CSE" },
      { day: "Wednesday", time: "11:00-12:00", subject: "TCS-408", room: "CSIT-CR3", section: "A", dept: "CSE" },
      { day: "Wednesday", time: "02:00-03:00", subject: "TCS-402", room: "CSIT-LT1", section: "A", dept: "CSE" },
      { day: "Thursday", time: "08:00-09:00", subject: "PCS-409 Lab", room: "CSIT-LAB2", section: "A", dept: "CSE" },
      { day: "Thursday", time: "10:00-11:00", subject: "TCS-409", room: "CSIT-LT2", section: "A", dept: "CSE" },
      { day: "Thursday", time: "11:00-12:00", subject: "TCS-408", room: "CSIT-CR3", section: "A", dept: "CSE" },
      { day: "Thursday", time: "02:00-03:00", subject: "TCS-402", room: "CSIT-LT1", section: "A", dept: "CSE" },
      { day: "Friday", time: "08:00-09:00", subject: "PCS-409 Lab Digital", room: "CSIT-LAB1", section: "A", dept: "CSE" },
      { day: "Friday", time: "11:00-12:00", subject: "TCS-408", room: "CSIT-CR3", section: "A", dept: "CSE" },
      { day: "Friday", time: "02:00-03:00", subject: "TCS-402", room: "CSIT-LT1", section: "A", dept: "CSE" },
      { day: "Saturday", time: "08:00-09:00", subject: "Career Skills QAR", room: "CSIT-LT6", section: "A", dept: "CSE" },
      { day: "Saturday", time: "09:00-10:00", subject: "TCS-403", room: "CSIT-LT5", section: "A", dept: "CSE" },
      { day: "Saturday", time: "10:00-11:00", subject: "Microprocessors Lab", room: "CSIT-LAB1", section: "A", dept: "CSE" },
      { day: "Saturday", time: "12:00-01:00", subject: "TCS-421", room: "CSIT-LT2", section: "A", dept: "CSE" },
      // Section B
      { day: "Monday", time: "10:00-11:00", subject: "TCS-408", room: "CSIT-LT1", section: "B", dept: "CSE" },
      { day: "Monday", time: "11:00-12:00", subject: "Career Skills Verbal", room: "CSIT-LT1", section: "B", dept: "CSE" },
      { day: "Monday", time: "12:00-01:00", subject: "TCS-402", room: "CSIT-LT1", section: "B", dept: "CSE" },
      { day: "Monday", time: "02:00-03:00", subject: "Career Skills Soft Skills", room: "CSIT-LT1", section: "B", dept: "CSE" },
      { day: "Monday", time: "03:00-04:00", subject: "Career Skills QAR", room: "CSIT-LT1", section: "B", dept: "CSE" },
      { day: "Tuesday", time: "09:00-10:00", subject: "TCS-402", room: "CSIT-LT7", section: "B", dept: "CSE" },
      { day: "Tuesday", time: "11:00-12:00", subject: "TCS-403", room: "CSIT-LT1", section: "B", dept: "CSE" },
      { day: "Tuesday", time: "02:00-03:00", subject: "TCS-409", room: "CSIT-LT1", section: "B", dept: "CSE" },
      { day: "Tuesday", time: "03:00-04:00", subject: "Microprocessors Lab", room: "CSIT-LAB1", section: "B", dept: "CSE" },
      { day: "Wednesday", time: "08:00-09:00", subject: "TOC-401", room: "CSIT-LT7", section: "B", dept: "CSE" },
      { day: "Wednesday", time: "10:00-11:00", subject: "TCS-408", room: "CSIT-LT1", section: "B", dept: "CSE" },
      { day: "Wednesday", time: "11:00-12:00", subject: "TCS-402", room: "CSIT-LT1", section: "B", dept: "CSE" },
      { day: "Wednesday", time: "11:00-12:00", subject: "TCS-403", room: "CSIT-LT2", section: "B", dept: "CSE" },
      { day: "Wednesday", time: "03:00-04:00", subject: "PCS-409 Lab", room: "CSIT-LAB1", section: "B", dept: "CSE" },
      { day: "Thursday", time: "09:00-10:00", subject: "TCS-433", room: "CSIT-LT1", section: "B", dept: "CSE" },
      { day: "Thursday", time: "10:00-11:00", subject: "TCS-408", room: "CSIT-LT1", section: "B", dept: "CSE" },
      { day: "Thursday", time: "11:00-12:00", subject: "TCS-402", room: "CSIT-LT1", section: "B", dept: "CSE" },
      { day: "Thursday", time: "02:00-03:00", subject: "TCS-409", room: "CSIT-LT1", section: "B", dept: "CSE" },
      { day: "Thursday", time: "03:00-04:00", subject: "Microprocessors Lab", room: "CSIT-LAB1", section: "B", dept: "CSE" },
      { day: "Friday", time: "08:00-09:00", subject: "TCS-465", room: "CSIT-LT1", section: "B", dept: "CSE" },
      { day: "Friday", time: "10:00-11:00", subject: "TCS-408", room: "CSIT-LT1", section: "B", dept: "CSE" },
      { day: "Friday", time: "11:00-12:00", subject: "TCS-409", room: "CSIT-LT1", section: "B", dept: "CSE" },
      { day: "Saturday", time: "08:00-09:00", subject: "Project Based Learning", room: "CSIT-LT1", section: "B", dept: "CSE" },
      { day: "Saturday", time: "09:00-10:00", subject: "TOC-401", room: "CSIT-LT7", section: "B", dept: "CSE" },
      { day: "Saturday", time: "10:00-11:00", subject: "TCS-403", room: "CSIT-LT1", section: "B", dept: "CSE" },
      { day: "Saturday", time: "11:00-12:00", subject: "TCS-403", room: "CSIT-LT1", section: "B", dept: "CSE" },
      { day: "Saturday", time: "02:00-03:00", subject: "PCS-409 Lab", room: "CSIT-LAB1", section: "B", dept: "CSE" },
      { day: "Saturday", time: "03:00-04:00", subject: "TCS-409", room: "CSIT-LT1", section: "B", dept: "CSE" },
      // Section C
      { day: "Monday", time: "08:00-09:00", subject: "Career Skills Verbal", room: "CSIT-LT8", section: "C", dept: "CSE" },
      { day: "Monday", time: "09:00-10:00", subject: "Career Skills Soft Skills", room: "CSIT-LT8", section: "C", dept: "CSE" },
      { day: "Monday", time: "10:00-11:00", subject: "TCS-402", room: "CSIT-LT2", section: "C", dept: "CSE" },
      { day: "Monday", time: "11:00-12:00", subject: "TCS-464", room: "CSIT-LT2", section: "C", dept: "CSE" },
      { day: "Monday", time: "12:00-01:00", subject: "Career Skills QAR", room: "CSIT-LT2", section: "C", dept: "CSE" },
      { day: "Monday", time: "03:00-04:00", subject: "LIB", room: "CSIT-CR3", section: "C", dept: "CSE" },
      { day: "Tuesday", time: "08:00-09:00", subject: "PCS-409 Lab", room: "CSIT-LAB1", section: "C", dept: "CSE" },
      { day: "Tuesday", time: "11:00-12:00", subject: "TCS-465", room: "CSIT-CR3", section: "C", dept: "CSE" },
      { day: "Tuesday", time: "02:00-03:00", subject: "TOC-401", room: "CSIT-LT1", section: "C", dept: "CSE" },
      { day: "Tuesday", time: "03:00-04:00", subject: "TCS-403", room: "CSIT-LT2", section: "C", dept: "CSE" },
      { day: "Wednesday", time: "08:00-09:00", subject: "TCS-464", room: "CSIT-LT8", section: "C", dept: "CSE" },
      { day: "Wednesday", time: "09:00-10:00", subject: "TCS-403", room: "CSIT-CR7", section: "C", dept: "CSE" },
      { day: "Wednesday", time: "12:00-01:00", subject: "TCS-403", room: "CSIT-CR3", section: "C", dept: "CSE" },
      { day: "Wednesday", time: "02:00-03:00", subject: "Project Based Learning", room: "CSIT-LT2", section: "C", dept: "CSE" },
      { day: "Wednesday", time: "03:00-04:00", subject: "Microprocessors Lab", room: "CSIT-LAB1", section: "C", dept: "CSE" },
      { day: "Thursday", time: "08:00-09:00", subject: "TCS-403", room: "CSIT-CR7", section: "C", dept: "CSE" },
      { day: "Thursday", time: "09:00-10:00", subject: "TCS-464", room: "CSIT-LT8", section: "C", dept: "CSE" },
      { day: "Thursday", time: "02:00-03:00", subject: "SWAYAM/LIB", room: "CSIT-LT2", section: "C", dept: "CSE" },
      { day: "Friday", time: "08:00-09:00", subject: "TOC-401", room: "CSIT-LT1", section: "C", dept: "CSE" },
      { day: "Friday", time: "09:00-10:00", subject: "TCS-465", room: "CSIT-LT1", section: "C", dept: "CSE" },
      { day: "Friday", time: "11:00-12:00", subject: "TCS-464", room: "CSIT-LT5", section: "C", dept: "CSE" },
      { day: "Friday", time: "02:00-03:00", subject: "TCS-402", room: "CSIT-LT9", section: "C", dept: "CSE" },
      { day: "Friday", time: "03:00-04:00", subject: "SWAYAM/LIB", room: "CSIT-LT2", section: "C", dept: "CSE" },
      { day: "Saturday", time: "08:00-09:00", subject: "PCS-409 Lab", room: "CSIT-LAB1", section: "C", dept: "CSE" },
      { day: "Saturday", time: "10:00-11:00", subject: "TCS-433", room: "CSIT-CR3", section: "C", dept: "CSE" },
      { day: "Saturday", time: "11:00-12:00", subject: "TCS-403", room: "CSIT-LT2", section: "C", dept: "CSE" },
      { day: "Saturday", time: "02:00-03:00", subject: "Microprocessors Lab", room: "CSIT-LAB1", section: "C", dept: "CSE" },
      { day: "Saturday", time: "03:00-04:00", subject: "Project Based Learning", room: "CSIT-CR3", section: "C", dept: "CSE" },
      // CR-3 timetable
      { day: "Monday", time: "08:00-09:00", subject: "TCS-408", room: "CSIT-CR6", section: "D", dept: "CSE" },
      { day: "Monday", time: "09:00-10:00", subject: "TCS-409", room: "CSIT-CR6", section: "D", dept: "CSE" },
      { day: "Monday", time: "10:00-11:00", subject: "Microprocessors Lab", room: "CSIT-LAB1", section: "D", dept: "CSE" },
      { day: "Monday", time: "11:00-12:00", subject: "TCS-402", room: "CSIT-LT7", section: "D", dept: "CSE" },
      { day: "Monday", time: "02:00-03:00", subject: "LIB", room: "CSIT-CR3", section: "D", dept: "CSE" },
      { day: "Monday", time: "03:00-04:00", subject: "Microprocessors Lab", room: "CSIT-LAB1", section: "D", dept: "CSE" },
      { day: "Tuesday", time: "08:00-09:00", subject: "TCS-408", room: "CSIT-CR3", section: "D", dept: "CSE" },
      { day: "Tuesday", time: "09:00-10:00", subject: "TCS-409", room: "CSIT-CR3", section: "D", dept: "CSE" },
      { day: "Tuesday", time: "11:00-12:00", subject: "TCS-403", room: "CSIT-CR3", section: "D", dept: "CSE" },
      { day: "Tuesday", time: "03:00-04:00", subject: "TOC-401", room: "CSIT-LT1", section: "D", dept: "CSE" },
      { day: "Wednesday", time: "08:00-09:00", subject: "Career Skills QAR", room: "CSIT-CR3", section: "D", dept: "CSE" },
      { day: "Wednesday", time: "09:00-10:00", subject: "Career Skills Verbal", room: "CSIT-CR3", section: "D", dept: "CSE" },
      { day: "Wednesday", time: "02:00-03:00", subject: "TCS-403", room: "CSIT-CR3", section: "D", dept: "CSE" },
      { day: "Wednesday", time: "03:00-04:00", subject: "TCS-408", room: "CSIT-CR9", section: "D", dept: "CSE" },
      { day: "Thursday", time: "08:00-09:00", subject: "LIB", room: "CSIT-CR3", section: "D", dept: "CSE" },
      { day: "Thursday", time: "09:00-10:00", subject: "TCS-402", room: "CSIT-LT8", section: "D", dept: "CSE" },
      { day: "Thursday", time: "10:00-11:00", subject: "Career Skills Soft Skills", room: "CSIT-CR3", section: "D", dept: "CSE" },
      { day: "Thursday", time: "11:00-12:00", subject: "TCS-402", room: "CSIT-LT2", section: "D", dept: "CSE" },
      { day: "Thursday", time: "02:00-03:00", subject: "TCS-403", room: "CSIT-CR8", section: "D", dept: "CSE" },
      { day: "Thursday", time: "03:00-04:00", subject: "TCS-409", room: "CSIT-LT2", section: "D", dept: "CSE" },
      { day: "Thursday", time: "04:00-05:00", subject: "TOC-401", room: "CSIT-CR2", section: "D", dept: "CSE" },
      { day: "Friday", time: "08:00-09:00", subject: "TCS-408", room: "CSIT-CR3", section: "D", dept: "CSE" },
      { day: "Friday", time: "09:00-10:00", subject: "TCS-403", room: "CSIT-CR3", section: "D", dept: "CSE" },
      { day: "Friday", time: "10:00-11:00", subject: "TCS-409", room: "CSIT-LT5", section: "D", dept: "CSE" },
      { day: "Friday", time: "11:00-12:00", subject: "TCS-465", room: "CSIT-CR3", section: "D", dept: "CSE" },
      { day: "Friday", time: "02:00-03:00", subject: "TCS-402", room: "CSIT-LT5", section: "D", dept: "CSE" },
      { day: "Friday", time: "03:00-04:00", subject: "PCS-409 Lab", room: "CSIT-LAB7", section: "D", dept: "CSE" }
    ];

    function deptClass(dept) {
      if (dept === "CSE") return "tt-cse";
      if (dept === "Mechanical") return "tt-mech";
      if (dept === "Management") return "tt-mgmt";
      return "tt-empty";
    }

    function render() {
      const selectedDept = departmentSelect.value;
      const filtered = timetableEntries.filter(function (row) {
        return row.dept === selectedDept;
      });

      tbody.innerHTML = slots.map(function (slot) {
        const cells = days.map(function (day) {
          const entry = filtered.find(function (row) {
            return row.day === day && row.time === slot;
          });
          if (!entry) {
            return '<td><div class="tt-cell tt-empty">+</div></td>';
          }
          return '<td><div class="tt-cell ' + deptClass(entry.dept) + '"><strong>' + entry.subject + '</strong><br />' + entry.room + '<br />' + entry.section + '</div></td>';
        }).join("");
        return '<tr><td>' + slot + '</td>' + cells + '</tr>';
      }).join("");
    }

    blockSelect.addEventListener("change", render);
    departmentSelect.addEventListener("change", render);
    if (uploadBtn) {
      uploadBtn.addEventListener("click", function () {
        showToast("CSV uploaded successfully (simulation).", "success");
      });
    }

    render();
  }
})();
