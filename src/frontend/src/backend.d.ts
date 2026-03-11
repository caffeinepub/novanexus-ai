import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    content: string;
    role: string;
    timestamp: bigint;
}
export interface Conversation {
    id: bigint;
    title: string;
    messages: Array<Message>;
    owner: Principal;
    timestamp: bigint;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createConversation(title: string): Promise<bigint>;
    deleteConversation(conversationId: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMessages(conversationId: bigint): Promise<Array<Message>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listConversations(): Promise<Array<Conversation>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(conversationId: bigint, content: string): Promise<void>;
}
