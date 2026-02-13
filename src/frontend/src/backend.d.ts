import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface MediaItem {
    id: string;
    blob: ExternalBlob;
    description: string;
    fileName: string;
    mediaType: MediaType;
}
export interface UserProfile {
    name: string;
}
export enum MediaType {
    video = "video",
    image = "image"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMedia(id: string, blob: ExternalBlob, mediaType: MediaType, description: string, fileName: string): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteMedia(id: string): Promise<void>;
    getAllMedia(): Promise<Array<MediaItem>>;
    getBouquetGraphic(): Promise<string>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLoveLetter(): Promise<string>;
    getLoveLetterAuthor(): Promise<string>;
    getOwner(): Promise<Principal | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateLoveLetter(newLetter: string): Promise<void>;
}
