"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Order, ShapeName, UserProfile } from "@/types";

export type PlaceOrderInput = {
  productId: string;
  productName: string;
  shapePath: string;
  price: number;
};

type AppStateContextValue = {
  selectedShape: ShapeName | null;
  selectedTransform: string | null;
  profile: UserProfile | null;
  orders: Order[];
  setShape: (shape: ShapeName | null) => void;
  setTransform: (transform: string | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  placeOrder: (input: PlaceOrderInput) => Order;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [selectedShape, setSelectedShape] = useState<ShapeName | null>(null);
  const [selectedTransform, setSelectedTransform] = useState<string | null>(
    null,
  );
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const setShape = useCallback((shape: ShapeName | null) => {
    setSelectedShape(shape);
  }, []);

  const setTransform = useCallback((transform: string | null) => {
    setSelectedTransform(transform);
  }, []);

  const setProfile = useCallback((next: UserProfile | null) => {
    setProfileState(next);
  }, []);

  const placeOrder = useCallback(
    (input: PlaceOrderInput): Order => {
      const order: Order = {
        id: crypto.randomUUID(),
        userId: profile?.id ?? "guest",
        productId: input.productId,
        productName: input.productName,
        shapePath: input.shapePath,
        price: input.price,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };
      setOrders((prev) => [...prev, order]);
      return order;
    },
    [profile],
  );

  const value = useMemo<AppStateContextValue>(
    () => ({
      selectedShape,
      selectedTransform,
      profile,
      orders,
      setShape,
      setTransform,
      setProfile,
      placeOrder,
    }),
    [
      selectedShape,
      selectedTransform,
      profile,
      orders,
      setShape,
      setTransform,
      setProfile,
      placeOrder,
    ],
  );

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  );
}

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return ctx;
}
