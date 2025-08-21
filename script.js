window.addEventListener("DOMContentLoaded", () => {
  const quoteText = document.querySelector(".quote"),
    quoteBtn = document.querySelector("button"),
    authorName = document.querySelector(".name"),
    speechBtn = document.querySelector(".speech"),
    copyBtn = document.querySelector(".copy"),
    discordBtn = document.querySelector(".discord"),
    synth = "speechSynthesis" in window ? window.speechSynthesis : null;

  async function randomQuote() {
    quoteBtn.classList.add("loading");
    quoteBtn.innerText = "Loading Quote...";
    try {
      // Ganti API ke ZenQuotes HTTPS
      const response = await fetch("https://zenquotes.io/api/random");
      const data = await response.json();
      const result = data[0]; // ZenQuotes mengembalikan array dengan satu objek

      quoteText.innerText = result.q;
      authorName.innerText = result.a;
    } catch (error) {
      quoteText.innerText = "Failed to fetch quote!";
      authorName.innerText = "Error";
      console.error(error);
    } finally {
      quoteBtn.classList.remove("loading");
      quoteBtn.innerText = "New Quote";
    }
  }

  // 🔊 Speech synthesis
  if (synth && speechBtn) {
    speechBtn.addEventListener("click", () => {
      if (!quoteBtn.classList.contains("loading")) {
        let utterance = new SpeechSynthesisUtterance(
          `${quoteText.innerText} by ${authorName.innerText}`
        );
        synth.cancel(); // supaya tidak numpuk
        synth.speak(utterance);

        let checkSpeaking = setInterval(() => {
          if (!synth.speaking) {
            speechBtn.classList.remove("active");
            clearInterval(checkSpeaking);
          } else {
            speechBtn.classList.add("active");
          }
        }, 100);
      }
    });
  }

  // 📋 Copy
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(quoteText.innerText);
    });
  }

  // 🐦 Discord
  if (discordBtn) {
    discordBtn.addEventListener("click", () => {
      let discordUrl = `https://discord.com/users/755071629389856848?text=${encodeURIComponent(
        quoteText.innerText
      )} - ${encodeURIComponent(authorName.innerText)}`;
      window.open(discordUrl, "_blank");
    });
  }

  // 🔄 Ambil quote baru
  if (quoteBtn) {
    quoteBtn.addEventListener("click", randomQuote);
  }

  // 🚀 Ambil 1 quote di awal
  randomQuote();
});