import {
  ChangeEvent,
  ClipboardEvent,
  FocusEvent,
  KeyboardEvent,
  useRef,
  useState,
} from "react";

export default function OtpInput() {
  const [otpInputs, setOtpInputs] = useState(Array(4).fill("")); // Array with 6 empty strings
  const inputRefs = useRef<HTMLInputElement[]>([]); // Array of refs for each input field

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Delete" || event.key === "Backspace") {
      const index = inputRefs.current.indexOf(event.target as HTMLInputElement);
      if (index >= 0) {
        const optValue = otpInputs;
        optValue[index] = "";
        setOtpInputs([...optValue]);
        inputRefs.current[index - 1 > -1 ? index - 1 : 0].focus();
      }
    }
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const index = inputRefs.current.indexOf(target);
    if (!new RegExp(`^[0-9]{1}$`).test(target.value)) {
      return;
    }
    if (target.value) {
      setOtpInputs((prevOtp) => [
        ...prevOtp.slice(0, index),
        target.value,
        ...prevOtp.slice(index + 1),
      ]);
      if (index < otpInputs.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text");
    if (!new RegExp(`^[0-9]{${otpInputs.length}}$`).test(text)) {
      return;
    }
    const digits = text.split("");
    setOtpInputs(digits);
  };

  const setRef = (element: HTMLInputElement, index: number) => {
    inputRefs.current[index] = element as HTMLInputElement;
  };

  return (
    <div>
      <p>
        OTP Verification Code <br />
        We have sent a verification code to your mobile number
      </p>
      <div className="bg-white py-10 dark:bg-dark">
        <div className="container">
          <form id="otp-form" className="flex gap-2">
            <div>
            {otpInputs.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onPaste={handlePaste}
                ref={(el: HTMLInputElement) => setRef(el, index)}
                className="shadow-xs flex w-[64px] items-center justify-center rounded-lg border border-stroke bg-white p-2 text-center text-2xl font-medium text-gray-5 outline-none sm:text-4xl dark:border-dark-3 dark:bg-white/5"
              />
            ))}
            </div>
            {otpInputs.every(input=> input !== "")  &&( <button type="submit">Submit</button>)}
          </form>
        </div>
      </div>
    </div>
  );
}
