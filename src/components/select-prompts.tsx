import { ChangeEvent, useEffect, useState } from "react"
import { Label } from "./ui/label"
import { api } from "@/lib/axios"


interface PromptAPI {
    id: string,
    title: string
    template: string
}

interface selectPromps {
    onSelectPrompt: (prompt: string) => void
}

export function PromptsSelect(Props: selectPromps){
    const [prompts, setPrompts] = useState<PromptAPI[] | null>(null)

    useEffect(() => {
        api.get('/prompts').then(response => {
            setPrompts(response.data)
        })   
    }, []);

    function selectPrompt(event: ChangeEvent<HTMLSelectElement>){
       const selectProps =  prompts?.find(propts => propts.id = event.target.value);

        if(!selectProps){
            return
        }

        Props.onSelectPrompt(selectProps.template);
    }

    return (
        <div className='space-y-2 flex flex-col'>
            <Label>
                Prompt
            </Label>

            <select onChange={selectPrompt} name="promptChat" className='form-select bg-black'>
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