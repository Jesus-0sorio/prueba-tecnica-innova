"use client";
import {
  Button,
  FormControl,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  // hooks
  const router = useRouter();

  // states
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const validateForm = () => {
    if (!email || !password) {
      setError("Por favor, rellena todos los campos");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const response = await signIn("credentials", {
      username: email,
      password,
      redirect: false,
    });

    if (!response?.ok) {
      setError("Credenciales incorrectas");
      return;
    }

    router.push("/dashboard");

  };

  return (
    <main className="flex h-full items-center justify-center bg-gradient-to-tl from-[#BCDFFF]/40 from-70%">
      <div className="flex justify-around border shadow-lg rounded-lg px-4 py-8 bg-white m-2">
        <div className="w-2/4">
          <form onSubmit={handleSubmit}>
            <Typography variant="h4" align="center" gutterBottom>
              Prueba Tecnica Fullstack
            </Typography>
            <FormControl fullWidth margin="normal">
              <TextField
                id="email"
                aria-describedby="email-input"
                label="Email"
                variant="standard"
                type="email"
                placeholder="your@email.com"
                sx={{ arialLabel: "email" }}
                color={error ? "error" : "primary"}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                autoFocus
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <TextField
                id="password"
                aria-describedby="password-input"
                label="Password"
                variant="standard"
                type="password"
                placeholder="••••••"
                color={error ? "error" : "primary"}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                autoFocus
              />
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
            >
              Iniciar sesión
            </Button>
          </form>

          {error && (
            <Typography variant="body2" align="center" color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            ¿No tienes una cuenta? &nbsp;
            <Link href="/register">Registrarte</Link>
          </Typography>
        </div>
        <Image
          className="hidden md:block w-96"
          src="/LoginImage.webp"
          alt="logo"
          width={300}
          height={300}
        />
      </div>
    </main>
  );
};

export default Page;
