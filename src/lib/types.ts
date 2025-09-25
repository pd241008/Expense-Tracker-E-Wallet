// types.ts
export interface Transaction {
  _id?: string; // Convex internal ID
  id: string;
  createdAt: number;
  updatedAt: number;
  amount: number;
  description: string;
  date: number;
  userId: string;
  type: string;
  category: string;
  categoryIcon: string;
}

export interface Category {
  _id?: string; // Convex internal ID
  createdAt: number;
  name: string;
  icon: string;
  type: string;
  userId: string;
}
