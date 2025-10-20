import './StatusBar.css';

const StatusBar = ({ loading = false, message = '', error = '' }) => {
  if (!loading && !error && !message) return null;
  return (
    <div className={`status-bar ${loading ? 'loading' : ''} ${error ? 'error' : ''}`} role="status">
      {loading && (
        <>
          <span className="spinner" aria-hidden>⏳</span>
          <span>{message || 'Procesando...'}</span>
        </>
      )}
      {!loading && error && (
        <>
          <span className="icon" aria-hidden>⚠️</span>
          <span>{error}</span>
        </>
      )}
      {!loading && !error && message && <span>{message}</span>}
    </div>
  );
};

export default StatusBar;
