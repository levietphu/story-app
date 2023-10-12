import { useState, useContext, useEffect, ChangeEvent } from 'react'
import './user.scss'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '~/context/AuthContextProvider'
import setToken from '~/ultis/setToken'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import axios from 'axios'

const Login = () => {
  const [checkInputName, setCheckInputName] = useState(false)
  const [checkInputPass, setCheckInputPass] = useState(false)
  const [loaderLogin, setLoaderLogin] = useState(false)
  const [error, setError] = useState<string>('')
  const [textLogin, setTextLogin] = useState({
    email: '',
    password: ''
  })

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin rev={undefined} />
  const { errorServer, checkLogin, user, setErrorServer, getUser, setLoaderUser, setReLogin }: any =
    useContext(AuthContext)

  const navigate = useNavigate()

  const clearChangePage = () => {
    setCheckInputName(false)
    setCheckInputPass(false)
    setErrorServer('')
    setTextLogin({ email: '', password: '' })
  }

  useEffect(() => {
    document.title = 'Đăng nhập vào Tiên Vực'
    return () => clearChangePage()
  }, [])

  useEffect(() => {
    user && navigate('/')
  }, [user])

  const loginTienVuc = async (e: ChangeEvent<HTMLFormElement>) => {
    setLoaderLogin(true)
    e.preventDefault()
    await axios
      .post(`${import.meta.env.REACT_APP_API}login`, {
        email: textLogin.email,
        password: textLogin.password
      })
      .then((res: any) => {
        // lần đầu đăng nhập cần gắn token vào header
        setToken(res.data.data.token)

        setLoaderUser('loader')
        setReLogin(false)
        getUser()

        //lưu đăng nhập
        document.cookie = `token=${res.data.data.token};max-age=604800;path=/;`
        !checkLogin ? navigate(-1) : navigate('/')
        setLoaderLogin(false)
      })
      .catch((err: any) => {
        setErrorServer(
          err.response.status === 400 || err.response.status === 500
            ? err.response.data.message
            : err.response.data.errors
        )
        setLoaderLogin(false)
      })
  }

  useEffect(() => {
    if (error) {
      const id = setTimeout(() => {
        setError('')
      }, 3000)
      return () => clearTimeout(id)
    }
  }, [error])

  return (
    <div className='login'>
      <div className='center login__center'>
        <div className='login__container'>
          <h1>
            <span>
              Đăng nhập vào <Link to='/'>Tiên vực</Link>{' '}
            </span>

            <i className='fa-sharp fa-solid fa-laptop-file'></i>
          </h1>

          <div className='login__main'>
            {errorServer && !errorServer.email && !errorServer.password && (
              <div className='info infoError'>
                <p>{errorServer}</p>
              </div>
            )}
            <form onSubmit={loginTienVuc} method='post'>
              <div className='name__login'>
                <p>Email hoặc tên tài khoản</p>
                <input
                  className={`${checkInputName ? 'comment__text--active' : ''} ${
                    errorServer && errorServer.email ? 'active_error' : ''
                  }`}
                  type='text'
                  placeholder='vidugmail.com'
                  onClick={() => setCheckInputName(!checkInputName)}
                  onBlur={() => setCheckInputName(false)}
                  value={textLogin.email}
                  onChange={(e) => setTextLogin({ ...textLogin, email: e.target.value })}
                  name='email'
                />
                {errorServer &&
                  errorServer.email &&
                  errorServer.email.map((item: any, index: any) => {
                    return (
                      <p className='error' key={index}>
                        {item}
                      </p>
                    )
                  })}
              </div>
              <div className='password__login'>
                <p>Mật khẩu</p>
                <input
                  className={`${checkInputPass ? 'comment__text--active' : ''} ${
                    errorServer && errorServer.email ? 'active_error' : ''
                  }`}
                  type='password'
                  placeholder='*********'
                  onClick={() => setCheckInputPass(!checkInputPass)}
                  onBlur={() => setCheckInputPass(false)}
                  value={textLogin.password}
                  onChange={(e) => setTextLogin({ ...textLogin, password: e.target.value })}
                  name='password'
                />
                {errorServer &&
                  errorServer.password &&
                  errorServer.password.map((item: any, index: any) => {
                    return (
                      <p className='error' key={index}>
                        {item}
                      </p>
                    )
                  })}
              </div>
              <Link to='/reset-password'>Quên mật khẩu?</Link>
              <button
                type='submit'
                // onClick={() => loginTienVuc()}
                style={{ marginTop: '10px' }}
              >
                {!loaderLogin ? 'Đăng nhập' : <Spin spinning indicator={antIcon} style={{ color: 'white' }} />}
              </button>
            </form>
          </div>

          <div className='change__register'>
            Bạn chưa có tài khoản? <Link to='/register'>Đăng ký</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
