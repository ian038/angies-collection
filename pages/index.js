import Head from 'next/head'
import Image from 'next/image'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import { nftaddress, collectionaddress } from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Collection from '../artifacts/contracts/Collection.sol/Collection.json'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNFTs()
  }, [])

  const loadNFTs = async () => {    
    const web3Modal = new Web3Modal()
    let provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com')

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    let collectionContract = new ethers.Contract(collectionaddress, Collection.abi, provider)

    const connection = await web3Modal.connect()
    provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    collectionContract = new ethers.Contract(collectionaddress, Collection.abi, signer)
    const data = await collectionContract.fetchMyNFTs()
    
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let item = {
        tokenId: i.tokenId.toNumber(),
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description
      }
      return item
    }))
    setNfts(items)
    setLoading(false) 
  }

  if (loading === false && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in collection</h1>)

  return (
    <div>
      <Head>
        <title>Angies Collection</title>
        <meta name="description" content="Collection of NFTs owned by Angie" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex justify-center">
          <div className="px-4">
            <div className="container grid grid-cols-3 gap-2 mx-auto">
              {
                nfts.map((nft, i) => (
                  <div key={i} className="max-w-sm shadow-lg overflow-hidden mt-4">
                    <div className="h-64 w-96 relative rounded">
                      <Image className='rounded-full' layout="fill" objectFit="contain" src={nft.image} alt="Asset Image" />
                    </div>
                    <div>
                      <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
                      <div style={{ height: '70px', overflow: 'hidden' }}>
                        <p className="text-gray-400">{nft.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
