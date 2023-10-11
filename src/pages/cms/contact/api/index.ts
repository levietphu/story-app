import { callApi } from '../../api'

//get liên lạc
export const getContact = async () => {
  return await callApi('get', 'contact/index', '')
}

//update liên lạc
export const updateContact = async (id: number, data: any) => {
  return await callApi('put', `contact/${id}/update`, data)
}
