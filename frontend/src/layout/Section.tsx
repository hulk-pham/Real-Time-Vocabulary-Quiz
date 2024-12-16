import type { ReactNode } from 'react';
import React from 'react';

type ISectionProps = {
  title?: string;
  description?: string;
  yPadding?: string;
  children: ReactNode;
  style?: React.CSSProperties;
  className?: string;
  fullWidth?: boolean;
};

const Section = (props: ISectionProps) => (
  <div
    className={`mx-auto px-3 ${props?.fullWidth ? '' : 'max-w-screen-custom'} ${props.yPadding ? props.yPadding : 'py-16'} ${props.className || ''}`}
    style={props.style}
  >
    {(props.title || props.description) && (
      <div className="mb-12 text-center">
        {props.title && (
          <h2 className="text-4xl font-bold text-gray-900">{props.title}</h2>
        )}
        {props.description && (
          <div className="mt-4 text-xl md:px-20">{props.description}</div>
        )}
      </div>
    )}

    {props.children}
  </div>
);

export { Section };
