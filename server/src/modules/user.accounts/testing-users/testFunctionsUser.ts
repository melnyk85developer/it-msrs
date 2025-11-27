import { HTTP_STATUSES } from "src/core/utils/utils";
import { contextTests } from "test/helpers/init-settings";

export const isCreatedUser = async (
    numUser: number,
    login: string,
    email: string,
    password: string,
    statusCode: number = HTTP_STATUSES.NO_CONTENT_204
) => {
    if (contextTests.users.createdUsers[numUser] === undefined || contextTests.users.createdUsers[numUser] === null) {
        // console.log('isCreatedUser1: - contextTests.createdUsers[num]', contextTests.users.createdUsers[numUser])
        // console.log('isCreatedUser1: - contextTests.createdUsers[num]', contextTests.users.createdUsers)
        const user: any = {
            login,
            password,
            email
        }
        // console.log('isCreatedUser1: - user', user)
        const { body, response } = await contextTests.authTestManager.registration(
            user,
            statusCode
        )
        if (response.status === HTTP_STATUSES.NO_CONTENT_204) {
            return true
        } else {
            return body
        }
    } else {
        return null
    }
}