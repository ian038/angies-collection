import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className='border-b p-6'>
        <p className='text-4xl font-bold'>Angies Collection</p>
        <div className='flex mt-4'>
          <Link href='/add-item'>
            <a className='mr-6 text-blue-700'>Add new NFT</a>
          </Link>
          <Link href='/'>
            <a className='mr-6 text-blue-700'>My NFTs</a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
