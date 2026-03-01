import * as admin from 'firebase-admin';

export interface FirebaseMessage {
  senderId: number;
  type: string;
  content: string | Record<string, any>;
  sentAt: admin.firestore.Timestamp;
  isRead: boolean;
}
