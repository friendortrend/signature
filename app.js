// Website B - signature.friendortrend.dedyn.io
// Startup splash -> login screen -> Google auth -> redirect back to Website A.

const splashView = document.getElementById("splashView");
const loginView = document.getElementById("loginView");
const statusEl = document.getElementById("status");
const googleBtn = document.getElementById("googleBtn");
const finbBtn = document.getElementById("finbBtn");

// Preserve a "return to" target so we can bounce the user back where they came from.
const params = new URLSearchParams(location.search);
const returnTo = params.get("return") || FOT.CREATE_URL;

function setStatus(msg, spinner) {
  statusEl.innerHTML = spinner ? '<span class="spinner"></span> ' + msg : msg;
}

// Transition from splash to the login screen after a short, elegant beat.
window.addEventListener("load", () => {
  setTimeout(() => {
    splashView.classList.add("hidden");
    loginView.classList.remove("hidden");
    document.body.classList.add("stage-login");
  }, 2200);
});

function redirectWithUser(user) {
  const url = new URL(returnTo);
  url.searchParams.set("uid", user.uid);
  url.searchParams.set("name", user.displayName || "Friend");
  url.searchParams.set("email", user.email || "");
  url.searchParams.set("photo", user.photoURL || "");
  window.location.href = url.toString();
}

// Google login via Firebase
googleBtn.addEventListener("click", async () => {
  setStatus("Opening Google sign-in...", true);
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await firebase.auth().signInWithPopup(provider);
    setStatus("Signed in! Taking you back...", true);
    redirectWithUser(result.user);
  } catch (err) {
    console.log("[v0] Google sign-in error:", err.message);
    setStatus("Sign-in was cancelled or failed. Please try again.");
  }
});

// FINB - Fake International Bank (credit-card game simulation)
finbBtn.addEventListener("click", () => {
  setStatus("Redirecting to Fake International Bank...", true);
  window.location.href = FOT.FINB_URL;
});

// If already signed in on this origin, offer to continue immediately.
firebase.auth().onAuthStateChanged((user) => {
  if (user && !loginView.classList.contains("hidden")) {
    setStatus("Welcome back, " + (user.displayName || "friend") + "! Continuing...", true);
    setTimeout(() => redirectWithUser(user), 900);
  }
});
