import { callApi } from '../../api'

//create per mission
export const createPermission = async (data: any) => {
  return await callApi('post', 'permission/create', data)
}
