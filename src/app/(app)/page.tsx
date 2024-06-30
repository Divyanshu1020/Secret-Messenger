import Image from "next/image";
import { GiBatMask } from "react-icons/gi";

export default function Home() {
  return (
    <main className=" flex-grow flex flex-col items-center justify-center px-4 md:px-34 py-12">
      <section className=" text-center mb-8 md:mb-12">
        <h1 className=" text-3xl md:text-5xl font-bold ">
          Drive into World of Anonymous Conversatiom
        </h1>
        <p className=" mt-3 md:mt-4 text-lg flex flex-row items-center justify-center text-wrap">Explore the No Mask - Where your identity remains a secret</p>
      </section>
    </main>
  );
}
