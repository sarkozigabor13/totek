"use client";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="rounded-lg bg-blacksection shadow-2xl relative"   style={{zIndex: 11114}}>
      <div className="mx-auto w-full max-w-screen-xl p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
        <a
            href="/#hero"
            className="text-primary flex items-center lg:justify-between gap-4 text-4xl"
          >
            <Image
              src="/images/logo/logo-light.svg"
              alt="logo"
              width={40}
              height={40}
            />
            TÓTÉK
          </a>
          <ul className="mb-6 flex flex-col lg:flex-wrap lg:flex-row lg:items-center pt-4 text-lg font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <a href="#hero" className="me-4 hover:underline md:me-6">
                Következő mérkőzés
              </a>
            </li>
            <li>
              <a href="/#matches" className="me-4 hover:underline md:me-6">
               Mérkőzések
              </a>
            </li>
            <li>
              <a href="/#standing" className="me-4 hover:underline md:me-6">
                Tabellák
              </a>
            </li>
            <li>
              <a href="/#players" className="hover:underline">
                Játékos statok
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8 dark:border-gray-700" />
        <span className="block text-lg text-gray-500 text-center dark:text-gray-400">
          © 2025{" "}
          <a href="https://flowbite.com/" className="hover:underline">
           TótÉk™
          </a>
          . Minden jog fenntartva.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
