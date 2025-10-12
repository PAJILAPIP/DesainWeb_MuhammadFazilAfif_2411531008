  // if ("serviceWorker" in navigator) {
  //   window.addEventListener("load", () => {
  //     navigator.serviceWorker
  //       .register("./service-worker.js")
  //       .then((reg) => console.log("Service Worker registered", reg))
  //       .catch((err) => console.log("Service Worker registration failed", err));
  //   });
  // }

  // let deferredPrompt;

  // window.addEventListener("beforeinstallprompt", (e) => {
  //   e.preventDefault();
  //   deferredPrompt = e;
  //   const installBtn = document.createElement("button");
  //   installBtn.innerText = "Install PWA";
  //   document.body.appendChild(installBtn);

  //   installBtn.addEventListener("click", () => {
  //     deferredPrompt.prompt();
  //     deferredPrompt.userChoice.then((choiceResult) => {
  //       if (choiceResult.outcome === "accepted") {
  //         console.log("User accepted the install prompt");
  //       }
  //       deferredPrompt = null;
  //       installBtn.remove();
  //     });
  //   });
  // });

  // window.addEventListener("appinstalled", () => {
  //   console.log("PWA installed");
  // });