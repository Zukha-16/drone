import { resetPassword } from "../utils/firebase";
import { onAuthStateChanged } from "@firebase/auth";
import { useRef, useEffect, FormEvent } from "react";
import { auth } from "../utils/firebase";
import { useRouter } from "next/router";
import Link from "next/link";

const PasswordReset = () => {
  const email = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      }
    });
    // eslint-disable-next-line
  }, []);

  const register = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailValue = email.current?.value;

    try {
      const response = await resetPassword(emailValue as string);
      if (response) {
        alert("Link to reset password sent to email");
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-[75vh] lg:py-0">
      <a
        href="https://apian.aero/"
        className="flex items-center mb-6 text-2xl font-semibold text-white"
      >
        Apian
      </a>
      <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
            Reset your password
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={register}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium  text-white"
              >
                Your email
              </label>
              <input
                ref={email}
                type="email"
                name="email"
                id="email"
                className="form_input"
                placeholder="name@company.com"
                required={true}
              />
            </div>

            <p className="text-sm font-light text-gray-400">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-medium text-primary-600 hover:underline text-primary-500 text-blue-500"
              >
                Login here
              </Link>
            </p>
            <div className="flex justify-center items-center">
              <button type="submit" className="form_btn">
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default PasswordReset;
