
// @ts-nocheck
'use client'
import Spinner from '@/components/ui/Spinner';
import { getURL, postData } from '@/utils/helpers';
import { uploadFiles, useUploadThing } from '@/utils/uploadthing';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';




export default function FeedbackForm() {
    const [formData, setformData] = useState()
    const [files, setFiles] = useState([])
    const t = useTranslations('Index');

    interface formDataType { [key: string]: FormDataEntryValue }
    const responseBody: formDataType = {}

    const { startUpload, isUploading, permittedFileInfo } = useUploadThing('imageUploader', {
        onClientUploadComplete: (res) => {
            toast.success('Files uploaded', {
                description: `${(res || []).length} images was uploaded successfully`,
            })
            setFiles([...files, ...res])
            console.log('Files uploaded', res);

        },
        onUploadError: (err) => {
            toast.error('It was an error in uploading files.', {
                description: 'Only JPG, PNG, JPEG. Max 3 images. Max size per image is 6MB. Try to reload the page and repeat',
            })
            console.log('error', err.message);
        },
    },)


    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files) as File[]
            startUpload(files)
        }
    };

    const handleSubmitClick = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget as HTMLFormElement)
        formData.forEach((value, property: string) => responseBody[property] = value);
        console.log(JSON.stringify(responseBody))
        const contacts = responseBody.email ? `email:${responseBody.email}` : responseBody.telegram ? `tel:${responseBody.telegram}` : responseBody.whatsapp ? `wa:${responseBody.whatsapp}` : "";
        const data = {
            name: responseBody.title || "not set",
            description: responseBody.message,
            type: responseBody.messageType,
            importance: responseBody.importance || "",
            initiator: contacts,
            files: files.map(r => r.fileUrl).join("; ")
        }
        submitForm(data)
    }

    const { mutate: submitForm, isLoading } = useMutation({
        mutationFn: async (data) => {
            const url = `${getURL("api/notion/features/create-page")}`;
            await postData({ url, data })
        },
        onError: (err) => {
            toast.error('There was an error.', {
                description: 'Could not submit your form',
            })
        },
        onSuccess: () => {
            toast.success("Success", {
                description: 'Your message was submited successfuly and ll be reviewd by our team',
            })
        },
    })


    return (
        <div className="pl-6 pr-8 lg:block lg:min-w-[25rem] sm:min-w-[20rem] max-w-1xl">
            <div className="top-12 rounded-2xl p-5 lg:sticky" style={{ backgroundColor: "rgb(60, 62, 68)" }}>
                <form onSubmit={handleSubmitClick}>
                    <MessageBox filesLen={files.length} />
                    <MessageTypes />
                    <Contacts />
                    {!isUploading ? <SubmitButton /> : <Spinner className="mt-2" />}



                    <div className="flex flex-row overflow-x-scroll align-middle scrollbar-hide">
                        <input id="file_input" className="hidden"
                            type="file"
                            onChange={handleFileChange}
                            accept="image/jpg, image/jpeg, image/png"
                            name="file"
                            multiple />
                    </div>
                </form>
            </div >
        </div >
    );
};

function SubmitButton() {
    return <div className="flex justify-end pt-4">

        <button
            className="group relative flex left select-none items-center justify-center gap-2 px-3 py-1 opacity-80 outline-none focus-visible:ring-4 bg-purple-600 hover:bg-purple-700 rounded h-[36px] whitespace-nowrap text-xs transition ml-2 cursor-pointer"
            type="submit"
        >
            <span className="select-none font-bold" >Submit</span>
        </button>
    </div>
}

const messages = ['Issue', 'Idea', 'Feedback'];
const importance = ['Critical', 'Medium', 'Low'];
function MessageTypes() {
    const [selectedMessage, setSelectedMessage] = useState("Feedback");
    const [selectedImportance, setSelectedImportance] = useState("Low");
    const [title, setTitle] = useState("");

    const handleInputChange = (event, setter) => {
        setter(event.target.value);
    };

    const handleChangeMessage = (event) => {
        setSelectedMessage(event.target.value);
    };
    const handleChangeImportance = (event) => {
        setSelectedImportance(event.target.value);
    };

    return (
        <>
            {selectedMessage === "Issue" || selectedMessage === "Idea" ? <div className="flex-1 mt-2">
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    className="h-[36px] w-full rounded  p-2 bg-zinc-900"
                    value={title}
                    onChange={(event) => handleInputChange(event, setTitle)}
                />

            </div> : null}
            <div className="pb-2 pt-5">
                <ul className="items-center w-full text-sm font-medium sm:flex">
                    {messages.map((message) => (
                        <li key={message} className="w-full">
                            <div className="flex items-center pl-3">
                                <input
                                    id={`horizontal-list-radio-${message.toLowerCase()}`}
                                    type="radio"
                                    value={message}
                                    name="messageType"
                                    className="w-4 h-4 text-purple-500 bg-gray-100 focus:ring-purple-500"
                                    checked={selectedMessage === message}
                                    onChange={handleChangeMessage}
                                />
                                <label htmlFor={`horizontal-list-radio-${message.toLowerCase()}`} className="w-full py-3 ml-2 text-sm font-medium">{message}</label>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {selectedMessage === "Issue" || selectedMessage === "Idea" ? <div className="pb-2 border-t-1 border-solid border-t-2 border-zinc-600">
                <ul className="items-center w-full text-sm font-medium sm:flex">
                    {importance.map((level) => (
                        <li key={level} className="w-full">
                            <div className="flex items-center pl-3">
                                <input
                                    id={`horizontal-list-radio-${level.toLowerCase()}`}
                                    type="radio"
                                    value={level}
                                    name="importance"
                                    className="w-4 h-4 text-purple-500 bg-gray-100 focus:ring-purple-500"
                                    checked={selectedImportance === level}
                                    onChange={handleChangeImportance}
                                />
                                <label htmlFor={`horizontal-list-radio-${level.toLowerCase()}`} className="w-full py-3 ml-2 text-sm font-medium">{level}</label>
                            </div>
                        </li>
                    ))}
                </ul>
            </div> : null}
        </>
    );
}


function MessageBox({ filesLen = 0 }) {

    return (
        <>
            <div className="mt-3 bg-zinc-900" >
                <textarea
                    name="message"
                    className="mb-3 w-full flex-1 resize-none min-h-[10rem] rounded p-3 border-0  bg-zinc-900"
                    placeholder="Share Feedback, Ideas, or Issues"
                />
                <div className="flex items-center">
                    <label htmlFor="file_input"
                        className="group relative flex select-none cursor-pointer items-center justify-center gap-2 px-3 py-1 outline-none focus-visible:ring-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded dark:hover:text-white transition text-gray-500 dark:text-gray-400 ring-purple-500/40 border border-transparent font-medium whitespace-nowrap text-xs  opacity-30 hover:bg-opacity-0 hover:opacity-80 dark:hover:bg-opacity-0"
                        type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            strokeWidth="1.5" stroke="currentColor" className="h-6 w-6"
                            style={{ color: "rgb(255, 255, 255)" }}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13">
                            </path>
                        </svg>

                    </label>
                    {filesLen ? <div className='text-purple-500 text-xs flex' >{`[${filesLen}/3] img`}</div> : null}
                </div>
            </div>

        </>
    )
}

function Contacts() {
    const [email, setEmail] = useState("");
    const [telegram, setTelegram] = useState("");
    const [whatsapp, setWhatsapp] = useState("");

    const handleInputChange = (event, setter) => {
        setter(event.target.value);
    };

    return (
        <div className="flex flex-col gap-4">
            {!telegram && !whatsapp && <div className="flex-1">
                <input
                    type="email"
                    name="email"
                    placeholder="Your email, or"
                    className="h-[36px] w-full rounded p-2 bg-zinc-900"
                    value={email}
                    onChange={(event) => handleInputChange(event, setEmail)}
                />
            </div>}
            {!email && !whatsapp && <div className="flex-1">
                <input
                    type="phone"
                    name="telegram"
                    placeholder="Your telegram number, or"
                    className="h-[36px] w-full rounded p-2 bg-zinc-900"
                    value={telegram}
                    onChange={(event) => handleInputChange(event, setTelegram)}
                />
            </div>}
            {!email && !telegram && <div className="flex-1">
                <input
                    type="phone"
                    name="whatsapp"
                    placeholder="Your whatsapp number"
                    className="h-[36px] w-full rounded p-2 bg-zinc-900"
                    value={whatsapp}
                    onChange={(event) => handleInputChange(event, setWhatsapp)}
                />
            </div>}
        </div>
    );
}
