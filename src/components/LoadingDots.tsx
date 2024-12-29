import { useEffect, useState } from "react";
import { renderToString } from "react-dom/server";

export const LoadingDots: React.FC<React.ComponentPropsWithoutRef<"div">> = (
  {children,...props}
) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => {
        switch (prevDots) {
          case "":
            return ".";
          case ".":
            return "..";
          case "..":
            return "...";
          case "...":
            return "";
          default:
            return "";
        }
      });
    }, 500); // Adjust the interval for speed

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, []);

  let paddedDots = dots;
  if (dots.length < 3) {
      paddedDots += '&nbsp;'.repeat(3 - dots.length);
  }

  return <div dangerouslySetInnerHTML={{ __html: `${renderToString(children)}${paddedDots}` }} {...props} />;
};