import { callApi } from '../../api'

//get category
export const getAuthor = async () => {
  return await callApi('get', 'author/index', '')
}

//create category
export const createAuthor = async (data: any) => {
  return await callApi('post', 'author/create', data)
}

//update category
export const updateAuthor = async (id: number, data: any) => {
  return await callApi('put', `author/${id}/update`, data)
}

//delete category
export const deleteAuthor = async (id: number) => {
  return await callApi('delete', `author/${id}/delete`, '')
}
