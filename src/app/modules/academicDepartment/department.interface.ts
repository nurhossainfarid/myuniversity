import { Types } from "mongoose";

export type TDepartment = {
    name: string;
    faculty: Types.ObjectId
}