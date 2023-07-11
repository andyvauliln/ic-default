
//@ts-nocheck
import type { NextPage } from "next";
import Loading from "./loading";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default async function HomePage() {
    sleep(6000);
    // throw Error("setttt")
    return (
        <>
            <Loading />
        </>
    );
}