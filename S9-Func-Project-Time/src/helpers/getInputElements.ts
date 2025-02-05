// Helper function to get input elements from the form
export const getInputElements = (formElement: HTMLFormElement) => {
  return {
    titleInput: formElement.querySelector("#title") as HTMLInputElement,
    descriptionInput: formElement.querySelector(
      "#description",
    ) as HTMLInputElement,
    peopleInput: formElement.querySelector("#people") as HTMLInputElement,
  };
};
