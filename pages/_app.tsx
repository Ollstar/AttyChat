import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import mySwrConfig from '../lib/swr-config'


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={mySwrConfig}>
      <Component {...pageProps} />
    </SWRConfig>
  )
}

export default MyApp