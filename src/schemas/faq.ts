export interface FAQ {
  id: number;
  question: string;
  answer: string;
  createdAt: string;
}

export interface FAQCategory {
  id: string | number;
  name: string;
}

export interface FAQFormModalProps {
  faq?: { id: number; question: string; answer: string } | null;
  onSave: (data: { question: string; answer: string }) => void;
  onClose: () => void;
}

export interface TermsSection {
  id?: string;
  title: string;
  content: string;
  order: number;
}

export interface TermsAndConditions {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  sections: TermsSection[];
}

export interface TermsFormModalProps {
  terms?: TermsAndConditions | null;
  onSave: (data: {
    isActive: boolean;
    sections: { title: string; content: string; order: number }[];
  }) => void;
  onClose: () => void;
}

export interface PrivacySection {
  id?: string;
  title: string;
  content: string;
  order: number;
}

export interface PrivacyPolicy {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  sections: PrivacySection[];
}

export interface PrivacyFormModalProps {
  policy?: PrivacyPolicy | null;
  onSave: (data: {
    isActive: boolean;
    sections: { title: string; content: string; order: number }[];
  }) => void;
  onClose: () => void;
}
