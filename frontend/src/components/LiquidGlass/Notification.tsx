import React from "react";
import { createRoot } from "react-dom/client";

export type NotificationPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center";

type NotificationOptions = {
  message: string;
  duration?: number;
  position?: NotificationPosition;
}

const containers: Record<NotificationPosition, HTMLElement | null> = {
  "top-left": null,
  "top-right": null,
  "bottom-left": null,
  "bottom-right": null,
  "center": null,
};

function getContainer(position: NotificationPosition) {
  if (containers[position]) return containers[position];

  const container = document.createElement("div");
  container.className = `fixed z-50 pointer-events-none flex flex-col ${
    position.includes("top") ? "top-4" : "bottom-4"
  } ${
    position.includes("left")
      ? "left-4"
      : position.includes("right")
      ? "right-4"
      : "left-1/2 transform -translate-x-1/2"
  } gap-2`;

  document.body.appendChild(container);
  containers[position] = container;
  return container;
}

export function notify({
  message,
  duration = 3000,
  position = "center",
}: NotificationOptions) {
  const container = getContainer(position);

  const notifDiv = document.createElement("div");
  notifDiv.className = "pointer-events-auto";

  container.appendChild(notifDiv);
  const root = createRoot(notifDiv);

  const Notification = () => {
    const [visible, setVisible] = React.useState(false);

    React.useEffect(() => {
      setVisible(true);

      const timer = setTimeout(() => setVisible(false), duration);

      const removeTimer = setTimeout(() => {
        root.unmount();
        notifDiv.remove();
      }, duration + 300);

      return () => {
        clearTimeout(timer);
        clearTimeout(removeTimer);
      };
    }, [duration]);

    return (
      <div
        className={`
          transition-all duration-300 transform
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
        `}
      >
        <div className="backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-4 bg-white/10 text-white max-w-xs">
          {message}
        </div>
      </div>
    );
  };

  root.render(<Notification />);
}
