

import { ChangeEvent, ClipboardEvent, FocusEvent, KeyboardEvent, Ref, useRef, useState } from "react";

export default function OtpInput() {
  const [otp, setOtp] = useState(Array(4).fill("")); // Array with 6 empty strings
  const inputRefs = useRef<(HTMLInputElement)[]>([]); // Array of refs for each input field

  const handleKeyDown = (e:KeyboardEvent<HTMLInputElement>) => {

    if (e.key === "Delete" || e.key === "Backspace") {
      const index = inputRefs.current.indexOf(e.target as HTMLInputElement);
      console.log(index , otp);
      
      if (index >= 0) {
        const optValue = otp
        optValue[index] = ''
        setOtp([...optValue]);
        inputRefs.current[index - 1 > -1 ? index - 1 : 0].focus();
      }
    }
  };

  const handleInput = (e:ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const index = inputRefs.current.indexOf(target);
    if (!new RegExp(`^[0-9]{${otp.length}}$`).test(target.value)) {
      return;
    }
    if (target.value) {
      setOtp((prevOtp) => [
        ...prevOtp.slice(0, index),
        target.value,
        ...prevOtp.slice(index + 1),
      ]);
      if (index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleFocus = (e:FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handlePaste = (e:ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    if (!new RegExp(`^[0-9]{${otp.length}}$`).test(text)) {
      return;
    }
    const digits = text.split("");
    setOtp(digits);
  };

  const setRef = (element:HTMLInputElement , index :number)=>{
    inputRefs.current[index] = element as HTMLInputElement
  }

  return (
    <section className="bg-white py-10 dark:bg-dark">
      <div className="container">
        <form id="otp-form" className="flex gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onPaste={handlePaste}
              ref={(el : HTMLInputElement) =>setRef(el,index)}
              className="shadow-xs flex w-[64px] items-center justify-center rounded-lg border border-stroke bg-white p-2 text-center text-2xl font-medium text-gray-5 outline-none sm:text-4xl dark:border-dark-3 dark:bg-white/5"
            />
          ))}
          {/* You can conditionally render a submit button here based on otp length */}
        </form>
      </div>
    </section>
  );
}
