import apiClient from './api';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type?: 'inquiry' | 'support' | 'feedback' | 'partnership' | 'other';
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    subject: string;
  };
}

export const contactService = {
  // Submit contact form
  submitContact: async (contactData: ContactFormData): Promise<ContactResponse> => {
    return apiClient.post('/contact', contactData);
  },
};
