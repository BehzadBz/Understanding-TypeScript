// Function to render a single project item
import { Project } from "../models/projectType.js";
import { importTemplate } from "../helpers/importTemplateHelper.js";
import { getElement } from "../helpers/getElementHelper.js";

export const renderProjectItem = (hostId: string, project: Project) => {
  const templateId = "single-project";
  const hostElement = getElement(hostId, HTMLUListElement);

  // Import the template and get the list item element
  const importedNode = importTemplate(templateId);
  const listItemElement = importedNode.firstElementChild as HTMLLIElement;
  listItemElement.id = project.id;

  // Render the content
  const personsText =
    project.people === 1 ? "1 person" : `${project.people} persons`;
  listItemElement.querySelector("h2")!.textContent = project.title;
  listItemElement.querySelector("h3")!.textContent = `${personsText} assigned`;
  listItemElement.querySelector("p")!.textContent = project.description;

  // Add drag event listeners
  listItemElement.addEventListener("dragstart", (event) => {
    event.dataTransfer!.setData("text/plain", project.id);
    event.dataTransfer!.effectAllowed = "move";
  });

  listItemElement.addEventListener("dragend", (_) => {
    console.log("DragEnd");
  });

  // Attach the list item to the host element
  hostElement.appendChild(listItemElement);
};
