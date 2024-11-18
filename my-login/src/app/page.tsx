"use client";
import { Form } from "./componets/form";
import { useAuthFetch } from "./hooks/useAuthFetch";
import { useLoading } from "./hooks/useLoading";

export default function LoginPage() {
  const {isLoading, startLoading, finishLoading} = useLoading();

  const authFetch = useAuthFetch();

  const login = async (formData: any) => {
    startLoading();
    await authFetch({
      endpoint: "login",
      redirectRoute: "/home",
      formData,
    });
    finishLoading();
  };

  return (
    <>
      <Form
        title="Iniciar Sesión"
        /*onSubmit={() => {}}*/
        onSubmit={login}
        description=""
      >
        <div className="my-[10px] flex flex-col gap-4">
          <Form.Input
            label="Email"
            name="email"
            placeholder="Ingresa tu email"
          />
        </div>
        <div>
          <Form.Input
            label="Password"
            name="Password"
            placeholder="Ingresa tu Password"
            type="password"
          />
        </div>
        <Form.SubmitButton buttonText="Entrar" isLoading={isLoading} />

        <Form.Footer
          description="¿Te olvidaste tu contraseña?"
          link="/forget-password"
          textLink="Recupérala aquí"
        />
        <Form.Footer
          description="¿No tienes cuenta?"
          link="/register"
          textLink="Registrate"
        />
      </Form>
    </>
  );
}
