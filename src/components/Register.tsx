import { createUser } from "../utils/firebase";
import { onAuthStateChanged } from "@firebase/auth";
import { useRef, useEffect, FormEvent } from "react";
import { auth } from "../utils/firebase";
import { useRouter } from "next/router";
import Link from "next/link";

const Register = () => {
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const confirmPassword = useRef<HTMLInputElement>(null);
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
    const passwordValue = password.current?.value;
    const confirmPasswordValue = confirmPassword.current?.value;

    if (passwordValue !== confirmPasswordValue) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await createUser({
        email: emailValue as string,
        password: passwordValue as string,
      });
      if (response) {
        alert("Account created successfully");
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
            Create and account
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
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium  text-white"
              >
                Password
              </label>
              <input
                ref={password}
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="form_input"
                required={true}
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block mb-2 text-sm font-medium  text-white"
              >
                Confirm password
              </label>
              <input
                ref={confirmPassword}
                type="password"
                name="confirm-password"
                id="confirm-password"
                placeholder="••••••••"
                className="form_input"
                required={true}
              />
            </div>

            <p className="text-sm font-light text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary-600 hover:underline text-primary-500 text-blue-500"
              >
                Login here
              </Link>
            </p>
            <div className="flex justify-center items-center">
              <button type="submit" className="form_btn">
                Create an account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Register;
