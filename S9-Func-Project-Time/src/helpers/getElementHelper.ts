// Helper function to get an element by ID and assert its type
export const getElement = <T extends HTMLElement>(
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
