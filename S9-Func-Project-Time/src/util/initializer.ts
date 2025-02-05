// Main function to initialize the project input
import { importTemplate } from "../helpers/importTemplateHelper.js";
import { getInputElements } from "../helpers/getInputElements.js";
import { submitHandler } from "./submitHandler.js";
import { attachElement } from "../helpers/attachElementHelper.js";

export const initializeProjectInput = () => {
  const templateId = "project-input";
  const hostId = "app";

  // Import the template and get the form element
  const importedNode = importTemplate(templateId);
  const formElement = importedNode.firstElementChild as HTMLFormElement;
  formElement.id = "user-input";

  // Get input elements from the form
  const inputs = getInputElements(formElement);

  // Configure the form with the submit handler
  formElement.addEventListener("submit", (e) => submitHandler(e, inputs));

  // Attach the form to the host element
  attachElement(hostId, formElement);
};
