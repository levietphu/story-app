import React, { useEffect, useState, useContext } from 'react'
import { Spin } from 'antd'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContextProvider'
import { LoadingOutlined } from '@ant-design/icons'

const ForgotPassword = () => {
  const [checkInputEmail, setCheckInputEmail] = useState(false)
  const [email, setEmail] = useState<string>('')
  const [loader, setLoader] = useState(false)
  const [message, setMessage] = useState<string>('')
  const [isError, setIsError] = useState<boolean>()
  const [checkOtp, setCheckOtp] = useState<string>('')
  const [userResetPassword, setUserResetPassword] = useState<any>()
  const [idCheckUser, setIdCheckUser] = useState<any>()

  const { setCheckLogin }: any = useContext(AuthContext)

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin rev={undefined} />

  const navigate = useNavigate()

  const callApiForgot = async () => {
    setLoader(true)
    await axios
      .post(`${import.meta.env.REACT_APP_API}forgot`, { email })
      .then((res) => {
        setMessage(res.data.message)
        setLoader(false)
        setIsError(false)
        setEmail('')
        setCheckOtp('checkOtp')
        setIdCheckUser(res.data.id_check_user)
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setMessage(err.response.data.message)
        } else {
          setMessage('Hệ thống đang bận')
        }
        setIsError(true)
        setLoader(false)
      })
  }

  const callApiCheckOtp = async () => {
    setLoader(true)
    await axios
      .post(`${import.meta.env.REACT_APP_API}check_otp`, {
        id: idCheckUser,
        otp: email
      })
      .then((res) => {
        setLoader(false)
        setIsError(false)
        setEmail('')
        setCheckOtp('pass')
        setUserResetPassword(res.data.user_reset_password)
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setMessage(err.response.data.message)
        } else {
          setMessage('Hệ thống đang bận')
        }
        setIsError(true)
        setLoader(false)
      })
  }

  const callApiChangePass = async () => {
    setLoader(true)
    await axios
      .post(`${import.meta.env.REACT_APP_API}change_pass`, {
        id: userResetPassword.id,
        password: email
      })
      .then(() => {
        navigate('/login')
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setMessage(err.response.data.message)
        } else {
          setMessage('Hệ thống đang bận')
        }
        setIsError(true)
        setLoader(false)
      })
  }

  const forgotPass = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault()
    if (checkOtp === 'checkOtp') {
      callApiCheckOtp()
    } else if (checkOtp === '') {
      callApiForgot()
    } else {
      callApiChangePass()
    }
  }

  useEffect(() => {
    setCheckLogin(true)
  }, [])

  useEffect(() => {
    if (message) {
      const id = setTimeout(() => setMessage(''), 4000)
      return () => clearTimeout(id)
    }
  }, [message])

  return (
    <div className='login'>
      <div className='center login__center'>
        <div className='login__container'>
          <h1>
            <span>Quên mật khẩu?</span>
          </h1>

          <div className='login__main'>
            {message && (
              <div className={`info ${isError ? 'infoError' : 'infoSuccess'}`}>
                <p>{message}</p>
              </div>
            )}
            <form onSubmit={(e) => forgotPass(e)} method='post'>
              <div className='name__login'>
                <p>
                  {checkOtp === 'checkOtp'
                    ? 'Mã xác nhận'
                    : checkOtp === 'pass'
                    ? 'Nhập mật khẩu mới'
                    : 'Email của bạn'}
                </p>
                <input
                  className={`${checkInputEmail ? 'comment__text--active' : ''}`}
                  type={checkOtp === 'pass' ? 'password' : 'text'}
                  onClick={() => setCheckInputEmail(!checkInputEmail)}
                  onBlur={() => setCheckInputEmail(false)}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name='email'
                />
              </div>

              <button type='submit' style={{ marginTop: '10px' }}>
                {!loader ? 'Tiếp tục' : <Spin style={{ color: 'white' }} spinning indicator={antIcon} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
