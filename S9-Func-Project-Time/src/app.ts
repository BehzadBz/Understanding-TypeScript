// Initialize the project input and project lists
import { initializeProjectInput } from "./util/initializer.js";
import { renderProjectList } from "./util/renderProjectList.js";

initializeProjectInput();
renderProjectList("active");
renderProjectList("finished");
