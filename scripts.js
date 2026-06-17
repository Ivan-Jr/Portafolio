const enlaces = document.querySelectorAll(".menu a")
const languageLinks = document.querySelectorAll(".lang-toggle")

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
})