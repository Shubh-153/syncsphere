/* ==========================================================================
   SyncSphere Interactive Application Engine
   Handles: Navigation, Persona Switching, Micro-Task Claiming & 24h Timers,
   Zero-Penalty Safety Valve, Proof Submission, Lead 1-Tap Approval,
   Burnout Heatmap & 1-Tap Rebalance, Buddy Chat, Credits/Badges & Club Vault
   ========================================================================== */

(function () {
  const STORAGE_KEY = "syncsphere_state_v1";

  function cloneInitialData() {
    return JSON.parse(JSON.stringify(window.SYNCSPHERE_INITIAL_DATA));
  }

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore storage errors in private mode
    }
    return cloneInitialData();
  }

  let state = loadState();
  let currentView = "landing";
  let mktCategory = "All";
  let mktTimeCap = "all";
  let mktSearch = "";

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // Ignore quota errors
    }
  }

  /* -------------------- TOAST NOTIFICATIONS -------------------- */
  function showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
      toast.style.transition = "all 0.25s ease";
      setTimeout(() => toast.remove(), 260);
    }, 3400);
  }

  /* -------------------- HELPERS -------------------- */
  function formatCountdown(claimedAt) {
    if (!claimedAt) return "24h 00m left";
    const end = claimedAt + 24 * 60 * 60 * 1000;
    const diff = Math.max(0, end - Date.now());
    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hrs}h ${String(mins).padStart(2, "0")}m ${String(secs).padStart(2, "0")}s left`;
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getVerifiedStats() {
    const count = state.verifiedLedger.length;
    const points = state.verifiedLedger.reduce((acc, item) => acc + item.points, 0);
    const dlMins = state.verifiedLedger.reduce((acc, item) => acc + item.dlMinutes, 0);
    return {
      count,
      points,
      dlMins,
      dlHours: (dlMins / 60).toFixed(1)
    };
  }

  function syncBadges() {
    const stats = getVerifiedStats();
    state.badges.forEach((b) => {
      if (b.id === "b5" && stats.count >= 5) b.earned = true;
      if (b.id === "b6" && stats.count >= 6) b.earned = true;
    });
  }

  /* -------------------- NAVIGATION & PERSONA -------------------- */
  function navigateTo(viewName) {
    const target = document.getElementById(`view-${viewName}`);
    if (!target) return;
    currentView = viewName;

    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
    target.classList.add("active");

    document.querySelectorAll(".nav-link, .mb-item").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === viewName);
    });

    const drawer = document.getElementById("mobile-drawer");
    const menuBtn = document.getElementById("mobile-menu-btn");
    if (drawer && !drawer.hidden) {
      drawer.hidden = true;
      if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    renderAll();
  }

  function switchPersona(persona, shouldNavigate = true) {
    state.persona = persona;
    saveState();
    document.getElementById("persona-student-btn").classList.toggle("active", persona === "student");
    document.getElementById("persona-lead-btn").classList.toggle("active", persona === "lead");

    if (shouldNavigate) {
      navigateTo(persona === "lead" ? "lead" : "student");
      showToast(
        persona === "lead"
          ? "Switched to Arjun Mehta (Club President · Lead Cockpit)"
          : "Switched to Riya Sharma (1st Year Student · Student Hub)"
      );
    }
  }

  /* -------------------- RENDER: NAV COUNTERS -------------------- */
  function renderNavBadges() {
    const openCount = state.tasks.filter((t) => t.status === "open").length;
    const claimedCount = state.tasks.filter((t) => t.status === "claimed").length;
    const pendingCount = state.pendingApprovals.length;

    const navOpen = document.getElementById("nav-open-tasks-count");
    const navPending = document.getElementById("nav-pending-count");
    const mktOpen = document.getElementById("mkt-open-count");
    const mktClaimed = document.getElementById("mkt-claimed-count");

    if (navOpen) navOpen.textContent = openCount;
    if (navPending) {
      navPending.textContent = pendingCount;
      navPending.style.display = pendingCount > 0 ? "inline-block" : "none";
    }
    if (mktOpen) mktOpen.textContent = openCount;
    if (mktClaimed) mktClaimed.textContent = claimedCount;
  }

  /* -------------------- RENDER: STUDENT DASHBOARD -------------------- */
  function renderStudentDashboard() {
    syncBadges();
    const stats = getVerifiedStats();
    const claimedTasks = state.tasks.filter((t) => t.status === "claimed");
    const pendingMine = state.pendingApprovals.filter((a) => a.isRiya);

    const kpiEl = document.getElementById("student-kpis");
    kpiEl.innerHTML = `
      <div class="kpi-card">
        <span class="kpi-label">Verified Micro-Tasks</span>
        <span class="kpi-val">${stats.count}</span>
        <span class="kpi-sub">${pendingMine.length} awaiting lead review</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">AICTE Activity Credits</span>
        <span class="kpi-val">${stats.points} <small style="font-size:0.9rem;color:#64748B;">/ 100</small></span>
        <span class="kpi-sub">Proof-of-work verified</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">DSA Duty-Leave Credit</span>
        <span class="kpi-val">${stats.dlHours} hrs</span>
        <span class="kpi-sub">${stats.dlMins} mins approved</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Active Claimed Tasks</span>
        <span class="kpi-val">${claimedTasks.length}</span>
        <span class="kpi-sub">24h no-stress lock</span>
      </div>
    `;

    const pct = Math.min(100, Math.round((stats.count / 6) * 100));
    const remaining = Math.max(0, 6 - stats.count);
    document.getElementById("tier-progress-bar").style.width = `${pct}%`;
    document.getElementById("tier-progress-label").textContent =
      remaining === 0 ? "Core Candidate Unlocked!" : `${stats.count} / 6 Tasks to Core`;
    document.getElementById("tier-progress-hint").innerHTML =
      remaining === 0
        ? "Congrats! You unlocked <strong>Core Candidate</strong> status for next semester."
        : `Complete <strong>${remaining} more</strong> verified micro-task${remaining > 1 ? "s" : ""} to unlock <strong>Core Candidate</strong> status.`;

    const activeContainer = document.getElementById("student-active-tasks");
    if (claimedTasks.length === 0) {
      activeContainer.innerHTML = `
        <div class="active-task-item" style="border-left-color:#CBD5E1; text-align:center; align-items:center; padding:28px;">
          <h4>No active tasks right now</h4>
          <p class="muted text-sm">Browse the Micro-Task Marketplace to claim a 10–30 minute task that fits between lectures.</p>
          <button class="btn btn-primary btn-sm" data-view="marketplace">Explore Open Micro-Tasks</button>
        </div>
      `;
    } else {
      activeContainer.innerHTML = claimedTasks
        .map(
          (t) => `
          <div class="active-task-item">
            <div class="active-task-top">
              <div>
                <div class="task-club">${escapeHtml(t.club)}</div>
                <h4>${escapeHtml(t.title)}</h4>
              </div>
              <span class="timer-badge" data-timer="${t.claimedAt}">⏱ ${formatCountdown(t.claimedAt)}</span>
            </div>
            <p class="text-sm muted">${escapeHtml(t.desc)}</p>
            <div class="task-dsa-row">
              <span class="chip chip-orange">${t.duration} MIN</span>
              <span class="dsa-seal">✓ DSA +${t.dlMinutes}m DL</span>
              <span class="chip chip-blue">+${t.points} pts</span>
              <span class="chip chip-navy">Buddy: ${escapeHtml(t.buddy)}</span>
            </div>
            <div class="active-task-actions">
              <button class="btn btn-primary btn-sm" data-open-submit="${t.id}">Submit Proof Link</button>
              <button class="btn btn-danger-outline btn-sm" data-release-task="${t.id}" title="Return silently to open pool with zero penalty">
                Release to Pool (Zero Penalty)
              </button>
            </div>
          </div>
        `
        )
        .join("");
    }

    const subContainer = document.getElementById("student-submissions-list");
    const rows = [
      ...pendingMine.map(
        (a) => `
        <div class="submission-row">
          <div>
            <strong>${escapeHtml(a.taskTitle)}</strong>
            <div class="text-xs muted">${escapeHtml(a.club)} · Submitted ${a.submittedAt}</div>
          </div>
          <span class="chip chip-orange">Pending Lead Review</span>
        </div>
      `
      ),
      ...state.verifiedLedger.slice(0, 3).map(
        (v) => `
        <div class="submission-row">
          <div>
            <strong>${escapeHtml(v.title)}</strong>
            <div class="text-xs muted">${escapeHtml(v.club)} · ${v.date} · +${v.dlMinutes}m DL</div>
          </div>
          <span class="chip chip-green">✓ +${v.points} pts</span>
        </div>
      `
      )
    ];
    subContainer.innerHTML = rows.join("");

    const buddy = state.buddies.find((b) => b.id === state.activeBuddyId) || state.buddies[0];
    document.getElementById("mini-buddy-avatar").textContent = buddy.initials;
    document.getElementById("mini-buddy-avatar").className = `avatar-md ${buddy.avatarClass}`;
    document.getElementById("mini-buddy-name").textContent = buddy.name;
    document.getElementById("mini-buddy-role").textContent = buddy.role;

    const earned = state.badges.filter((b) => b.earned).slice(0, 4);
    document.getElementById("student-badges-preview").innerHTML = earned
      .map(
        (b) => `
        <div class="badge-mini">
          <div class="badge-mini-emoji">${b.emoji}</div>
          <div class="badge-mini-name">${escapeHtml(b.name)}</div>
        </div>
      `
      )
      .join("");
  }

  /* -------------------- RENDER: MICRO-TASK MARKETPLACE -------------------- */
  function renderMarketplace() {
    const grid = document.getElementById("marketplace-grid");
    const filtered = state.tasks.filter((t) => {
      if (mktCategory !== "All" && t.category !== mktCategory) return false;
      if (mktTimeCap !== "all" && t.duration > Number(mktTimeCap)) return false;
      if (mktSearch.trim()) {
        const q = mktSearch.toLowerCase();
        const hay = `${t.title} ${t.club} ${t.category} ${t.desc} ${t.buddy}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="card" style="grid-column: 1 / -1; text-align:center; padding:40px;">
          <h3>No matching micro-tasks found</h3>
          <p class="muted">Try clearing your search or selecting "All Skills" and "Any Duration".</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered
      .map((t) => {
        const isClaimed = t.status === "claimed";
        const isSubmitted = t.status === "submitted";
        let actionHtml = `<button class="btn btn-primary btn-block" data-claim-task="${t.id}">1-Click Claim Task (24h)</button>`;
        if (isClaimed) {
          actionHtml = `
            <div style="display:flex; gap:8px;">
              <button class="btn btn-secondary btn-sm" style="flex:1;" data-open-submit="${t.id}">Submit Proof</button>
              <button class="btn btn-danger-outline btn-sm" data-release-task="${t.id}">Release</button>
            </div>
          `;
        } else if (isSubmitted) {
          actionHtml = `<button class="btn btn-ghost btn-block" disabled>✓ Submitted · Awaiting Lead Approval</button>`;
        }

        return `
          <article class="task-card">
            <div class="task-card-top">
              <span class="chip chip-orange">${t.duration} MIN</span>
              <span class="chip chip-navy">${escapeHtml(t.category)}</span>
            </div>
            <div>
              <div class="task-club">${escapeHtml(t.club)}</div>
              <h3>${escapeHtml(t.title)}</h3>
            </div>
            <p class="task-desc">${escapeHtml(t.desc)}</p>
            <div class="task-dsa-row">
              <span class="dsa-seal">✓ DSA +${t.dlMinutes}m DL</span>
              <span class="chip chip-blue">+${t.points} pts</span>
              <span class="skill-tag">${escapeHtml(t.level)}</span>
            </div>
            <div class="task-card-footer">
              <div class="task-buddy-mini">
                <span>Buddy: <strong>${escapeHtml(t.buddy)}</strong></span>
                <span>${isClaimed ? "⏱ Claimed by you" : isSubmitted ? "Under Review" : "Open Pool"}</span>
              </div>
              ${actionHtml}
            </div>
          </article>
        `;
      })
      .join("");
  }

  /* -------------------- RENDER: BUDDY SYSTEM -------------------- */
  function renderBuddySystem() {
    const buddy = state.buddies.find((b) => b.id === state.activeBuddyId) || state.buddies[0];
    document.getElementById("active-buddy-avatar").textContent = buddy.initials;
    document.getElementById("active-buddy-avatar").className = `avatar-lg ${buddy.avatarClass}`;
    document.getElementById("active-buddy-name").textContent = buddy.name;
    document.getElementById("active-buddy-role").textContent = buddy.role;
    document.getElementById("active-buddy-tags").innerHTML = buddy.tags
      .map((tag) => `<span class="skill-tag">${escapeHtml(tag)}</span>`)
      .join("");
    document.getElementById("active-buddy-metrics").innerHTML = `
      <div><strong>${buddy.mentored}</strong><span>Freshers Mentored</span></div>
      <div><strong>${buddy.replyTime}</strong><span>Avg. Reply</span></div>
      <div><strong>${buddy.rating}</strong><span>Peer Rating</span></div>
    `;

    document.getElementById("chat-buddy-avatar").textContent = buddy.initials;
    document.getElementById("chat-buddy-avatar").className = `avatar-sm ${buddy.avatarClass}`;
    document.getElementById("chat-buddy-name").textContent = buddy.name;

    const chatEl = document.getElementById("buddy-chat-messages");
    chatEl.innerHTML = state.buddyMessages
      .map(
        (m) => `
        <div class="msg ${m.sender === "me" ? "msg-me" : "msg-buddy"}">
          <div>${escapeHtml(m.text)}</div>
          <span class="msg-time">${m.time}</span>
        </div>
      `
      )
      .join("");
    chatEl.scrollTop = chatEl.scrollHeight;

    document.getElementById("buddy-directory-grid").innerHTML = state.buddies
      .map((b) => {
        const isPaired = b.id === state.activeBuddyId;
        return `
          <div class="buddy-dir-card">
            <div class="buddy-profile-row" style="margin-bottom:0;">
              <div class="avatar-md ${b.avatarClass}">${b.initials}</div>
              <div>
                <div class="buddy-name">${escapeHtml(b.name)}</div>
                <div class="text-xs muted">${escapeHtml(b.role)}</div>
              </div>
            </div>
            <p class="text-sm muted">${escapeHtml(b.bio)}</p>
            <div class="buddy-tags" style="margin-bottom:0;">
              ${b.tags.map((t) => `<span class="skill-tag">${escapeHtml(t)}</span>`).join("")}
            </div>
            <button class="btn ${isPaired ? "btn-ghost" : "btn-secondary"} btn-sm btn-block" data-pair-buddy="${b.id}" ${isPaired ? "disabled" : ""}>
              ${isPaired ? "✓ Currently Paired" : `Pair with ${b.name.split(" ")[0]}`}
            </button>
          </div>
        `;
      })
      .join("");
  }

  /* -------------------- RENDER: CLUB LEAD DASHBOARD & HEATMAP -------------------- */
  function renderLeadDashboard() {
    const arjun = state.coreTeam[0];
    const openCount = state.tasks.filter((t) => t.status === "open").length;
    const pendingCount = state.pendingApprovals.length;

    document.getElementById("lead-kpis").innerHTML = `
      <div class="kpi-card">
        <span class="kpi-label">Arjun's Weekly Load</span>
        <span class="kpi-val">${arjun.load}%</span>
        <span class="kpi-sub ${arjun.load >= 80 ? "warn" : ""}">
          ${arjun.load >= 80 ? "Exhaustion Risk (7 tasks)" : "Healthy · Balanced"}
        </span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Active Contributors</span>
        <span class="kpi-val">38 <small style="font-size:0.9rem;color:#64748B;">/ 150</small></span>
        <span class="kpi-sub">+26% since SyncSphere launch</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Open Micro-Tasks</span>
        <span class="kpi-val">${openCount}</span>
        <span class="kpi-sub">Avg. claim time: 24.2s</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Pending Proof Reviews</span>
        <span class="kpi-val">${pendingCount}</span>
        <span class="kpi-sub">1-tap WhatsApp speed</span>
      </div>
    `;

    const alertEl = document.getElementById("burnout-alert-container");
    if (!state.rebalanced) {
      alertEl.innerHTML = `
        <div class="burnout-banner">
          <div>
            <h3>⚠ Burnout Alert: Arjun Mehta is at 88% Capacity (7 Active Tasks)</h3>
            <p class="text-sm muted">Rebalance 3 modular admin &amp; design tasks to the open fresher pool to cut lead workload by 42%.</p>
          </div>
          <button class="btn btn-orange" id="rebalance-btn">Move 3 Tasks to Open Pool</button>
        </div>
      `;
    } else {
      alertEl.innerHTML = `
        <div class="burnout-banner healthy">
          <div>
            <h3>✓ Workload Rebalanced: Arjun Mehta dropped from 88% to 46% Capacity</h3>
            <p class="text-sm muted">3 micro-tasks were published to the open Marketplace with assigned 2nd-year buddies. Home by 6 PM!</p>
          </div>
          <button class="btn btn-secondary btn-sm" data-view="marketplace">View in Marketplace →</button>
        </div>
      `;
    }

    document.getElementById("workload-bars").innerHTML = state.coreTeam
      .map((m) => {
        const cls = m.load >= 80 ? "wl-danger" : m.load >= 60 ? "wl-warn" : "wl-ok";
        const tag = m.load >= 80 ? "Overload Risk" : m.load >= 60 ? "Moderate" : "Healthy";
        return `
          <div class="wl-row">
            <div class="wl-meta">
              <span>${escapeHtml(m.name)} <span class="muted" style="font-weight:500;">(${escapeHtml(m.role)})</span></span>
              <span>${m.load}% · ${m.tasks} tasks · ${tag}</span>
            </div>
            <div class="wl-track">
              <div class="wl-fill ${cls}" style="width:${m.load}%"></div>
            </div>
          </div>
        `;
      })
      .join("");

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    let hmHtml = `<div></div>` + days.map((d) => `<div class="hm-day-head">${d}</div>`).join("");
    state.coreTeam.forEach((m) => {
      hmHtml += `<div class="hm-name">${escapeHtml(m.name.split(" ")[0])}</div>`;
      m.hours.forEach((h) => {
        const lvl = h >= 4 ? "hm-4" : h === 3 ? "hm-3" : h === 2 ? "hm-2" : "hm-1";
        hmHtml += `<div class="hm-cell ${lvl}" title="${m.name}: ${h} hrs">${h}h</div>`;
      });
    });
    document.getElementById("workload-heatmap-grid").innerHTML = hmHtml;

    const badge = document.getElementById("pending-approvals-badge");
    badge.textContent = `${pendingCount} Pending`;
    const queueEl = document.getElementById("lead-approvals-queue");
    if (pendingCount === 0) {
      queueEl.innerHTML = `
        <div class="approval-card" style="text-align:center; padding:28px;">
          <strong>All caught up! 🎉</strong>
          <p class="text-sm muted">No pending student proof submissions. Try submitting a task as Riya to see it appear live here.</p>
        </div>
      `;
    } else {
      queueEl.innerHTML = state.pendingApprovals
        .map(
          (a) => `
          <div class="approval-card">
            <div class="task-card-top">
              <strong>${escapeHtml(a.studentName)} <span class="muted text-xs">(${a.studentReg})</span></strong>
              <span class="text-xs muted">${a.submittedAt}</span>
            </div>
            <div style="font-weight:700; color:#0F172A;">${escapeHtml(a.taskTitle)}</div>
            <div class="text-xs muted">${escapeHtml(a.club)} · +${a.points} pts · +${a.dlMinutes}m DL</div>
            <a class="proof-link" href="${escapeHtml(a.proofUrl)}" target="_blank" rel="noopener noreferrer">🔗 ${escapeHtml(a.proofUrl)}</a>
            ${a.note ? `<div class="text-xs muted">"${escapeHtml(a.note)}"</div>` : ""}
            <div class="approval-actions">
              <button class="btn btn-success btn-sm" style="flex:1;" data-approve-id="${a.id}">✓ Approve &amp; Credit DL</button>
              <button class="btn btn-danger-outline btn-sm" data-reject-id="${a.id}">✎ Request Edit</button>
            </div>
          </div>
        `
        )
        .join("");
    }
  }

  /* -------------------- RENDER: CREDITS & BADGES -------------------- */
  function renderCreditsAndBadges() {
    syncBadges();
    const stats = getVerifiedStats();

    document.getElementById("dsa-pass-stats").innerHTML = `
      <div><strong>${stats.count}</strong><span>Verified Tasks</span></div>
      <div><strong>${stats.dlHours} hrs</strong><span>Duty-Leave Credit</span></div>
      <div><strong>${stats.points} pts</strong><span>AICTE Credits</span></div>
    `;

    const pct = Math.min(100, stats.points);
    const circumference = 314.16;
    const offset = circumference - (pct / 100) * circumference;
    document.getElementById("aicte-points-chip").textContent = `${stats.points} / 100 pts`;
    document.getElementById("aicte-ring-val").textContent = `${pct}%`;
    document.getElementById("aicte-ring-circle").style.strokeDashoffset = offset;

    document.getElementById("aicte-breakdown").innerHTML = `
      <div class="aicte-row"><span>Technical &amp; Hackathons</span><strong>${Math.round(stats.points * 0.55)} pts</strong></div>
      <div class="aicte-row"><span>Design &amp; Creative Guild</span><strong>${Math.round(stats.points * 0.3)} pts</strong></div>
      <div class="aicte-row"><span>Campus Operations &amp; Media</span><strong>${stats.points - Math.round(stats.points * 0.55) - Math.round(stats.points * 0.3)} pts</strong></div>
    `;

    document.getElementById("badges-grid").innerHTML = state.badges
      .map(
        (b) => `
        <article class="badge-card ${b.earned ? "earned" : "locked"}">
          <div class="badge-emblem">${b.emoji}</div>
          <div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
              <strong style="color:#0F172A;">${escapeHtml(b.name)}</strong>
              <span class="chip ${b.earned ? "chip-green" : "chip-navy"}">${b.earned ? "Earned" : b.req}</span>
            </div>
            <p class="text-sm muted">${escapeHtml(b.desc)}</p>
          </div>
        </article>
      `
      )
      .join("");

    document.getElementById("credits-ledger-body").innerHTML = state.verifiedLedger
      .map(
        (v) => `
        <tr>
          <td><strong>${escapeHtml(v.title)}</strong></td>
          <td>${escapeHtml(v.club)}</td>
          <td>${escapeHtml(v.date)}</td>
          <td>${v.duration}m · <span class="text-green">+${v.dlMinutes}m DL</span></td>
          <td><span class="chip chip-orange">+${v.points} pts</span></td>
          <td><span class="chip chip-green">✓ ${escapeHtml(v.status)}</span></td>
        </tr>
      `
      )
      .join("");
  }

  /* -------------------- RENDER: CLUB RESOURCE VAULT -------------------- */
  function renderVault() {
    document.getElementById("vault-sops-grid").innerHTML = state.vaultSops
      .map(
        (s) => `
        <article class="vault-card">
          <div class="task-card-top">
            <span class="chip chip-orange">${escapeHtml(s.tag)}</span>
            <span class="text-xs muted">${escapeHtml(s.updated)}</span>
          </div>
          <h3>${escapeHtml(s.title)}</h3>
          <p class="text-sm muted" style="flex:1;">${escapeHtml(s.summary)}</p>
          <button class="btn btn-secondary btn-sm" data-open-sop="${s.id}">Open Living Playbook →</button>
        </article>
      `
      )
      .join("");

    document.getElementById("vault-vendors-grid").innerHTML = state.vaultVendors
      .map(
        (v) => `
        <article class="vault-card">
          <div class="task-card-top">
            <span class="chip chip-green">${escapeHtml(v.status)}</span>
            <span class="text-xs muted">${escapeHtml(v.category)}</span>
          </div>
          <h3>${escapeHtml(v.name)}</h3>
          <p class="text-sm"><strong>Contact:</strong> ${escapeHtml(v.contact)}</p>
          <p class="text-sm muted"><strong>Approved Rate:</strong> ${escapeHtml(v.budget)}</p>
        </article>
      `
      )
      .join("");

    document.getElementById("vault-pipeline-list").innerHTML = state.vaultPipeline
      .map((p) => {
        const chipCls =
          p.status === "Approved" ? "chip-green" : p.status === "In Review" ? "chip-orange" : "chip-navy";
        return `
          <div class="pipeline-item">
            <div>
              <strong>${escapeHtml(p.title)}</strong>
              <div class="text-xs muted">Owner: ${escapeHtml(p.owner)} · ${escapeHtml(p.office)} · ${escapeHtml(p.updated)}</div>
            </div>
            <span class="chip ${chipCls}">${escapeHtml(p.status)}</span>
          </div>
        `;
      })
      .join("");
  }

  function renderAll() {
    renderNavBadges();
    renderStudentDashboard();
    renderMarketplace();
    renderBuddySystem();
    renderLeadDashboard();
    renderCreditsAndBadges();
    renderVault();
  }

  /* -------------------- INTERACTIVE ACTIONS -------------------- */
  function claimTask(taskId) {
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task || task.status !== "open") return;
    task.status = "claimed";
    task.claimedAt = Date.now();
    saveState();
    renderAll();
    showToast(`Claimed "${task.title}"! 24h timer started & Buddy ${task.buddy} notified.`);
  }

  function releaseTask(taskId) {
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return;
    task.status = "open";
    task.claimedAt = null;
    saveState();
    renderAll();
    showToast(`"${task.title}" returned silently to the open pool with zero penalty.`);
  }

  function openSubmitModal(taskId) {
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return;
    document.getElementById("submit-task-id").value = task.id;
    document.getElementById("submit-modal-title").textContent = task.title;
    document.getElementById("submit-modal-club").textContent = `${task.club} · +${task.points} pts · DSA +${task.dlMinutes}m DL`;
    document.getElementById("submit-modal-timer").textContent = `⏱ ${formatCountdown(task.claimedAt)}`;
    document.getElementById("submit-modal-buddy-name").textContent = task.buddy;
    document.getElementById("submit-proof-url").value = "";
    document.getElementById("submit-proof-note").value = "";
    document.getElementById("submit-modal-checklist").innerHTML = (task.checklist || [])
      .map(
        (c, i) => `
        <label class="check-item">
          <input type="checkbox" ${i === 0 ? "checked" : ""} />
          <span>${escapeHtml(c)}</span>
        </label>
      `
      )
      .join("");
    document.getElementById("submit-modal").hidden = false;
  }

  function handleProofSubmit(e) {
    e.preventDefault();
    const taskId = document.getElementById("submit-task-id").value;
    const url = document.getElementById("submit-proof-url").value.trim();
    const note = document.getElementById("submit-proof-note").value.trim();
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return;

    task.status = "submitted";
    task.proofUrl = url;
    task.proofNote = note;

    state.pendingApprovals.unshift({
      id: `app-${Date.now()}`,
      taskId: task.id,
      studentName: "Riya Sharma",
      studentReg: "12214801",
      taskTitle: task.title,
      club: task.club,
      duration: task.duration,
      points: task.points,
      dlMinutes: task.dlMinutes,
      proofUrl: url,
      note: note || "Ready for review!",
      submittedAt: "Just now",
      isRiya: true
    });

    document.getElementById("submit-modal").hidden = true;
    saveState();
    renderAll();
    showToast(`Proof submitted! Switch to Lead Cockpit (Arjun) to test 1-Tap Approval.`);
  }

  function handleLeadRebalance() {
    if (state.rebalanced) return;
    state.rebalanced = true;
    state.coreTeam[0].load = 46;
    state.coreTeam[0].tasks = 4;
    state.coreTeam[0].hours = [2, 2, 2, 2, 2, 1, 1];
    state.tasks = [...state.rebalanceTasks, ...state.tasks];
    saveState();
    renderAll();
    showToast("Burnout Shield activated! 3 micro-tasks moved to the open Marketplace.");
  }

  function handleApproval(appId, approved) {
    const idx = state.pendingApprovals.findIndex((a) => a.id === appId);
    if (idx === -1) return;
    const item = state.pendingApprovals[idx];
    state.pendingApprovals.splice(idx, 1);

    if (approved) {
      if (item.isRiya) {
        state.verifiedLedger.unshift({
          id: `ver-${Date.now()}`,
          title: item.taskTitle,
          club: item.club.split("·")[0].trim(),
          date: "Nov 23, 2026",
          duration: item.duration,
          dlMinutes: item.dlMinutes,
          points: item.points,
          status: "Approved by Arjun"
        });
        state.tasks = state.tasks.filter((t) => t.id !== item.taskId);
      }
      showToast(`Approved ${item.studentName}'s task! +${item.points} pts & +${item.dlMinutes}m DL auto-credited.`);
    } else {
      if (item.isRiya) {
        const task = state.tasks.find((t) => t.id === item.taskId);
        if (task) task.status = "claimed";
      }
      showToast(`Inline edit request sent to ${item.studentName} & paired buddy.`);
    }
    saveState();
    renderAll();
  }

  function handleCreateTask(e) {
    e.preventDefault();
    const title = document.getElementById("new-task-title").value.trim();
    const category = document.getElementById("new-task-category").value;
    const duration = Number(document.getElementById("new-task-duration").value);
    const club = document.getElementById("new-task-club").value.trim();
    const desc = document.getElementById("new-task-desc").value.trim();
    const pointsMap = { 15: 10, 20: 15, 25: 20, 30: 25 };

    state.tasks.unshift({
      id: `task-${Date.now()}`,
      title,
      club,
      category,
      duration,
      points: pointsMap[duration] || 15,
      dlMinutes: duration,
      level: "New from Lead",
      buddy: "Aman Singh",
      desc,
      checklist: [
        "Follow club brand & format guidelines",
        "Check with assigned buddy if unsure",
        "Submit viewable link for 1-tap approval"
      ],
      status: "open",
      claimedAt: null,
      proofUrl: "",
      proofNote: ""
    });

    document.getElementById("create-task-modal").hidden = true;
    document.getElementById("create-task-form").reset();
    saveState();
    renderAll();
    showToast(`Published "${title}" to the Micro-Task Marketplace!`);
  }

  function sendBuddyMessage(text) {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    state.buddyMessages.push({ sender: "me", text: text.trim(), time: now });

    const lower = text.toLowerCase();
    let reply =
      "Got it! Feel free to drop your link here anytime—I'll give you quick private feedback before Arjun reviews it.";
    if (lower.includes("canva") || lower.includes("font") || lower.includes("brand")) {
      reply =
        "Just shared it! Open Club Vault → 'Official Club Brand Kit & Canva Templates' for the exact Navy (#152238) & Orange (#F97316) palette and Space Grotesk fonts.";
    } else if (lower.includes("review") || lower.includes("draft")) {
      reply =
        "I'd love to check it! Drop your Canva or Drive link right here—usually takes me 5 mins to review and give tips.";
    } else if (lower.includes("duty") || lower.includes("dsa") || lower.includes("leave")) {
      reply =
        "Every approved micro-task logs verified duty-leave minutes automatically! Once Arjun taps Approve, your DSA PDF Manifest updates instantly in Credits & Badges.";
    }

    saveState();
    renderBuddySystem();

    setTimeout(() => {
      state.buddyMessages.push({
        sender: "buddy",
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      });
      saveState();
      renderBuddySystem();
    }, 550);
  }

  function openSopModal(sopId) {
    const sop = state.vaultSops.find((s) => s.id === sopId);
    if (!sop) return;
    document.getElementById("sop-modal-tag").textContent = sop.tag;
    document.getElementById("sop-modal-title").textContent = sop.title;
    document.getElementById("sop-modal-body").innerHTML = `
      <p class="muted text-sm">${escapeHtml(sop.updated)}</p>
      <p>${escapeHtml(sop.summary)}</p>
      <div class="modal-checklist-box">
        <h4>Actionable Handover Steps</h4>
        <ol style="padding-left:18px; display:flex; flex-direction:column; gap:8px; font-size:0.9rem;">
          ${sop.steps.map((st) => `<li>${escapeHtml(st)}</li>`).join("")}
        </ol>
      </div>
    `;
    document.getElementById("sop-modal").hidden = false;
  }

  /* -------------------- EVENT LISTENERS -------------------- */
  document.addEventListener("click", (e) => {
    const viewTrigger = e.target.closest("[data-view]");
    if (viewTrigger) {
      if (viewTrigger.dataset.switchPersona) {
        switchPersona(viewTrigger.dataset.switchPersona, false);
      }
      navigateTo(viewTrigger.dataset.view);
      return;
    }

    const personaBtn = e.target.closest("[data-persona]");
    if (personaBtn) {
      switchPersona(personaBtn.dataset.persona, true);
      return;
    }

    const claimBtn = e.target.closest("[data-claim-task]");
    if (claimBtn) return claimTask(claimBtn.dataset.claimTask);

    const releaseBtn = e.target.closest("[data-release-task]");
    if (releaseBtn) return releaseTask(releaseBtn.dataset.releaseTask);

    const submitBtn = e.target.closest("[data-open-submit]");
    if (submitBtn) return openSubmitModal(submitBtn.dataset.openSubmit);

    if (e.target.closest("#rebalance-btn")) return handleLeadRebalance();

    const approveBtn = e.target.closest("[data-approve-id]");
    if (approveBtn) return handleApproval(approveBtn.dataset.approveId, true);

    const rejectBtn = e.target.closest("[data-reject-id]");
    if (rejectBtn) return handleApproval(rejectBtn.dataset.rejectId, false);

    const pairBtn = e.target.closest("[data-pair-buddy]");
    if (pairBtn) {
      state.activeBuddyId = pairBtn.dataset.pairBuddy;
      const b = state.buddies.find((x) => x.id === state.activeBuddyId);
      saveState();
      renderAll();
      showToast(`Paired with ${b.name} as your active skill buddy!`);
      return;
    }

    const quickChip = e.target.closest(".quick-chip");
    if (quickChip) {
      sendBuddyMessage(quickChip.dataset.msg);
      return;
    }

    const vaultTab = e.target.closest("[data-vault-tab]");
    if (vaultTab) {
      const tab = vaultTab.dataset.vaultTab;
      document.querySelectorAll("[data-vault-tab]").forEach((b) => {
        b.classList.toggle("active", b === vaultTab);
        b.setAttribute("aria-selected", b === vaultTab ? "true" : "false");
      });
      document.querySelectorAll(".vault-panel").forEach((p) => {
        p.hidden = p.id !== `vault-panel-${tab}`;
      });
      return;
    }

    const sopBtn = e.target.closest("[data-open-sop]");
    if (sopBtn) return openSopModal(sopBtn.dataset.openSop);

    const closeModalBtn = e.target.closest("[data-close-modal]");
    if (closeModalBtn) {
      document.getElementById(closeModalBtn.dataset.closeModal).hidden = true;
      return;
    }

    if (e.target.classList.contains("modal-backdrop")) {
      e.target.hidden = true;
    }
  });

  document.getElementById("mkt-category-pills").addEventListener("click", (e) => {
    const pill = e.target.closest("[data-cat]");
    if (!pill) return;
    mktCategory = pill.dataset.cat;
    document.querySelectorAll("#mkt-category-pills .pill").forEach((p) => p.classList.toggle("active", p === pill));
    renderMarketplace();
  });

  document.getElementById("mkt-time-filter").addEventListener("change", (e) => {
    mktTimeCap = e.target.value;
    renderMarketplace();
  });

  document.getElementById("mkt-search").addEventListener("input", (e) => {
    mktSearch = e.target.value;
    renderMarketplace();
  });

  document.getElementById("submit-task-form").addEventListener("submit", handleProofSubmit);
  document.getElementById("create-task-form").addEventListener("submit", handleCreateTask);
  document.getElementById("buddy-chat-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("buddy-chat-input");
    sendBuddyMessage(input.value);
    input.value = "";
  });

  document.getElementById("open-create-task-btn").addEventListener("click", () => {
    document.getElementById("create-task-modal").hidden = false;
  });

  document.getElementById("export-manifest-btn").addEventListener("click", () => {
    showToast("Opening printable DSA Duty-Leave PDF Manifest...");
    setTimeout(() => window.print(), 300);
  });

  document.getElementById("reset-demo-btn").addEventListener("click", () => {
    state = cloneInitialData();
    saveState();
    switchPersona("student", false);
    renderAll();
    showToast("Demo data reset to initial presentation state.");
  });

  document.getElementById("mobile-menu-btn").addEventListener("click", () => {
    const drawer = document.getElementById("mobile-drawer");
    const btn = document.getElementById("mobile-menu-btn");
    drawer.hidden = !drawer.hidden;
    btn.setAttribute("aria-expanded", String(!drawer.hidden));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-backdrop").forEach((m) => (m.hidden = true));
    }
    if ((e.key === "Enter" || e.key === " ") && document.activeElement.classList.contains("feature-card")) {
      e.preventDefault();
      navigateTo(document.activeElement.dataset.view);
    }
  });

  setInterval(() => {
    document.querySelectorAll("[data-timer]").forEach((el) => {
      el.textContent = `⏱ ${formatCountdown(Number(el.dataset.timer))}`;
    });
  }, 1000);

  document.getElementById("persona-student-btn").classList.toggle("active", state.persona === "student");
  document.getElementById("persona-lead-btn").classList.toggle("active", state.persona === "lead");
  renderAll();
})();
