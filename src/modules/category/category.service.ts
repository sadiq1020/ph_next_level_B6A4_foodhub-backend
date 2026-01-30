import { prisma } from "../../lib/prisma"
import { ICreateCategory } from "./category.interface";

// create new category
const createCategory = async (data: ICreateCategory) => {
    const result = await prisma.category.create({
        data
    })
    return result;
}

export const categoryService = {
    createCategory
}