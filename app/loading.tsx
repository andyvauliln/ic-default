import { SandwichIcon } from 'lucide-react';

const Loading = ({ text }: { text: string }): JSX.Element => {
    return (
        <div className="relative m-auto min-h-screen flex flex-col items-center justify-center">
            <div id="load">
                <div>G</div>
                <div>N</div>
                <div>I</div>
                <div>D</div>
                <div>A</div>
                <div>O</div>
                <div>L</div>
            </div>
        </div>
    );
};

export default Loading;