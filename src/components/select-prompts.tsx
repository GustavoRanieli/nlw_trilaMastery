import { useEffect, useState } from "react"
import { Label } from "./ui/label"
import { api } from "@/lib/axios"


interface PromptAPI {
    id: string,
    title: string
    template: string
}

export function PromptsSelect(){
    const [prompts, setPrompts] = useState<PromptAPI[] | null>(null)

    useEffect(() => {
        api.get('/prompts').then(response => {
            setPrompts(response.data)
        })   
    }, [])

    return (
        <div className='space-y-2 flex flex-col'>
            <Label>
                Prompt
            </Label>

            <select name="" className='form-select bg-black'>
                <option value="" selected>Selecione o prompt desejado</option>
                {prompts?.map(prompt => {
                    return (
                        <option key={prompt.id} value={prompt.id}>{prompt.title}</option>
                    )
                })}
            </select>           
        </div>
    )
}