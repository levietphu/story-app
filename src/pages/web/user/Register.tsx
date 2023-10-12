import { useState, useEffect, useContext, ChangeEvent } from 'react'
import './user.scss'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContextProvider'
import { useNavigate } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import axios from 'axios'

const Register = () => {
  const [checkInputName, setCheckInputName] = useState(false)
  const [checkInputPass, setCheckInputPass] = useState(false)
  const [checkInputEmail, setCheckInputEmail] = useState(false)
  const [checkRules, setCheckRules] = useState(false)
  const [loaderRegister, setLoaderRegister] = useState(false)
  const [dataRegister, setDataRegister] = useState({
    name: '',
    email: '',
    password: ''
  })

  const navigate = useNavigate()

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin rev={undefined} />

  const { errorServer, setCheckLogin, setErrorServer, user }: any = useContext(AuthContext)

  const clearChangePage = () => {
    setCheckInputEmail(false)
    setCheckInputPass(false)
    setCheckInputName(false)
    setCheckRules(false)
    setErrorServer('')
    setDataRegister({
      name: '',
      email: '',
      password: ''
    })
  }

  useEffect(() => {
    document.title = 'Tạo tài khoản Tiên Vực'
    setCheckLogin(true)
    return () => clearChangePage()
  }, [])

  useEffect(() => {
    user && navigate('/')
  }, [user])

  useEffect(() => {
    if (errorServer && !errorServer.name && !errorServer.email && !errorServer.password) {
      const id = setTimeout(() => setErrorServer(''), 2000)
      return () => clearTimeout(id)
    }
  }, [errorServer])

  const registerTienVuc = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoaderRegister(true)
    await axios
      .post(`${import.meta.env.REACT_APP_API}register`, {
        name: dataRegister.name,
        email: dataRegister.email,
        password: dataRegister.password
      })
      .then(() => {
        navigate('/login')
        setLoaderRegister(false)
      })
      .catch((err: any) => {
        err.response.status === 422 && setErrorServer(err.response.data.errors)
        setLoaderRegister(false)
      })
  }
  return (
    <div className='login'>
      <div className='center login__center'>
        <div className='login__container'>
          <h1>
            <span>
              Đăng ký vào <Link to='/'>Tiên vực</Link>{' '}
            </span>

            <i className='fa-solid fa-clipboard-list'></i>
          </h1>
          <form onSubmit={(e: ChangeEvent<HTMLFormElement>) => (checkRules ? registerTienVuc(e) : e.preventDefault())}>
            <div className='login__main'>
              <div className='name__login'>
                <p>Tên tài khoản</p>
                <input
                  className={`${checkInputName ? 'comment__text--active' : ''} ${
                    errorServer && errorServer.name ? 'active_error' : ''
                  }`}
                  type='text'
                  placeholder='Tên tài khoản từ 5-20 ký tự bao gồm a-z, 0-9 và _'
                  onClick={() => {
                    setCheckInputName(!checkInputName)
                  }}
                  name='name'
                  value={dataRegister.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setDataRegister({ ...dataRegister, name: e.target.value })
                  }}
                />
                {errorServer &&
                  errorServer.name &&
                  errorServer.name.map((item: any, index: any) => {
                    return (
                      <p className='error' key={index}>
                        {item}
                      </p>
                    )
                  })}
              </div>
              <div className={`name__login }`}>
                <p>Email</p>
                <input
                  className={`${checkInputEmail ? 'comment__text--active' : ''} ${
                    errorServer && errorServer.email ? 'active_error' : ''
                  }`}
                  type='email'
                  placeholder='vidu@gmail.com'
                  onClick={() => setCheckInputEmail(!checkInputEmail)}
                  name='email'
                  value={dataRegister.email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setDataRegister({ ...dataRegister, email: e.target.value })
                  }
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
                    errorServer && errorServer.password ? 'active_error' : ''
                  }`}
                  type='password'
                  placeholder='*********'
                  onClick={() => setCheckInputPass(!checkInputPass)}
                  onBlur={() => setCheckInputPass(false)}
                  name='password'
                  value={dataRegister.password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setDataRegister({
                      ...dataRegister,
                      password: e.target.value
                    })
                  }
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
              <div className='check'>
                <input type='checkbox' onChange={() => setCheckRules(!checkRules)} checked={checkRules} />
                <span>
                  {' '}
                  Đồng ý với các <Link to=''>điều khoản</Link> và <Link to=''>chính sách</Link> của tiên vực
                </span>
              </div>
              <button type='submit' className={`${checkRules ? '' : 'forbiden'}`}>
                {!loaderRegister ? 'Đăng ký' : <Spin spinning indicator={antIcon} style={{ color: 'white' }} />}
              </button>
            </div>
          </form>
          <div className='change__register'>
            Bạn chưa có tài khoản? <Link to='/login'>Đăng nhập</Link>
          </div>
        </div>
      </div>
      {errorServer && !errorServer.name && !errorServer.email && !errorServer.password && (
        <p className='error_auth'>Lỗi hệ thống</p>
      )}
    </div>
  )
}

export default Register
