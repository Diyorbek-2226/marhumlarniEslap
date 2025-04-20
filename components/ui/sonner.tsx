'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
* Renders a customized toaster component with theme and style settings.
* @example
* renderToasterComponent({ theme: 'light', position: 'bottom-right' })
* // returns a Sonner component configured with specified theme and position
* @param {object} props - ToasterProps containing configuration options.
* @returns {JSX.Element} A Sonner component with applied theme and custom styles.
* @description
*   - Utilizes the useTheme hook to determine the theme setting.
*   - Applies custom classNames for different toaster elements for styling.
*   - Passes default theme 'system' if no theme is provided in props.
*/
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
