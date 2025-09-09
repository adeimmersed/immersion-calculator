import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Immersion Intensity Calculator | AdeImmersed</title>
        <meta name="description" content="Discover your personalized language learning profile and get a reality check on your immersion journey." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Immersion Intensity Calculator | AdeImmersed" />
        <meta property="og:description" content="Get personalized language learning recommendations based on your goals, lifestyle, and current proficiency." />
        <meta property="og:image" content="/og-image.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Immersion Intensity Calculator | AdeImmersed" />
        <meta property="twitter:description" content="Get personalized language learning recommendations based on your goals, lifestyle, and current proficiency." />
        <meta property="twitter:image" content="/og-image.jpg" />
        
        {/* Additional Meta Tags */}
        <meta name="keywords" content="language learning, immersion, Korean, Japanese, Spanish, French, personalized learning" />
        <meta name="author" content="AdeImmersed" />
        <meta name="robots" content="index, follow" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
