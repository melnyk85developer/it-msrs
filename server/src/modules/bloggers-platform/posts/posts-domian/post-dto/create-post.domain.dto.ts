import { Types } from "mongoose";

export class CreatePostDomainDto {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: null | string;
}