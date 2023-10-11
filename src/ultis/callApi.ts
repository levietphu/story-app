import axios from 'axios'

const callApi = async (method: string, data: any, endpoint: string) => {
  return await axios({
    method: method,
    headers: { 'Content-Type': 'application/json' },
    url: `${import.meta.env.REACT_APP_API}${endpoint}`,
    data: data
  }).catch((err) => console.log(err))
}

export default callApi
