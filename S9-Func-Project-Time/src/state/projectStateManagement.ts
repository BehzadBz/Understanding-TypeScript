// Project State Management
import { Project, ProjectStatus } from "../models/projectType.js";

type Listener<T> = (items: T[]) => void;

export const createState = <T extends Project>() => {
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

export const projectState = createState<Project>();
