// Helper function to attach an element to the DOM
import { getElement } from "./getElementHelper.js";

export const attachElement = (
  hostId: string,
  element: HTMLElement,
  position: InsertPosition = "afterbegin",
) => {
  const hostElement = getElement(hostId, HTMLDivElement);
  hostElement.insertAdjacentElement(position, element);
};
