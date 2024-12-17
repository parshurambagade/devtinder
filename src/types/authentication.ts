export interface IUser {
    _id?: string,
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  generateAuthToken: () => string;
  isValidPassword: (password: string) => boolean;
}
