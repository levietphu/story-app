import { callApi } from '../../api'

//get Discount
export const getDiscount = async (id_story: number) => {
  return await callApi('get', `discount/${id_story}/index`, '')
}

//create Discount
export const createDiscount = async (id_story: number, data: any) => {
  return await callApi('post', `discount/${id_story}/create`, data)
}

//update Discount
export const updateDiscount = async (id: number, data: any) => {
  return await callApi('put', `discount/${id}/update`, data)
}

//hidden Discount
export const deleteDiscount = async (id: number) => {
  return await callApi('delete', `discount/${id}/delete`, '')
}
