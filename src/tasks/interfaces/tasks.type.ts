export interface RegistAdminMessage {
  email: string;
  password: string;
}

export interface PromotionMessage {
  type: 'email';
  message: string;
}

export interface ScrapMessage {
  link: string;
  type: 'instagram' | 'self';
}
