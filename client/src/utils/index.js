import { surpriseMePrompts } from '../constants'
import FileSaver from 'file-saver'; 

export function getRandomPrompt(prompt){
    const randomIndex = Math.floor(Math.random()*surpriseMePrompts.length)
    const randomPrompt = surpriseMePrompts[randomIndex]

    //Check dupe
    if(randomPrompt === prompt) return getRandomPrompt(prompt)

    return randomPrompt
}

export async function downloadImage(_id, photo){
    FileSaver.saveAs(photo, `goosed-${_id}.jpg`)
}