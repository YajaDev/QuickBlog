import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../reduxStore/store";

import { authError, authSuccess, startAuth } from "../reduxStore/authSlice";
import { setNotification } from "../reduxStore/notificationSlice";
import { useNavigate } from "react-router-dom";

type Step = "Login" | "Register";

const UserForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector(
    (state: RootState) => state.auth
  );

  const [step, setStep] = useState<Step>("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(startAuth()); // Make loading state to true

    try {
      // Check if email and password is not Empty
      if (!email || !password) throw new Error("All fields are required");

      if (step === "Login") {
        // LOGIN Authentication
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error; // check if there's an error
        dispatch(authSuccess(data.session)); // update session state
        console.log(data);
      } else {
        // REGISTER Authentication
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (!data.session) throw Error("No user returned"); // check if session is autenticated
        dispatch(authSuccess(data.session));
        dispatch(
          setNotification({
            status: "success",
            message: "Created account successfully!",
          })
        );
      }

      navigate("/dashboard"); // redirect
      setEmail("");
      setPassword("");
    } catch (err) {
      if (err instanceof Error) {
        dispatch(authError(err.message));
        dispatch(setNotification({ status: "error", message: err.message })); // trigger error notification
      } else {
        dispatch(authError("Unexpected Error!"));
        dispatch(
          setNotification({ status: "error", message: "Unexpected Error!" })
        );
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm p-6 max-md:mx-6 rounded-md border border-primary/30 shadow-lg">
        <div className="w-full py-6 mb-6 text-center">
          <h1>
            <span className="text-primary">Admin</span> {step}
          </h1>
          {step === "Login" && (
            <p className="font-thin">
              Enter your credentials to access the admin panel
            </p>
          )}
        </div>
        <form
          onSubmit={handleSubmit}
          className="[&>div]:flex [&>div]:flex-col [&>div]:border-b-2 space-y-6 [&>div>input]:p-2 [&>div>input]:outline-none [&>div]:border-gray-300 text-gray-600"
        >
          <div>
            <label htmlFor="email">
              Email{!email && <span className="text-red-500">*</span>}
            </label>
            <input
              id="email"
              type="text"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">
              Password{!password && <span className="text-red-500">*</span>}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              placeholder="Your Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* Form button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 bg-primary text-primary-foreground rounded hover:-translate-y-0.5 ${
              loading && "bg-primary/50"
            }`}
          >
            {step}
          </button>
        </form>
        <div className="text-sm text-center font-light">
          {step === "Register" ? "Already a User?" : "Need an account?"}
          {/* Switch step button */}
          <button
            className="ml-1.5 underline mt-2 decoration-0 hover:text-primary"
            onClick={() =>
              step === "Register" ? setStep("Login") : setStep("Register")
            }
          >
            {step === "Register" ? "Login" : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
