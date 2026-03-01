import { Rnd } from "react-rnd";
import { useRef } from "react";

interface StickerProps {
  img: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onChange?: (pos: { x: number; y: number; width?: number; height?: number }) => void;
}

const Sticker = ({ img, onClick, onDoubleClick, onChange }: StickerProps) => {
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    if (clickTimeout.current) {
      // 두 번째 클릭: 더블클릭
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
      onDoubleClick?.();
    } else {
      // 첫 번째 클릭
      clickTimeout.current = setTimeout(() => {
        onClick?.();
        clickTimeout.current = null;
      }, 250); // 250ms 내 두 번 클릭 시 더블클릭으로 처리
    }
  };

  return (
    <Rnd
      default={{
        x: 100,
        y: 100,
        width: 40,
        height: 40,
      }}
      bounds="parent"
      style={{ zIndex: 10 }}
      dragGrid={[1, 1]}
      onDragStop={(e, d) => {
        onChange?.({ x: d.x, y: d.y });
      }}
      onDrag={(e) => {
        e.stopPropagation();
      }}
      onResizeStop={(e, dir, ref, delta, position) => {
        onChange?.({
          x: position.x,
          y: position.y,
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        });
      }}
    >
      <img
        src={img}
        alt="sticker"
        style={{ width: "100%", height: "100%", cursor: "pointer" }}
        onClick={handleClick}
      />
    </Rnd>
  );
};

export default Sticker;