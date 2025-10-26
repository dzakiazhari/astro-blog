import satori from 'satori'

import { SITE } from '@/consts'

export default async (fonts) => {
  return satori(
    {
      type: 'div',
      props: {
        style: {
          background: '#fefbfb',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'IBM Plex Sans',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: '-1px',
                right: '-1px',
                border: '4px solid #000',
                background: '#ecebeb',
                opacity: '0.9',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'center',
                margin: '2.5rem',
                width: '88%',
                height: '80%',
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                border: '4px solid #000',
                background: '#fefbfb',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'center',
                margin: '2rem',
                width: '88%',
                height: '80%',
              },
              children: {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    margin: '20px',
                    width: '90%',
                    height: '90%',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '90%',
                          maxHeight: '90%',
                          overflow: 'hidden',
                          textAlign: 'center',
                          gap: '1.6rem',
                        },
                        children: [
                          {
                            type: 'p',
                            props: {
                              style: { fontSize: 72, fontWeight: 700 },
                              children: SITE.title,
                            },
                          },
                          {
                            type: 'p',
                            props: {
                              style: { fontSize: 28, color: '#5d8f63' },
                              children: SITE.description,
                            },
                          },
                        ],
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          justifyContent: 'flex-end',
                          width: '100%',
                          marginBottom: '8px',
                          fontSize: 28,
                          fontWeight: 600,
                          fontFamily: 'IBM Plex Mono',
                        },
                        children: {
                          type: 'span',
                          props: {
                            style: { overflow: 'hidden' },
                            children: new URL(SITE.href).hostname,
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts,
    },
  )
}
