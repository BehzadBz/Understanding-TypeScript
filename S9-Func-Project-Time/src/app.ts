// Project type
enum ProjectStatus {
  Active,
  Finished,
}

type Project = {
  id: string;
  title: string;
  description: string;
  people: number;
  status: ProjectStatus;
};

// Project State Management
type Listener = (items: Project[]) => void;

const createProjectState = () => {
  let listeners: Listener[] = [];
  let projects: Project[] = [];

  const addListener = (listenerFn: Listener) => {
    listeners.push(listenerFn);
  };

  const addProject = (
    title: string,
    description: string,
    numOfPeople: number,
  ) => {
    const newProject: Project = {
      id: Math.random().toString(),
      title,
      description,
      people: numOfPeople,
      status: ProjectStatus.Active,
    };
    projects.push(newProject);
    for (const listenerFn of listeners) {
      listenerFn(projects.slice());
    }
  };

  return {
    addListener,
    addProject,
  };
};

const projectState = createProjectState();

// Validation logic
type Validatable = {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
};

const validate = (validatableInput: Validatable): boolean => {
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength;
  }
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength;
  }
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }
  return isValid;
};

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
    projectState.addProject(title, description, people);
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

const renderProjectList = (type: "active" | "finished") => {
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

  // Add a listener to update the project list when the state changes
  projectState.addListener((projects: Project[]) => {
    const filteredProjects = projects.filter((prj) => {
      if (type === "active") {
        return prj.status === ProjectStatus.Active;
      }
      return prj.status === ProjectStatus.Finished;
    });

    const listEl = document.getElementById(listId)! as HTMLUListElement;
    listEl.innerHTML = ""; // Clear the list before re-rendering
    for (const prjItem of filteredProjects) {
      const listItem = document.createElement("li");
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  });
};

// Initialize the project input
initializeProjectInput();
renderProjectList("active");
renderProjectList("finished");
