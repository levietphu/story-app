import { callApi } from '../../api'

//get dịch giả
export const getTranslator = async () => {
  return await callApi('get', 'trans/index', '')
}

//create dịch giả
export const createTranslator = async (data: any) => {
  return await callApi('post', 'trans/create', data)
}

//update dịch giả
export const updateTranslator = async (id: number, data: any) => {
  return await callApi('put', `trans/${id}/update`, data)
}

//delete dịch giả
export const deleteTranslator = async (id: number) => {
  return await callApi('delete', `trans/${id}/delete`, '')
}
