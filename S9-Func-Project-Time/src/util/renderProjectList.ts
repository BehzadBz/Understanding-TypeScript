import { attachElement } from "../helpers/attachElementHelper.js";
import { importTemplate } from "../helpers/importTemplateHelper.js";
import { projectState } from "../state/projectStateManagement.js";
import { Project, ProjectStatus } from "../models/projectType.js";
import { renderProjectItem } from "./renderProjectItems.js";

export const renderProjectList = (type: "active" | "finished") => {
  const templateId = "project-list";
  const hostId = "app";

  // Import the template and get the list element
  const importedNode = importTemplate(templateId);
  const listElement = importedNode.firstElementChild as HTMLElement;
  listElement.id = `${type}-projects`;

  // Render the content
  const listId = `${type}-projects-list`;
  listElement.querySelector("ul")!.id = listId;
  listElement.querySelector("h2")!.textContent =
    `${type.toUpperCase()} PROJECTS`;

  // Attach the list to the host element
  attachElement(hostId, listElement, "beforeend");

  // Add drag & drop event listeners
  const listEl = listElement.querySelector("ul")!;
  listEl.addEventListener("dragover", (event) => {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      listEl.classList.add("droppable");
    }
  });

  listEl.addEventListener("dragleave", (_) => {
    listEl.classList.remove("droppable");
  });

  listEl.addEventListener("drop", (event) => {
    const prjId = event.dataTransfer!.getData("text/plain");
    projectState.moveItem(
      prjId,
      type === "active" ? ProjectStatus.Active : ProjectStatus.Finished,
    );
    listEl.classList.remove("droppable");
  });

  // Add a listener to update the project list when the state changes
  projectState.addListener((projects: Project[]) => {
    const filteredProjects = projects.filter((prj) => {
      if (type === "active") {
        return prj.status === ProjectStatus.Active;
      } else {
        return prj.status === ProjectStatus.Finished;
      }
    });

    const listEl = document.getElementById(listId)! as HTMLUListElement;
    listEl.innerHTML = ""; // Clear the list before re-rendering
    for (const prjItem of filteredProjects) {
      renderProjectItem(listId, prjItem);
    }
  });
};
