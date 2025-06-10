export const GA_MEASUREMENT_ID = 'G-MCCB3CJSSB';

declare global {
  interface Window {
    gtag: {
      (
        command: 'config',
        targetId: string,
        config?: {
          page_path?: string;
          [key: string]: string | number | boolean | undefined;
        }
      ): void;
      (
        command: 'event',
        eventName: string,
        eventParams?: {
          event_category?: string;
          event_label?: string;
          value?: number;
          [key: string]: string | number | boolean | undefined;
        }
      ): void;
    };
  }
}

export const pageview = (url: string) => {
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

interface GTagEvent {
  action: string;
  category: string;
  label: string;
  value: number;
}

export const event = ({ action, category, label, value }: GTagEvent) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
};
