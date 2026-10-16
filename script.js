export function initializePortfolio() {
  const controller = new AbortController();
  const { signal } = controller;
  const themeToggle = document.querySelector("#theme-toggle");
  const projectDialog = document.querySelector("#project-dialog");
  const projectForm = document.querySelector("#project-form");
  const projectTrack = document.querySelector("#project-track");
  const projectDots = document.querySelector("#project-dots");
  const projectError = document.querySelector("#project-form-error");
  const projectDescription = projectForm.elements.namedItem("project-description");
  const descriptionCounter = document.querySelector("#description-counter");
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector("#site-nav");
  const projectStorageKey = "deg-portfolio-projects";
  const themeStorageKey = "deg-portfolio-theme";
  const brandMark = document.querySelector(".brand-mark");
  const codeSymbols = ["</>", "{ }", "[ ]", "=>", "01", "!= ", "&&"];

  let projects = [];
  let activeProject = 0;

  function reportStorageError(error, message) {
    console.error(message, error);
  }

  function applyTheme(theme) {
    const isDark = theme === "dark";
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Activar modo claro" : "Activar modo oscuro"
    );
    themeToggle.title = isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro";
    themeToggle.querySelector(".theme-icon").textContent = isDark ? "☀" : "☾";
    themeToggle.querySelector(".theme-label").textContent = isDark
      ? "Modo claro"
      : "Modo oscuro";
    document.querySelector('meta[name="theme-color"]').content = isDark
      ? "#171827"
      : "#f4f2e9";
  }

  function loadTheme() {
    try {
      return localStorage.getItem(themeStorageKey) === "dark" ? "dark" : "light";
    } catch (error) {
      reportStorageError(error, "No se pudo leer el tema guardado.");
      return "light";
    }
  }

  themeToggle.addEventListener("click", () => {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(theme);

    try {
      localStorage.setItem(themeStorageKey, theme);
    } catch (error) {
      reportStorageError(error, "No se pudo guardar la preferencia de tema.");
    }
  }, { signal });

  applyTheme(loadTheme());
  document.documentElement.classList.add("theme-ready");

  let currentCodeSymbol = 0;
  const brandSymbolInterval = window.setInterval(() => {
    const nextSymbols = codeSymbols
      .map((symbol, index) => ({ symbol, index }))
      .filter(({ index }) => index !== currentCodeSymbol);
    const nextSymbol = nextSymbols[Math.floor(Math.random() * nextSymbols.length)];
    currentCodeSymbol = nextSymbol.index;
    brandMark.textContent = nextSymbol.symbol.trim();
  }, 60_000);

  function normalizeUrl(value) {
    const trimmedValue = value.trim();
    if (!trimmedValue) return null;

    try {
      const url = new URL(
        /^[a-z][a-z\d+.-]*:/i.test(trimmedValue)
          ? trimmedValue
          : `https://${trimmedValue}`
      );
      if (url.protocol !== "https:" && url.protocol !== "http:") return null;
      return url.href;
    } catch {
      return null;
    }
  }

  function isGitHubRepository(url) {
    if (!url) return false;
    const parsedUrl = new URL(url);
    return (
      parsedUrl.hostname === "github.com" &&
      parsedUrl.pathname.split("/").filter(Boolean).length >= 2
    );
  }

  function isNetlifySite(url) {
    if (!url) return false;
    const hostname = new URL(url).hostname;
    return hostname.endsWith(".netlify.app") && hostname.split(".").length >= 3;
  }

  function isValidProject(project) {
    if (
      !project ||
      typeof project.name !== "string" ||
      !project.name.trim() ||
      typeof project.description !== "string" ||
      !project.description.trim() ||
      typeof project.category !== "string" ||
      !project.category.trim() ||
      (project.repository !== null && typeof project.repository !== "string") ||
      (project.demo !== null && typeof project.demo !== "string")
    ) {
      return false;
    }

    const repository = project.repository ? normalizeUrl(project.repository) : null;
    const demo = project.demo ? normalizeUrl(project.demo) : null;
    return (
      (repository || demo) &&
      (!project.repository || isGitHubRepository(repository)) &&
      (!project.demo || isNetlifySite(demo))
    );
  }

  function readProjects() {
    let savedProjects;
    try {
      savedProjects = localStorage.getItem(projectStorageKey);
    } catch (error) {
      reportStorageError(error, "No se pudieron leer los proyectos guardados.");
      return { projects: [], error: "No se pudieron leer los proyectos guardados." };
    }

    if (!savedProjects) return { projects: [], error: "" };

    try {
      const parsedProjects = JSON.parse(savedProjects);
      if (!Array.isArray(parsedProjects) || !parsedProjects.every(isValidProject)) {
        throw new TypeError("El formato de los proyectos guardados no es válido.");
      }

      return {
        projects: parsedProjects.map((project) => ({
          ...project,
          repository: project.repository ? normalizeUrl(project.repository) : null,
          demo: project.demo ? normalizeUrl(project.demo) : null
        })),
        error: ""
      };
    } catch (error) {
      reportStorageError(error, "No se pudieron cargar los proyectos guardados.");
      return { projects: [], error: "No se pudieron cargar los proyectos guardados." };
    }
  }

  function showEmptyState(message) {
    const emptyState = document.createElement("p");
    emptyState.className = "project-empty";
    emptyState.textContent = message;
    projectTrack.replaceChildren(emptyState);
  }

  function makeProjectLink(label, url) {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label;
    return link;
  }

  function renderProjects() {
    projectDots.replaceChildren();

    if (!projects.length) {
      showEmptyState("Aun no hay proyectos. Usa + Cargar proyecto para agregar el primero.");
      document.querySelector("#prev-project").disabled = true;
      document.querySelector("#next-project").disabled = true;
      return;
    }

    activeProject = (activeProject + projects.length) % projects.length;
    const project = projects[activeProject];
    const card = document.createElement("article");
    card.className = "project-card";

    const category = document.createElement("span");
    category.className = "project-category";
    category.textContent = project.category;

    const preview = document.createElement("div");
    preview.className = "project-preview";
    if (project.demo) {
      const iframe = document.createElement("iframe");
      iframe.src = project.demo;
      iframe.title = `Vista previa del proyecto ${project.name}`;
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer";
      iframe.setAttribute("sandbox", "allow-forms allow-popups allow-scripts allow-same-origin");
      preview.append(iframe);

      const previewDomain = document.createElement("span");
      previewDomain.className = "preview-domain";
      previewDomain.textContent = new URL(project.demo).hostname;
      preview.append(previewDomain);

      const openPreview = makeProjectLink("Abrir sitio", project.demo);
      openPreview.className = "preview-open-link";
      preview.append(openPreview);
    } else if (project.repository) {
      const repositoryPreview = document.createElement("a");
      repositoryPreview.className = "repository-preview";
      repositoryPreview.href = project.repository;
      repositoryPreview.target = "_blank";
      repositoryPreview.rel = "noopener noreferrer";
      repositoryPreview.textContent = "⌘  Ver repositorio en GitHub";
      preview.append(repositoryPreview);
    }

    const projectDetails = document.createElement("div");
    projectDetails.className = "project-details";
    const title = document.createElement("h3");
    title.textContent = project.name;

    const description = document.createElement("p");
    description.textContent = project.description;

    const links = document.createElement("div");
    links.className = "project-links";
    if (project.repository) {
      links.append(makeProjectLink("Ver código en GitHub", project.repository));
    }
    if (project.demo) {
      links.append(makeProjectLink("Ver proyecto en vivo", project.demo));
    }

    projectDetails.append(category, title, description, links);
    card.append(preview, projectDetails);
    projectTrack.replaceChildren(card);

    projects.forEach((item, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Mostrar proyecto ${index + 1}: ${item.name}`);
      dot.setAttribute("aria-current", String(index === activeProject));
      dot.addEventListener("click", () => {
        activeProject = index;
        renderProjects();
      }, { signal });
      projectDots.append(dot);
    });

    document.querySelector("#prev-project").disabled = projects.length < 2;
    document.querySelector("#next-project").disabled = projects.length < 2;
  }

  const storedProjectData = readProjects();
  projects = storedProjectData.projects;
  renderProjects();
  if (storedProjectData.error) showEmptyState(storedProjectData.error);

  function changeProject(direction) {
    if (projects.length < 2) return;
    activeProject = (activeProject + direction + projects.length) % projects.length;
    renderProjects();
  }

  document.querySelector("#prev-project").addEventListener("click", () => changeProject(-1), { signal });
  document.querySelector("#next-project").addEventListener("click", () => changeProject(1), { signal });

  document.querySelector("#open-project-form").addEventListener("click", () => {
    projectError.hidden = true;
    projectDialog.showModal();
  }, { signal });

  document.querySelector("#close-project-form").addEventListener("click", () => {
    projectDialog.close();
  }, { signal });

  projectDialog.addEventListener("click", (event) => {
    if (event.target === projectDialog) projectDialog.close();
  }, { signal });

  function setProjectError(message) {
    projectError.textContent = message;
    projectError.hidden = false;
  }

  function updateDescriptionField() {
    const maxLength = Number(projectDescription.maxLength);
    const currentLength = projectDescription.value.length;
    const maxHeight = 320;
    projectDescription.style.height = "auto";
    projectDescription.style.height = `${Math.min(projectDescription.scrollHeight, maxHeight)}px`;
    projectDescription.style.overflowY =
      projectDescription.scrollHeight > maxHeight ? "auto" : "hidden";
    descriptionCounter.textContent = `${currentLength} / ${maxLength} caracteres`;
  }

  projectDescription.addEventListener("input", updateDescriptionField, { signal });
  updateDescriptionField();

  projectForm.addEventListener("submit", (event) => {
    event.preventDefault();
    projectError.hidden = true;

    const nameInput = projectForm.elements.namedItem("project-name");
    const descriptionInput = projectForm.elements.namedItem("project-description");
    const categoryInput = projectForm.elements.namedItem("project-category");
    const repositoryInput = projectForm.elements.namedItem("project-repository");
    const demoInput = projectForm.elements.namedItem("project-demo");
    const repositoryText = repositoryInput.value.trim();
    const demoText = demoInput.value.trim();
    const repository = repositoryText ? normalizeUrl(repositoryText) : null;
    const demo = demoText ? normalizeUrl(demoText) : null;

    if (!nameInput.value.trim()) {
      setProjectError("El nombre del proyecto es obligatorio.");
      nameInput.focus();
      return;
    }

    if (!descriptionInput.value.trim()) {
      setProjectError("La descripcion del proyecto es obligatoria.");
      descriptionInput.focus();
      return;
    }

    if (!categoryInput.value) {
      setProjectError("Selecciona una categoria para el proyecto.");
      categoryInput.focus();
      return;
    }

    if (!repositoryText && !demoText) {
      setProjectError("Agrega al menos un enlace válido de GitHub o Netlify.");
      repositoryInput.focus();
      return;
    }

    if (!projectForm.checkValidity()) {
      projectForm.reportValidity();
      return;
    }

    if (repositoryText && !isGitHubRepository(repository)) {
      setProjectError("Ingresa el enlace de un repositorio valido de github.com.");
      repositoryInput.focus();
      return;
    }

    if (demoText && !isNetlifySite(demo)) {
      setProjectError("Ingresa un enlace valido de un sitio publicado en netlify.app.");
      demoInput.focus();
      return;
    }

    const newProject = {
      name: nameInput.value.trim(),
      description: descriptionInput.value.trim(),
      category: categoryInput.value,
      repository,
      demo
    };
    const updatedProjects = [...projects, newProject];

    try {
      localStorage.setItem(projectStorageKey, JSON.stringify(updatedProjects));
    } catch (error) {
      reportStorageError(error, "No se pudo guardar el proyecto.");
      setProjectError("No se pudo guardar el proyecto en este navegador. Intentalo de nuevo.");
      return;
    }

    projects = updatedProjects;
    activeProject = projects.length - 1;
    renderProjects();
    projectForm.reset();
    updateDescriptionField();
    projectDialog.close();
  }, { signal });

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav.classList.toggle("is-open", !isOpen);
  }, { signal });

  siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menuToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
    }
  }, { signal });

  return () => {
    controller.abort();
    window.clearInterval(brandSymbolInterval);
    document.documentElement.classList.remove("theme-ready");
  };
  }
