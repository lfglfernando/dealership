const form = document.querySelector("#updateForm")
const updateBtn = document.querySelector("#updateBtn")

if (form && updateBtn) {
  form.addEventListener("change", () => {
    updateBtn.removeAttribute("disabled")
  })
}
