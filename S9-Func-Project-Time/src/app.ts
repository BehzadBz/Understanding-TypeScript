// Helper function to get an element by ID and assert its type
const getElement = <T extends HTMLElement>(
  id: string,
  elementType: new () => T,
): T => {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element with id "${id}" not found.`);
  }
  if (!(element instanceof elementType)) {
    throw new Error(
      `Element with id "${id}" is not of type ${elementType.name}.`,
    );
  }
  return element as T;
};

// Helper function to import template content
const importTemplate = (templateId: string): DocumentFragment => {
  const template = getElement(templateId, HTMLTemplateElement);
  return document.importNode(template.content, true);
};

// Helper function to attach an element to the DOM
const attachElement = (
  hostId: string,
  element: HTMLElement,
  position: InsertPosition = "afterbegin",
) => {
  const hostElement = getElement(hostId, HTMLDivElement);
  hostElement.insertAdjacentElement(position, element);
};

// Helper function to get input elements from the form
const getInputElements = (formElement: HTMLFormElement) => {
  return {
    titleInput: formElement.querySelector("#title") as HTMLInputElement,
    descriptionInput: formElement.querySelector(
      "#description",
    ) as HTMLInputElement,
    peopleInput: formElement.querySelector("#people") as HTMLInputElement,
  };
};

// Helper function to gather user input
const gatherUserInput = (inputs: {
  titleInput: HTMLInputElement;
  descriptionInput: HTMLInputElement;
  peopleInput: HTMLInputElement;
}): [string, string, number] | void => {
  const enteredTitle = inputs.titleInput.value;
  const enteredDescription = inputs.descriptionInput.value;
  const enteredPeople = inputs.peopleInput.value;

  if (
    enteredTitle.trim().length === 0 ||
    enteredDescription.trim().length === 0 ||
    enteredPeople.trim().length === 0
  ) {
    alert("Invalid input, please try again!");
    return;
  } else {
    return [enteredTitle, enteredDescription, +enteredPeople];
  }
};

// Helper function to clear input fields
const clearInputs = (inputs: {
  titleInput: HTMLInputElement;
  descriptionInput: HTMLInputElement;
  peopleInput: HTMLInputElement;
}) => {
  inputs.titleInput.value = "";
  inputs.descriptionInput.value = "";
  inputs.peopleInput.value = "";
};

// Submit handler function
const submitHandler = (
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
    console.log(title, description, people);
    clearInputs(inputs);
  }
};

// Main function to initialize the project input
const initializeProjectInput = () => {
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

// Initialize the project input
initializeProjectInput();
