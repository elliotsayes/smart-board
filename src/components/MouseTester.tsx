import { useEffect, useState } from 'react';

function MouseTester() {
  const [mousePos, setMousePos] = useState<{x: number, y: number}>();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener(
        'mousemove',
        handleMouseMove
      );
    };
  }, []);

  return (
    <div>
      The mouse is at position{' '}
      <b>
        ({mousePos?.x}, {mousePos?.y})
      </b>
    </div>
  );
}

export default MouseTester;
