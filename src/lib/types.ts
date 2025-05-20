export interface Service {
  _id: string;
  name: string;
  requirements: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  _id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isError?: boolean;
}

export interface User {
  _id: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
} 