import { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { getCookie } from '../ultis/getCookie'

interface AppContextInterface {
  name: string
  author: string
  url: string
}

export const AuthContext = createContext<AppContextInterface | null>(null)

const AuthContextProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>()
  const [loaderUser, setLoaderUser] = useState<string>('loader')
  const [checkLogin, setCheckLogin] = useState<boolean>(false)
  const [errorServer, setErrorServer] = useState<any>()
  const [reLogin, setReLogin] = useState<boolean>(false)

  const token = getCookie('token')

  const getUser = async () => {
    await axios.get(`${import.meta.env.REACT_APP_API}getUser?token=${token}`).then((res: any) => {
      setUser(res.data.data.items)
      setLoaderUser('user')
    })
  }

  useEffect(() => {
    if (token) {
      getUser().catch((err) => {
        if (err.response.status === 401) {
          setLoaderUser('login')
          setReLogin(true)
        }
      })
    } else {
      setLoaderUser('login')
    }
  }, [])

  const dataAuth: any = {
    errorServer,
    setErrorServer,
    user,
    setUser,
    loaderUser,
    setLoaderUser,
    getUser,
    setCheckLogin,
    checkLogin,
    reLogin,
    setReLogin
  }

  return <AuthContext.Provider value={dataAuth}>{children}</AuthContext.Provider>
}

export default AuthContextProvider
