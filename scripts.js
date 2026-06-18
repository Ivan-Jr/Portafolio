const enlaces = document.querySelectorAll(".menu a")
const languageLinks = document.querySelectorAll(".lang-toggle")

const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const setMessage = (element, message, type) => {
  element.textContent = message
  element.className = `mensaje-form ${type}`
}

enlaces.forEach(enlace => {
  enlace.addEventListener("click", function () {
    enlaces.forEach(e => e.classList.remove("activo"))
    this.classList.add("activo")
  })
})

languageLinks.forEach(link => {
  link.addEventListener("click", () => {
    sessionStorage.setItem("translationScrollPosition", window.scrollY.toString())
    const targetName = new URL(link.href, location.href).pathname.split("/").pop()
    sessionStorage.setItem("translationTargetFile", targetName)
  })
})

window.addEventListener("DOMContentLoaded", () => {
  const savedPosition = sessionStorage.getItem("translationScrollPosition")
  const savedTargetFile = sessionStorage.getItem("translationTargetFile")
  const currentFile = location.pathname.split("/").pop()
  if (savedPosition !== null && savedTargetFile === currentFile) {
    window.scrollTo({ top: parseInt(savedPosition, 10), behavior: "auto" })
  }
  sessionStorage.removeItem("translationScrollPosition")
  sessionStorage.removeItem("translationTargetFile")

  const contactForm = document.getElementById("contact-form")
  if (!contactForm) return

  const message = document.getElementById("form-message")

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    const nombre = contactForm.querySelector('[name="nombre"]')
    const segundoNombre = contactForm.querySelector('[name="segundo_nombre"]')
    const email = contactForm.querySelector('[name="email"]')
    const mensaje = contactForm.querySelector('[name="mensaje"]')

    const campos = [nombre, segundoNombre, email, mensaje]
    let isValid = true

    campos.forEach(campo => {
      campo.classList.remove("campo-error")
      if (!campo.value.trim()) {
        campo.classList.add("campo-error")
        isValid = false
      }
    })

    if (!validateEmail(email.value.trim())) {
      email.classList.add("campo-error")
      isValid = false
    }

    if (!isValid) {
      setMessage(message, "Por favor completa todos los campos obligatorios y usa un correo válido.", "error")
      return
    }

    try {
      const response = await fetch(contactForm.action, {
        method: contactForm.method,
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json"
        }
      })

      if (response.ok) {
        contactForm.reset()
        setMessage(message, "Mensaje enviado correctamente. Gracias por contactarme.", "success")
      } else {
        throw new Error("No se pudo enviar el mensaje.")
      }
    } catch (error) {
      setMessage(message, "No se pudo enviar el formulario en este momento. Intenta nuevamente más tarde.", "error")
    }
  })
})