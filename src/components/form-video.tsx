import { FileVideo, Upload } from "lucide-react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { api } from '../lib/axios'

type Status = 'waiting' | 'converting' | 'transcription' | 'success';
const statusMessage = {
  'waiting': 'Aguardando...',
  'converting': 'Convertendo...',
  'transcription': 'Transcrevendo...',
  'success': 'Sucesso!'
}


export function FormVideo(){
    const [video, setVideo] = useState<File | null>(null)
    const [status, setStatus] = useState<Status>('waiting')


    const promptinputRef = useRef<HTMLTextAreaElement>(null)


    function handleVideo(event: ChangeEvent<HTMLInputElement>){
        const {files} = event.currentTarget;

        if(!files){
            return
        }

        const seletedFile = files[0];
        setVideo(seletedFile);
    };

    async function convertAudio(video: File) {
        console.log('Convert started');

        const ffmpeg = await getFFmpeg();

        await ffmpeg.writeFile('input.mp4', await fetchFile(video));

        ffmpeg.on("log", ({type, message}) => {
            console.log(type);
            console.log(message)
        });

        ffmpeg.on("progress", progress => {
            console.log("Convert progress: " + Math.round(progress.progress * 100));
        });

        await ffmpeg.exec([
            '-i',
            'input.mp4',
            '-map',
            '0:a',
            '-b:a',
            '20k',
            '-acodec',
            'libmp3lame',
            'output.mp3' 
        ]);

        const data = await ffmpeg.readFile('output.mp3');

        const audioFileBlob = new Blob([data], {type: 'audio/mpeg'});
        const audioFile = new File([audioFileBlob], 'audio.mp3', {
          type: 'audio/mpeg',
        });

        console.log('Convert Finished')

        return audioFile
    }

    async function handleFormRef(form: FormEvent<HTMLFormElement>){
        event?.preventDefault();

        const prompt = promptinputRef.current?.value;

        if(!video){
          return
        }

        // Convertendo video - audio
        setStatus('converting')
        const audioFile = await convertAudio(video);


        // Transcrevendo audio enviando para api
        setStatus('transcription')
        const data = new FormData();
        data.append('file', audioFile);
        const response = await api.post('/videos', data);
        const videoId = response.data.video.id;


        await api.post(`/videos/${videoId}transcription`, {
          prompt,
        })

        setStatus('success')
    }

    const previewVideo = useMemo(() => {
        if(!video){
            return '';
        }

        return URL.createObjectURL(video);
    }, [video])

    return(
        <form onSubmit={handleFormRef} className='space-y-6'>
            <label 
              htmlFor="video"
              className=' relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5'            
            >
              {video ? (
                <>
                    <video src={previewVideo} controls={false} className=" pointer-events-none inset-0 absolute"/>
                </>
              ) : (
                <>
                    <FileVideo className='w-4 h-4'/>
                        Selecione um vídeo
                </>
              )}
            </label>


            <input type="file" id='video' accept='video/mp4' className='sr-only' onChange={handleVideo}/>

            <Separator />

            <div className='space-y-2'>
              <Label htmlFor='transcription-prompt'>Prompt de transcrição</Label>
              <Textarea 
                id='transcription-prompt'
                className='h-20 leading-relaxed resize-none'
                placeholder='Inclua palavra-chave mencionadas no vídeo separadas por vírgula (,)'
              />
            </div>

            <Button
              disabled={status != 'waiting'}
              data-success={status === 'success'}
              className='w-full  data-[success=true]:bg-emerald-400'
              type='submit'>
              {status == 'waiting' ? (
                <>
                  Carregar Vídeo
                  <Upload className='w-4 h-4 ml-2'/>
                </>
              ) : statusMessage[status]}
            </Button>
          </form>
    )
}