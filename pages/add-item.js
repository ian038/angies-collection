import Image from 'next/image'
import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import { nftaddress, collectionaddress } from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Collection from '../artifacts/contracts/Collection.sol/Collection.json'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

export default function AddItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, setFormInput] = useState({ name: '', description: '' })
  const router = useRouter()

  const handleChange = async (e) => {
    const file = e.target.files[0]
    try {
      const added = await client.add(file, { progress: (prog) => console.log(`received: ${prog}`) })
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  const createAsset = async () => {
    const { name, description } = formInput
    if (!name || !description || !fileUrl) {
        alert("All fields are required")
        return
    }
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createItem(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  const createItem = async (url) => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()
    
    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()
  
    /* create item in collection */
    contract = new ethers.Contract(collectionaddress, Collection.abi, signer)
    transaction = await contract.createCollectionItem(nftaddress, tokenId)
    await transaction.wait()
    router.push('/')
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input 
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={e => setFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={e => setFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={handleChange}
        />
        {
          fileUrl && (
            <Image className="rounded mt-4" width={350} height={350} src={fileUrl} alt="Asset Image" />
          )
        }
        <button onClick={createAsset} className="font-bold mt-4 bg-blue-500 text-white rounded p-4 shadow-lg">
          Create Digital Asset
        </button>
      </div>
    </div>
  )
}