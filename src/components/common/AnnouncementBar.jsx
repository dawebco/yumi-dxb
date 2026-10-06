import { useEffect, useState } from "react";

const messages = [
  "Customer Care / WhatsApp: +91 7349558926",
  "Follow Us @yumi_dxb on Instagram",
];

export default function AnnouncementBar() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="bg-[#2E2A27] text-white text-sm">

      <div className="max-w-7xl mx-auto h-10 flex items-center justify-center relative px-12">

        <p
          key={currentMessage}
          className="animate-fade tracking-wide text-center"
        >
          {messages[currentMessage]}
        </p>

        <button
          onClick={() => setVisible(false)}
          className="absolute right-4 text-lg hover:text-[#C3A274] transition duration-300"
        >
          ✕
        </button>

      </div>

    </div>
  );
}