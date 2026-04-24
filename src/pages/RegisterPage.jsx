import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  User,
  Phone,
  Mail,
  Building2,
  FileText,
  CreditCard,
  ImagePlus,
  X,
  AlertCircle,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../context/AuthContext'
import { registerUser } from '../api/services'
import { toast } from 'react-toastify'

// ─── Validation rules ─────────────────────────────────────────────────────────

const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const VALIDATION = {
  name: {
    required: 'Full name is required',
    minLength: { value: 2, message: 'Name must be at least 2 characters' },
    maxLength: { value: 80, message: 'Name must be 80 characters or fewer' },
    pattern: {
      value: /^[a-zA-Z\s'-]+$/,
      message: 'Only letters, spaces, hyphens or apostrophes allowed',
    },
  },
  mobile: {
    required: 'Mobile number is required',
    validate: {
      onlyDigits: (v) => /^\d+$/.test(v) || 'Only digits are allowed',
      exactLength: (v) => v.length === 10 || 'Must be exactly 10 digits',
      noLeadingZero: (v) => v[0] !== '0' || 'Cannot start with 0',
    },
  },
  email: {
    required: 'Email address is required',
    pattern: { value: EMAIL_REGEX, message: 'Enter a valid email address' },
    maxLength: { value: 100, message: 'Email must be 100 characters or fewer' },
  },
company_name: {
  required: 'Company name is required',
  maxLength: { value: 100, message: 'Company name must be 100 characters or fewer' },
},
gst_no: {
  required: 'GST number is required',
  pattern: {
    value: GST_REGEX,
    message: 'Enter a valid 15-character GST number',
  },
},
pan_no: {
  required: 'PAN number is required',
  pattern: {
    value: PAN_REGEX,
    message: 'Enter a valid 10-character PAN number',
  },
},
}

// ─── Field component ──────────────────────────────────────────────────────────

function Field({
  label,
  name,
  rules,
  type = 'text',
  readOnly = false,
  placeholder,
  register,
  errors,
  icon: Icon,
  inputMode,
  onKeyDown,
  onChange,
  maxLength,
  optional = false,
}) {
  const hasError = !!errors[name]
  // A field is "valid" once it has been touched and has no error
  const isDirtyValid = !hasError && errors[name] !== undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-700"
      >
        {label}
        
      </label>

      <div className="relative">
        {Icon && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Icon
              size={16}
              className={hasError ? 'text-red-400' : 'text-gray-400'}
              aria-hidden="true"
            />
          </span>
        )}

        <input
          id={name}
          type={type}
          placeholder={placeholder}
          readOnly={readOnly}
          inputMode={inputMode}
          maxLength={maxLength}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
          onKeyDown={onKeyDown}
          {...register(name, { ...rules, onChange })}
          className={[
            'w-full rounded-xl border bg-white py-2.5 pr-10 text-sm text-gray-900 outline-none',
            'transition-all duration-200 placeholder:text-gray-400',
            'focus:ring-2 focus:ring-offset-0',
            Icon ? 'pl-10' : 'pl-4',
            readOnly
              ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
              : hasError
              ? 'border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-red-100'
              : 'border-gray-200 hover:border-gray-300 focus:border-indigo-400 focus:ring-indigo-100',
          ]
            .filter(Boolean)
            .join(' ')}
        />

        {/* Success checkmark */}
        {isDirtyValid && !readOnly && (
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
            <CheckCircle2 size={15} className="text-emerald-500" aria-hidden="true" />
          </span>
        )}

        {/* Error icon on the right */}
        {hasError && (
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
            <AlertCircle size={15} className="text-red-400" aria-hidden="true" />
          </span>
        )}
      </div>

      {hasError && (
        <p
          id={`${name}-error`}
          role="alert"
          className="flex items-center gap-1.5 text-xs text-red-500"
        >
          <AlertCircle size={12} className="shrink-0" aria-hidden="true" />
          {errors[name].message}
        </p>
      )}
    </div>
  )
}

// ─── Image upload zone ────────────────────────────────────────────────────────

function ImageUpload({ fileRef, preview, previewName, previewSize, onFileChange, onClear }) {
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file && file.type.startsWith('image/')) onFileChange(file)
    },
    [onFileChange]
  )

  const handleInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) onFileChange(file)
  }

  if (preview) {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50/80 p-3">
        {/* Thumbnail */}
        <div className="relative h-16 w-16 shrink-0">
          <img
            src={preview}
            alt="Profile preview"
            className="h-16 w-16 rounded-xl object-cover ring-2 ring-white shadow-sm"
          />
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
            <CheckCircle2 size={11} className="text-white" />
          </span>
        </div>

        {/* Meta */}
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-gray-800">{previewName}</p>
          <p className="mt-0.5 text-xs text-gray-400">{previewSize}</p>
          <div className="mt-2 flex items-center gap-2">
            <label className="cursor-pointer rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-100">
              Change
              <input
                type="file"
                ref={fileRef}
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={handleInputChange}
              />
            </label>
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100"
            >
              <X size={11} />
              Remove
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={[
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-7',
        'transition-all duration-200',
        dragging
          ? 'border-indigo-400 bg-indigo-50'
          : 'border-gray-200 bg-gray-50/50 hover:border-indigo-300 hover:bg-indigo-50/30',
      ].join(' ')}
    >
      <div
        className={[
          'flex h-11 w-11 items-center justify-center rounded-xl transition-colors',
          dragging ? 'bg-indigo-100' : 'bg-white shadow-sm border border-gray-100',
        ].join(' ')}
      >
        <ImagePlus
          size={20}
          className={dragging ? 'text-indigo-500' : 'text-gray-400'}
          aria-hidden="true"
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700">
          <span className="text-indigo-600">Click to upload</span>
          {' '}or drag &amp; drop
        </p>
        <p className="mt-0.5 text-xs text-gray-400">JPG, PNG, WebP or GIF · max 5 MB</p>
      </div>
      <input
        type="file"
        ref={fileRef}
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={handleInputChange}
      />
    </label>
  )
}

// ─── Section divider ──────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-gray-100" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
        {children}
      </span>
      <div className="h-px flex-1 bg-gray-100" />
    </div>
  )
}

// ─── Server error banner ──────────────────────────────────────────────────────

function ServerAlert({ message }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
    >
      <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-500" aria-hidden="true" />
      <p className="text-sm text-red-700">{message}</p>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const preFillMobile = location.state?.mobile || ''
  const fileRef = useRef(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageMeta, setImageMeta] = useState({ name: '', size: '' })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      mobile: preFillMobile,
      email: '',
      company_name: '',
      gst_no: '',
      pan_no: '',
      user_type_id: '1',
      location_id: '132050',
      login_via: 'ANDROID',
    },
  })

  const serverError = watch('_serverError')

  useEffect(() => {
    if (preFillMobile) setValue('mobile', preFillMobile)
  }, [preFillMobile, setValue])

  // ── Image ──────────────────────────────────────────────────────────────────

  const handleFileChange = useCallback((file) => {
    if (!file) return
    // Inject file into the hidden input via DataTransfer
    const dt = new DataTransfer()
    dt.items.add(file)
    if (fileRef.current) fileRef.current.files = dt.files
    const url = URL.createObjectURL(file)
    setImagePreview(url)
    setImageMeta({
      name: file.name,
      size: file.size < 1024 * 1024
        ? `${(file.size / 1024).toFixed(1)} KB`
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    })
  }, [])

  const handleClearImage = useCallback(() => {
    setImagePreview((prev) => { if (prev) URL.revokeObjectURL(prev); return null })
    setImageMeta({ name: '', size: '' })
    if (fileRef.current) fileRef.current.value = ''
  }, [])

  // ── Mobile input guards ───────────────────────────────────────────────────

  const blockNonDigits = (e) => {
    const ctrl = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
    const shortcut = (e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x', 'z'].includes(e.key.toLowerCase())
    if (!ctrl.includes(e.key) && !shortcut && !/^\d$/.test(e.key)) e.preventDefault()
  }

  const sanitizeMobile = (e) => {
    const clean = e.target.value.replace(/\D/g, '')
    if (e.target.value !== clean) setValue('mobile', clean, { shouldValidate: true, shouldDirty: true })
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

const onSubmit = async (formData) => {
  setValue('_serverError', '');
  clearErrors('_serverError');

  try {
    const fd = new FormData();

    Object.entries(formData).forEach(([key, val]) => {
      if (key === '_serverError' || val === undefined || val === null || val === '') return;
      fd.append(key, ['gst_no', 'pan_no'].includes(key) ? val.toUpperCase() : val);
    });

    if (fileRef.current?.files?.[0]) {
      fd.append('profile_image', fileRef.current.files[0]);
    }

    await registerUser(fd);
    toast.success("Registration successful! Please login.");
    toast.info("Redirecting to Login...");

    // Redirect to login after successful registration
    navigate('/login', {
      state: { mobile: formData.mobile }, // optional
    });

  } catch (err) {
    if (err?.field) {
      setError(err.field, { type: 'server', message: err.message });
      toast.error(err.message || "Something went wrong");
    } else {
      setValue('_serverError', err.message || 'Something went wrong. Please try again.');
      toast.error(err.message || "Something went wrong");
    }
  }
};

  const fp = { register, errors }

  return (
    <AuthLayout title="Create account" subtitle="Fill in your details to get started">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

        <SectionLabel>Personal info</SectionLabel>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            {...fp}
            label="Full Name *"
            name="name"
            placeholder="Ravi Kumar"
            icon={User}
            rules={VALIDATION.name}
          />
          <Field
            {...fp}
            label="Mobile *"
            name="mobile"
            placeholder="9876543210"
            icon={Phone}
            readOnly={!!preFillMobile}
            inputMode="numeric"
            maxLength={10}
            onKeyDown={!preFillMobile ? blockNonDigits : undefined}
            onChange={!preFillMobile ? sanitizeMobile : undefined}
            rules={VALIDATION.mobile}
          />
        </div>

        <Field
          {...fp}
          label="Email *"
          name="email"
          type="email"
          placeholder="ravi@example.com"
          icon={Mail}
          rules={VALIDATION.email}
        />

        <SectionLabel>Business info</SectionLabel>

        <Field
          {...fp}
          label="Company Name"
          name="company_name"
          placeholder="Acme Pvt Ltd"
          icon={Building2}
          optional
          rules={VALIDATION.company_name}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            {...fp}
            label="GST Number"
            name="gst_no"
            placeholder="29ABCDE1234F1Z5"
            icon={FileText}
            optional
            maxLength={15}
            rules={VALIDATION.gst_no}
          />
          <Field
            {...fp}
            label="PAN Number"
            name="pan_no"
            placeholder="ABCDE1234F"
            icon={CreditCard}
            optional
            maxLength={10}
            rules={VALIDATION.pan_no}
          />
        </div>

        <SectionLabel>Profile photo</SectionLabel>

        <ImageUpload
          fileRef={fileRef}
          preview={imagePreview}
          previewName={imageMeta.name}
          previewSize={imageMeta.size}
          onFileChange={handleFileChange}
          onClear={handleClearImage}
        />

        {/* Hidden fields */}
        <input type="hidden" {...register('user_type_id')} />
        <input type="hidden" {...register('location_id')} />
        <input type="hidden" {...register('login_via')} />

        {serverError && <ServerAlert message={serverError} />}

        <button
          type="submit"
          disabled={isSubmitting}
          className={[
            'w-full flex items-center justify-center gap-2.5 rounded-xl px-6 py-3 mt-1',
            'bg-indigo-600 text-sm font-semibold text-white shadow-sm',
            'transition-all duration-200',
            'hover:bg-indigo-700 active:scale-[0.98]',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
            'disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100',
          ].join(' ')}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              Creating your account…
            </>
          ) : (
            <>
              Create Account
              <ArrowRight size={16} aria-hidden="true" />
            </>
          )}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-indigo-600 underline underline-offset-2 transition-colors hover:text-indigo-700"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}