import satori from 'satori'

import { SITE } from '@/consts'

export default async (post, fonts) => {
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
                      type: 'p',
                      props: {
                        style: {
                          fontSize: 72,
                          fontWeight: 700,
                          maxHeight: '82%',
                          overflow: 'hidden',
                          lineHeight: 1.1,
                        },
                        children: post.data.title,
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '100%',
                          marginBottom: '8px',
                          fontSize: 28,
                          fontWeight: 500,
                        },
                        children: [
                          {
                            type: 'span',
                            props: {
                              children: [
                                'by ',
                                {
                                  type: 'span',
                                  props: {
                                    style: {
                                      fontFamily: 'IBM Plex Mono',
                                      fontWeight: 600,
                                      color: '#5d8f63',
                                    },
                                    children: post.data.author || SITE.author,
                                  },
                                },
                              ],
                            },
                          },
                          {
                            type: 'span',
                            props: {
                              style: {
                                overflow: 'hidden',
                                fontWeight: 600,
                                fontFamily: 'IBM Plex Mono',
                                letterSpacing: '0.04em',
                              },
                              children: SITE.title,
                            },
                          },
                        ],
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
