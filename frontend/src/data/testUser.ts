export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  image: string;
}

export const testUser: User = {
  id: 1,
  firstName: "Yasin",
  lastName: "Çulha",
  email: "test@shopsphere.com",
  password: "Test123",
  image: "https://dummyjson.com/icon/emilys/128",
};
