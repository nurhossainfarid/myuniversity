import { TFaculty } from "./faculty.interface";
import { FacultyModel } from "./faculty.modal";

const createFacultyIntoDB = async (payload: TFaculty) => {
    const result = await FacultyModel.create(payload);
    return result;
}

const getAllFacultyFromDB = async () => {
    const result = await FacultyModel.find({});
    return result;
}

const getSingleFacultyFromDB = async (facultyId: string) => {
    const result = await FacultyModel.findById(facultyId);
    return result;
}

const updateFacultyIntoDB = async (facultyId: string, payload: Partial<TFaculty>) => {
    const result = await FacultyModel.findByIdAndUpdate(facultyId, payload, {new: true});
    return result;
}

export const FacultyServices = {
    createFacultyIntoDB,
    getAllFacultyFromDB,
    getSingleFacultyFromDB,
    updateFacultyIntoDB
}