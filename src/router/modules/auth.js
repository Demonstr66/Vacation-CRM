const Login = () => import('@/views/Auth/Login.vue')
const LoginByLink = () => import('@/views/Auth/LoginByLink')
const Register = () => import('@/views/Auth/Register.vue')
const ForgetPassword = () => import('@/views/Auth/ResetPassword.vue')
const EmailSending = () => import('@/views/Auth/EmailSending')

export const authRoutes = [
  {
    path: '/loginlink',
    name: 'LoginByLink',
    component: LoginByLink,
    meta: {
      layout: 'EmptyLayout',
      title: 'Авторизация',
      protected: {
        accessLevel: [0, 1]
      }
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      layout: 'EmptyLayout',
      title: 'Авторизация',
      protected: {
        accessLevel: [0, 1]
      }
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      layout: 'EmptyLayout',
      title: 'Регистрация',
      protected: {
        accessLevel: [0, 1]
      }
    }
  },
  {
    path: '/resetpassword',
    name: 'Reset',
    component: ForgetPassword,
    meta: {
      layout: 'EmptyLayout',
      title: 'Восстановление пароля',
      protected: {
        accessLevel: [0, 1]
      }
    }
  },
  {
    path: '/emailsending',
    name: 'EmailSending',
    component: EmailSending,
    meta: {
      layout: 'EmptyLayout',
      title: 'Запрос отправлен',
      protected: {
        accessLevel: [1]
      }
    }
  }
]