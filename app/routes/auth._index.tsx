import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, Link, redirect, useActionData } from "@remix-run/react";
import { clsx } from "clsx";
import { AlertCircleIcon } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import styles from "~/styles/Login.module.css";
import { authCookie } from "~/utils/cookies.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const API_URL = "http://134.122.95.126:8080";

  try {
    if (intent == "login") {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) return json({ error: "Login failed" }, { status: 401 });
      const { token } = await res.json();

      return redirect("/", {
        headers: {
          "Set-Cookie": await authCookie.serialize(token),
        },
      });
    } else if (intent == "register") {
      const res = await fetch(`${API_URL}/api/auth/newuser`, {
        method: `POST`,
        body: formData,
      });
      if (res.ok) {
        const email = formData.get("email");

        return redirect(`/auth/verify?email=${email}`);
      }
      return json({ error: "Failed to create user", status: 401 });
    }
    return json({ status: 200, success: true });
  } catch (e) {
    console.error(e);
    return json({ error: "Unexpected error", status: 500 });
  }
}
export default function Auth() {
  const [isActive, setIsActive] = useState(false);
  const actionData = useActionData<typeof action>();

  return (
    <main className={styles.background}>
      <div className={clsx(styles.container, { [styles.active]: isActive })}>
        {/* Login Form */}
        <section className={clsx(styles["form-box"], styles.login)}>
          <Form method="POST">
            <h1>Login</h1>
            <input type="hidden" name="intent" value="login" />
            <div className={styles["input-box"]}>
              <input
                type="text"
                placeholder="Username"
                required
                name="userName"
              />
              <i className="bx bxs-user"></i>
            </div>
            <div className={styles["input-box"]}>
              <input
                type="password"
                placeholder="Password"
                required
                name="password"
              />
              <i className="bx bxs-lock-alt"></i>
            </div>
            <div className={styles["forgot-link"]}>
              <Link to={""}>Forgot Password?</Link>
            </div>
            {actionData && "error" in actionData && (
              <Alert variant={"destructive"} style={{ padding: 12 }}>
                <AlertCircleIcon />
                <AlertTitle> Failed to login</AlertTitle>
                <AlertDescription>Wrong username or password</AlertDescription>
              </Alert>
            )}
            <button type="submit" className={styles.btn}>
              Login
            </button>
          </Form>
        </section>

        {/* Registration Form */}
        <section className={clsx(styles["form-box"], styles.register)}>
          <Form method="POST">
            <h1>Registration</h1>
            <input type="hidden" name="intent" value="register" />
            <div className={styles["input-box"]}>
              <input
                type="text"
                placeholder="FirstName"
                required
                name="firstName"
              />
              <i className="bx bxs-user"></i>
            </div>
            <div className={styles["input-box"]}>
              <input
                type="text"
                placeholder="LastName"
                required
                name="lastName"
              />
              <i className="bx bxs-user"></i>
            </div>
            <div className={styles["input-box"]}>
              <input
                type="text"
                placeholder="Username"
                required
                name="username"
              />
              <i className="bx bxs-user"></i>
            </div>
            <div className={styles["input-box"]}>
              <input type="email" placeholder="Email" required name="email" />
              <i className="bx bxs-envelope"></i>
            </div>
            <div className={styles["input-box"]}>
              <input
                type="password"
                placeholder="Password"
                required
                name="password"
              />
              <i className="bx bxs-lock-alt"></i>
            </div>
            <button type="submit" className={styles.btn}>
              Register
            </button>
          </Form>
        </section>

        {/* Toggle Panels */}
        <section className={styles["toggle-box"]}>
          <div className={clsx(styles["toggle-panel"], styles["toggle-left"])}>
            <h1>Hello, Welcome!</h1>
            <p>Don&apos;t have an account?</p>
            <button
              className={clsx(styles.btn, styles["register-btn"])}
              onClick={() => setIsActive(true)}
            >
              Register
            </button>
          </div>

          <div className={clsx(styles["toggle-panel"], styles["toggle-right"])}>
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button
              className={clsx(styles.btn, styles["login-btn"])}
              onClick={() => setIsActive(false)}
            >
              Login
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
