import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Repository } from 'typeorm';
import { PushToken } from '../push_token/entities/push_token.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FirebaseService {
    private readonly logger = new Logger('FirebaseService');

    constructor(
        @InjectRepository(PushToken)
        private repo: Repository<PushToken>,
    ) {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
                }),
            });
        }
    }

    async sendToToken(token: string, title: string, body: string, data?: Record<string, string>) {
        const message: admin.messaging.Message = {
            token,
            notification: { title, body },
            data: data || {},
            android: { priority: 'high' },
            webpush: { headers: { Urgency: 'high' } },
        };
        try {
            const res = await admin.messaging().send(message);
            this.logger.log(`Sent message: ${res}`);
            return res;
        } catch (err) {
            this.logger.error('FCM send error', err);
            throw err;
        }
    }

    async sendToTokens(tokens: string[], title: string, body: string, data?: Record<string, string>) {
        const message: admin.messaging.MulticastMessage = {
            tokens,
            notification: { title, body },
            data: data || {},
        };
        const res = await admin.messaging().sendEachForMulticast(message);
        res.responses.forEach((r, idx) => {
            if (!r.success) {
                const error = r.error;
                if (error!.code === 'messaging/registration-token-not-registered' ||
                    error!.code === 'messaging/invalid-registration-token') {

                    this.logger.warn(`Token no registrado: ${tokens[idx]}`);
                    this.repo.delete({ token: tokens[idx] });
                }
            }
        });
        this.logger.log(`Multicast: ${res.successCount} succeeded, ${res.failureCount} failed`);
        return res;
    }

    async sendToTopic(topic: string, title: string, body: string, data?: Record<string, string>) {
        return admin.messaging().send({
            topic,
            notification: { title, body },
            data: data || {}
        });
    }
}
