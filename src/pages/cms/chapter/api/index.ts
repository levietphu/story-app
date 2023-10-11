import { callApi } from '../../api'

//get Chapter
export const getChapter = async (id_story: number) => {
  return await callApi('get', `chapter/${id_story}/index`, '')
}

//create Chapter
export const createChapter = async (id_story: number, data: any) => {
  return await callApi('post', `chapter/${id_story}/create`, data)
}

//update Chapter
export const updateChapter = async (id_story: number, id_chapter: number, data: any) => {
  return await callApi('put', `chapter/${id_story}/update/${id_chapter}`, data)
}

//delete Chapter
export const deleteChapter = async (id: number) => {
  return await callApi('delete', `chapter/${id}/delete`, '')
}
