const FAQ_COMMENTS_KEY = "fenixlabs-comments:/web/pagina%20principal/FAQ.html";

const FAQ_SEEDED_COMMENTS = [
  {
    name: "Profesor invitado",
    text: "La sección de preguntas frecuentes ayuda a entender rápido el propósito del proyecto.",
    createdAt: "2026-06-07T18:20:00-06:00",
    seeded: true,
  },
  {
    name: "Usuario externo",
    text: "Me gusta que aclaren que Fénix Labs es una empresa ficticia y académica.",
    createdAt: "2026-06-07T18:34:00-06:00",
    seeded: true,
  },
  {
    name: "Docente evaluador",
    text: "Las respuestas son claras y se relacionan con soporte remoto, privacidad y atención.",
    createdAt: "2026-06-07T18:49:00-06:00",
    seeded: true,
  },
  {
    name: "Compañero de clase",
    text: "La parte de acceso remoto queda fácil de explicar y no se siente tan técnica.",
    createdAt: "2026-06-07T19:05:00-06:00",
    seeded: true,
  },
  {
    name: "Cliente simulado",
    text: "Está bien que separen cuándo se necesita soporte presencial y cuándo basta con soporte a distancia.",
    createdAt: "2026-06-07T19:18:00-06:00",
    seeded: true,
  },
  {
    name: "Revisión académica",
    text: "El FAQ funciona como apoyo para navegar el blog y reforzar la lista de cotejo.",
    createdAt: "2026-06-07T19:42:00-06:00",
    seeded: true,
  },
];

document.addEventListener("DOMContentLoaded", () => {
  setupPageComments();
  setupFaqCommentPreview();
});

function setupPageComments() {
  const explicitHost = document.querySelector("[data-comments-host]");
  const article = document.querySelector(".article-content");
  const host = explicitHost || article;

  if (!host) return;

  const navigation = article?.querySelector(".article-navigation");
  const isFaq = explicitHost?.dataset.commentsSeed === "faq";
  const pageKey = explicitHost?.dataset.commentsKey || `fenixlabs-comments:${location.pathname}`;
  const title = explicitHost?.dataset.commentsTitle || "Opiniones de la entrada";
  const description = explicitHost?.dataset.commentsDescription || "Comentarios guardados localmente en este navegador.";

  const section = explicitHost || document.createElement("section");
  section.classList.add("comments-section");
  section.innerHTML = `
    <div class="comments-header">
      <span class="eyebrow">Comentarios</span>
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(description)}</p>
    </div>

    <form class="comment-form" data-comment-form>
      <label>
        <span>Nombre</span>
        <input name="name" type="text" maxlength="40" placeholder="Tu nombre" required>
      </label>

      <label>
        <span>Comentario</span>
        <textarea name="comment" maxlength="420" rows="4" placeholder="Escribe tu comentario..." required></textarea>
      </label>

      <button class="btn btn-primary" type="submit">Publicar comentario</button>
    </form>

    <div class="comments-list" data-comments-list aria-live="polite"></div>
  `;

  if (!explicitHost) {
    if (navigation) {
      article.insertBefore(section, navigation);
    } else {
      article.appendChild(section);
    }
  }

  const form = section.querySelector("[data-comment-form]");
  const list = section.querySelector("[data-comments-list]");

  function getLocalComments() {
    return readLocalComments(pageKey);
  }

  function getVisibleComments() {
    return isFaq ? [...FAQ_SEEDED_COMMENTS, ...getLocalComments()] : getLocalComments();
  }

  function renderComments() {
    const comments = getVisibleComments();

    if (!comments.length) {
      list.innerHTML = `<p class="comments-empty">Aún no hay comentarios en esta sección.</p>`;
      return;
    }

    list.innerHTML = comments
      .map((comment, index) => {
        const deleteButton = comment.seeded
          ? ""
          : `<button class="comment-delete" type="button" data-local-index="${index - (isFaq ? FAQ_SEEDED_COMMENTS.length : 0)}">Eliminar</button>`;

        return `
          <article class="comment-card ${comment.seeded ? "comment-card-seeded" : ""}">
            <div>
              <strong>${escapeHtml(comment.name)}</strong>
              <span>${formatDate(comment.createdAt)}</span>
            </div>
            <p>${escapeHtml(comment.text)}</p>
            ${deleteButton}
          </article>
        `;
      })
      .join("");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const text = String(formData.get("comment") || "").trim();

    if (!name || !text) return;

    const comments = getLocalComments();
    comments.unshift({
      name,
      text,
      createdAt: new Date().toISOString(),
    });

    saveLocalComments(pageKey, comments.slice(0, 30));
    form.reset();
    renderComments();
  });

  list.addEventListener("click", (event) => {
    const button = event.target.closest(".comment-delete");
    if (!button) return;

    const localIndex = Number(button.dataset.localIndex);
    if (Number.isNaN(localIndex) || localIndex < 0) return;

    const comments = getLocalComments();
    comments.splice(localIndex, 1);
    saveLocalComments(pageKey, comments);
    renderComments();
  });

  renderComments();
}

function setupFaqCommentPreview() {
  const preview = document.querySelector("[data-faq-comments-preview]");
  if (!preview) return;

  const card = preview.querySelector("[data-faq-comment-card]");
  const progress = preview.querySelector("[data-faq-comment-progress]");
  const counter = preview.querySelector("[data-faq-comment-counter]");
  const comments = [...FAQ_SEEDED_COMMENTS, ...readLocalComments(FAQ_COMMENTS_KEY)];
  let currentIndex = 0;

  if (!comments.length) return;

  function renderPreview() {
    const comment = comments[currentIndex];
    card.classList.remove("is-visible");

    window.setTimeout(() => {
      card.innerHTML = `
        <div>
          <strong>${escapeHtml(comment.name)}</strong>
          <span>${formatDate(comment.createdAt)}</span>
        </div>
        <p>${escapeHtml(comment.text)}</p>
      `;
      counter.textContent = `${currentIndex + 1} / ${comments.length}`;
      card.classList.add("is-visible");
      restartProgress(progress);
    }, 160);
  }

  renderPreview();

  window.setInterval(() => {
    currentIndex = (currentIndex + 1) % comments.length;
    renderPreview();
  }, 6200);
}

function readLocalComments(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function saveLocalComments(key, comments) {
  localStorage.setItem(key, JSON.stringify(comments));
}

function formatDate(value) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function restartProgress(progress) {
  progress.classList.remove("is-running");
  void progress.offsetWidth;
  progress.classList.add("is-running");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;",
  }[char]));
}
