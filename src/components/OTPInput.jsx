import { useRef, useState } from 'react'

export default function OTPInput({ length = 6, value, onChange }) {
  const inputsRef = useRef([])
  const digits = (value || '').split('').slice(0, length)

  // Pad to length
  while (digits.length < length) digits.push('')

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '')
    if (!val) {
      const newDigits = [...digits]
      newDigits[idx] = ''
      onChange(newDigits.join(''))
      return
    }
    // Allow pasting a full OTP
    if (val.length > 1) {
      const pasted = val.slice(0, length).split('')
      const newDigits = [...digits]
      pasted.forEach((ch, i) => {
        if (idx + i < length) newDigits[idx + i] = ch
      })
      onChange(newDigits.join(''))
      const nextIdx = Math.min(idx + pasted.length, length - 1)
      inputsRef.current[nextIdx]?.focus()
      return
    }
    const newDigits = [...digits]
    newDigits[idx] = val
    onChange(newDigits.join(''))
    if (idx < length - 1) {
      inputsRef.current[idx + 1]?.focus()
    }
  }

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      if (digits[idx]) {
        const newDigits = [...digits]
        newDigits[idx] = ''
        onChange(newDigits.join(''))
      } else if (idx > 0) {
        inputsRef.current[idx - 1]?.focus()
      }
    }
    if (e.key === 'ArrowLeft' && idx > 0) {
      inputsRef.current[idx - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus()
    }
  }

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => (inputsRef.current[idx] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onFocus={(e) => e.target.select()}
          className="otp-input w-11 h-13 text-center text-xl font-mono font-semibold
                     border-2 border-ink/10 rounded-xl bg-cream-dark
                     focus:outline-none text-ink transition-all duration-150"
          style={{ height: '52px' }}
        />
      ))}
    </div>
  )
}
