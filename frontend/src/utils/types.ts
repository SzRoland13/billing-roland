export type Invoice = {
  id: number;
  customerName: string;
  issueDate: string;
  dueDate: string;
  itemName: string;
  comment: string;
  price: number;
};

export type User = {
  id: number;
  name: string;
  username: string;
  roles: Role[];
};

export type Role = {
  id: number;
  name: string;
  description: string;
};
