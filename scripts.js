const enlaces = document.querySelectorAll(".menu a")
const languageLinks = document.querySelectorAll(".lang-toggle")

const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const isEnglishPage = () => {
  const lang = document.documentElement.lang || ""
  return lang.toLowerCase().startsWith("en")
}

const translations = {
  es: {
    bubbleLabel: "Abrir formulario de contacto",
    badge: "CONTACTO",
    title: "Hablemos",
    nameLabel: "Nombre",
    secondNameLabel: "Segundo nombre",
    emailLabel: "Correo electrónico",
    messageLabel: "Mensaje",
    submitLabel: "Enviar mensaje",
    closeLabel: "Cerrar formulario",
    placeholders: {
      name: "Tu nombre",
      secondName: "Tu segundo nombre",
      email: "tucorreo@ejemplo.com",
      message: "Cuéntame sobre tu idea o proyecto"
    },
    validationError: "Completa todos los campos y usa un correo válido.",
    successMessage: "Mensaje enviado correctamente. Gracias por contactarme.",
    sendError: "No se pudo enviar el mensaje en este momento. Intenta nuevamente."
  },
  en: {
    bubbleLabel: "Open contact form",
    badge: "CONTACT",
    title: "Let’s talk",
    nameLabel: "First Name",
    secondNameLabel: "Last Name",
    emailLabel: "Email",
    messageLabel: "Message",
    submitLabel: "Send message",
    closeLabel: "Close form",
    placeholders: {
      name: "Your name",
      secondName: "Your last name",
      email: "youremail@example.com",
      message: "Tell me about your idea or project"
    },
    validationError: "Please fill in all fields and use a valid email address.",
    successMessage: "Message sent successfully. Thank you for reaching out.",
    sendError: "The message could not be sent right now. Please try again."
  }
}

const t = (key) => {
  const locale = isEnglishPage() ? "en" : "es"
  return translations[locale][key]
}

const setMessage = (element, message, type) => {
  if (!element) return
  element.textContent = message
  element.className = `mensaje-form ${type}`
}

const initMenuBehavior = () => {
  enlaces.forEach(enlace => {
    enlace.addEventListener("click", function () {
      enlaces.forEach(e => e.classList.remove("activo"))
      this.classList.add("activo")
    })
  })
}

const initLanguageScrollRestore = () => {
  languageLinks.forEach(link => {
    link.addEventListener("click", () => {
      sessionStorage.setItem("translationScrollPosition", window.scrollY.toString())
      const targetName = new URL(link.href, location.href).pathname.split("/").pop()
      sessionStorage.setItem("translationTargetFile", targetName)
    })
  })
}

const initPageRestore = () => {
  const savedPosition = sessionStorage.getItem("translationScrollPosition")
  const savedTargetFile = sessionStorage.getItem("translationTargetFile")
  const currentFile = location.pathname.split("/").pop()

  if (savedPosition !== null && savedTargetFile === currentFile) {
    window.scrollTo({ top: parseInt(savedPosition, 10), behavior: "auto" })
  }

  sessionStorage.removeItem("translationScrollPosition")
  sessionStorage.removeItem("translationTargetFile")
}

const initFloatingContact = () => {
  if (document.querySelector(".floating-contact-btn")) return

  const bubble = document.createElement("button")
  bubble.type = "button"
  bubble.className = "floating-contact-btn"
  bubble.setAttribute("aria-label", t("bubbleLabel"))
  bubble.innerHTML = `
    <span class="floating-contact-icon">✉</span>
  `

  const modal = document.createElement("div")
  modal.className = "floating-contact-modal"
  modal.setAttribute("aria-hidden", "true")
  modal.innerHTML = `
    <div class="floating-contact-modal-panel">
      <button type="button" class="floating-contact-close" aria-label="${t("closeLabel")}">×</button>
      <div class="floating-contact-header">
        <span class="etiqueta_bloque">${t("badge")}</span>
        <h3>${t("title")}</h3>
      </div>
      <form class="floating-contact-form" id="floating-contact-form" method="POST" action="https://formspree.io/f/mzdqlvqv">
        <div class="floating-contact-field">
          <label for="floating-nombre">${t("nameLabel")} *</label>
          <input type="text" id="floating-nombre" name="nombre" placeholder="${t("placeholders").name}" required>
        </div>
        <div class="floating-contact-field">
          <label for="floating-segundo">${t("secondNameLabel")} *</label>
          <input type="text" id="floating-segundo" name="segundo_nombre" placeholder="${t("placeholders").secondName}" required>
        </div>
        <div class="floating-contact-field">
          <label for="floating-email">${t("emailLabel")} *</label>
          <input type="email" id="floating-email" name="email" placeholder="${t("placeholders").email}" required>
        </div>
        <div class="floating-contact-field">
          <label for="floating-mensaje">${t("messageLabel")} *</label>
          <textarea id="floating-mensaje" name="mensaje" placeholder="${t("placeholders").message}" required></textarea>
        </div>
        <button type="submit" class="floating-contact-submit">${t("submitLabel")}</button>
        <p class="mensaje-form" id="floating-form-message" aria-live="polite"></p>
      </form>
    </div>
  `

  document.body.appendChild(bubble)
  document.body.appendChild(modal)

  const closeButton = modal.querySelector(".floating-contact-close")
  const form = modal.querySelector("#floating-contact-form")
  const message = modal.querySelector("#floating-form-message")

  bubble.addEventListener("click", () => {
    setMessage(message, "", "")
    modal.classList.add("is-open")
    modal.setAttribute("aria-hidden", "false")
    document.body.style.overflow = "hidden"
  })

  closeButton.addEventListener("click", () => {
    modal.classList.remove("is-open")
    modal.setAttribute("aria-hidden", "true")
    document.body.style.overflow = ""
  })

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.remove("is-open")
      modal.setAttribute("aria-hidden", "true")
      document.body.style.overflow = ""
    }
  })

  form.addEventListener("submit", async (event) => {
    event.preventDefault()

    const nombre = form.querySelector('[name="nombre"]')
    const segundoNombre = form.querySelector('[name="segundo_nombre"]')
    const email = form.querySelector('[name="email"]')
    const mensaje = form.querySelector('[name="mensaje"]')

    const campos = [nombre, segundoNombre, email, mensaje]
    let isValid = true

    campos.forEach(campo => {
      campo.classList.remove("floating-error")
      if (!campo.value.trim()) {
        campo.classList.add("floating-error")
        isValid = false
      }
    })

    if (!validateEmail(email.value.trim())) {
      email.classList.add("floating-error")
      isValid = false
    }

    if (!isValid) {
      setMessage(message, t("validationError"), "error")
      return
    }

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: {
          Accept: "application/json"
        }
      })

      if (response.ok) {
        form.reset()
        setMessage(message, t("successMessage"), "success")
      } else {
        throw new Error("Error al enviar")
      }
    } catch (error) {
      setMessage(message, t("sendError"), "error")
    }
  })
}

const initAll = () => {
  initMenuBehavior()
  initLanguageScrollRestore()
  initPageRestore()
  initFloatingContact()
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAll)
} else {
  initAll()
}