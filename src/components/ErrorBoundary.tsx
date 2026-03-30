import { Component, type ErrorInfo, type ReactNode } from 'react'

import { clearStoredSessions } from '../constants'
import styles from './ErrorBoundary.module.css'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary] Caught render error:', error, info.componentStack)
  }

  handleClearAndRestart = () => {
    try {
      clearStoredSessions(window.localStorage)
    } catch {
      // If localStorage isn't accessible, proceed anyway
    }
    window.location.reload()
  }

  handleTryAgain = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    const isStorageError =
      this.state.error?.name === 'SyntaxError' ||
      this.state.error?.message?.toLowerCase().includes('storage') ||
      this.state.error?.message?.toLowerCase().includes('json')

    return (
      <main className={styles.shell}>
        <div className={styles.frame}>
          <section className={styles.panel}>
            <div className={styles.body}>
              <p className={styles.label}>Something went wrong</p>
              <h1 className={styles.title}>Oops.</h1>
              <p className={styles.text}>
                {isStorageError
                  ? 'Your saved session may be corrupted. Clearing it should get things working again.'
                  : 'An unexpected error occurred. You can try clearing your saved session, or just try again.'}
              </p>
              {this.state.error && (
                <p className={styles.errorDetail}>{this.state.error.message}</p>
              )}
            </div>
            <div className={styles.actions}>
              <button type="button" onClick={this.handleClearAndRestart}>
                Clear data &amp; restart
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={this.handleTryAgain}
              >
                Try again
              </button>
            </div>
          </section>
        </div>
      </main>
    )
  }
}
