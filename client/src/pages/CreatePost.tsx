import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { preview } from '../assets'
import { getRandomPrompt } from '../utils'
import { Loader, FormField } from '../components' 

const CreatePost = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState<{name: string; prompt: string; photo: string}>({
    name: '',
    prompt: '', 
    photo: '',
  })
  const [loading, setLoading] = useState<Boolean>(false)
  const [generating, setGenerating] = useState<Boolean>(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (form.prompt && form.photo) {
      setLoading(true)
      try {
        const response = await fetch('https://node-backend-iktl.onrender.com/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...form }),
        });

        await response.json()
        navigate('/')
      } catch (err) {
        alert(err)
      } finally {
        setLoading(false)
      }
    } else {
      alert('Please generate the image or enter your name')
    }
  }

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value})
  }

  const handleSurprise = () => {
    const randomPrompt = getRandomPrompt(form.prompt)
    setForm({ ...form, prompt: randomPrompt })
  }

  const generateImage = async () => {
    if(form.prompt) {
      try {
        setGenerating(true);
        const response = await fetch('https://node-backend-iktl.onrender.com/api/v1/dalle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: form.prompt.concat(' with a goose hidden in the image') }),
        })

        const data = await response.json()
        setForm({ ...form, photo: `data:image/jpeng;base64,${data.photo}`})
      } catch (error) {
        alert(error)
      } finally {
        setGenerating(false);
      }
    } else {
      alert('Please enter a prompt to generate image.')
    }
  }

  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>
          Create Goosified Image
        </h1>
        <p className='mt-2 text-[#666e75] text-[16px] max-w [500px]'>
          Generate now!
        </p>
      </div>

      <form className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-5'>
          <FormField
            labelName="Your display name"
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            handleChange={handleChange}
          />
          <FormField
            labelName="Generation Prompt"
            type="text"
            name="prompt"
            placeholder="A sad Waterloo student studying in a library"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurprise={handleSurprise}
          />
          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                          focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            { form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}

            {generating && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className='mt-5 flex gap-5'>
              <button
                type="button"
                onClick={generateImage}
                className=" text-white bg-yellow-500 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              >
                {generating ? 'Generating...' : 'Generate'}
              </button>
        </div>

        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">Feel free to share your goosified image after its generated. </p>
          <button
            type="submit"
            className="mt-3 text-white bg-black font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? 'Sharing...' : 'Share with the Community'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default CreatePost