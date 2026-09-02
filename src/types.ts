export type ViewType = 'login' | 'dashboard' | 'complaint';

export interface UserSession {
  email: string;
  name: string;
  accountNumber: string;
  loginTime: string;
}

export interface BankAccount {
  id: string;
  name: string;
  type: string;
  accountNumber: string;
  routingNumber: string;
  balance: number;
  currency: string;
  status: 'Active' | 'Locked' | 'Review';
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  merchant: string;
  category: string;
  amount: number;
  type: 'debit' | 'credit';
  status: 'Completed' | 'Pending' | 'Flagged';
  reference: string;
  iconName?: string;
}

export interface ComplaintSubmission {
  productType: string;
  complaintDetails: string;
  urgency?: 'Standard' | 'Urgent' | 'Critical';
}

export interface ComplaintTicket {
  traceId: string;
  email: string;
  productType: string;
  details: string;
  status: 'Received' | 'Under Review' | 'Resolved';
  timestamp: string;
  estimatedResolution: string;
  isLiveApi: boolean;
  apiNotice?: string;
}

export interface ApiSubmissionResult {
  success: boolean;
  trace_id: string;
  liveApi?: boolean;
  apiNotice?: string;
  gatewayResponse?: any;
  error?: string;
}
