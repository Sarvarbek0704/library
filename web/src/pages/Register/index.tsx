import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Phone, Lock, User, Eye, EyeOff, BookOpen } from 'lucide-react'
import { http } from '@/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type FormData = {
  firstName: string
  lastName: string
  phone: string
  password: string
  confirmPassword: string
}

export default function Register() {
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (values: FormData) => {
    if (values.password !== values.confirmPassword) {
      return toast.error('Parollar mos kelmadi')
    }
    setLoading(true)
    try {
      const res = await http<{ message: string; devOtp?: string }>(
        '/api/auth/register',
        {
          method: 'POST',
          body: JSON.stringify({
            firstName: values.firstName,
            lastName: values.lastName || '',
            phone: values.phone,
            password: values.password,
          }),
        }
      )
      toast.success('Tasdiqlash kodi yaratildi!')
      navigate('/otp', {
        state: {
          phone: values.phone,
          devOtp: res.devOtp,   // shown in UI since SMS is not connected
        },
      })
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-app flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] animate-in">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgb(var(--primary))]">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-[rgb(var(--text))]">Ro'yxatdan o'tish</h1>
            <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">Yangi hisob yarating</p>
          </div>
        </div>

        <div className="rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Ism *"
                placeholder="Ism"
                leftIcon={<User className="h-4 w-4" />}
                error={errors.firstName?.message}
                {...register('firstName', { required: 'Ism kiritish shart' })}
              />
              <Input
                label="Familiya"
                placeholder="Familiya"
                leftIcon={<User className="h-4 w-4" />}
                {...register('lastName')}
              />
            </div>

            <Input
              label="Telefon raqam *"
              type="tel"
              placeholder="+998901234567"
              leftIcon={<Phone className="h-4 w-4" />}
              error={errors.phone?.message}
              {...register('phone', {
                required: 'Telefon raqam kiritish shart',
                pattern: {
                  value: /^\+998[0-9]{9}$/,
                  message: "Format: +998XXXXXXXXX",
                },
              })}
            />

            <Input
              label="Parol *"
              type={showPass ? 'text' : 'password'}
              placeholder="Kamida 6 ta belgi"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button type="button" onClick={() => setShowPass(p => !p)} className="text-[rgb(var(--text-faint))] hover:text-[rgb(var(--text-muted))]">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              error={errors.password?.message}
              {...register('password', {
                required: 'Parol kiritish shart',
                minLength: { value: 6, message: 'Kamida 6 ta belgi' },
              })}
            />

            <Input
              label="Parolni tasdiqlang *"
              type="password"
              placeholder="Parolni qayta kiriting"
              leftIcon={<Lock className="h-4 w-4" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Parolni tasdiqlang',
                validate: v => v === watch('password') || 'Parollar mos kelmadi',
              })}
            />

            <Button type="submit" loading={loading} size="lg" className="mt-2">
              Davom etish
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[rgb(var(--text-muted))]">
              Hisobingiz bormi?{' '}
              <Link to="/login" className="text-[rgb(var(--text))] underline underline-offset-4 hover:text-violet-400 transition-colors">
                Kirish
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
