import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { BookOpen, KeyRound, Phone, RefreshCw, Copy, Check } from 'lucide-react'
import { http } from '@/api'
import { useAppDispatch } from '../../store/hooks'
import { setUser } from '../../store/user/user.slice'
import { Button } from '@/components/ui/button'

interface LocationState {
  phone?: string
  devOtp?: string
}

export default function OTP() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const state = location.state as LocationState
  const phone = state?.phone ?? ''
  const devOtp = state?.devOtp ?? ''

  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [copied, setCopied] = useState(false)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  // Redirect if no phone
  useEffect(() => {
    if (!phone) navigate('/register', { replace: true })
  }, [phone, navigate])

  function handleInput(i: number, val: string) {
    const v = val.replace(/\D/g, '').slice(-1)
    const next = [...code]
    next[i] = v
    setCode(next)
    if (v && i < 5) inputs.current[i + 1]?.focus()
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      inputs.current[i - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setCode(pasted.split(''))
      inputs.current[5]?.focus()
    }
  }

  async function copyDevOtp() {
    await navigator.clipboard.writeText(devOtp).catch(() => {})
    setCode(devOtp.split(''))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    inputs.current[5]?.focus()
  }

  async function resendOtp() {
    if (countdown > 0) return
    setResending(true)
    try {
      const res = await http<{ devOtp?: string }>('/api/auth/otp', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      })
      toast.success('Yangi kod yuborildi')
      setCountdown(60)
      setCode(['', '', '', '', '', ''])
      // Update devOtp in location state
      navigate('/otp', { state: { phone, devOtp: res.devOtp }, replace: true })
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Xatolik')
    } finally {
      setResending(false)
    }
  }

  async function handleVerify() {
    const otp = code.join('')
    if (otp.length < 6) return toast.error('6 xonali kodni kiriting')
    setLoading(true)
    try {
      const res = await http<{
        message: string
        token: { accessToken: string }
        user: { id: number; firstName: string; lastName?: string; phone: string; role: string }
      }>('/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, otp }),
      })

      // Auto-login: save token and user to store
      if (res.token?.accessToken) {
        localStorage.setItem('token', res.token.accessToken)
        window.dispatchEvent(new Event('auth:changed'))
        dispatch(setUser({
          id: String(res.user.id),
          firstName: res.user.firstName,
          lastName: res.user.lastName ?? '',
          phone: res.user.phone,
          role: res.user.role.toLowerCase(),
        }))
      }

      toast.success("Ro'yxatdan o'tdingiz! Xush kelibsiz!")
      navigate('/', { replace: true })
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Noto\'g\'ri kod')
      setCode(['', '', '', '', '', ''])
      inputs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const otpFilled = code.every(c => c !== '')

  return (
    <div className="min-h-screen bg-app flex items-center justify-center p-4">
      <div className="w-full max-w-[380px] animate-in">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgb(var(--primary))]">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-[rgb(var(--text))]">Tasdiqlash kodi</h1>
            <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">
              6 xonali kodni kiriting
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-6 space-y-6">

          {/* Phone display */}
          <div className="flex items-center gap-2 rounded-lg border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-elevated))] px-3.5 py-2.5">
            <Phone className="h-4 w-4 text-[rgb(var(--text-muted))] flex-shrink-0" />
            <p className="text-sm text-[rgb(var(--text-muted))]">{phone}</p>
          </div>

          {/* Dev OTP hint — shown since SMS is not connected */}
          {devOtp && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <div className="flex items-start gap-2.5">
                <KeyRound className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-amber-400 mb-1">
                    Demo rejim — SMS o'rniga:
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-2xl font-bold tracking-[0.3em] text-amber-300">
                      {devOtp}
                    </p>
                    <button
                      onClick={copyDevOtp}
                      className="flex items-center gap-1 rounded-lg border border-amber-500/30 px-2.5 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-500/20 transition-colors"
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copied ? 'Nusxalandi' : 'Nusxalash'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OTP input boxes */}
          <div>
            <p className="text-sm font-medium text-[rgb(var(--text-muted))] mb-3">Kodni kiriting:</p>
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { inputs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleInput(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  className={`h-12 w-10 rounded-xl border text-center text-lg font-bold transition-all outline-none
                    ${digit
                      ? 'border-violet-500 bg-violet-500/10 text-[rgb(var(--text))]'
                      : 'border-[rgb(var(--border))] bg-[rgb(var(--bg-elevated))] text-[rgb(var(--text))]'
                    }
                    focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30`}
                />
              ))}
            </div>
          </div>

          {/* Verify button */}
          <Button
            size="lg"
            className="w-full"
            loading={loading}
            disabled={!otpFilled}
            onClick={handleVerify}
          >
            Tasdiqlash
          </Button>

          {/* Resend */}
          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-sm text-[rgb(var(--text-muted))]">
                Qayta yuborish: <span className="font-semibold text-[rgb(var(--text))]">{countdown}s</span>
              </p>
            ) : (
              <button
                onClick={resendOtp}
                disabled={resending}
                className="flex items-center gap-1.5 mx-auto text-sm text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] transition-colors"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${resending ? 'animate-spin' : ''}`} />
                Kodni qayta yuborish
              </button>
            )}
          </div>

          <div className="text-center border-t border-[rgb(var(--border-subtle))] pt-4">
            <Link to="/register" className="text-sm text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] transition-colors">
              ← Orqaga
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
