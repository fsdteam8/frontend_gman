// import Featured_Farms from '@/components/Featured_Farms';
// import HeroSection from '@/components/Hero';
// import Searchbar from '@/components/Searchbar';
// import React, { Suspense } from 'react';

// const Page = () => {
//   return (
//     <div>
//       <div className="relative">
//         <HeroSection />
//         <div className="absolute w-full lg:max-w-5xl bottom-[-30px] md:bottom-[-50px] left-[50%] translate-x-[-50%] right-0 z-10">
//           <Searchbar />
//         </div>
//       </div>

//     <Suspense fallback={<div>Loading...</div>}>
//         <Featured_Farms />
//       </Suspense>
//       {/* <Add_Banner/> */}
//        {/* <All_farms/> */}

//     </div>
//   );
// };

// export default Page;

// "use client";

// import Featured_Farms from "@/components/Featured_Farms";
// import HeroSection from "@/components/Hero";
// import Searchbar from "@/components/Searchbar";
// import React, { Suspense, useState, useEffect } from "react";

// const AutoModal = ({
//   isOpen,
//   onClose,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
// }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/30 backdrop:md flex items-center justify-center z-50">
//       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white p-8 rounded-lg w-[500px] text-center shadow-lg">
//           <h2 className="text-[24px] text-[#272727] font-semibold mb-4">Payment and fees</h2>
//           <p className="mb-6 text-[#595959] text-base">
//             Table Fresh is completely free to join and use. The only fees you
//             will ever see are a small credit card fee and a maintenance
//             processing fee to purchase products using the payment system.
//           </p>
//           <button
//             onClick={onClose}
//             className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
//           >
//             Ok
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Page = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     // Check if modal has already been shown in this session
//     const hasModalBeenShown = sessionStorage.getItem("modalShown");

//     if (!hasModalBeenShown) {
//       // Set timeout for 2 minutes (120,000 milliseconds)
//       const timer = setTimeout(() => {
//         setIsModalOpen(true);
//         // Mark modal as shown in sessionStorage
//         sessionStorage.setItem("modalShown", "true");
//       }, 5000);

//       // Cleanup timeout on component unmount
//       return () => clearTimeout(timer);
//     }
//   }, []);

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <div>
//       <div className="relative">
//         <HeroSection />
//         <div className="absolute w-full lg:max-w-5xl bottom-[-30px] md:bottom-[-50px] left-[50%] translate-x-[-50%] right-0 z-10">
//           <Searchbar />
//         </div>
//       </div>

//       <Suspense fallback={<div>Loading...</div>}>
//         <Featured_Farms />
//       </Suspense>
//       {/* <Add_Banner/> */}
//       {/* <All_farms/> */}

//       <AutoModal isOpen={isModalOpen} onClose={closeModal} />
//     </div>
//   );
// };

// export default Page;

"use client";

import Featured_Farms from "@/components/Featured_Farms";
import HeroSection from "@/components/Hero";
import Searchbar from "@/components/Searchbar";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <div>
      <div className="relative">
        <HeroSection />
        <div className="absolute w-full lg:max-w-5xl bottom-[-30px] md:bottom-[-50px] left-[50%] translate-x-[-50%] right-0 z-10">
          <Searchbar />
        </div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <Featured_Farms />
      </Suspense>
      {/* <Add_Banner/> */}
      {/* <All_farms/> */}
    </div>
  );
};

export default Page;