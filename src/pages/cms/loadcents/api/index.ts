import { callApi } from '../../api'

//get LoadCent
export const getLoadCent = async (id_bankinfo: any) => {
  return await callApi('get', `load_cent/${id_bankinfo}/index`, '')
}

//create LoadCent
export const createLoadCent = async (id_bankinfo: any, data: any) => {
  return await callApi('post', `load_cent/${id_bankinfo}/create`, data)
}

//update LoadCent
export const updateLoadCent = async (id: number, data: any) => {
  return await callApi('put', `load_cent/${id}/update`, data)
}

//delete LoadCent
export const deleteLoadCent = async (id: number) => {
  return await callApi('delete', `load_cent/${id}/delete`, '')
}
