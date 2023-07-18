import { FC } from 'react'

interface settingsProps {

}

const settings: FC<settingsProps> = ({ }) => {
    return <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="settings" role="tabpanel" aria-labelledby="settings-tab">
        <p className="text-sm text-gray-500 dark:text-gray-400">This is some placeholder content the <strong className="font-medium text-gray-800 dark:text-white">Dashboard tab's associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.</p>
    </div>
}

export default settings
const question = [
    {
        "id": 1,
        "name": "Behavioral Questions",
        "description": "Questions that ask candidates to provide examples of past behavior to assess their skills, abilities, and fit for the job.",
        "percentage": 20
    },
    {
        "id": 2,
        "name": "Professional Questions",
        "description": "Questions that assess a candidate's professional knowledge, experience, and qualifications for the job.",
        "percentage": 15
    },
    {
        "id": 3,
        "name": "Technical Questions",
        "description": "Questions that evaluate a candidate's knowledge and skills specific to the job or industry, such as coding challenges or problem-solving inquiries.",
        "percentage": 25
    },
    {
        "id": 4,
        "name": "Situational Questions",
        "description": "Questions that present hypothetical scenarios to test a candidate's decision-making and problem-solving abilities.",
        "percentage": 10
    },
    {
        "id": 5,
        "name": "Case Study Questions",
        "description": "Questions that require candidates to analyze a specific problem or situation and provide recommendations or solutions.",
        "percentage": 10
    },
    {
        "id": 6,
        "name": "Brainteasers",
        "description": "Questions that test a candidate's critical thinking and problem-solving skills through unusual or challenging scenarios.",
        "percentage": 5
    },
    {
        "id": 7,
        "name": "Competency-Based Questions",
        "description": "Questions that focus on specific skills or competencies required for the job, asking candidates to provide examples of how they have demonstrated those skills in the past.",
        "percentage": 10
    },
    {
        "id": 8,
        "name": "Hypothetical Questions",
        "description": "Questions that pose hypothetical situations to assess a candidate's thought process, reasoning abilities, and approach to challenges.",
        "percentage": 5
    },
    {
        "id": 9,
        "name": "Cultural Fit Questions",
        "description": "Questions that evaluate whether a candidate's values, work style, and personality align with the company culture to determine their fit within the team and organization.",
        "percentage": 10
    }
]