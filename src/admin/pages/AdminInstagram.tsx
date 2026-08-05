import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import AdminButton from '../components/ui/AdminButton';
import FormField from '../components/ui/FormField';
import { settingsService } from '../services/settings.service';
import { useToast } from '../context/ToastContext';

const INSTAGRAM_HOME = 'https://www.instagram.com/';

function defaultCaption(storeName: string) {
  const name = storeName.trim() || 'Krishna Jewellers';
  return (
    `Temple-town gold from ${name}, Byasanagar, Jajpur.\n` +
    `Hallmarked jewellery for weddings, festivals & everyday elegance.\n` +
    `Visit us in the showroom.\n\n` +
    `#KrishnaJewellers #Byasanagar #Jajpur #GoldJewellery #Odisha`
  );
}

/**
 * Helper for posting to Instagram manually:
 * Open Instagram → upload video there → Copy Caption from here → paste on Instagram.
 */
export default function AdminInstagram() {
  const toast = useToast();
  const [caption, setCaption] = useState('');
  const [savedDefault, setSavedDefault] = useState('');
  const [storeName, setStoreName] = useState('Krishna Jewellers');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    settingsService
      .get()
      .then((s) => {
        const name = s.storeName || 'Krishna Jewellers';
        setStoreName(name);
        const fromSettings = (s.instagramCaption || '').trim();
        const initial = fromSettings || defaultCaption(name);
        setCaption(initial);
        setSavedDefault(fromSettings);
      })
      .catch(() => {
        const initial = defaultCaption('Krishna Jewellers');
        setCaption(initial);
      })
      .finally(() => setLoading(false));
  }, []);

  const openInstagram = () => {
    window.open(INSTAGRAM_HOME, '_blank', 'noopener,noreferrer');
  };

  const copyCaption = async () => {
    const text = caption.trim();
    if (!text) {
      toast.error('Write a caption first');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Caption copied — paste it on Instagram');
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Could not copy — select the text and copy manually');
    }
  };

  const saveAsDefault = async () => {
    setSaving(true);
    try {
      await settingsService.update({ instagramCaption: caption.trim() });
      setSavedDefault(caption.trim());
      toast.success('Default caption saved');
    } catch {
      toast.error('Failed to save default caption');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = () => {
    setCaption(savedDefault || defaultCaption(storeName));
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', color: 'var(--admin-text-2)' }}>Loading…</div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Instagram"
        subtitle="Open Instagram, upload your video there, then paste a caption from here."
      />

      {/* Steps */}
      <motion.ol
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          margin: '0 0 28px',
          padding: '20px 24px 20px 44px',
          background: 'var(--admin-card)',
          border: '1px solid var(--admin-border)',
          borderRadius: '10px',
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          color: 'var(--admin-text-2)',
          lineHeight: 1.7,
        }}
      >
        <li style={{ marginBottom: '6px' }}>
          Click <strong style={{ color: 'var(--admin-text)' }}>Open Instagram</strong> — if you’re logged in, Instagram opens; if not, log in there.
        </li>
        <li style={{ marginBottom: '6px' }}>
          Upload your <strong style={{ color: 'var(--admin-text)' }}>video manually</strong> on Instagram (Reels / Post).
        </li>
        <li>
          Click <strong style={{ color: 'var(--admin-text)' }}>Copy Caption</strong>, then paste it into Instagram.
        </li>
      </motion.ol>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: '20px',
          maxWidth: '720px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          style={{
            padding: '24px',
            background: 'var(--admin-card)',
            border: '1px solid var(--admin-border)',
            borderRadius: '10px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.6875rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--admin-text-2)',
              marginBottom: '16px',
            }}
          >
            1 · Open Instagram
          </p>
          <AdminButton variant="primary" onClick={openInstagram}>
            Open Instagram
          </AdminButton>
          <p
            style={{
              marginTop: '12px',
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              color: 'var(--admin-text-2)',
            }}
          >
            Opens {INSTAGRAM_HOME} in a new tab
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            padding: '24px',
            background: 'var(--admin-card)',
            border: '1px solid var(--admin-border)',
            borderRadius: '10px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.6875rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--admin-text-2)',
              marginBottom: '16px',
            }}
          >
            2 · Caption
          </p>

          <FormField
            as="textarea"
            label="Caption (editable)"
            rows={8}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write the caption you’ll paste on Instagram…"
          />

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              marginTop: '16px',
            }}
          >
            <AdminButton variant="primary" onClick={copyCaption}>
              {copied ? 'Copied' : 'Copy Caption'}
            </AdminButton>
            <AdminButton variant="secondary" onClick={saveAsDefault} disabled={saving}>
              {saving ? 'Saving…' : 'Save as default'}
            </AdminButton>
            <AdminButton variant="ghost" onClick={resetToDefault}>
              Reset to default
            </AdminButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
