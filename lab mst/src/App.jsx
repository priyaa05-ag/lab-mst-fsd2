import React, { useEffect, useState } from "react";

const DEFAULT_USERS = [
  { id: 1, username: "admin", password: "admin123", role: "Admin" },
  { id: 2, username: "editor", password: "editor123", role: "Editor" },
  { id: 3, username: "viewer", password: "viewer123", role: "Viewer" }
];

const loadUsers = () => {
  try {
    const saved = localStorage.getItem("rbac_users");
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
};

export default function App() {
  const [users, setUsers] = useState(loadUsers);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("rbac_current_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [page, setPage] = useState(() =>
    localStorage.getItem("rbac_current_user") ? "dashboard" : "login"
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("Viewer");
  const [adminMessage, setAdminMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("rbac_users", JSON.stringify(users));
  }, [users]);

  const login = (event) => {
    event.preventDefault();
    setLoginError("");

    const found = users.find(
      (u) => u.username === username.trim() && u.password === password
    );

    if (!found) {
      setLoginError("Invalid username or password.");
      return;
    }

    const safeUser = {
      id: found.id,
      username: found.username,
      role: found.role
    };

    localStorage.setItem("rbac_current_user", JSON.stringify(safeUser));
    localStorage.setItem("demo_jwt", "demo.jwt.token");
    setCurrentUser(safeUser);
    setUsername("");
    setPassword("");
    setPage("dashboard");
  };

  const logout = () => {
    localStorage.removeItem("rbac_current_user");
    localStorage.removeItem("demo_jwt");
    setCurrentUser(null);
    setPage("login");
  };

  const createUser = () => {
    setAdminMessage("");

    if (!newUsername.trim() || !newPassword) {
      setAdminMessage("Enter both username and password.");
      return;
    }

    const exists = users.some(
      (u) => u.username.toLowerCase() === newUsername.trim().toLowerCase()
    );

    if (exists) {
      setAdminMessage("That username already exists.");
      return;
    }

    const newUser = {
      id: Date.now(),
      username: newUsername.trim(),
      password: newPassword,
      role: newRole
    };

    setUsers((old) => [...old, newUser]);
    setNewUsername("");
    setNewPassword("");
    setNewRole("Viewer");
    setAdminMessage(`User "${newUser.username}" created successfully.`);
  };

  const deleteUser = (id) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;

    if (target.username === "admin") {
      setAdminMessage("The default admin account cannot be deleted.");
      return;
    }

    if (target.id === currentUser?.id) {
      setAdminMessage("You cannot delete the account you are currently using.");
      return;
    }

    setUsers((old) => old.filter((u) => u.id !== id));
    setAdminMessage(`User "${target.username}" deleted successfully.`);
  };

  const goTo = (target) => {
    if (!currentUser) {
      setPage("login");
      return;
    }

    if (target === "admin" && currentUser.role !== "Admin") {
      setPage("forbidden");
      return;
    }

    setPage(target);
  };

  if (page === "login") {
    return (
      <div className="app">
        <div className="card login-card">
          <div className="badge">EXPERIMENT 3</div>
          <h1>RBAC Authentication</h1>
          <p className="muted">Login to access the protected application.</p>

          <form onSubmit={login}>
            <label>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />

            {loginError && <div className="error">{loginError}</div>}

            <button className="primary full" type="submit">
              Login
            </button>
          </form>

          <div className="demo-box">
            <strong>Demo accounts</strong>
            <div>Admin: <code>admin / admin123</code></div>
            <div>Editor: <code>editor / editor123</code></div>
            <div>Viewer: <code>viewer / viewer123</code></div>
          </div>
        </div>
      </div>
    );
  }

  if (page === "forbidden") {
    return (
      <div className="app">
        <div className="card">
          <div className="big">403</div>
          <h1>Access Denied</h1>
          <p>You are authenticated, but your role does not have permission to access this page.</p>
          <button className="primary" onClick={() => setPage("dashboard")}>
            Back to Dashboard
          </button>
          <button className="danger" onClick={logout}>Logout</button>
        </div>
      </div>
    );
  }

  if (page === "admin" && currentUser?.role !== "Admin") {
    return (
      <div className="app">
        <div className="card">
          <div className="big">403</div>
          <h1>Admin Only</h1>
          <button className="primary" onClick={() => setPage("dashboard")}>
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <strong>RBAC Dashboard</strong>
          <span className="subtitle">Experiment 3</span>
        </div>
        <div className="user-pill">
          <span>{currentUser?.username}</span>
          <b>{currentUser?.role}</b>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="content">
        <div className="hero">
          <div>
            <div className="badge">AUTHENTICATED</div>
            <h1>Welcome, {currentUser?.username} 👋</h1>
            <p>Your access is controlled using Role-Based Access Control.</p>
          </div>
          <div className="role-card">
            <span>Your role</span>
            <strong>{currentUser?.role}</strong>
          </div>
        </div>

        <div className="grid">
          <div className="card">
            <h2>Authentication</h2>
            <p>✓ User authenticated</p>
            <p>✓ Demo JWT token generated</p>
            <p>✓ Login state persisted</p>
          </div>

          <div className="card">
            <h2>Permissions</h2>
            <p>Admin: full user management</p>
            <p>Editor: edit content</p>
            <p>Viewer: view content</p>
          </div>
        </div>

        <div className="card">
          <h2>Available Actions</h2>

          <button className="primary" onClick={() => goTo("dashboard")}>
            Dashboard
          </button>

          {currentUser?.role === "Admin" && (
            <button className="primary" onClick={() => goTo("admin")}>
              Admin Panel
            </button>
          )}

          {(currentUser?.role === "Admin" || currentUser?.role === "Editor") && (
            <button className="success" onClick={() => alert("Edit permission granted!")}>
              Edit Content
            </button>
          )}

          {currentUser?.role === "Viewer" && (
            <p className="info">
              Viewer users can view content but cannot edit or manage users.
            </p>
          )}
        </div>

        {page === "admin" && (
          <div className="card">
            <h2>Admin Panel</h2>
            <p className="muted">Create and delete application users.</p>

            <div className="admin-form">
              <input
                placeholder="New username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                <option>Admin</option>
                <option>Editor</option>
                <option>Viewer</option>
              </select>
              <button className="primary" onClick={createUser}>
                + Create User
              </button>
            </div>

            {adminMessage && <div className="message">{adminMessage}</div>}

            <h3>Users</h3>
            <div className="user-list">
              {users.map((u) => (
                <div className="user-row" key={u.id}>
                  <div>
                    <strong>{u.username}</strong>
                    <span>{u.role}</span>
                  </div>
                  <button
                    className="danger"
                    disabled={u.username === "admin" || u.id === currentUser.id}
                    onClick={() => deleteUser(u.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}