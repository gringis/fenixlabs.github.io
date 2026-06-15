document.addEventListener("DOMContentLoaded", () => {
  const members = document.querySelectorAll("[data-member]");
  const image = document.querySelector("[data-selected-image]");
  const number = document.querySelector("[data-selected-number]");
  const name = document.querySelector("[data-selected-name]");
  const role = document.querySelector("[data-selected-role]");
  const description = document.querySelector("[data-selected-description]");
  const fullName = document.querySelector("[data-selected-fullname]");
  const group = document.querySelector("[data-selected-group]");
  const area = document.querySelector("[data-selected-area]");
  const contribution = document.querySelector("[data-selected-contribution]");
  const stage = document.querySelector(".team-select-stage");
  let currentIndex = 0;
  let autoRotate = null;

  if (!members.length || !image || !number || !name || !role || !description) return;

  function selectMember(member) {
    currentIndex = [...members].indexOf(member);
    members.forEach((item) => item.classList.remove("is-selected"));
    member.classList.add("is-selected");

    stage?.classList.remove("is-switching");
    void stage?.offsetWidth;
    stage?.classList.add("is-switching");

    image.src = member.dataset.image;
    image.alt = `Foto de ${member.dataset.name}`;
    number.textContent = member.dataset.number;
    name.textContent = member.dataset.name;
    role.textContent = member.dataset.role;
    description.textContent = member.dataset.description;
    if (fullName) fullName.textContent = member.dataset.fullname || member.dataset.name;
    if (group) group.textContent = member.dataset.group || "4° E";
    if (area) area.textContent = member.dataset.area || member.dataset.role;
    if (contribution) contribution.textContent = member.dataset.contribution || member.dataset.description;
  }

  function rotateMember() {
    currentIndex = (currentIndex + 1) % members.length;
    selectMember(members[currentIndex]);
  }

  function restartAutoRotate() {
    window.clearInterval(autoRotate);
    autoRotate = window.setInterval(rotateMember, 10000);
  }

  image.addEventListener("error", () => {
    image.removeAttribute("src");
    image.alt = "Imagen pendiente del integrante";
  });

  members.forEach((member) => {
    member.addEventListener("click", () => {
      selectMember(member);
      restartAutoRotate();
    });
  });

  restartAutoRotate();
});
