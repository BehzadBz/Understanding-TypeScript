// Drag & Drop Types
export type Draggable = {
  dragStartHandler: (event: DragEvent) => void;
  dragEndHandler: (event: DragEvent) => void;
};

export type DragTarget = {
  dragOverHandler: (event: DragEvent) => void;
  dropHandler: (event: DragEvent) => void;
  dragLeaveHandler: (event: DragEvent) => void;
};
