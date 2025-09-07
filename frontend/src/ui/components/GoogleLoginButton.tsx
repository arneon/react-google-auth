import React, { useEffect, useRef } from 'react';
import { config } from '../../shared/config';

type Props = {
  onCredential: (idToken: string) => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  size?: 'large' | 'medium' | 'small';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  className?: string;
};

const GoogleLoginButton: React.FC<Props> = ({
  onCredential,
  text = 'signin_with',
  shape = 'pill',
  size = 'large',
  theme = 'outline',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure the Google script is loaded
    const g = window.google;
    if (!g || !g.accounts || !g.accounts.id) return;

    g.accounts.id.initialize({
      client_id: config.googleClientId,
      callback: (response: any) => {
        const token = response?.credential as string | undefined;
        if (token) onCredential(token);
      },
      auto_select: false,
      ux_mode: 'popup',
    });

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      g.accounts.id.renderButton(containerRef.current, {
        type: 'standard',
        theme,
        size,
        text,
        shape,
        logo_alignment: 'left',
        width: 280
      });
    }
  }, [onCredential]);

  return (
    <div className={className}>
      <div ref={containerRef} />
    </div>
  );
};

export default GoogleLoginButton;
