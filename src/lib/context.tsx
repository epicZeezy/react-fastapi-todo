"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Order, OrderItem, ShapeName, UserProfile } from "@/types";

export type CartItem = OrderItem & {
  accentShape: ShapeName;
};

type AppStateContextValue = {
  selectedShape: ShapeName | null;
  selectedTransform: string | null;
  profile: UserProfile | null;
  orders: Order[];
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setShape: (shape: ShapeName | null) => void;
  setTransform: (transform: string | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: (items: OrderItem[]) => Order;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [selectedShape, setSelectedShape] = useState<ShapeName | null>(null);
  const [selectedTransform, setSelectedTransform] = useState<string | null>(
    null,
  );
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const setShape = useCallback((shape: ShapeName | null) => {
    setSelectedShape(shape);
  }, []);

  const setTransform = useCallback((transform: string | null) => {
    setSelectedTransform(transform);
  }, []);

  const setProfile = useCallback((next: UserProfile | null) => {
    setProfileState(next);
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((open) => !open), []);

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.productId === item.productId);
      if (existing) {
        return prev.map((p) =>
          p.productId === item.productId
            ? { ...p, quantity: p.quantity + item.quantity }
            : p,
        );
      }
      return [...prev, item];
    });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      setCart((prev) => {
        if (quantity <= 0) {
          return prev.filter((p) => p.productId !== productId);
        }
        return prev.map((p) =>
          p.productId === productId ? { ...p, quantity } : p,
        );
      });
    },
    [],
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((p) => p.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const placeOrder = useCallback(
    (items: OrderItem[]): Order => {
      const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const order: Order = {
        id: crypto.randomUUID(),
        userId: profile?.id ?? "guest",
        items,
        total,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };
      setOrders((prev) => [...prev, order]);
      setCart([]);
      return order;
    },
    [profile],
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, i) => sum + i.quantity, 0),
    [cart],
  );
  const cartSubtotal = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cart],
  );

  const value = useMemo<AppStateContextValue>(
    () => ({
      selectedShape,
      selectedTransform,
      profile,
      orders,
      cart,
      cartCount,
      cartSubtotal,
      isCartOpen,
      setShape,
      setTransform,
      setProfile,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      placeOrder,
    }),
    [
      selectedShape,
      selectedTransform,
      profile,
      orders,
      cart,
      cartCount,
      cartSubtotal,
      isCartOpen,
      setShape,
      setTransform,
      setProfile,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
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
