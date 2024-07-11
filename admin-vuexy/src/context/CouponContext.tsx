import React, { ReactNode, createContext, useContext, useState } from "react";

interface CouponContextType {
  checkedItems: any[];
  updateCheckedItems: (newItems: any[]) => void;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export const useCheckedItems = (): CouponContextType => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error("Error occurred in coupon context provider");
  }
  return context;
};

interface CouponContextProviderProps {
  children: ReactNode;
}

export const CouponContextProvider: React.FC<CouponContextProviderProps> = ({
  children,
}: CouponContextProviderProps) => {
  const [checkedItems, setCheckedItems] = useState<any[]>([]);

  const updateCheckedItems = (newItems: any[]) => {
    setCheckedItems(newItems);
  };

  const contextValue: CouponContextType = {
    checkedItems,
    updateCheckedItems,
  };

  return (
    <CouponContext.Provider value={contextValue}>
      {children}
    </CouponContext.Provider>
  );
};
