import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  Eye,
  EyeOff,
  Lock,
  Mail,
  UserRoundCog,
  Wrench,
} from "lucide-react";
import api from "../../services/api";
import bitLogo from "../../assets/logo/bit-logo.png";
import campusImage from "../../assets/images/campus_illustration.png";
import { useNavigate } from "react-router-dom";

const workflow = [
  { label: "Report", icon: ClipboardList },
  { label: "Assign", icon: UserRoundCog },
  { label: "Resolve", icon: Wrench },
  { label: "Verify", icon: BadgeCheck },
];

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (isSubmitting) return;

    if (!email || !password) {
      alert("Please enter Email and Password");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("/auth/login", {
        college_email: email,
        password,
      });

      const { token, user } = response.data;

      const dashboardByRole = {
        Admin: "/admin-dashboard",
        Technician: "/technician-dashboard",
        Student: "/student-dashboard",
      };

      const destination = dashboardByRole[user.role];

      if (!destination) {
        localStorage.removeItem("token");
        alert("Unsupported user role.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user.user_id);
      localStorage.setItem("full_name", user.full_name);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      navigate(destination);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-4 sm:p-5 lg:flex lg:items-center lg:justify-center">

      {/* MAIN LOGIN CONTAINER */}
      <main
        className="
          mx-auto
          grid
          w-full
          max-w-[1220px]
          overflow-hidden
          rounded-[30px]
          bg-white
          shadow-[0_25px_70px_rgba(15,23,42,0.22)]
          
          lg:h-[calc(100vh-40px)]
          lg:max-h-[700px]
          lg:min-h-[620px]
          
          lg:grid-cols-[1.08fr_0.92fr]
        "
      >

        {/* =====================================================
            LEFT SIDE
        ====================================================== */}

        <section
          className="
            flex
            min-w-0
            flex-col
            px-7
            py-7
            sm:px-10
            sm:py-8
            lg:px-11
            lg:py-9
          "
        >

          {/* BRAND */}
          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-blue-700
                text-white
                shadow-lg
                shadow-blue-700/20
              "
            >
              <Wrench size={21} aria-hidden="true" />
            </div>

            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-slate-900">
                Smart Campus
              </p>

              <p className="mt-1 text-sm font-medium text-slate-500">
                Maintenance &amp; Service Management
              </p>
            </div>

          </div>


          {/* LEFT MAIN CONTENT */}
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center">

            {/* TAGLINE */}
            <p
              className="
                mb-2
                text-center
                text-xl
                font-bold
                tracking-wide
                text-blue-700
                sm:text-2xl
              "
            >
              Report. Resolve. Verify.
            </p>


            {/* CAMPUS IMAGE */}
            <div className="flex w-full flex-1 items-center justify-center">
              <img
                src={campusImage}
                alt="Smart Campus Maintenance"
                className="
                  block
                  h-auto
                  max-h-[410px]
                  w-[95%]
                  max-w-[530px]
                  object-contain
                "
              />
            </div>


            {/* WORKFLOW */}
            <div
              className="
                w-full
                max-w-[650px]
                rounded-2xl
                border
                border-blue-100
                bg-gradient-to-r
                from-blue-50
                to-cyan-50
                px-4
                py-3
              "
            >

              <div className="flex items-center justify-between gap-1">

                {workflow.map(({ label, icon: Icon }, index) => (
                  <div
                    key={label}
                    className="flex min-w-0 flex-1 items-center"
                  >

                    <div className="flex min-w-0 items-center gap-1.5">

                      <span
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-white
                          text-blue-700
                          shadow-sm
                        "
                      >
                        <Icon size={15} aria-hidden="true" />
                      </span>

                      <span
                        className="
                          truncate
                          text-xs
                          font-bold
                          text-slate-600
                          sm:text-sm
                        "
                      >
                        {label}
                      </span>

                    </div>

                    {index < workflow.length - 1 && (
                      <ArrowRight
                        className="mx-1.5 shrink-0 text-blue-300"
                        size={16}
                        aria-hidden="true"
                      />
                    )}

                  </div>
                ))}

              </div>

            </div>


            {/* DEPARTMENTS */}
            <p
              className="
                mt-3
                text-center
                text-xs
                font-semibold
                tracking-wide
                text-slate-400
              "
            >
              Electrical
              <span className="mx-2 text-cyan-500">•</span>
              Plumbing
              <span className="mx-2 text-cyan-500">•</span>
              Technical
            </p>

          </div>

        </section>


        {/* =====================================================
            RIGHT SIDE - LOGIN
        ====================================================== */}

        <section
          className="
            flex
            min-w-0
            items-center
            justify-center
            border-t
            border-slate-100
            bg-slate-50
            px-7
            py-8
            sm:px-12
            lg:border-l
            lg:border-t-0
            lg:px-12
          "
        >

          <div className="w-full max-w-[390px]">

            {/* COLLEGE LOGO */}
            <div className="mb-6 text-center">

              <img
                src={bitLogo}
                alt="Bannari Amman Institute of Technology"
                className="
                  mx-auto
                  h-[70px]
                  w-[70px]
                  object-contain
                "
              />

            </div>


            {/* WELCOME */}
            <div className="mb-7 text-center">

              <h1
                className="
                  text-[30px]
                  font-extrabold
                  tracking-tight
                  text-slate-800
                  sm:text-[32px]
                "
              >
                Welcome Back
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Sign in to continue
              </p>

            </div>


            {/* EMAIL */}
            <div className="mb-5">

              <label
                htmlFor="college-email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                College Email
              </label>

              <div className="relative">

                <Mail
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                  size={19}
                  aria-hidden="true"
                />

                <input
                  id="college-email"
                  type="email"
                  placeholder="example@bitsathy.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    h-[52px]
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    pl-12
                    pr-4
                    text-sm
                    text-slate-800
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-blue-600
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />

              </div>

            </div>


            {/* PASSWORD */}
            <div className="mb-5">

              <label
                htmlFor="login-password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <div className="relative">

                <Lock
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                  size={19}
                  aria-hidden="true"
                />

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLogin();
                    }
                  }}
                  className="
                    h-[52px]
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    pl-12
                    pr-12
                    text-sm
                    text-slate-800
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-blue-600
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />

                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                    transition
                    hover:text-blue-700
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-200
                  "
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>


            {/* REMEMBER ME */}
            <div className="mb-6 flex items-center">

              <label
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-2
                  text-sm
                  text-slate-600
                "
              >

                <input
                  type="checkbox"
                  className="
                    h-4
                    w-4
                    cursor-pointer
                    accent-blue-700
                  "
                />

                Remember Me

              </label>

            </div>


            {/* LOGIN BUTTON */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={isSubmitting}
              className="
                h-[52px]
                w-full
                rounded-xl
                bg-blue-700
                font-semibold
                text-white
                shadow-lg
                shadow-blue-700/20
                transition
                hover:bg-blue-800
                hover:shadow-blue-700/30
                focus:outline-none
                focus:ring-4
                focus:ring-blue-200
                disabled:cursor-not-allowed
                disabled:opacity-70
              "
            >
              {isSubmitting
                ? "Logging in..."
                : "Login"}
            </button>


            {/* COPYRIGHT */}
            <p
              className="
                mt-7
                text-center
                text-xs
                text-slate-400
              "
            >
              © 2026 Bannari Amman Institute of Technology
            </p>

          </div>

        </section>

      </main>
    </div>
  );
}

export default Login;