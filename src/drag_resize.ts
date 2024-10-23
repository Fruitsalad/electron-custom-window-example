import {Vec2} from './math';
const {vec2, sub, max} = Vec2;

// This isn't strictly necessary, because Electron itself already ensures a
// minimum window size.
const MIN_WINDOW_SIZE = vec2(10, 10);

// After calling this function, clicking and dragging on the given `node` will
// resize the window. The parameter `drag_region_width` determines how thick the
// draggable edges are (that's especially relevant for the behaviour of corners)
export function init_drag_borders(node: HTMLElement, drag_region_width: number) {
  let is_dragging = false;
  let drag_device = -1;
  let drag_start_pos = vec2(0, 0);  // In desktop space
  let drag_start_window_pos = vec2(0, 0);
  let drag_start_window_size = vec2(1, 1);
  let drag_region = vec2(0, 0);

  node.addEventListener("pointerdown", on_pointer_down);
  node.addEventListener("pointermove", on_pointer_move);
  node.addEventListener("pointerup", on_pointer_up);


  // Events

  async function on_pointer_down(e: PointerEvent) {
    // Should be the primary button of the primary pointer.
    if (e.button !== 0 || !e.isPrimary)
      return;

    // Capture the pointer. This way we still get pointer events if the cursor
    // leaves the window.
    // @ts-ignore  setPointerCapture
    if (e.target.setPointerCapture)  // @ts-ignore  setPointerCapture
      e.target.setPointerCapture(e.pointerId);

    // Determine the drag region (which window edge or corner was clicked).
    const region = get_drag_region(vec2(e.x, e.y));

    // Start dragging. (Just storing info for later use in `on_pointer_move`)
    // @ts-ignore  window.main
    const bounds = await window.main.get_window_bounds();
    is_dragging = true;
    drag_device = get_device(e);
    drag_region = region;
    drag_start_pos = vec2(e.screenX, e.screenY);
    drag_start_window_pos = vec2(bounds.x, bounds.y);
    drag_start_window_size = vec2(bounds.width, bounds.height);
  }

  function on_pointer_up(e: PointerEvent) {
    if (get_device(e) === drag_device || e.button === 0)
      is_dragging = false;
  }

  function on_pointer_move(e: PointerEvent) {
    // Make sure we're dragging and that it's the same device.
    if (!is_dragging || get_device(e) !== drag_device)
      return;

    // Determine the cursor's difference in position since the start of the drag
    const cursor_pos = vec2(e.screenX, e.screenY);
    const diff = sub(cursor_pos, drag_start_pos);

    // Use that difference to calculate new window bounds.
    const {pos, size} = determine_new_bounds(
      drag_start_window_pos, drag_start_window_size, diff, drag_region
    );

    // Move & resize the window.
    // @ts-ignore
    window.main.set_window_bounds({
      x: pos.x, y: pos.y, width: size.x, height: size.y
    });
  }

  function get_device(e: PointerEvent) {
    // @ts-ignore  Undefined is handled by the coalescing operator.
    return e.persistentDeviceId ?? e.pointerId;
  }


  // Drag regions

  function determine_new_bounds(
    old_pos: Vec2, old_size: Vec2, diff: Vec2, region: Vec2
  ): { pos: Vec2, size: Vec2 } {
    const [x, w] = get_new_bounds_1D(old_pos.x, old_size.x, diff.x, region.x);
    const [y, h] = get_new_bounds_1D(old_pos.y, old_size.y, diff.y, region.y);
    return {
      pos: vec2(x, y),
      size: max(vec2(w, h), MIN_WINDOW_SIZE)
    };
  }

  function get_new_bounds_1D(
    x: number, width: number, diff: number, drag_region: number
  ): Array<number> {
    // If we're dragging from the left, move & shrink the window
    if (drag_region === -1)
      return [x + diff, width - diff];
    // If we're dragging from the right, grow the window
    if (drag_region === 1)
      return [x, width + diff];
    // If we're dragging from the middle, do nothing
    return [x, width];
  }

  function get_drag_region(body_pos: Vec2): Vec2 {
    const body_size = vec2(node.offsetWidth, node.offsetHeight);
    const x = get_drag_region_1D(body_pos.x, body_size.x);
    const y = get_drag_region_1D(body_pos.y, body_size.y);
    return vec2(x, y);
  }

  function get_drag_region_1D(x: number, width: number): number {
    if (x < drag_region_width)
      return -1;
    if (x >= width - drag_region_width)
      return 1;
    return 0;
  }
}



