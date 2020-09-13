import { throttle } from 'core/utils';
import { $ } from 'core/dom';

export function resizeHandler($root, event) {
  return new Promise((resolve) => {
    const $resizer = $(event.target);
    const type = $resizer.data.resize;
    let newWidth = null;
    let newHeight = null;
    const $parent = $resizer.closest('[data-type="resizable"]');
    const sideProp = type === 'col' ? 'bottom' : 'right';
    $resizer.css({ opacity: 1, zIndex: 1000, [sideProp]: '-5000px' });

    document.onmousemove = throttle((e) => {
      if (type === 'col') {
        const { right, width } = $parent.getCoords();
        const delta = Math.floor(e.pageX - right);
        newWidth = width + delta;
        $resizer.css({ right: `${-delta}px` });
      } else if (type === 'row') {
        const { bottom, height } = $parent.getCoords();
        const delta = Math.floor(e.pageY - bottom);
        newHeight = height + delta;
        $resizer.css({ bottom: `${-delta}px` });
      }
    }, 16);

    document.onmouseup = () => {
      if (type === 'col') {
        $parent.css({ width: `${newWidth}px` });
        const dataCells = $root.findAll(
          `.cell[data-col="${$parent.data.col}"]`
        );
        dataCells.forEach((cell) => {
          cell.style.width = `${newWidth}px`;
        });
      } else {
        $parent.css({ height: `${newHeight}px` });
      }

      resolve({
        value: newWidth ?? newHeight,
        id: type === 'col' ? +$parent.data.col : +$parent.data.row,
        type,
      });
      $resizer.css({ opacity: 0, bottom: 0, right: 0 });
      document.onmousemove = null;
      document.onmouseup = null;
    };
  });
}
