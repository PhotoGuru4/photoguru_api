import * as admin from 'firebase-admin';

export interface FirebaseMessage {
  senderId: number;
  type: string;
  content: string | Record<string, any>;
  createdAt: admin.firestore.Timestamp;
  isRead: boolean;
}
