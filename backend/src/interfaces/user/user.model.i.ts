export default interface UserModel {
  id_user?: number;
  role?: string;
  full_name?: string;
  email?: string;
  password?: string;
  image?: string;
  is_active?: boolean;
  password_changed_at?: Date;
  token_forgot_password?: string;
  token_forgot_password_expires_at?: Date;
}