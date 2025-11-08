let currentUser = null;
let currentCategory = null;

// Alternativ per kategori
const categoryOptions = {
  "Polis": ["Volvo XC60 Målad 2020", "Volvo XC60 Målad 2025", "Volvo XC70 Målad 2015"],
  "Sjukvård": ["Ambulans 1", "Ambulans 2", "Ambulans 3"],
  "Räddningstjänst": ["Brandbil 1", "Brandbil 2", "Brandbil 3"]
};

function showRegister() {
  document.getElementById("login-container").classList.add("hidden");
  document.getElementById("register-container").classList.remove("hidden");
}

function showLogin() {
  document.getElementById("register-container").classList.add("hidden");
  document.getElementById("login-container").classList.remove("hidden");
}

function register() {
  const username = document.getElementById("register-username").value.trim();
  const password = document.getElementById("register-password").value.trim();
  const category = document.getElementById("register-category").value;
  const message = document.getElementById("register-message");

  if (!username || !password) {
    message.textContent = "Fyll i alla fält!";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[username]) {
    message.textContent = "Användarnamnet är redan taget.";
    return;
  }

  users[username] = { password, category };
  localStorage.setItem("users", JSON.stringify(users));

  message.style.color = "green";
  message.textContent = "Konto skapat! Du kan nu logga in.";

  document.getElementById("register-username").value = "";
  document.getElementById("register-password").value = "";
}

function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const category = document.getElementById("login-category").value;
  const message = document.getElementById("login-message");

  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[username] && users[username].password === password && users[username].category === category) {
    currentUser = username;
    currentCategory = category;
    message.textContent = "";
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("register-container").classList.add("hidden");
    document.getElementById("main-container").classList.remove("hidden");
  } else {
    message.textContent = "Fel användarnamn, lösenord eller kategori.";
  }
}

function logout() {
  let anmalningar = JSON.parse(localStorage.getItem("anmalningar")) || [];
  anmalningar = anmalningar.filter(a => a.username !== currentUser);
  localStorage.setItem("anmalningar", JSON.stringify(anmalningar));

  currentUser = null;
  currentCategory = null;

  document.getElementById("main-container").classList.add("hidden");
  document.getElementById("login-container").classList.remove("hidden");
}

function showAnmal() {
  document.getElementById("main-container").classList.add("hidden");
  document.getElementById("anmal-container").classList.remove("hidden");

  const select = document.getElementById("anmal-option");
  select.innerHTML = "";
  categoryOptions[currentCategory].forEach(opt => {
    const option = document.createElement("option");
    option.value = opt;
    option.textContent = opt;
    select.appendChild(option);
  });
  select.multiple = true; // tillåt flera val
}

function showList() {
  document.getElementById("main-container").classList.add("hidden");
  document.getElementById("list-container").classList.remove("hidden");
  renderList();
}

function backToMain() {
  document.getElementById("anmal-container").classList.add("hidden");
  document.getElementById("list-container").classList.add("hidden");
  document.getElementById("main-container").classList.remove("hidden");
}

function submitAnmal() {
  const select = document.getElementById("anmal-option");
  const selectedOptions = Array.from(select.selectedOptions).map(opt => opt.value);
  const rakel = document.getElementById("anmal-rakel").value.trim();

  if (selectedOptions.length === 0) {
    alert("Välj minst en bil!");
    return;
  }
  if (!rakel) {
    alert("Fyll i Rakel!");
    return;
  }

  let anmalningar = JSON.parse(localStorage.getItem("anmalningar")) || [];
  anmalningar = anmalningar.filter(a => a.username !== currentUser);

  anmalningar.push({
    username: currentUser,
    category: currentCategory,
    options: selectedOptions,
    rakel
  });

  localStorage.setItem("anmalningar", JSON.stringify(anmalningar));

  document.getElementById("anmal-rakel").value = "";
  backToMain();
}

function renderList() {
  const ul = document.getElementById("anmal-list");
  ul.innerHTML = "";
  const anmalningar = JSON.parse(localStorage.getItem("anmalningar")) || [];

  const filtered = anmalningar.filter(a => a.category === currentCategory);

  if (filtered.length === 0) {
    ul.innerHTML = "<li>Ingen har anmält sig än.</li>";
    return;
  }

  filtered.forEach(a => {
    const li = document.createElement("li");
    li.textContent = `Användare: ${a.username}, Alternativ: ${a.options.join(", ")}, Rakel: ${a.rakel}`;
    ul.appendChild(li);
  });
}
