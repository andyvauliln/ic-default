'use client'
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { RadioGroup } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { v4 as uuid } from "uuid";



export default function TrainPage() {
    const [selected, setSelected] = useState(questions[0]);
    const [selectedInterviewer, setSelectedInterviewer] = useState(
        interviewers[0]
    );

    const [loading, setLoading] = useState(true);
    const webcamRef = useRef<Webcam | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [seconds, setSeconds] = useState(150);
    const [videoEnded, setVideoEnded] = useState(false);
    const [recordingPermission, setRecordingPermission] = useState(true);
    const [cameraLoaded, setCameraLoaded] = useState(false);
    const vidRef = useRef<HTMLVideoElement>(null);
    const [isSubmitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState("Processing");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isDesktop, setIsDesktop] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [generatedFeedback, setGeneratedFeedback] = useState("");

    console.log(selected, selectedInterviewer, loading, "selected, selectedInterviewer, loading");
    console.log(capturing, "capturing");
    console.log(seconds, "seconds");
    console.log(videoEnded, "videoEnded");
    console.log(recordingPermission, "recordingPermission");
    console.log(cameraLoaded, "cameraLoaded");
    console.log(isSubmitting, "isSubmitting");
    console.log(status, "status");
    console.log(isSuccess, "isSuccess");
    console.log(isVisible, "isVisible");
    console.log(isDesktop, "isDesktop");
    console.log(completed, "completed");
    console.log(transcript, "transcript");
    console.log(generatedFeedback, "generatedFeedback");

    useEffect(() => {
        console.log('set is desktop');

        setIsDesktop(window.innerWidth >= 768);
    }, []);

    useEffect(() => {
        if (videoEnded) {
            console.log('video ended');

            const element = document.getElementById("startTimer");

            if (element) {
                element.style.display = "flex";
            }

            setCapturing(true);
            setIsVisible(false);

            mediaRecorderRef.current = new MediaRecorder(
                webcamRef?.current?.stream as MediaStream
            );
            mediaRecorderRef.current.addEventListener(
                "dataavailable",
                handleDataAvailable
            );
            mediaRecorderRef.current.start();
        }
    }, [videoEnded, webcamRef, setCapturing, mediaRecorderRef]);

    const handleStartCaptureClick = useCallback(() => {
        const startTimer = document.getElementById("startTimer");
        console.log('handle start capture click', startTimer, vidRef, customElements);

        if (startTimer) {
            startTimer.style.display = "none";
        }

        if (vidRef.current) {
            vidRef.current.play();
        }
    }, [webcamRef, setCapturing, mediaRecorderRef]);

    const handleDataAvailable = useCallback(
        ({ data }: BlobEvent) => {
            console.log('Data Available', data);
            if (data.size > 0) {
                setRecordedChunks((prev) => prev.concat(data));
            }
        },
        [setRecordedChunks]
    );

    const handleStopCaptureClick = useCallback(() => {
        console.log('Stope Capture Click');
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        setCapturing(false);
    }, [mediaRecorderRef, webcamRef, setCapturing]);

    useEffect(() => {
        let timer: any = null;
        if (capturing) {
            console.log('set Interval', seconds, capturing);
            timer = setInterval(() => {
                setSeconds((seconds) => seconds - 1);
            }, 1000);
            if (seconds === 0) {
                handleStopCaptureClick();
                setCapturing(false);
                setSeconds(0);
            }
        }
        return () => {
            clearInterval(timer);
        };
    });

    const handleDownload = async () => {
        console.log("dowloading video");

        if (recordedChunks.length) {
            setSubmitting(true);
            setStatus("Processing");

            const file = new Blob(recordedChunks, {
                type: `video/webm`,
            });

            const unique_id = uuid();

            // This checks if ffmpeg is loaded
            if (!ffmpeg.isLoaded()) {
                await ffmpeg.load();
            }

            // This writes the file to memory, removes the video, and converts the audio to mp3
            ffmpeg.FS("writeFile", `${unique_id}.webm`, await fetchFile(file));
            await ffmpeg.run(
                "-i",
                `${unique_id}.webm`,
                "-vn",
                "-acodec",
                "libmp3lame",
                "-ac",
                "1",
                "-ar",
                "16000",
                "-f",
                "mp3",
                `${unique_id}.mp3`
            );

            // This reads the converted file from the file system
            const fileData = ffmpeg.FS("readFile", `${unique_id}.mp3`);
            // This creates a new file from the raw data
            const output = new File([fileData.buffer], `${unique_id}.mp3`, {
                type: "audio/mp3",
            });

            const formData = new FormData();
            formData.append("file", output, `${unique_id}.mp3`);
            formData.append("model", "whisper-1");

            const question =
                selected.name === "Behavioral"
                    ? `Tell me about yourself. Why don${`’`}t you walk me through your resume?`
                    : selectedInterviewer.name === "John"
                        ? "What is a Hash Table, and what is the average case and worst case time for each of its operations?"
                        : selectedInterviewer.name === "Richard"
                            ? "Uber is looking to expand its product line. Talk me through how you would approach this problem."
                            : "You have a 3-gallon jug and 5-gallon jug, how do you measure out exactly 4 gallons?";

            setStatus("Transcribing");

            const upload = await fetch(
                `/api/transcribe?question=${encodeURIComponent(question)}`,
                {
                    method: "POST",
                    body: formData,
                }
            );
            const results = await upload.json();


            if (upload.ok) {
                setIsSuccess(true);
                setSubmitting(false);

                if (results.error) {
                    setTranscript(results.error);
                } else {
                    setTranscript(results.transcript);
                }

                console.log("Uploaded successfully!");

                await Promise.allSettled([
                    new Promise((resolve) => setTimeout(resolve, 800)),
                ]).then(() => {
                    setCompleted(true);
                    console.log("Success!");
                });

                if (results.transcript.length > 0) {
                    const prompt = `Please give feedback on the following interview question: ${question} given the following transcript: ${results.transcript
                        }. ${selected.name === "Behavioral"
                            ? "Please also give feedback on the candidate's communication skills. Make sure their response is structured (perhaps using the STAR or PAR frameworks)."
                            : "Please also give feedback on the candidate's communication skills. Make sure they accurately explain their thoughts in a coherent way. Make sure they stay on topic and relevant to the question."
                        } \n\n\ Feedback on the candidate's response:`;

                    setGeneratedFeedback("");
                    const response = await fetch("/api/generate", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            prompt,
                        }),
                    });

                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }

                    // This data is a ReadableStream
                    const data = response.body;
                    if (!data) {
                        return;
                    }

                    const reader = data.getReader();
                    const decoder = new TextDecoder();
                    let done = false;

                    while (!done) {
                        const { value, done: doneReading } = await reader.read();
                        done = doneReading;
                        const chunkValue = decoder.decode(value);
                        setGeneratedFeedback((prev: any) => prev + chunkValue);
                    }
                }
            } else {
                console.error("Upload failed.");
            }

            setTimeout(function () {
                setRecordedChunks([]);
            }, 1500);
        }
    };

    function restartVideo() {
        console.log('reseting video');

        setRecordedChunks([]);
        setVideoEnded(false);
        setCapturing(false);
        setIsVisible(true);
        setSeconds(150);
    }

    const videoConstraints = isDesktop
        ? { width: 1280, height: 720, facingMode: "user" }
        : { width: 480, height: 640, facingMode: "user" };

    const handleUserMedia = () => {
        console.log('User Media loaded');

        setTimeout(() => {
            setLoading(false);
            setCameraLoaded(true);
        }, 1000);
    };

    return (<div>

        {/* {questions.map((question) => <div key={question.id}>
            <div>{question.name}</div>
            <div>{question.description}</div>
            <div>{question.difficulty}</div>
        </div>)
        }
        {interviewers.map((interviewer) => (<div key={interviewer.id}>
            <div>{interviewer.name}</div>
            <div>{interviewer.description}</div>
            <div>{interviewer.level}</div>
        </div>))
        }
        */}
        {completed && <video
            className="w-full h-full rounded-lg"
            controls
            crossOrigin="anonymous"
            autoPlay
        >
            <source
                src={URL.createObjectURL(
                    new Blob(recordedChunks, { type: "video/mp4" })
                )}
                type="video/mp4"
            />
        </video>}

        {!recordingPermission && <p className="text-white font-medium text-lg text-center max-w-3xl">
            Camera permission is denied. We don{`'`}t store your
            attempts anywhere, but we understand not wanting to give
            us access to your camera. Try again by opening this page
            in an incognito window {`(`}or enable permissions in your
            browser settings{`)`}.
        </p>}
        {/* <div>
            <h2 className="text-xl font-semibold text-left text-[#1D2B3A] mb-2">
                Transcript
            </h2>
            <p className="prose prose-sm max-w-none">
                {transcript.length > 0
                    ? transcript
                    : "Don't think you said anything. Want to try again?"}
            </p>
        </div>
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-left text-[#1D2B3A] mb-2">
                Feedback
            </h2>
            <div className="mt-4 text-sm flex gap-2.5 rounded-lg border border-[#EEEEEE] bg-[#FAFAFA] p-4 leading-6 text-gray-900 min-h-[100px]">
                <p className="prose prose-sm max-w-none">
                    {generatedFeedback}
                </p>
            </div>
        </div> */}

        {/* {!cameraLoaded && (
            <div className="text-white absolute top-1/2 left-1/2 z-20 flex items-center">
                <svg
                    className="animate-spin h-4 w-4 text-white mx-auto my-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth={3}
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            </div>
        )} */}

        <div className="relative z-10 h-full w-full rounded-lg">
            <div className="absolute top-5 lg:top-10 left-5 lg:left-10 z-20">
                <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800">
                    {new Date(seconds * 1000).toISOString().slice(14, 19)}
                </span>
            </div>
            {isVisible && (
                <div className="block absolute top-[10px] sm:top-[20px] lg:top-[40px] left-auto right-[10px] sm:right-[20px] md:right-10 h-[80px] sm:h-[140px] md:h-[180px] aspect-video rounded z-20">
                    <div className="h-full w-full aspect-video rounded md:rounded-lg lg:rounded-xl">
                        <video
                            id="question-video"
                            onEnded={() => setVideoEnded(true)}
                            controls={false}
                            ref={vidRef}
                            playsInline
                            className="h-full object-cover w-full rounded-md md:rounded-[12px] aspect-video"
                            crossOrigin="anonymous"
                        >
                            <source
                                src={
                                    selectedInterviewer.name === "John"
                                        ? selected.name === "Behavioral"
                                            ? "https://liftoff-public.s3.amazonaws.com/DemoInterviewMale.mp4"
                                            : "https://liftoff-public.s3.amazonaws.com/JohnTechnical.mp4"
                                        : selectedInterviewer.name === "Richard"
                                            ? selected.name === "Behavioral"
                                                ? "https://liftoff-public.s3.amazonaws.com/RichardBehavioral.mp4"
                                                : "https://liftoff-public.s3.amazonaws.com/RichardTechnical.mp4"
                                            : selectedInterviewer.name === "Sarah"
                                                ? selected.name === "Behavioral"
                                                    ? "https://liftoff-public.s3.amazonaws.com/BehavioralSarah.mp4"
                                                    : "https://liftoff-public.s3.amazonaws.com/SarahTechnical.mp4"
                                                : selected.name === "Behavioral"
                                                    ? "https://liftoff-public.s3.amazonaws.com/DemoInterviewMale.mp4"
                                                    : "https://liftoff-public.s3.amazonaws.com/JohnTechnical.mp4"
                                }
                                type="video/mp4"
                            />
                        </video>
                    </div>
                </div>
            )}
            <Webcam
                mirrored
                audio
                muted
                ref={webcamRef}
                videoConstraints={videoConstraints}
                onUserMedia={handleUserMedia}
                onUserMediaError={(error) => {
                    console.log('Error from web cam');

                    setRecordingPermission(false);
                }}
                className="absolute z-10 min-h-[100%] min-w-[100%] h-auto w-auto object-cover"
            />
        </div>
        {/* {loading && (
                <div className="absolute flex h-full w-full items-center justify-center">
                    <div className="relative h-[112px] w-[112px] rounded-lg object-cover text-[2rem]">
                        <div className="flex h-[112px] w-[112px] items-center justify-center rounded-[0.5rem] bg-[#4171d8] !text-white">
                            Loading...
                        </div>
                    </div>
                </div>
            )} */}

        {cameraLoaded && (
            <div className="absolute bottom-0 left-0 z-50 flex h-[82px] w-full items-center justify-center">
                {recordedChunks.length > 0 ? (
                    <>
                        {isSuccess ? (
                            <button
                                className="cursor-disabled group rounded-full min-w-[140px] px-4 py-2 text-[13px] font-semibold group inline-flex items-center justify-center text-sm text-white duration-150 bg-green-500 hover:bg-green-600 hover:text-slate-100 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 active:scale-100 active:bg-green-800 active:text-green-100"
                                style={{
                                    boxShadow:
                                        "0px 1px 4px rgba(27, 71, 13, 0.17), inset 0px 0px 0px 1px #5fc767, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mx-auto"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                </svg>
                            </button>
                        ) : (
                            <div className="flex flex-row gap-2">
                                {!isSubmitting && (
                                    <button
                                        onClick={() => restartVideo()}
                                        className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-white text-[#1E2B3A] hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline flex gap-x-2  active:scale-95 scale-100 duration-75"
                                    >
                                        Restart
                                    </button>
                                )}
                                <button
                                    onClick={handleDownload}
                                    disabled={isSubmitting}
                                    className="group rounded-full min-w-[140px] px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline flex  active:scale-95 scale-100 duration-75  disabled:cursor-not-allowed"
                                    style={{
                                        boxShadow:
                                            "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
                                    }}
                                >
                                    <span>
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center gap-x-2">
                                                <svg
                                                    className="animate-spin h-5 w-5 text-slate-50 mx-auto"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth={3}
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                <span>{status}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-x-2">
                                                <span>Process transcript</span>
                                                <svg
                                                    className="w-5 h-5"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M13.75 6.75L19.25 12L13.75 17.25"
                                                        stroke="white"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M19 12H4.75"
                                                        stroke="white"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                    </span>
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="absolute bottom-[6px] md:bottom-5 left-5 right-5">
                        <div className="lg:mt-4 flex flex-col items-center justify-center gap-2">
                            {capturing ? (
                                <div
                                    id="stopTimer"
                                    onClick={handleStopCaptureClick}
                                    className="flex h-10 w-10 flex-col items-center justify-center rounded-full bg-transparent text-white hover:shadow-xl ring-4 ring-white  active:scale-95 scale-100 duration-75 cursor-pointer"
                                >
                                    <div className="h-5 w-5 rounded bg-red-500 cursor-pointer"></div>
                                </div>
                            ) : (
                                <button
                                    id="startTimer"
                                    onClick={handleStartCaptureClick}
                                    className="flex h-8 w-8 sm:h-8 sm:w-8 flex-col items-center justify-center rounded-full bg-red-500 text-white hover:shadow-xl ring-4 ring-white ring-offset-gray-500 ring-offset-2 active:scale-95 scale-100 duration-75"
                                ></button>
                            )}
                            <div className="w-12"></div>
                        </div>
                    </div>
                )}
            </div>
        )}



    </div>
    );
}
const questions = [
    {
        id: 1,
        name: "Behavioral Questions",
        description: "Questions that ask candidates to provide examples of past behavior to assess their skills, abilities, and fit for the job."
    },
    {
        id: 2,
        name: "Professional Questions",
        description: "Questions that assess a candidate's professional knowledge, experience, and qualifications for the job."
    },
    {
        id: 3,
        name: "Technical Questions",
        description: "Questions that evaluate a candidate's knowledge and skills specific to the job or industry, such as coding challenges or problem-solving inquiries."
    },
    {
        id: 4,
        name: "Situational Questions",
        description: "Questions that present hypothetical scenarios to test a candidate's decision-making and problem-solving abilities."
    },
    {
        id: 5,
        name: "Case Study Questions",
        description: "Questions that require candidates to analyze a specific problem or situation and provide recommendations or solutions."
    },
    {
        id: 6,
        name: "Brainteasers",
        description: "Questions that test a candidate's critical thinking and problem-solving skills through unusual or challenging scenarios."
    },
    {
        id: 7,
        name: "Competency-Based Questions",
        description: "Questions that focus on specific skills or competencies required for the job, asking candidates to provide examples of how they have demonstrated those skills in the past."
    },
    {
        id: 8,
        name: "Hypothetical Questions",
        description: "Questions that pose hypothetical situations to assess a candidate's thought process, reasoning abilities, and approach to challenges."
    },
    {
        id: 9,
        name: "Cultural Fit Questions",
        description: "Questions that evaluate whether a candidate's values, work style, and personality align with the company culture to determine their fit within the team and organization."
    }
];

const interviewers = [
    {
        id: "John",
        name: "John",
        description: "Software Engineering",
        level: "L3",
    },
    {
        id: "Richard",
        name: "Richard",
        description: "Product Management",
        level: "L5",
    },
    {
        id: "Sarah",
        name: "Sarah",
        description: "Other",
        level: "L7",
    },
];

const ffmpeg = createFFmpeg({
    // corePath: `http://localhost:3000/ffmpeg/dist/ffmpeg-core.js`,
    // I've included a default import above (and files in the public directory), but you can also use a CDN like this:
    corePath: "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
    log: true,
});
