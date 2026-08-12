// Üretilmiş dosya — components/ klasöründen derlenmiştir. Elle düzenlemeyin.

/** Lucide glifini DOM'a basar. lucide UMD script'i sayfada yüklü olmalıdır. */
function Icon({ name, size = 20, strokeWidth = 1.75, color = 'currentColor', style, ...rest }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    let cancelled = false;
    const paint = () => {
      const el = ref.current;
      if (cancelled || !el) return;
      if (!window.lucide || !window.lucide.createIcons) { setTimeout(paint, 120); return; }
      el.innerHTML = '';
      const i = document.createElement('i');
      i.setAttribute('data-lucide', name);
      el.appendChild(i);
      window.lucide.createIcons({ nameAttr: 'data-lucide' });
      const svg = el.querySelector('svg');
      if (svg) {
        svg.setAttribute('width', size); svg.setAttribute('height', size);
        svg.setAttribute('stroke-width', strokeWidth);
        svg.style.display = 'block';
      }
    };
    paint();
    return () => { cancelled = true; };
  }, [name, size, strokeWidth]);
  return <span ref={ref} aria-hidden="true" style={{ display: 'inline-flex', width: size, height: size, color, flex: '0 0 auto', ...style }} {...rest} />;
}

const buttonBase = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)',
  fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-semibold)', letterSpacing: '.01em',
  borderRadius: 'var(--radius-control)', border: '1px solid transparent', cursor: 'pointer',
  textDecoration: 'none', whiteSpace: 'nowrap',
  transition: 'background var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard), transform var(--dur-instant) var(--ease-standard)',
};
const buttonSizes = {
  sm: { height: 'var(--control-h-sm)', padding: '0 var(--space-3)', fontSize: 'var(--text-body-sm)' },
  md: { height: 'var(--control-h)', padding: '0 var(--space-5)', fontSize: 'var(--text-body-sm)' },
  lg: { height: 'var(--control-h-lg)', padding: '0 var(--space-6)', fontSize: 'var(--text-body)' },
};
const buttonVariants = {
  primary: { background: 'var(--action-primary)', color: 'var(--text-on-dark)' },
  accent: { background: 'var(--action-accent)', color: 'var(--ink-950)' },
  secondary: { background: 'var(--surface-card)', color: 'var(--text-heading)', borderColor: 'var(--border-default)', boxShadow: 'var(--shadow-card)' },
  ghost: { background: 'transparent', color: 'var(--text-heading)' },
  danger: { background: 'var(--status-danger-fg)', color: 'var(--paper-0)' },
  inverse: { background: 'rgba(255,255,255,.10)', color: 'var(--text-on-dark)', borderColor: 'var(--border-inverse)' },
};
const buttonHover = {
  primary: { background: 'var(--action-primary-hover)' },
  accent: { background: 'var(--action-accent-hover)' },
  secondary: { background: 'var(--action-quiet-hover)', borderColor: 'var(--border-strong)' },
  ghost: { background: 'var(--action-quiet-hover)' },
  danger: { background: '#8E2828' },
  inverse: { background: 'rgba(255,255,255,.18)' },
};

function Button({ variant = 'primary', size = 'md', icon, iconEnd, block, disabled, loading, as = 'button', children, style, onMouseEnter, onMouseLeave, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const Tag = as;
  const s = {
    ...buttonBase, ...buttonSizes[size], ...buttonVariants[variant],
    ...(hover && !disabled ? buttonHover[variant] : null),
    ...(block ? { display: 'flex', width: '100%' } : null),
    ...(disabled || loading ? { opacity: .48, cursor: 'not-allowed', pointerEvents: loading ? 'none' : 'auto' } : null),
    ...style,
  };
  return (
    <Tag
      style={s} disabled={Tag === 'button' ? disabled : undefined}
      onMouseEnter={(e) => { setHover(true); onMouseEnter && onMouseEnter(e); }}
      onMouseLeave={(e) => { setHover(false); onMouseLeave && onMouseLeave(e); }}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(var(--press-scale))'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'none'; }}
      {...rest}
    >
      {loading ? <Icon name="loader-circle" size={size === 'lg' ? 18 : 16} style={{ animation: 'lexa-spin 900ms linear infinite' }} /> : icon ? <Icon name={icon} size={size === 'lg' ? 20 : 16} /> : null}
      {children}
      {iconEnd ? <Icon name={iconEnd} size={size === 'lg' ? 20 : 16} /> : null}
    </Tag>
  );
}

const iconButtonSizes = { sm: 34, md: 40, lg: 44 };
const iconButtonTones = {
  quiet: { background: 'transparent', color: 'var(--text-muted)', borderColor: 'transparent' },
  outline: { background: 'var(--surface-card)', color: 'var(--text-heading)', borderColor: 'var(--border-default)' },
  solid: { background: 'var(--action-primary)', color: 'var(--text-on-dark)', borderColor: 'transparent' },
  inverse: { background: 'rgba(255,255,255,.10)', color: 'var(--text-on-dark)', borderColor: 'var(--border-inverse)' },
};

function IconButton({ icon, size = 'md', tone = 'quiet', label, round, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const px = iconButtonSizes[size];
  return (
    <button
      aria-label={label} title={label}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: px, height: px, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: round ? 'var(--radius-pill)' : 'var(--radius-control)', border: '1px solid',
        cursor: 'pointer', transition: 'background var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard)',
        ...iconButtonTones[tone],
        ...(hover ? (tone === 'quiet' ? { background: 'var(--action-quiet-hover)', color: 'var(--text-heading)' }
          : tone === 'outline' ? { background: 'var(--action-quiet-hover)' }
          : tone === 'solid' ? { background: 'var(--action-primary-hover)' }
          : { background: 'rgba(255,255,255,.18)' }) : null),
        ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={size === 'sm' ? 16 : 20} />
    </button>
  );
}

const cardTones = {
  default: { background: 'var(--surface-card)', border: '1px solid var(--border-hairline)', boxShadow: 'var(--shadow-card)' },
  raised: { background: 'var(--surface-card)', border: '1px solid var(--border-hairline)', boxShadow: 'var(--shadow-raised)' },
  flat: { background: 'var(--surface-sunken)', border: '1px solid transparent', boxShadow: 'none' },
  outline: { background: 'transparent', border: '1px solid var(--border-default)', boxShadow: 'none' },
  inverse: { background: 'var(--surface-inverse)', border: '1px solid var(--border-inverse)', boxShadow: 'none', color: 'var(--text-on-dark)' },
  accent: { background: 'var(--surface-accent-soft)', border: '1px solid var(--brass-200)', boxShadow: 'none' },
};
const cardPads = { none: 0, sm: 'var(--space-4)', md: 'var(--space-6)', lg: 'var(--space-8)' };

function Card({ tone = 'default', padding = 'md', interactive, topRule, children, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: 'var(--radius-card)', padding: cardPads[padding], position: 'relative', overflow: 'hidden',
        transition: 'box-shadow var(--dur-base) var(--ease-standard), border-color var(--dur-base) var(--ease-standard), transform var(--dur-base) var(--ease-standard)',
        ...cardTones[tone],
        ...(interactive ? { cursor: 'pointer' } : null),
        ...(interactive && hover ? { boxShadow: 'var(--shadow-raised)', borderColor: 'var(--border-default)', transform: 'translateY(-2px)' } : null),
        ...style,
      }}
      {...rest}
    >
      {topRule ? <span style={{ position: 'absolute', insetInline: 0, top: 0, height: 3, background: 'var(--brass-500)' }} /> : null}
      {children}
    </div>
  );
}

const badgeTones = {
  neutral: { background: 'var(--surface-sunken)', color: 'var(--text-muted)' },
  ink: { background: 'var(--ink-50)', color: 'var(--ink-700)' },
  success: { background: 'var(--status-success-bg)', color: 'var(--status-success-fg)' },
  pending: { background: 'var(--status-pending-bg)', color: 'var(--status-pending-fg)' },
  danger: { background: 'var(--status-danger-bg)', color: 'var(--status-danger-fg)' },
  info: { background: 'var(--status-info-bg)', color: 'var(--status-info-fg)' },
  accent: { background: 'var(--brass-50)', color: 'var(--brass-700)' },
};

function Badge({ tone = 'neutral', icon, dot, children, style, ...rest }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
      height: 24, padding: '0 var(--space-3)', borderRadius: 'var(--radius-pill)',
      fontSize: 'var(--text-caption)', fontWeight: 'var(--weight-semibold)', lineHeight: 1,
      ...badgeTones[tone], ...style,
    }} {...rest}>
      {dot ? <span style={{ width: 6, height: 6, borderRadius: 999, background: 'currentColor' }} /> : null}
      {icon ? <Icon name={icon} size={13} /> : null}
      {children}
    </span>
  );
}

function Tag({ selected, onRemove, icon, children, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <span
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', height: 30,
        padding: '0 var(--space-3)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-body-sm)',
        fontWeight: 'var(--weight-medium)', cursor: rest.onClick ? 'pointer' : 'default',
        border: '1px solid ' + (selected ? 'var(--ink-700)' : 'var(--border-default)'),
        background: selected ? 'var(--ink-700)' : hover && rest.onClick ? 'var(--action-quiet-hover)' : 'var(--surface-card)',
        color: selected ? 'var(--text-on-dark)' : 'var(--text-body)',
        transition: 'background var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard)',
        ...style,
      }}
      {...rest}
    >
      {icon ? <Icon name={icon} size={14} /> : null}
      {children}
      {onRemove ? <Icon name="x" size={14} style={{ opacity: .6, cursor: 'pointer' }} onClick={onRemove} /> : null}
    </span>
  );
}

const avatarSizes = { sm: 28, md: 40, lg: 56, xl: 88 };

function Avatar({ name = '', src, size = 'md', tone = 'ink', style, ...rest }) {
  const px = avatarSizes[size];
  const initials = name.trim().split(/\s+/).slice(0, 2).map((w) => w[0] || '').join('').toLocaleUpperCase('tr-TR');
  const tones = {
    ink: { background: 'var(--ink-700)', color: 'var(--text-on-dark)' },
    brass: { background: 'var(--brass-200)', color: 'var(--brass-800)' },
    sand: { background: 'var(--paper-3)', color: 'var(--sand-700)' },
  };
  return (
    <span style={{
      width: px, height: px, borderRadius: 'var(--radius-pill)', overflow: 'hidden', flex: '0 0 auto',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-semibold)',
      fontSize: px <= 28 ? 11 : px <= 40 ? 14 : px <= 56 ? 18 : 28, letterSpacing: '.02em',
      ...tones[tone], ...style,
    }} {...rest}>
      {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
    </span>
  );
}

function Input({ label, hint, error, icon, suffix, size = 'md', id, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const uid = React.useId ? React.useId() : 'in';
  const inputId = id || uid;
  const h = size === 'lg' ? 'var(--control-h-lg)' : size === 'sm' ? 'var(--control-h-sm)' : 'var(--control-h)';
  return (
    <label htmlFor={inputId} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', ...style }}>
      {label ? <span style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-heading)' }}>{label}</span> : null}
      <span style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)', height: h, padding: '0 var(--space-3)',
        background: 'var(--surface-card)', borderRadius: 'var(--radius-control)',
        border: '1px solid ' + (error ? 'var(--status-danger-fg)' : focus ? 'var(--border-focus)' : 'var(--border-default)'),
        boxShadow: focus ? 'var(--shadow-focus)' : 'none',
        transition: 'border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)',
      }}>
        {icon ? <Icon name={icon} size={16} color="var(--text-faint)" /> : null}
        <input id={inputId} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ flex: 1, minWidth: 0, border: 0, outline: 'none', background: 'transparent', font: 'inherit', fontSize: 'var(--text-body-sm)', color: 'var(--text-heading)' }}
          {...rest} />
        {suffix ? <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-faint)' }}>{suffix}</span> : null}
      </span>
      {error ? <span style={{ fontSize: 'var(--text-caption)', color: 'var(--status-danger-fg)' }}>{error}</span>
        : hint ? <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-faint)' }}>{hint}</span> : null}
    </label>
  );
}

function Textarea({ label, hint, error, rows = 4, counterMax, value, id, style, onChange, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const uid = React.useId ? React.useId() : 'ta';
  const taId = id || uid;
  const len = typeof value === 'string' ? value.length : 0;
  return (
    <label htmlFor={taId} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', ...style }}>
      {label ? <span style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-heading)' }}>{label}</span> : null}
      <textarea id={taId} rows={rows} value={value} onChange={onChange}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          resize: 'vertical', padding: 'var(--space-3)', font: 'inherit', fontSize: 'var(--text-body-sm)',
          lineHeight: 'var(--leading-normal)', color: 'var(--text-heading)', background: 'var(--surface-card)',
          borderRadius: 'var(--radius-control)', outline: 'none',
          border: '1px solid ' + (error ? 'var(--status-danger-fg)' : focus ? 'var(--border-focus)' : 'var(--border-default)'),
          boxShadow: focus ? 'var(--shadow-focus)' : 'none',
        }} {...rest} />
      <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-caption)', color: error ? 'var(--status-danger-fg)' : 'var(--text-faint)' }}>
        <span>{error || hint || ''}</span>
        {counterMax ? <span className="mono">{len}/{counterMax}</span> : null}
      </span>
    </label>
  );
}

function Select({ label, hint, error, options = [], size = 'md', id, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const uid = React.useId ? React.useId() : 'sel';
  const selId = id || uid;
  const h = size === 'lg' ? 'var(--control-h-lg)' : size === 'sm' ? 'var(--control-h-sm)' : 'var(--control-h)';
  return (
    <label htmlFor={selId} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', ...style }}>
      {label ? <span style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-heading)' }}>{label}</span> : null}
      <span style={{
        position: 'relative', display: 'flex', alignItems: 'center', height: h,
        background: 'var(--surface-card)', borderRadius: 'var(--radius-control)',
        border: '1px solid ' + (error ? 'var(--status-danger-fg)' : focus ? 'var(--border-focus)' : 'var(--border-default)'),
        boxShadow: focus ? 'var(--shadow-focus)' : 'none',
      }}>
        <select id={selId} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ appearance: 'none', width: '100%', height: '100%', border: 0, outline: 'none', background: 'transparent',
            font: 'inherit', fontSize: 'var(--text-body-sm)', color: 'var(--text-heading)', padding: '0 var(--space-8) 0 var(--space-3)', cursor: 'pointer' }}
          {...rest}>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <Icon name="chevron-down" size={16} color="var(--text-faint)" style={{ position: 'absolute', right: 12, pointerEvents: 'none' }} />
      </span>
      {error ? <span style={{ fontSize: 'var(--text-caption)', color: 'var(--status-danger-fg)' }}>{error}</span>
        : hint ? <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-faint)' }}>{hint}</span> : null}
    </label>
  );
}

function Checkbox({ label, description, checked, onChange, disabled, style, ...rest }) {
  return (
    <label style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .5 : 1, ...style }}>
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} {...rest} />
      <span style={{
        width: 20, height: 20, flex: '0 0 auto', marginTop: 1, borderRadius: 'var(--radius-xs)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid ' + (checked ? 'var(--action-primary)' : 'var(--border-strong)'),
        background: checked ? 'var(--action-primary)' : 'var(--surface-card)',
        transition: 'background var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard)',
      }}>
        {checked ? <Icon name="check" size={14} color="var(--text-on-dark)" strokeWidth={2.5} /> : null}
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--text-heading)' }}>{label}</span>
        {description ? <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-muted)' }}>{description}</span> : null}
      </span>
    </label>
  );
}

function Radio({ label, description, checked, onChange, name, value, disabled, style, ...rest }) {
  return (
    <label style={{
      display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start', cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .5 : 1, padding: 'var(--space-3)', borderRadius: 'var(--radius-control)',
      border: '1px solid ' + (checked ? 'var(--ink-700)' : 'var(--border-default)'),
      background: checked ? 'var(--surface-selected)' : 'var(--surface-card)',
      transition: 'border-color var(--dur-fast) var(--ease-standard), background var(--dur-fast) var(--ease-standard)', ...style,
    }}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} disabled={disabled} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} {...rest} />
      <span style={{
        width: 18, height: 18, flex: '0 0 auto', marginTop: 2, borderRadius: 999,
        border: '1px solid ' + (checked ? 'var(--ink-700)' : 'var(--border-strong)'),
        background: 'var(--surface-card)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {checked ? <span style={{ width: 9, height: 9, borderRadius: 999, background: 'var(--ink-700)' }} /> : null}
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--text-heading)' }}>{label}</span>
        {description ? <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-muted)' }}>{description}</span> : null}
      </span>
    </label>
  );
}

function Switch({ label, description, checked, onChange, disabled, style, ...rest }) {
  return (
    <label style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', justifyContent: 'space-between', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .5 : 1, ...style }}>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--text-heading)' }}>{label}</span>
        {description ? <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-muted)' }}>{description}</span> : null}
      </span>
      <input type="checkbox" role="switch" checked={checked} onChange={onChange} disabled={disabled} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} {...rest} />
      <span style={{
        width: 44, height: 26, flex: '0 0 auto', borderRadius: 999, padding: 3,
        background: checked ? 'var(--action-primary)' : 'var(--sand-400)',
        transition: 'background var(--dur-base) var(--ease-standard)',
      }}>
        <span style={{
          display: 'block', width: 20, height: 20, borderRadius: 999, background: 'var(--paper-0)',
          boxShadow: '0 1px 2px rgba(11,22,38,.25)', transform: checked ? 'translateX(18px)' : 'translateX(0)',
          transition: 'transform var(--dur-base) var(--ease-standard)',
        }} />
      </span>
    </label>
  );
}

function Tabs({ items = [], value, onChange, variant = 'underline', style, ...rest }) {
  const underline = variant === 'underline';
  return (
    <div role="tablist" style={{
      display: 'flex', gap: underline ? 'var(--space-6)' : 'var(--space-1)', alignItems: 'stretch',
      borderBottom: underline ? '1px solid var(--border-hairline)' : 'none',
      background: underline ? 'transparent' : 'var(--surface-sunken)',
      padding: underline ? 0 : 4, borderRadius: underline ? 0 : 'var(--radius-control)', ...style,
    }} {...rest}>
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button key={it.value} role="tab" aria-selected={active} onClick={() => onChange && onChange(it.value)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer',
              font: 'inherit', fontSize: 'var(--text-body-sm)', fontWeight: active ? 'var(--weight-semibold)' : 'var(--weight-medium)',
              color: active ? 'var(--text-heading)' : 'var(--text-muted)', background: underline ? 'transparent' : active ? 'var(--surface-card)' : 'transparent',
              border: 0, borderBottom: underline ? '2px solid ' + (active ? 'var(--brass-500)' : 'transparent') : 0,
              borderRadius: underline ? 0 : 'var(--radius-xs)', padding: underline ? '0 0 var(--space-3)' : '6px var(--space-4)',
              boxShadow: !underline && active ? 'var(--shadow-card)' : 'none',
              transition: 'color var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard)',
            }}>
            {it.icon ? <Icon name={it.icon} size={16} /> : null}
            {it.label}
            {it.count != null ? <span style={{ fontSize: 'var(--text-micro)', fontWeight: 'var(--weight-semibold)', background: 'var(--surface-sunken)', color: 'var(--text-muted)', borderRadius: 999, padding: '2px 7px' }}>{it.count}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

function Dialog({ open, title, description, onClose, footer, width = 480, children }) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'var(--scrim-overlay)', backdropFilter: 'blur(2px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6)',
        animation: 'lexa-fade var(--dur-base) var(--ease-enter)' }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: width, background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-overlay)', border: '1px solid var(--border-hairline)', overflow: 'hidden',
          animation: 'lexa-rise var(--dur-base) var(--ease-enter)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)', padding: 'var(--space-6) var(--space-6) var(--space-4)' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-title-3)', color: 'var(--text-heading)', margin: 0 }}>{title}</h3>
            {description ? <p style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-body-sm)', color: 'var(--text-muted)' }}>{description}</p> : null}
          </div>
          {onClose ? <IconButton icon="x" label="Kapat" size="sm" onClick={onClose} /> : null}
        </div>
        {children ? <div style={{ padding: '0 var(--space-6) var(--space-6)' }}>{children}</div> : null}
        {footer ? <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', padding: 'var(--space-4) var(--space-6)', background: 'var(--surface-sunken)', borderTop: '1px solid var(--border-hairline)' }}>{footer}</div> : null}
      </div>
    </div>
  );
}

const toastTones = {
  success: { icon: 'check-circle-2', color: 'var(--status-success-fg)' },
  info: { icon: 'info', color: 'var(--status-info-fg)' },
  pending: { icon: 'clock', color: 'var(--status-pending-fg)' },
  danger: { icon: 'triangle-alert', color: 'var(--status-danger-fg)' },
};

function Toast({ tone = 'success', title, description, action, onClose, style }) {
  const t = toastTones[tone];
  return (
    <div role="status" style={{
      display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start', width: 'min(380px,100%)',
      padding: 'var(--space-4)', background: 'var(--surface-inverse)', color: 'var(--text-on-dark)',
      borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-overlay)',
      animation: 'lexa-rise var(--dur-base) var(--ease-enter)', ...style,
    }}>
      <Icon name={t.icon} size={18} color={tone === 'success' ? 'var(--brass-400)' : t.color} style={{ marginTop: 1 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 'var(--text-body-sm)', fontWeight: 'var(--weight-semibold)' }}>{title}</div>
        {description ? <div style={{ fontSize: 'var(--text-caption)', color: 'var(--text-on-dark-muted)', marginTop: 2 }}>{description}</div> : null}
      </div>
      {action ? <button onClick={action.onClick} style={{ font: 'inherit', fontSize: 'var(--text-caption)', fontWeight: 'var(--weight-semibold)', color: 'var(--brass-400)', background: 'none', border: 0, cursor: 'pointer' }}>{action.label}</button> : null}
      {onClose ? <Icon name="x" size={16} color="var(--text-on-dark-muted)" style={{ cursor: 'pointer' }} onClick={onClose} /> : null}
    </div>
  );
}

function Tooltip({ label, placement = 'top', children, style }) {
  const [open, setOpen] = React.useState(false);
  const pos = {
    top: { bottom: '100%', left: '50%', transform: 'translate(-50%,-8px)' },
    bottom: { top: '100%', left: '50%', transform: 'translate(-50%,8px)' },
    left: { right: '100%', top: '50%', transform: 'translate(-8px,-50%)' },
    right: { left: '100%', top: '50%', transform: 'translate(8px,-50%)' },
  }[placement];
  return (
    <span style={{ position: 'relative', display: 'inline-flex', ...style }}
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
      {children}
      {open ? (
        <span role="tooltip" style={{
          position: 'absolute', zIndex: 60, ...pos, whiteSpace: 'nowrap', pointerEvents: 'none',
          background: 'var(--ink-900)', color: 'var(--text-on-dark)', fontSize: 'var(--text-caption)',
          padding: '6px var(--space-3)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-overlay)',
          animation: 'lexa-fade var(--dur-fast) var(--ease-enter)',
        }}>{label}</span>
      ) : null}
    </span>
  );
}

const slotChannels = {
  office: { icon: 'building-2', label: 'Ofiste', color: 'var(--channel-office)' },
  video: { icon: 'video', label: 'Görüntülü', color: 'var(--channel-video)' },
  phone: { icon: 'phone', label: 'Sesli', color: 'var(--channel-phone)' },
};

function AppointmentSlot({ time, duration = '30 dk', channel = 'office', selected, disabled, onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const c = slotChannels[channel];
  return (
    <button type="button" onClick={disabled ? undefined : onClick} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, minWidth: 104,
        minHeight: 'var(--tap-min)', padding: 'var(--space-3)', cursor: disabled ? 'not-allowed' : 'pointer',
        borderRadius: 'var(--radius-control)', font: 'inherit', textAlign: 'left',
        border: '1px solid ' + (selected ? 'var(--ink-800)' : 'var(--border-default)'),
        background: disabled ? 'var(--surface-sunken)' : selected ? 'var(--ink-800)' : hover ? 'var(--action-quiet-hover)' : 'var(--surface-card)',
        color: disabled ? 'var(--text-faint)' : selected ? 'var(--text-on-dark)' : 'var(--text-heading)',
        opacity: disabled ? .7 : 1, textDecoration: disabled ? 'line-through' : 'none',
        transition: 'background var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard)',
        ...style,
      }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-sm)', fontWeight: 500, letterSpacing: 'var(--tracking-mono)' }}>{time}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 'var(--text-micro)', color: selected ? 'var(--text-on-dark-muted)' : disabled ? 'var(--text-faint)' : c.color }}>
        <Icon name={c.icon} size={12} />{c.label} · {duration}
      </span>
    </button>
  );
}

const caseStatusMap = {
  active: { tone: 'info', label: 'Devam ediyor' },
  hearing: { tone: 'pending', label: 'Duruşma bekleniyor' },
  closed: { tone: 'success', label: 'Sonuçlandı' },
  urgent: { tone: 'danger', label: 'Süre doluyor' },
};

function CaseStatusCard({ title, fileNo, court, status = 'active', nextDate, progress = 0, unread = 0, onClick, style }) {
  const s = caseStatusMap[status];
  return (
    <Card interactive={!!onClick} onClick={onClick} padding="sm" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', ...style }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
        <div style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--text-body-lg)', color: 'var(--text-heading)', lineHeight: 'var(--leading-snug)', textWrap: 'balance' }}>{title}</div>
        <Badge tone={s.tone} dot>{s.label}</Badge>
      </div>
      <div className="mono" style={{ color: 'var(--text-faint)', marginTop: -6, lineHeight: 1.45 }}>{fileNo}{court ? <><span style={{ opacity: .5 }}> · </span>{court}</> : null}</div>
      <div style={{ height: 4, borderRadius: 999, background: 'var(--paper-3)', overflow: 'hidden' }}>
        <div style={{ width: progress + '%', height: '100%', background: 'var(--brass-500)', transition: 'width var(--dur-slow) var(--ease-standard)' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', fontSize: 'var(--text-caption)', color: 'var(--text-muted)' }}>
        {nextDate ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="calendar-days" size={14} color="var(--text-faint)" />{nextDate}</span> : null}
        {unread > 0 ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-accent)', fontWeight: 'var(--weight-semibold)' }}><Icon name="message-square" size={14} />{unread} yeni</span> : null}
      </div>
    </Card>
  );
}

function MessageBubble({ from = 'client', author, time, attachment, aiNote, children, style }) {
  const mine = from === 'client';
  const isAi = from === 'ai';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: mine ? 'flex-end' : 'flex-start', gap: 4, ...style }}>
      {author ? <span style={{ fontSize: 'var(--text-micro)', fontWeight: 'var(--weight-semibold)', letterSpacing: 'var(--tracking-eyebrow)', textTransform: 'uppercase', color: 'var(--text-faint)' }}>{author}</span> : null}
      <div style={{
        maxWidth: '78%', padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-body-sm)',
        lineHeight: 'var(--leading-relaxed)',
        borderRadius: mine ? 'var(--radius-md) var(--radius-md) var(--radius-xs) var(--radius-md)' : 'var(--radius-md) var(--radius-md) var(--radius-md) var(--radius-xs)',
        background: mine ? 'var(--ink-800)' : isAi ? 'var(--brass-50)' : 'var(--surface-card)',
        color: mine ? 'var(--text-on-dark)' : 'var(--text-body)',
        border: '1px solid ' + (mine ? 'transparent' : isAi ? 'var(--brass-200)' : 'var(--border-hairline)'),
        boxShadow: mine ? 'none' : 'var(--shadow-card)',
      }}>
        {isAi ? <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: 'var(--text-micro)', fontWeight: 'var(--weight-semibold)', letterSpacing: 'var(--tracking-eyebrow)', textTransform: 'uppercase', color: 'var(--brass-700)' }}><Icon name="sparkles" size={12} />Ön Değerlendirme</div> : null}
        {children}
        {attachment ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-3)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)', background: mine ? 'rgba(255,255,255,.10)' : 'var(--surface-sunken)', fontSize: 'var(--text-caption)' }}>
            <Icon name="paperclip" size={14} />{attachment}
          </div>
        ) : null}
        {isAi && aiNote ? <div style={{ marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--brass-200)', fontSize: 'var(--text-micro)', color: 'var(--brass-800)' }}>{aiNote}</div> : null}
      </div>
      {time ? <span className="mono" style={{ color: 'var(--text-faint)', fontSize: 'var(--text-micro)' }}>{time}</span> : null}
    </div>
  );
}

function PracticeAreaCard({ icon = 'scale', title, description, meta, onClick, style }) {
  return (
    <Card interactive onClick={onClick} padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', ...style }}>
      <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--brass-50)', border: '1px solid var(--brass-200)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={20} color="var(--brass-700)" />
      </span>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-title-3)', color: 'var(--text-heading)' }}>{title}</div>
      <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-relaxed)', textWrap: 'pretty' }}>{description}</p>
      {meta ? <span style={{ marginTop: 'auto', paddingTop: 'var(--space-2)', fontSize: 'var(--text-caption)', color: 'var(--text-accent)', fontWeight: 'var(--weight-semibold)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>{meta}<Icon name="arrow-right" size={14} /></span> : null}
    </Card>
  );
}

window.LexaHukukDesignSystem_93e85e = { Icon, Button, IconButton, Card, Badge, Tag, Avatar, Input, Textarea, Select, Checkbox, Radio, Switch, Tabs, Dialog, Toast, Tooltip, AppointmentSlot, CaseStatusCard, MessageBubble, PracticeAreaCard };
