const keyUser = 'authx.user';
const registeredUsers = new Map([
  ['admin', {
    id: 'uid:0', username: 'admin', email: 'admin@example.com', password: 'qwerty', firstname: 'App', lastname: 'Admin',
  }],
  ['tim', {
    id: 'uid:973236115', username: 'tim', email: 'tim@example.com', password: 'tim', firstname: 'Timothy', lastname: 'Noel',
  }],
]);

function newUID() {
  const epoch = Math.floor(new Date() / 1000).toString();
  return `uid:${epoch}`;
}

function newToken() {
  return (Math.random() * 1000000000).toString(16);
}

function setSession(user, token) {
  // Remove the password property.
  const { password, ...rest } = user;

  // Merge token to the final object.
  const merged = {
    ...rest,
    token,
  };

  localStorage.setItem(keyUser, JSON.stringify(merged));
}

function getSession() {
  const user = localStorage.getItem(keyUser);

  return JSON.parse(user);
}

function isAuth() {
  return !!getSession();
}

async function login(username, password) {
  const response = await fetch('http://localhost:5000/login?username='+username+'&password='+password)
  if (response?.ok) {
      const token = newToken();
      const user = await response.json()
      console.log (user[0])
      setSession(user[0], token);
      return token;
  } else {
        return new Error('invalid credentials');
  }

  /*return new Promise((resolve, reject) => {
    // Using setTimeout to simulate network latency.
    setTimeout(() => {
      const found = registeredUsers.get(username);
      if (!found) {
        return reject(new Error('user not found'));
      }

      if (found.password !== password) {
        return reject(new Error('invalid credentials'));
      }

      const token = newToken();
      setSession(found, token);
      return resolve(token);
    }, 2000);
  });*/
}

async function logout() {
  return new Promise((resolve) => {
    // Using setTimeout to simulate network latency.
    setTimeout(() => {
      localStorage.removeItem(keyUser);
      resolve();
    }, 1000);
  });
}

async function sendPasswordReset() {
  return new Promise((resolve) => {
    // Using setTimeout to simulate network latency.
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

async function addUser(user) {
  return new Promise((resolve) => {
    // Using setTimeout to simulate network latency.
    const id = newUID();
    setTimeout(() => {
      const merged = {
        ...user,
        id,
      };

      registeredUsers.set(user.username, merged);
      resolve(merged);
    }, 1000);
  });
}

async function getUsers() {
  return new Promise((resolve) => {
    // Using setTimeout to simulate network latency.
    setTimeout(() => {
      const users = Array.from(registeredUsers.values());
      resolve(users);
    }, 1000);
  });
}

// The useAuth hook is a wrapper to this service, make sure exported functions are also reflected
// in the useAuth hook.
export {
  getSession, isAuth, login, logout, sendPasswordReset, addUser, getUsers,
};
