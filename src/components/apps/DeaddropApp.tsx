/**
 * DEADDROP.msg - Contact form.
 *
 * Placeholder implementation with cyberpunk styling.
 */

import { contactFormSubmitted } from '@/lib/events'
import { cn } from '@/lib/utils'
import { useAnalytics } from '@/providers/analytics'
import { AlertCircle, CheckCircle, Send } from 'lucide-react'
import { useState } from 'react'

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

function DeaddropApp() {
  const analytics = useAnalytics()
  const [status, setStatus] = useState<FormStatus>('idle')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulate form submission (placeholder)
    setStatus('sending')

    setTimeout(() => {
      // For now, just show success
      setStatus('success')
      analytics.track(contactFormSubmitted(true))
      setName('')
      setMessage('')

      // Reset after showing success
      setTimeout(() => setStatus('idle'), 3000)
    }, 1000)
  }

  return (
    <div className="flex h-full flex-col p-4">
      {/* Header */}
      <div className="mb-4 border-b border-cyan-500/30 pb-3">
        <h2 className="text-lg font-bold uppercase tracking-wider text-cyan-300">SECURE MESSAGE</h2>
        <p className="mt-1 text-xs text-cyan-500/60">ENCRYPTED CHANNEL | DIRECT LINE</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        {/* Name field */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-1 block text-xs font-medium uppercase text-cyan-400">
            Designation
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your callsign..."
            disabled={status === 'sending'}
            className={cn(
              'w-full rounded border bg-black/50 px-3 py-2',
              'border-cyan-500/30 text-cyan-100 placeholder-cyan-500/40',
              'transition-colors duration-150',
              'focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50',
              'disabled:opacity-50'
            )}
          />
        </div>

        {/* Message field */}
        <div className="mb-4 flex-1">
          <label
            htmlFor="message"
            className="mb-1 block text-xs font-medium uppercase text-cyan-400"
          >
            Transmission
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message..."
            disabled={status === 'sending'}
            className={cn(
              'h-full min-h-[120px] w-full resize-none rounded border bg-black/50 px-3 py-2',
              'border-cyan-500/30 text-cyan-100 placeholder-cyan-500/40',
              'transition-colors duration-150',
              'focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50',
              'disabled:opacity-50'
            )}
          />
        </div>

        {/* Status messages */}
        {status === 'success' && (
          <div className="mb-4 flex items-center gap-2 rounded border border-green-500/30 bg-green-500/10 p-3">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-sm text-green-400">Message transmitted successfully</span>
          </div>
        )}

        {status === 'error' && (
          <div className="mb-4 flex items-center gap-2 rounded border border-red-500/30 bg-red-500/10 p-3">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <span className="text-sm text-red-400">Transmission failed. Please retry.</span>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={status === 'sending' || !name.trim() || !message.trim()}
          className={cn(
            'flex items-center justify-center gap-2 rounded border px-4 py-2',
            'border-cyan-500/50 bg-cyan-500/10 text-cyan-300',
            'transition-all duration-150',
            'hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-200',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-cyan-500/50 disabled:hover:bg-cyan-500/10 disabled:hover:text-cyan-300'
          )}
        >
          <Send className="h-4 w-4" />
          <span className="font-medium uppercase tracking-wider">
            {status === 'sending' ? 'Transmitting...' : 'Send Message'}
          </span>
        </button>
      </form>

      {/* Footer */}
      <div className="mt-4 border-t border-cyan-500/20 pt-3">
        <p className="text-center text-xs text-cyan-500/40">— ALL MESSAGES ARE ENCRYPTED —</p>
      </div>
    </div>
  )
}

export { DeaddropApp }
