import { Types } from "mongoose";

export class CreateBlogDomainDto {
    name: string;
    description: string;
    websiteUrl: string;
    userId: Types.ObjectId;
    isMembership: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}