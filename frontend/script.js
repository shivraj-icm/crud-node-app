const apiBase = 'http://localhost:5000/api/users';

document.getElementById('createUserForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const userType = document.getElementById('userType').value;

  const res = await fetch(apiBase, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, userType })
  });

  const data = await res.json();
  alert(data.message || 'User created');
  loadUsers();
});

document.getElementById('updateUserForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('updateEmail').value;
  const name = document.getElementById('newName').value;

  const encodedEmail = encodeURIComponent(email);

  const res = await fetch(`${apiBase}/${encodedEmail}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });

  const data = await res.json();
  alert(data.message || 'User updated');
  loadUsers();
});

async function loadUsers() {
  const res = await fetch(apiBase);
  const json = await res.json();
  const users = json.data || json;

  const tbody = document.getElementById('userTableBody');
  tbody.innerHTML = '';

  users.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.email}</td>
      <td>${user.name || '-'}</td>
      <td>${user.userType || '-'}</td>
    `;
    tbody.appendChild(tr);
  });
}

loadUsers(); // Load on page load
