'use client'
import { Toaster } from "react-hot-toast";
import AllProducts from "@/components/AllProducts";
import Link from "next/link";
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";
import TextReveal from "@/components/magicui/text-reveal";
import Footer from "@/components/Footer";
import ReactLenis from "lenis/react";


export default function Home() {
  const category = "All";
  return (
    <ReactLenis root>
      <main className="flex flex-col gap-5">
        <Toaster />
        <div className="flex flex-col min-h-dvh">
          <main className="flex-1">
            <section className="relative h-[60vh] lg:h-[85vh] w-full overflow-hidden">
              <div className="grid grid-cols-4 grid-rows-5 gap-2 lg:gap-4 w-full h-full py-3 px-6">
                <div className="row-span-3">
                  <img src="https://img.freepik.com/free-photo/picture-frame-by-velvet-armchair_53876-132788.jpg?t=st=1729422991~exp=1729426591~hmac=cc28093b74acd4d4ec3c698df4dd074737b03a8ea7dd55c4a582733cf153da3d&w=360" alt="Image 1" className="rounded-lg w-full h-full object-cover" />
                </div>
                <div className="col-span-2 row-span-2">
                  <img src="https://img.freepik.com/free-photo/interior-design-with-photoframes-plants_23-2149385437.jpg?t=st=1729423015~exp=1729426615~hmac=52d95c826a09075e45c9d63eb6acade57aa8414d419d80e5e065b64c8c4e6f23&w=900" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="row-span-3 col-start-4">
                  <img src="https://img.freepik.com/premium-psd/mockup-frame-office_23-2147968616.jpg?w=900" alt="Image 3" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="row-span-2 col-start-1 row-start-4">
                  <img src="https://img.freepik.com/premium-psd/living-room-frame-mockup_388313-1630.jpg?w=740" alt="Image 4" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="row-span-3 col-start-2 row-start-3">
                  <img src="https://img.freepik.com/premium-photo/lamp-book-table-living-room_1169327-267607.jpg?w=900" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="col-span-2 col-start-3 row-start-5">
                  <img src="https://img.freepik.com/premium-photo/four-orange-chairs-illustration-with-blue-wall-gray-floor_1088041-74129.jpg?w=1060" alt="Image 8" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="row-span-2 col-start-3 row-start-3">
                  <img src="https://img.freepik.com/free-photo/modern-styled-entryway_23-2150695875.jpg?t=st=1729423174~exp=1729426774~hmac=012b5b2da022f91b8179dedb3d795625c751a8feb0afdfed2cd259820509ebd6&w=900" alt="Image 10" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="col-start-4 row-start-4">
                  <img src="https://img.freepik.com/free-photo/blue-armchair-against-blue-wall-living-room-interior-elegant-interior-design-with-copy-space-ai-generative_123827-23719.jpg?t=st=1729423656~exp=1729427256~hmac=a41c7671dca8bb7d6143caf163691ac62e9b47b83f7c6f279e451ee3c4867718&w=1380" alt="Image 11" className="w-full h-full object-cover rounded-lg" />
                </div>
              </div>
            </section>
            <VelocityScroll
              text="Discover Your Perfect Space"
              default_velocity={5}
              className="font-display text-center text-4xl font-bold tracking-[-0.02em] text-black drop-shadow-sm dark:text-white md:text-7xl md:leading-[5rem]"
            />

            <section className="mx-3 bg-[#f2f2f] mt-20">
              <div className="overflow-hidden rounded-xl">
                <div className="flex flex-col overflow-hidden bg-[#f5f5f5] sm:flex-row md:h-80">
                  <div className="relative order-first ml-auto h-48 w-full bg-gray-700 sm:order-none sm:h-auto sm:w-1/2 lg:w-full">
                    <img className="h-full w-full object-cover relative" src="assets/furniture.jpeg" loading="lazy" alt="kjk" />
                    {/* LAMP DOT  */}
                    <Link href="/explore">
                      <div className="absolute top-[33%] left-[16%]">
                        <div className="relative flex items-center justify-center">
                          {/* <!-- Dot --> */}
                          <div className="absolute w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          {/* <!-- Ring --> */}
                          <div className="absolute w-4 h-4 border-[2px] border-white rounded-full animate-pulse"></div>
                        </div>
                        <div>
                          <hr className="absolute w-12" />
                          <span className="hover:underline text-[#0d3945] text-sm flex items-center justify-center w-20 h-6 bg-[#ffffff66] backdrop-blur-sm rounded-xl absolute -top-[12px] left-[48px] text-center">Lamps</span>
                        </div>
                      </div>
                    </Link>
                    {/* PILLOW DOT  */}
                    <div className="absolute top-[44%] left-[58%]">
                      <div className="relative flex items-center justify-center">
                        {/* <!-- Dot --> */}
                        <div className="absolute w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        {/* <!-- Ring --> */}
                        <div className="absolute w-4 h-4 border-[2px] border-white rounded-full animate-pulse"></div>
                      </div>
                      <div>
                        <hr className="absolute w-12 rotate-90 top-[-32px] left-[-24px]" />
                        <span className="text-white text-sm w-20 h-6 bg-[#ffffff66] backdrop-blur-sm rounded-xl absolute -top-[79px] -left-[40px] flex items-center justify-center">Pillows</span>
                      </div>
                    </div>
                    {/* TABLE DOT  */}
                    <div className="absolute top-[70%] right-[24%]">
                      <div className="relative flex items-center justify-center">
                        {/* <!-- Dot --> */}
                        <div className="absolute w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        {/* <!-- Ring --> */}
                        <div className="absolute w-4 h-4 border-[2px] border-white rounded-full animate-pulse"></div>
                      </div>
                      <div>
                        <hr className="absolute md:w-12 w-9" />
                        <span className="text-white text-sm flex items-center justify-center w-16 h-6 bg-[#ffffff66] backdrop-blur-sm rounded-xl absolute -top-[12px] left-[25px] md:left-[48px] text-center">Table</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full flex-col p-4 sm:w-1/2 sm:p-8 lg:w-3/5">
                    <h2 className=" border-2 border-[#7bb4c0] text-l font-normal text-[#3f6a6a] md:text-xl bg-[#dae9ec] w-fit px-5 rounded-full py-1">Furniture Design Ideas</h2>
                    <p className="mt-4 mb-4 max-w-md text-gray-500">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam iusto, cumque dolores sit odio ex.</p>
                    <a href="#" className="group mt-auto flex w-44 cursor-pointer select-none items-center justify-center rounded-full bg-[#115564] px-6 py-2 text-white transition">
                      <span className="group flex w-full items-center justify-center rounded py-1 text-center font-bold"> Shop now </span>
                      <svg className="flex-0 group-hover:w-10 ml-4 h-6 w-6 transition-all" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <section className="md:px-20 px-4 md:py-8 mt-14">
              <div className="grid grid-cols-2 grid-rows-3 gap-5 md:grid-cols-6 md:grid-rows-6 md:h-[26rem]">
                {/* Div 1: Occupies all columns in the first row on mobile, first 4 columns and first 3 rows on large screens */}
                <div className="col-span-2 row-span-1 md:col-span-4 md:row-span-3 bg-[#f5f5f5] rounded-lg flex py-4 px-8">
                  <div className="w-1/2 flex flex-col">
                    <span className="bg-white rounded-full px-2 py-1 text-sm font-light w-fit"><span className="text-teal-600 font-bold">130+</span>items</span>
                    <span className="font-extrabold text-xl m-1">Tables</span>
                    <span><ul className="text-gray-400 text-sm font-light mb-1">
                      <li>folding table</li>
                      <li>desk</li>
                      <li>dining table</li>
                      <li>coffee table</li>
                    </ul></span>
                    <button className="w-fit underline font-light text-sm">View all →</button>
                  </div>
                  <img className="object-contain w-1/2 h-full" src="assets/table.png" alt="" />
                </div>

                {/* Div 2: Occupies all columns in the second row on mobile, last 2 columns and all rows on large screens */}
                <div className="col-span-2 row-span-1 md:col-span-2 md:row-span-6 bg-[#e9eef1] rounded-lg flex py-4 px-8 relative">
                  <div className="w-1/2 flex flex-col relative z-10">
                    <span className="bg-white rounded-full px-2 py-1 text-sm font-light w-fit"><span className="text-teal-600 font-bold">130+</span>items</span>
                    <span className="font-extrabold text-xl m-1">Chairs</span>
                    <span><ul className="text-gray-400 text-sm font-light mb-1">
                      <li>gaming chair</li>
                      <li>office chair</li>
                      <li>lounge chair</li>
                      <li>adirondack chairs</li>
                    </ul></span>
                    <button className="w-fit underline font-light text-sm">View all →</button>
                  </div>
                  <img className="object-contain md:w-[85%] w-[63%] h-[78%] absolute bottom-2 right-0" src="assets/chair.png" alt="" />
                </div>

                {/* Div 3: Occupies first column in the third row on mobile, first 2 columns and last 3 rows on large screens */}
                <div className="col-span-1 row-span-1 md:col-span-3 md:row-start-4 md:row-span-3 bg-[#feefdc] rounded-lg flex py-4 px-8">
                  <div className="w-1/2 flex flex-col">
                    <span className="bg-white rounded-full px-2 py-1 text-sm font-light w-fit"><span className="text-teal-600 font-bold">130+</span>items</span>
                    <span className="font-extrabold text-xl m-1">Light</span>
                    <span><ul className="text-gray-400 text-sm font-light mb-1">
                      <li>chandelier</li>
                      {/* <li>desk</li> */}
                      {/* <li>dining table</li> */}
                      <li>pendent light</li>
                    </ul></span>
                    <button className="w-fit underline font-light text-sm">View all →</button>
                  </div>
                  <img className="object-contain w-[80%] h-full" src="assets/lamp.png" alt="" />
                </div>

                {/* Div 4: Occupies second column in the third row on mobile, 3rd and 4th columns and last 3 rows on large screens */}
                <div className="col-span-1 row-span-1 md:col-span-1 md:row-start-4 md:row-span-3 bg-gradient-to-br from-[#21758d] to-black rounded-lg relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <span className="bg-[#e6a950] rounded-full text-xs px-3 py-1 mb-3 w-max border-2 border-gray-500 text-white">Get Discount</span>
                    <span className="text-lg text-white w-max text-center font-light">30% OFFER</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-12 md:py-16 lg:py-20 ">
              <div className="mx-4">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Explore Our Collections</h2>
                  <p className="mt-4 text-muted-foreground">Browse our latest fashion trends and must-have pieces.</p>
                </div>
                <AllProducts category={category}></AllProducts>
                <div className="flex justify-start">
                  <Link
                    href="/explore"
                    className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    prefetch={false}
                  >
                    Shop All
                  </Link>
                </div>
              </div>
            </section>

            {/* <div className="textRevel z-10 flex min-h-[16rem] items-center justify-center rounded-lg border bg-white dark:bg-black">
              <TextReveal text="Immerse yourself in crystal-clear audio with our premium earbuds." />
            </div> */}
          </main>
        </div>
        <Footer />
      </main>
    </ReactLenis>
  );
}
