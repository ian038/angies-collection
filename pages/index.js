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
    const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com')
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const collectionContract = new ethers.Contract(collectionaddress, Collection.abi, provider)
    const data = await collectionContract.fetchMyNFTs()
    
    const items = await Promise.all(data.map(async i => {
      console.log({i})
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
          <div className="px-4" style={{ maxWidth: '1600px' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {
                nfts.map((nft, i) => (
                  <div key={i} className="border shadow rounded-xl overflow-hidden">
                    <Image className="rounded mt-4" width={225} height={225} src={nft.image} alt="Asset Image" />
                    <div className="p-4">
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
