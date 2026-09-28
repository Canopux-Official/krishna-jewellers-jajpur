import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

interface BaseProps {
  label: string;
  error?: string;
  required?: boolean;
  endAdornment?: React.ReactNode;
}
interface InputProps extends BaseProps, InputHTMLAttributes<HTMLInputElement> {
  as?: 'input';
}
interface TextareaProps extends BaseProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: 'textarea';
  rows?: number;
}
interface SelectProps extends BaseProps, SelectHTMLAttributes<HTMLSelectElement> {
  as: 'select';
  options: { value: string; label: string }[];
}

type FormFieldProps = InputProps | TextareaProps | SelectProps;

const fieldStyle: React.CSSProperties = {
  width: '100%', fontFamily: 'var(--font-body)', fontSize: '0.875rem',
  color: 'var(--admin-text)', backgroundColor: 'var(--admin-card)',
  border: '1px solid var(--admin-border)', borderRadius: '6px',
  padding: '9px 12px', outline: 'none',
  transition: 'border-color 0.2s',
};

export default function FormField(props: FormFieldProps) {
  const { label, error, required, as = 'input', ...rest } = props;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'var(--color-gold)';
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = error ? 'var(--admin-danger)' : 'var(--admin-border)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 500, color: 'var(--admin-text-2)', letterSpacing: '0.03em' }}>
        {label}{required && <span style={{ color: 'var(--admin-danger)', marginLeft: '2px' }}>*</span>}
      </label>

      {as === 'textarea' ? (
        <textarea
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          rows={(props as TextareaProps).rows ?? 4}
          onFocus={handleFocus as any}
          onBlur={handleBlur as any}
          style={{ ...fieldStyle, resize: 'vertical', borderColor: error ? 'var(--admin-danger)' : 'var(--admin-border)' }}
        />
      ) : as === 'select' ? (
        <select
          {...(rest as SelectHTMLAttributes<HTMLSelectElement>)}
          onFocus={handleFocus as any}
          onBlur={handleBlur as any}
          style={{ ...fieldStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B6966' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '36px', borderColor: error ? 'var(--admin-danger)' : 'var(--admin-border)' }}
        >
          {(props as SelectProps).options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : (
        <div style={{ position: 'relative' }}>
          <input
            {...(rest as InputHTMLAttributes<HTMLInputElement>)}
            onFocus={handleFocus as any}
            onBlur={handleBlur as any}
            style={{
              ...fieldStyle,
              borderColor: error ? 'var(--admin-danger)' : 'var(--admin-border)',
              paddingRight: (props as InputProps).endAdornment ? '40px' : fieldStyle.padding,
            }}
          />
          {(props as InputProps).endAdornment && (
            <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
              {(props as InputProps).endAdornment}
            </div>
          )}
        </div>
      )}

      {error && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--admin-danger)' }}>{error}</p>
      )}
    </div>
  );
}
