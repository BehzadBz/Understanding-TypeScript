// Drag & Drop Types
type Draggable = {
  dragStartHandler: (event: DragEvent) => void;
  dragEndHandler: (event: DragEvent) => void;
};

type DragTarget = {
  dragOverHandler: (event: DragEvent) => void;
  dropHandler: (event: DragEvent) => void;
  dragLeaveHandler: (event: DragEvent) => void;
};

// Project Type
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
type Listener<T> = (items: T[]) => void;

const createState = <T extends Project>() => {
  let listeners: Listener<T>[] = [];
  let items: T[] = [];

  const addListener = (listenerFn: Listener<T>) => {
    listeners.push(listenerFn);
  };

  const addItem = (item: T) => {
    items.push(item);
    updateListeners();
  };

  const moveItem = (itemId: string, newStatus: ProjectStatus) => {
    const item = items.find((itm) => (itm as Project).id === itemId);
    if (item && (item as Project).status !== newStatus) {
      (item as Project).status = newStatus;
      updateListeners();
    }
  };

  const updateListeners = () => {
    for (const listenerFn of listeners) {
      listenerFn(items.slice());
    }
  };

  return {
    addListener,
    addItem,
    moveItem,
  };
};

const projectState = createState<Project>();

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

// Function to render a single project item
const renderProjectItem = (hostId: string, project: Project) => {
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

// Initialize the project input and project lists
initializeProjectInput();
renderProjectList("active");
renderProjectList("finished");
