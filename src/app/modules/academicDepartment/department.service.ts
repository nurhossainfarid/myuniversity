import { TDepartment } from "./department.interface";
import { DepartmentModel } from "./department.model";

const createDepartmentIntoDB = async (payload: TDepartment) => {
    const result = await DepartmentModel.create(payload);
    return result;
}

const getAllDepartmentFromDB = async () => {
    const result = await DepartmentModel.find({});
    return result;
}

const getSingleDepartmentFromDB = async (departmentId: string) => {
    const result = await DepartmentModel.findById(departmentId);
    return result;
}

const updateDepartmentIntoDB = async (departmentId: string, payload: Partial<TDepartment>) => {
    const result = await DepartmentModel.findOneAndUpdate({_id: departmentId}, payload, {new: true});
    return result;
}

export const DepartmentServices = {
    createDepartmentIntoDB,
    getAllDepartmentFromDB,
    getSingleDepartmentFromDB,
    updateDepartmentIntoDB
}