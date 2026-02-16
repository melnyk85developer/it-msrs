import { ObjectId, SortDirection } from "mongodb"

export type sanitizedQueryType = {
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: SortDirection;
    searchNameTerm?: string | null;
    searchEmailTerm?: string | null;
    searchLoginTerm?: string | null;
}