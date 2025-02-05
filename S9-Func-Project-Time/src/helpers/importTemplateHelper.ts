// Helper function to import template content
import { getElement } from "./getElementHelper.js";

export const importTemplate = (templateId: string): DocumentFragment => {
  const template = getElement(templateId, HTMLTemplateElement);
  return document.importNode(template.content, true);
};
