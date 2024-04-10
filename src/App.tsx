import { Github, FileVideo, Upload, Wand2} from 'lucide-react'
import { Button } from "./components/ui/button";
import { Separator } from './components/ui/separator';
import { Textarea } from './components/ui/textarea';
import { Label } from './components/ui/label';
import { Select } from './components/ui/select';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import { Slider } from './components/ui/slider';

export function App() {

  return (
    <div className='min-h-screen flex flex-col'>

      <div className=" px-6 py-3 flex items-center justify-between">
        <h1 className=" text-xl font-bold">Upload.ai</h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Desenvolvido com ❤ no NLW da RocketSeat
          </span>

          <Separator orientation='vertical' className='h-6'/>

          <Button variant="outline">
            <Github className='w-4 h-4 mr-2'/>
            GitHub
          </Button>
        </div>
      </div>


      <main className='flex-1 p-6 flex gap-6'>
        <div className='flex flex-col flex-1 gap-4'>
          <div className='grid grid-rows-2 gap-4 flex-1'>
              <Textarea 
                className='p-4 leading-relaxed resize-none'
                placeholder='Inclua o prompt para a IA...'
              />
              <Textarea 
                className='p-4 leading-relaxed resize-none'
                placeholder='Resultado gerado pela IA...' 
                readOnly
              />
          </div>

          <p className='text-sm text-muted-foreground'>
            Lembre-se: você pode utilizar a variável <code className=' text-violet-700'>{'{transcription}'}</code> no seu prompt para adicionar o conteúdo do vídeo.</p>
        </div>


        <aside className='w-80 space-y-6'>
          <form className='space-y-6'>
            <label 
              htmlFor="video"
              className='border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5'            
            >
              <FileVideo className='w-4 h-4'/>
              Selecione um vídeo
            </label>


            <input type="file" id='video' accept='video/mp4' className='sr-only'/>

            <Separator />

            <div className='space-y-2'>
              <Label htmlFor='transcription-prompt'>Prompt de transcrição</Label>
              <Textarea 
                id='transcription-prompt'
                className='h-20 leading-relaxed resize-none'
                placeholder='Inclua palavra-chave mencionadas no vídeo separadas por vírgula (,)'
              />
            </div>

            <Button className='w-full' type='submit'>
              Carregar Vídeo
              <Upload className='w-4 h-4 ml-2'/>
            </Button>
          </form>

          <Separator />

          <form className='space-y-6'>

          <div className='space-y-2 flex flex-col'>
              <Label>
                Prompt
              </Label>

              <select name="" className='form-select bg-black'>
                <option value="" selected>Selecione o prompt desejado</option>
                <option value="">Título do vídeo</option>
                <option value="">Descrição do vídeo</option>
              </select>           
            </div>

            <div className='space-y-2 flex flex-col'>
              <Label>
                Modelo
              </Label>

              <select name="" className='bg-black form-select'>
                <option value="gtp3.5" selected>GPT 3.5 16k</option>
              </select>

              <span className='text-sm italic text-muted-foreground block'>Você poderá customizar essa opção em breve</span>              
            </div>

            <Separator />

            <div className='space-y-2'>
              <Label>
                Temperatura
              </Label>

              <Slider 
                min={0}
                max={1}
                step={0.5}
              />

              <span className='text-sm italic text-muted-foreground block'>
                Valores mais altos tendem a deixar o resultado mais criativo mas com possíveis erros.
              </span>              
            </div>

            <Separator />

            <Button type='submit' className='w-full'>
                Executar
                <Wand2 className='w-4 h-4 ml-2' />
            </Button>
          </form>
        </aside>
      </main>

    </div>
  )
}

 
