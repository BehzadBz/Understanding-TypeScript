// Helper function to gather user input
import { Validatable, validate } from "../util/validation.js";

export const gatherUserInput = (inputs: {
  titleInput: HTMLInputElement;
  descriptionInput: HTMLInputElement;
  peopleInput: HTMLInputElement;
}): [string, string, number] | void => {
  const enteredTitle = inputs.titleInput.value;
  const enteredDescription = inputs.descriptionInput.value;
  const enteredPeople = inputs.peopleInput.value;

  const titleValidatable: Validatable = {
    value: enteredTitle,
    required: true,
  };
  const descriptionValidatable: Validatable = {
    value: enteredDescription,
    required: true,
    minLength: 5,
  };
  const peopleValidatable: Validatable = {
    value: +enteredPeople,
    required: true,
    min: 1,
    max: 5,
  };

  if (
    !validate(titleValidatable) ||
    !validate(descriptionValidatable) ||
    !validate(peopleValidatable)
  ) {
    alert("Invalid input, please try again!");
    return;
  } else {
    return [enteredTitle, enteredDescription, +enteredPeople];
  }
};
