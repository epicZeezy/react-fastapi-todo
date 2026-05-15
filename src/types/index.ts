export type ShapeName =
  | "circle"
  | "square"
  | "triangle"
  | "rectangle"
  | "hexagon";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  favoriteShape: ShapeName;
  categories: string[];
  stylePreference: "minimal" | "bold" | "classic" | "playful";
  priceRange: { min: number; max: number };
  summary?: string;
}

export interface ShapeTransformation {
  name: string;
  description: string;
  geometryType: string;
}

export interface Shape {
  id: string;
  name: ShapeName;
  displayName: string;
  transformsInto: ShapeTransformation[];
  description: string;
}

export interface Product {
  id: string;
  name: string;
  baseShape: ShapeName;
  expandedShape: string;
  category: string;
  price: number;
  imageUrl: string;
  reason: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  shapePath: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "confirmed" | "processing" | "shipped";
  createdAt: string;
}
