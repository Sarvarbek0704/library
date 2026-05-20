import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Phone, Lock, BookOpen, Eye, EyeOff } from 'lucide-react'
import { useAppDispatch } from '../../store/hooks'
import { setUser } from '../../store/user/user.slice'
import { getRoleFromToken } from '../../utils'
import { http } from '../../api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type FormData = { phone: string; password: string }

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: { phone: '', password: '' }
  })

  const onSubmit = async (values: FormData) => {
    setLoading(true)
    try {
      const data = await http<{ token?: { accessToken?: string }; user?: { id: number; firstName: string; lastName?: string; phone: string; role: string } }>(
        '/api/auth/login',
        { method: 'POST', body: JSON.stringify(values) }
      )

      const token = data?.token?.accessToken ?? ''
      if (!token) throw new Error('Token olishda xatolik')

      const role = (getRoleFromToken(token) || data?.user?.role || 'user').toLowerCase()
      const normalizedRole = role.includes('super') ? 'superadmin' : role.includes('admin') ? 'admin' : 'user'

      localStorage.setItem('token', token)
      window.dispatchEvent(new Event('auth:changed'))

      dispatch(setUser({
        id: String(data?.user?.id ?? ''),
        firstName: data?.user?.firstName ?? '',
        lastName: data?.user?.lastName ?? '',
        phone: data?.user?.phone ?? values.phone,
        role: normalizedRole,
      }))

      toast.success('Xush kelibsiz!')
      if (normalizedRole === 'superadmin') navigate('/superadmin', { replace: true })
      else if (normalizedRole === 'admin') navigate('/admin', { replace: true })
      else navigate('/', { replace: true })
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Kirish xatoligi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-app flex items-center justify-center p-4">
      <div className="w-full max-w-[380px] animate-in">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgb(var(--primary))]">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-[rgb(var(--text))]">Kutubxona</h1>
            <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">Hisobingizga kiring</p>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="Telefon raqam"
              type="tel"
              placeholder="+998901234567"
              leftIcon={<Phone className="h-4 w-4" />}
              error={errors.phone?.message}
              {...register('phone', {
                required: 'Telefon raqam kiritish shart',
                pattern: { value: /^\+?[0-9]{9,15}$/, message: "Noto'g'ri telefon raqam" },
              })}
            />

            <Input
              label="Parol"
              type={showPass ? 'text' : 'password'}
              placeholder="Parolingizni kiriting"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button type="button" onClick={() => setShowPass(p => !p)} className="cursor-pointer">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              error={errors.password?.message}
              {...register('password', { required: 'Parol kiritish shart' })}
            />

            <Button type="submit" loading={loading} className="mt-1 w-full">
              Kirish
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-[rgb(var(--text-muted))]">
            Hisobingiz yo'qmi?{' '}
            <Link to="/register" className="text-[rgb(var(--text))] underline underline-offset-4 hover:text-violet-400 transition-colors">
              Ro'yxatdan o'ting
            </Link>
          </p>
        </div>

        {/* Demo accounts */}
        <div className="mt-4 rounded-lg border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-4">
          <p className="text-xs font-medium text-[rgb(var(--text-muted))] mb-2">Demo hisoblar</p>
          <div className="space-y-1.5 text-xs text-[rgb(var(--text-faint))]">
            <div className="flex justify-between">
              <span>Foydalanuvchi</span>
              <span className="text-[rgb(var(--text-muted))]">+998900000003 / demo1234</span>
            </div>
            <div className="flex justify-between">
              <span>Admin</span>
              <span className="text-[rgb(var(--text-muted))]">+998900000002 / demo1234</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
