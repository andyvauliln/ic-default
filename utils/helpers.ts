import { Database } from '@/supabase/types_db';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';


export const getURL = (path: string = '') => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/';
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Make sure to including trailing `/`.

  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  url = path ? `${url}${path}` : url;
  return url;
};

export const postData = async ({
  url,
  data
}: {
  url: string;
  data?: any;
}) => {

  const res = await fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    console.log('Error in postData', { url, data, res });

    throw Error(res.statusText);
  }

  return res.json();
};


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleSelectModel(
  modelState,
  modelsStateContext,
  setModelsStateContext,
  parametersContext,
  setParametersContext,
  multi_select: boolean
) {
  const number_of_models_selected = modelsStateContext.filter(
    modelState => modelState.selected
  ).length;
  const selected =
    !multi_select && number_of_models_selected > 1
      ? true
      : !modelState.selected;

  if (selected && !multi_select) {
    const parameters = modelState.parameters;

    setParametersContext({
      ...parametersContext,
      temperature:
        parameters.temperature?.value || parametersContext.temperature,
      maximumLength:
        parameters.maximumLength?.value || parametersContext.maximumLength,
      topP: parameters.topP?.value || parametersContext.topP,
      topK: parameters.topK?.value || parametersContext.topK,
      frequencyPenalty:
        parameters.frequencyPenalty?.value ||
        parametersContext.frequencyPenalty,
      presencePenalty:
        parameters.presencePenalty?.value || parametersContext.presencePenalty,
      repetitionPenalty:
        parameters.repetitionPenalty?.value ||
        parametersContext.repetitionPenalty,
      stopSequences:
        parameters.stopSequences?.value || parametersContext.stopSequences,
    });
  }

  setModelsStateContext(
    modelsStateContext.map(m => {
      if (!multi_select && m.tag !== modelState.tag) {
        m.selected = false;
      } else if (m.tag === modelState.tag) {
        m.selected = selected;
      }
      return m;
    })
  );
}