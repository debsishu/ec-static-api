import { ObjectId } from "mongoose";

export const validateEmail = (email: string): boolean => {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
};

export const removeElement = (arr: any, element: ObjectId) => {
  const index = arr.indexOf(element);
  if (index > -1) arr.splice(index, 1);
  return arr;
};
