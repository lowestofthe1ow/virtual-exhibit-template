import React from 'react';

export default function HeroCover({ children }) {
    return (
        <div style={{
            marginBottom: '3rem',
            position: 'relative',
            width: '100%',
            background: 'linear-gradient(135deg, rgba(0, 255, 200, 0.05) 0%, rgba(10, 14, 23, 0.9) 50%, rgba(0, 255, 200, 0.05) 100%)',
            borderRadius: '16px',
            padding: '2rem 1.5rem',
            border: '1px solid rgba(0, 255, 200, 0.15)',
            boxShadow: '0 0 40px rgba(0, 255, 200, 0.08), inset 0 0 60px rgba(0, 255, 200, 0.03)',
            overflow: 'hidden'
        }}>
            {/* Decorative glow effect */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-20%',
                width: '60%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(0, 255, 200, 0.03) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-30%',
                left: '-10%',
                width: '40%',
                height: '150%',
                background: 'radial-gradient(circle, rgba(0, 255, 200, 0.02) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />
            {children}
        </div>
    );
}