const DEFAULT_ASSASSINS = [
  { id: 1, name: 'Gun Yamazaki', spec: 'Close Combat', kills: 487, success: '99%', fee: '$1,800,000', status: 'ACTIVE' },
  { id: 2, name: 'Shingen', spec: 'Sword Master', kills: 512, success: '98%', fee: '$2,100,000', status: 'ACTIVE' },
  { id: 3, name: 'Manager Kim', spec: 'Recon', kills: 204, success: '100%', fee: '$950,000', status: 'ACTIVE' },
  { id: 4, name: 'Goo Kim', spec: 'Improvised Weapons', kills: 366, success: '95%', fee: '$1,200,000', status: 'STANDBY' },
  { id: 5, name: 'Amur Tigro', spec: 'Stealth', kills: 601, success: '100%', fee: '$3,200,000', status: 'ACTIVE' }
];

const DEFAULT_CONTRACTS = [
  { id: 1, city: 'Tokyo', difficulty: 'HIGH', reward: '$2,400,000', status: 'IN PROGRESS' },
  { id: 2, city: 'Seoul', difficulty: 'EXTREME', reward: '$3,750,000', status: 'CRITICAL' },
  { id: 3, city: 'Moscow', difficulty: 'MEDIUM', reward: '$1,150,000', status: 'SCHEDULED' },
  { id: 4, city: 'Berlin', difficulty: 'HIGH', reward: '$2,050,000', status: 'IN PROGRESS' },
  { id: 5, city: 'Dubai', difficulty: 'EXTREME', reward: '$4,900,000', status: 'CRITICAL' }
];

function loadList(key, defaults) {
  const raw = localStorage.getItem(key);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(key, JSON.stringify(defaults));
  return defaults.slice();
}

function saveList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

function nextId(list) {
  return list.reduce(function (max, item) { return Math.max(max, item.id); }, 0) + 1;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

function isAuthed() {
  return sessionStorage.getItem('scaraAdminAuth') === 'true';
}

document.addEventListener('DOMContentLoaded', function () {
  const isLoginFile = window.location.pathname.endsWith('admin.html') || window.location.pathname.endsWith('admin.html/');

  if (isLoginFile) {
    if (isAuthed()) {
      window.location.href = 'admin-dashboard.html';
      return;
    }
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const staffName = document.getElementById('adminName').value.trim();
      if (staffName === '') {
        alert('Please enter your staff name.');
        return;
      }
      sessionStorage.setItem('scaraAdminAuth', 'true');
      window.location.href = 'admin-dashboard.html';
    });
    return;
  }

  if (!isAuthed()) {
    window.location.href = 'admin.html';
    return;
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      sessionStorage.removeItem('scaraAdminAuth');
      window.location.href = 'admin.html';
    });
  }

  const statAssassins = document.getElementById('statAssassins');
  const statContracts = document.getElementById('statContracts');
  const statInquiries = document.getElementById('statInquiries');
  if (statAssassins) statAssassins.textContent = loadList('scaraAdminAssassins', DEFAULT_ASSASSINS).length;
  if (statContracts) statContracts.textContent = loadList('scaraAdminContracts', DEFAULT_CONTRACTS).length;
  if (statInquiries) statInquiries.textContent = loadList('scaraInquiries', []).length;

  const assassinForm = document.getElementById('assassinForm');
  if (assassinForm) {
    const tbody = document.getElementById('assassinsTableBody');
    const idField = document.getElementById('assassinId');
    const nameField = document.getElementById('assassinName');
    const specField = document.getElementById('assassinSpec');
    const killsField = document.getElementById('assassinKills');
    const successField = document.getElementById('assassinSuccess');
    const feeField = document.getElementById('assassinFee');
    const statusField = document.getElementById('assassinStatus');
    const saveBtn = document.getElementById('assassinSaveBtn');
    const cancelBtn = document.getElementById('assassinCancelBtn');

    function render() {
      const list = loadList('scaraAdminAssassins', DEFAULT_ASSASSINS);
      tbody.innerHTML = list.map(function (a) {
        return '<tr><td>' + escapeHtml(a.name) + '</td><td>' + escapeHtml(a.spec) + '</td><td>' + a.kills + '</td><td>' + escapeHtml(a.success) + '</td><td>' + escapeHtml(a.fee) + '</td><td>' + a.status + '</td>' +
          '<td><button type="button" class="btn btn-sm btn-hero-outline me-1 edit-btn" data-id="' + a.id + '">Edit</button>' +
          '<button type="button" class="btn btn-sm btn-hero-outline delete-btn" data-id="' + a.id + '">Delete</button></td></tr>';
      }).join('');

      tbody.querySelectorAll('.edit-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const id = parseInt(btn.getAttribute('data-id'), 10);
          const item = loadList('scaraAdminAssassins', DEFAULT_ASSASSINS).find(function (a) { return a.id === id; });
          if (!item) return;
          idField.value = item.id;
          nameField.value = item.name;
          specField.value = item.spec;
          killsField.value = item.kills;
          successField.value = item.success;
          feeField.value = item.fee;
          statusField.value = item.status;
          saveBtn.textContent = 'Save Changes';
          cancelBtn.style.display = 'inline-block';
          window.scrollTo({ top: assassinForm.offsetTop - 100, behavior: 'smooth' });
        });
      });

      tbody.querySelectorAll('.delete-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const id = parseInt(btn.getAttribute('data-id'), 10);
          const list = loadList('scaraAdminAssassins', DEFAULT_ASSASSINS).filter(function (a) { return a.id !== id; });
          saveList('scaraAdminAssassins', list);
          render();
        });
      });
    }

    function resetForm() {
      assassinForm.reset();
      idField.value = '';
      saveBtn.textContent = 'Add Assassin';
      cancelBtn.style.display = 'none';
    }

    cancelBtn.addEventListener('click', resetForm);

    assassinForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const list = loadList('scaraAdminAssassins', DEFAULT_ASSASSINS);
      const entry = {
        name: nameField.value,
        spec: specField.value,
        kills: parseInt(killsField.value, 10) || 0,
        success: successField.value,
        fee: feeField.value,
        status: statusField.value
      };
      if (idField.value) {
        const id = parseInt(idField.value, 10);
        const index = list.findIndex(function (a) { return a.id === id; });
        if (index !== -1) {
          entry.id = id;
          list[index] = entry;
        }
      } else {
        entry.id = nextId(list);
        list.push(entry);
      }
      saveList('scaraAdminAssassins', list);
      resetForm();
      render();
    });

    render();
  }

  const contractForm = document.getElementById('contractForm');
  if (contractForm) {
    const tbody = document.getElementById('contractsTableBody');
    const idField = document.getElementById('contractId');
    const cityField = document.getElementById('contractCity');
    const difficultyField = document.getElementById('contractDifficulty');
    const rewardField = document.getElementById('contractReward');
    const statusField = document.getElementById('contractStatus');
    const saveBtn = document.getElementById('contractSaveBtn');
    const cancelBtn = document.getElementById('contractCancelBtn');

    function render() {
      const list = loadList('scaraAdminContracts', DEFAULT_CONTRACTS);
      tbody.innerHTML = list.map(function (c) {
        return '<tr><td>' + escapeHtml(c.city) + '</td><td>' + c.difficulty + '</td><td>' + escapeHtml(c.reward) + '</td><td>' + c.status + '</td>' +
          '<td><button type="button" class="btn btn-sm btn-hero-outline me-1 edit-btn" data-id="' + c.id + '">Edit</button>' +
          '<button type="button" class="btn btn-sm btn-hero-outline delete-btn" data-id="' + c.id + '">Delete</button></td></tr>';
      }).join('');

      tbody.querySelectorAll('.edit-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const id = parseInt(btn.getAttribute('data-id'), 10);
          const item = loadList('scaraAdminContracts', DEFAULT_CONTRACTS).find(function (c) { return c.id === id; });
          if (!item) return;
          idField.value = item.id;
          cityField.value = item.city;
          difficultyField.value = item.difficulty;
          rewardField.value = item.reward;
          statusField.value = item.status;
          saveBtn.textContent = 'Save Changes';
          cancelBtn.style.display = 'inline-block';
          window.scrollTo({ top: contractForm.offsetTop - 100, behavior: 'smooth' });
        });
      });

      tbody.querySelectorAll('.delete-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const id = parseInt(btn.getAttribute('data-id'), 10);
          const list = loadList('scaraAdminContracts', DEFAULT_CONTRACTS).filter(function (c) { return c.id !== id; });
          saveList('scaraAdminContracts', list);
          render();
        });
      });
    }

    function resetForm() {
      contractForm.reset();
      idField.value = '';
      saveBtn.textContent = 'Add Contract';
      cancelBtn.style.display = 'none';
    }

    cancelBtn.addEventListener('click', resetForm);

    contractForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const list = loadList('scaraAdminContracts', DEFAULT_CONTRACTS);
      const entry = {
        city: cityField.value,
        difficulty: difficultyField.value,
        reward: rewardField.value,
        status: statusField.value
      };
      if (idField.value) {
        const id = parseInt(idField.value, 10);
        const index = list.findIndex(function (c) { return c.id === id; });
        if (index !== -1) {
          entry.id = id;
          list[index] = entry;
        }
      } else {
        entry.id = nextId(list);
        list.push(entry);
      }
      saveList('scaraAdminContracts', list);
      resetForm();
      render();
    });

    render();
  }

  const inquiriesTbody = document.getElementById('inquiriesTableBody');
  if (inquiriesTbody) {
    const noInquiries = document.getElementById('noInquiries');
    const clearBtn = document.getElementById('clearInquiriesBtn');

    function render() {
      const list = loadList('scaraInquiries', []);
      if (list.length === 0) {
        inquiriesTbody.innerHTML = '';
        noInquiries.style.display = 'block';
        return;
      }
      noInquiries.style.display = 'none';

      inquiriesTbody.innerHTML = list.slice().reverse().map(function (i) {
        return '<tr><td>' + escapeHtml(i.assassin) + '</td><td>' + escapeHtml(i.name) + '</td><td>' + escapeHtml(i.email) + '</td><td>' + escapeHtml(i.message) + '</td><td>' + escapeHtml(i.fee) + '</td><td>' + new Date(i.date).toLocaleString() + '</td>' +
          '<td><button type="button" class="btn btn-sm btn-hero-outline delete-btn" data-id="' + i.id + '">Delete</button></td></tr>';
      }).join('');

      inquiriesTbody.querySelectorAll('.delete-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const id = parseInt(btn.getAttribute('data-id'), 10);
          const list = loadList('scaraInquiries', []).filter(function (i) { return i.id !== id; });
          saveList('scaraInquiries', list);
          render();
        });
      });
    }

    clearBtn.addEventListener('click', function () {
      saveList('scaraInquiries', []);
      render();
    });

    render();
  }
});
