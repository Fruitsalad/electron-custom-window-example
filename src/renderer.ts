import './index.css';
import './drag_resize.css';
import feather from 'feather-icons';
import {init_drag_borders} from "./drag_resize";
import {explode_at} from "./explode";
import {Vec2} from "./math";
const {vec2, add, div} = Vec2;

console.log("Renderer script starting");

const $ = (id: string) => document.getElementById(id);

// Custom window-resizing borders.
init_drag_borders($("resize_borders"), 10);

// Titlebar buttons.
$("window_minimize").onclick = () => window.main.minimize();
$("window_maximize").onclick = () => window.main.toggle_maximized();
$("window_close").onclick = () => window.main.close();

// Make sure the correct icon is shown for the maximize button.
window.main.after_maximization_changed(is_maximized => {
  $("icon_maximize").classList.toggle("hidden-by-code", is_maximized);
  $("icon_unmaximize").classList.toggle("hidden-by-code", !is_maximized);
});

// Insert icons into the page.
feather.replace();

// Add a particle effect for when you click the logo button.
// (Completely unnecessary but I wanted something to happen when you click it)
$("app_icon").onclick = () => explode_at(get_center($("app_icon")));
$("search_button").onclick = () => explode_at(get_center($("search_button")));

function get_center(node: HTMLElement): Vec2 {
  const rect = node.getBoundingClientRect();
  const pos = vec2(rect.x, rect.y);
  const size = vec2(rect.width, rect.height);
  return add(pos, div(size, 2));
}


