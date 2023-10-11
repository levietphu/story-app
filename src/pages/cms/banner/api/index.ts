import { callApi } from '../../api'

//get Banner
export const getBanner = async () => {
  return await callApi('get', 'banner/index', '')
}

//create Banner
export const createBanner = async (data: any) => {
  return await callApi('post', 'banner/create', data)
}

//update Banner
export const updateBanner = async (id: number, data: any) => {
  return await callApi('put', `banner/${id}/update`, data)
}

//delete Banner
export const deleteBanner = async (id: number) => {
  return await callApi('delete', `banner/${id}/delete`, '')
}
