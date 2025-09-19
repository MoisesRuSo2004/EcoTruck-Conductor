import { useEffect, useState } from "react";

const Clock = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options = {
        hour: "2-digit",
        minute: "2-digit",
        //second: "2-digit",
        timeZone: "America/Bogota",
      };
      setTime(now.toLocaleTimeString("en-US", options));
    };

    updateClock(); // inicial
    const interval = setInterval(updateClock, 1000); // actualiza cada segundo

    return () => clearInterval(interval); // limpia al desmontar
  }, []);

  return (
    <div
      className="
      text-gray-100
      font-mono font-bold
      bg-[#5c5c5e]
      px-2 py-1 rounded-md       /* base (móviles) */
      text-lg                    /* base: tamaño pequeño */
      sm:text-xl sm:px-3 sm:py-2 /* tablets */
      md:text-2xl md:px-4 md:py-2 /* pantallas medianas */
      lg:text-3xl lg:px-5 lg:py-3 /* pantallas grandes */
    "
    >
      {time}
    </div>
  );
};

export default Clock;
