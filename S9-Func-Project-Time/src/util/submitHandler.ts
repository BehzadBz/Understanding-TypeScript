// Submit handler function
import { gatherUserInput } from "../helpers/gatherUserInputHelper.js";
import { projectState } from "../state/projectStateManagement.js";
import { ProjectStatus } from "../models/projectType.js";
import { clearInputs } from "../helpers/clearInputsHelper.js";

export const submitHandler = (
  event: Event,
  inputs: {
    titleInput: HTMLInputElement;
    descriptionInput: HTMLInputElement;
    peopleInput: HTMLInputElement;
  },
) => {
  event.preventDefault();
  const userInput = gatherUserInput(inputs);
  if (Array.isArray(userInput)) {
    const [title, description, people] = userInput;
    projectState.addItem({
      id: Math.random().toString(),
      title,
      description,
      people,
      status: ProjectStatus.Active,
    });
    clearInputs(inputs);
  }
};
