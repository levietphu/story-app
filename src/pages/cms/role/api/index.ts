import { callApi } from '../../api'

//get Role
export const getRole = async () => {
  return await callApi('get', 'role/index', '')
}

//create Role
export const createRole = async (data: any) => {
  return await callApi('post', 'role/create', data)
}

//update Role
export const updateRole = async (id: number, data: any) => {
  return await callApi('put', `role/${id}/update`, data)
}

//delete Role
export const deleteRole = async (id: number) => {
  return await callApi('delete', `role/${id}/delete`, '')
}
