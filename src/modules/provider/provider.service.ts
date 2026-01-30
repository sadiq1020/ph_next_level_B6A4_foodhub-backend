import { prisma } from "../../lib/prisma"
import { ICreateProviderProfile } from "./provider.interface";

// create new category
const createProviderProfile = async (data: ICreateProviderProfile) => {
    const result = await prisma.providerProfiles.create({
        data
    })
    return result;
}

export const providerService = {
    createProviderProfile
}
