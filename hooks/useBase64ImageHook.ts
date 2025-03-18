import React, { useEffect, useState } from "react";

const useBase64Image = (url: string) => {
  const [base64Image, setBase64Image] = useState<string | ArrayBuffer | null>(null);

  useEffect(() => {
    if (!url) return;
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => setBase64Image(reader.result);
        reader.readAsDataURL(blob);
      })
      .catch((err) => {
        console.error("Error converting image:", err);
      });
  }, [url]);

  return base64Image;
};

export default useBase64Image;
