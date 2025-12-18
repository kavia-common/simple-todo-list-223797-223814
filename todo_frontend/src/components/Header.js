import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Header - Displays the app title and subtitle with Ocean Professional style.
 */
export default function Header() {
  return (
    <header className="ocean-header" role="banner">
      <div className="ocean-container" style={{ paddingTop: 28, paddingBottom: 18 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 800,
            color: '#111827'
          }}
        >
          Ocean Tasks
        </h1>
        <p
          style={{
            margin: '6px 0 0 0',
            color: '#6b7280'
          }}
        >
          Manage your todos with a clean, modern interface.
        </p>
      </div>
    </header>
  );
}
