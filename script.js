
const memories = [
  {
    left: {
      type: "photos",
      images: ["images/immagine10.jpeg", "images/immagine11.jpeg"]
    },
    right: {
      type: "text",
      text: "I primi momenti passati a conoscerci sono stati bellissimi, dalle prime esperienze (I kissesss ^ ^) ai primi trend wawi."
    }
  },
  {
    left: {
      type: "photos",
      images: ["images/immagine9.jpeg"]
    },
    right: {
      type: "text",
      text: "Mi sono sempre chiesto del perché di certe insicurezze, sei bellissima tata VERAMENTE.\n\n(In caso ci sono io a ricordartelo ♡)"
    }
  },
  {
    left: {
      type: "text",
      text: "Poi quelle uscite al parcooo, bellissime.\n\nQuei parchi e quelle panchine hanno assistito a parecchie sessioni di cuddles.\n\n(Quella foglia ancora rispersa da qualche parte 🍃)"
    },
    right: {
      type: "photos",
      images: ["images/immagine6.jpeg", "images/immagine8.jpeg"]
    }
  },
  {
    left: {
      type: "photos",
      images: ["images/immagine5.jpeg"]
    },
    right: {
      type: "text",
      text: "Pause, vogliamo parlare di QUANTO DANNATAMENTE TU SIA CARINA.\n\nRRRAAAAAAAAAHHH ♡"
    }
  },
  {
    left: {
      type: "photos",
      images: ["images/immagine1.jpeg"]
    },
    right: {
      type: "text",
      text: "Poi hai un umorismo stra patatino, veramente sei una persona unica, CIOÈ CHE CUTIE ♡"
    }
  },
  {
    left: {
      type: "text",
      text: "Poi... vogliamo parlare di quei neck kisses?!\n\nCioè hai una laurea o cosa, gawdawmn 😭♡"
    },
    right: {
      type: "photos",
      images: ["images/immagine3.jpeg", "images/immagine4.jpeg"]
    }
  },
  {
    left: {
      type: "text",
      text: "Che carina qua che sei appoggiata aww. ♡\n\nSpero di farti sentire amata e sicura ogni volta che siamo assieme, voglio che tu sia felice."
    },
    right: {
      type: "photos",
      images: ["images/immagine2.jpeg"]
    }
  }
];

const $ = (id) => document.getElementById(id);

const screens = ["intro", "cover", "book", "final"];

function showScreen(id) {
  screens.forEach(screen => {
    $(screen).classList.toggle("active", screen === id);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Crea una foto con un segnaposto in caso di file mancante.
function makePhoto(src, alt, className) {
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.className = className;
  img.loading = "eager";

  img.addEventListener("error", () => {
    const placeholder = document.createElement("div");
    placeholder.className = "photo-placeholder";
    placeholder.textContent = "♡ Aggiungi qui la tua foto ♡";
    placeholder.setAttribute("role", "img");
    placeholder.setAttribute("aria-label", "Fotografia da aggiungere");
    img.replaceWith(placeholder);
  }, { once: true });

  return img;
}

let current = 0;
let busy = false;

// Costruisce una pagina fotografica oppure una pagina di testo.
function renderPage(element, content, pageNumber, side) {
  element.replaceChildren();

  if (content.type === "photos") {
    const stack = document.createElement("div");
    stack.className =
      "photo-stack " +
      (content.images.length > 1 ? "photo-collage" : "photo-single");

    content.images.forEach((src, index) => {
      const photo = makePhoto(
        src,
        `Ricordo ${current + 1}, foto ${index + 1}`,
        "memory-photo"
      );

      if (content.images.length > 1) {
        photo.classList.add(`collage-photo-${index + 1}`);
      }

      stack.appendChild(photo);
    });

    element.appendChild(stack);

    const decoration = document.createElement("div");
    decoration.className = "page-caption";
    decoration.textContent = "♡ ✿  ♡  ✿ ♡";
    element.appendChild(decoration);
  } else {
    const decoration = document.createElement("div");
    decoration.className = "page-flower";
    decoration.textContent = "✿  ♡  ✿";

    const dedication = document.createElement("p");
    dedication.className = "dedication";
    dedication.textContent = content.text;

    element.append(decoration, dedication);
  }

  const number = document.createElement("div");
  number.className = "page-number";
  number.textContent = `♡ ${pageNumber} ♡`;
  element.appendChild(number);

  element.classList.toggle("text-page", content.type === "text");
  element.classList.toggle("photo-page", content.type === "photos");
  element.dataset.side = side;
}

function renderSpread() {
  const memory = memories[current];

  renderPage($("leftPage"), memory.left, current * 2 + 1, "left");
  renderPage($("rightPage"), memory.right, current * 2 + 2, "right");

  $("counter").textContent =
    `Ricordo ${current + 1} di ${memories.length}`;

  $("prev").disabled = current === 0;

  $("next").textContent =
    current === memories.length - 1
      ? "Concludi ♡ →"
      : "Avanti ♡ →";
}

function turnPage(direction) {
  if (busy) return;

  if (direction > 0 && current === memories.length - 1) {
    showScreen("final");
    return;
  }

  const nextIndex = current + direction;

  if (nextIndex < 0 || nextIndex >= memories.length) return;

  busy = true;

  const spread = $("bookSpread");
  spread.classList.add("turning");

  window.setTimeout(() => {
    current = nextIndex;
    renderSpread();
    spread.classList.remove("turning");
    busy = false;
  }, 220);
}

// Apertura della letterina.
$("start").addEventListener("click", () => {
  showScreen("cover");
});

// Apertura del libro.
$("openBook").addEventListener("click", () => {
  current = 0;
  renderSpread();
  showScreen("book");
});

// Navigazione.
$("prev").addEventListener("click", () => turnPage(-1));
$("next").addEventListener("click", () => turnPage(1));

$("backCover").addEventListener("click", () => {
  showScreen("cover");
});

// Sorpresa finale.
$("surprise").addEventListener("click", () => {
  $("secret").classList.remove("hidden");
  $("surprise").textContent = "♡ Sorpresa svelata ♡";
  $("surprise").disabled = true;
});

// Ricomincia il viaggio senza modificare la pagina finale.
$("restart").addEventListener("click", () => {
  $("secret").classList.add("hidden");
  $("surprise").disabled = false;
  $("surprise").textContent = "Una cosina ancora... ♡";
  showScreen("intro");
});

// Navigazione con le frecce della tastiera.
document.addEventListener("keydown", event => {
  if (!$("book").classList.contains("active")) return;

  if (event.key === "ArrowRight") turnPage(1);
  if (event.key === "ArrowLeft") turnPage(-1);
});

// Sfogliamento tramite swipe su smartphone.
let touchStartX = 0;

$("bookSpread").addEventListener("touchstart", event => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

$("bookSpread").addEventListener("touchend", event => {
  const difference =
    event.changedTouches[0].clientX - touchStartX;

  if (Math.abs(difference) > 55) {
    turnPage(difference < 0 ? 1 : -1);
  }
}, { passive: true });

// Prepara la prima doppia pagina.
renderSpread();
