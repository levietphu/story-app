import { callApi } from '../../api'

//get category
export const getCate = async () => {
  return await callApi('get', 'cate/index', '')
}

//create category
export const createCate = async (data: any) => {
  return await callApi('post', 'cate/create', data)
}

//update category
export const updateCate = async (id: number, data: any) => {
  return await callApi('put', `cate/${id}/update`, data)
}

//delete category
export const deleteCate = async (id: number) => {
  return await callApi('delete', `cate/${id}/delete`, '')
}
