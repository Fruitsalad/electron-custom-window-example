import './index.css';
import './drag_resize.css';
import {DragBorders} from "./drag_resize";

console.log("Renderer script starting");

const REGION_WIDTH = 10;
const resize_area = document.getElementById("resize_borders");
DragBorders(resize_area, REGION_WIDTH);

