"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { GiBatMask } from "react-icons/gi";
import img1 from "../../../public/img1.jpeg"
import img2 from "../../../public/img2.jpeg"

const images = [
  {
    src: img1,
  },
  {
    src: img2,
  },
];
export default function Home() {
  return (
    <main className=" flex-grow flex flex-col items-center justify-center px-4 md:px-34 py-12">
      <section className=" flex flex-col  text-center  min-h-[calc(100vh-6rem-98px)]">
        <h1 className=" text-3xl md:text-5xl font-bold ">
          Drive into World of Anonymous Conversatiom
        </h1>
        <p className=" mt-3 md:mt-4 text-lg flex flex-row items-center justify-center text-wrap">
          Explore the No Mask - Where your identity remains a secret
        </p>
        <div className=" m-auto ">
          <Carousel
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
            className="w-full max-w-3xl "
          >
            <CarouselContent>
              {images.map((src, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className=" p-1 flex items-center justify-center">
                        <Image src={src.src} className="w-full" alt=""  />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
    </main>
  );
}
