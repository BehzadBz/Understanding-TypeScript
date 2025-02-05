// Helper function to clear input fields
export const clearInputs = (inputs: {
  titleInput: HTMLInputElement;
  descriptionInput: HTMLInputElement;
  peopleInput: HTMLInputElement;
}) => {
  inputs.titleInput.value = "";
  inputs.descriptionInput.value = "";
  inputs.peopleInput.value = "";
};
