import { useEffect, useState } from "react";

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const validateCouponCode = (couponCode: string) => {
  if (!couponCode) {
    return "";
  }

  const regex = /^[A-Z0-9]+$/;
  if (!regex.test(couponCode)) {
    return "Please ensure code requirements suggested in the tooltip. ";
  }

  return null;
};

export const parseHtmlResponse = (htmlResponse: any) => {
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(htmlResponse, "text/html");

  if (htmlDoc.body.firstChild) {
    return htmlDoc.body.firstChild.textContent;
  } else {
    return "";
  }
};
