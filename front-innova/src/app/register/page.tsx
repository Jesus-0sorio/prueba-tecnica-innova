"use client";
import { CustomForm, Field } from "@/components/CustmoForm";
import { authService } from "@/services/auth.service";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";

export default function Page() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "",
  });
  // const router = useRouter();

  const handleSubmitCreateCustom = async () => {
    try {

      if (!formData.email || !formData.name || !formData.password || !formData.role) {
        enqueueSnackbar("Todos los campos son obligatorios", {
          variant: "error",
          autoHideDuration: 3000,
        });
        return
      }

      const response = await authService.register(formData.name, formData.email, formData.password, formData.role)

      if (response.status === 201) {
        enqueueSnackbar('Te registraste exitosamente', {
          variant: 'success',
          autoHideDuration: 3000,
        });
        return
      }

      enqueueSnackbar("Hubo un error al momento de registrarte", {
        variant: "error",
        autoHideDuration: 3000,
      });

    } catch (error) {
      console.error(error);
    }
  };

  const fields = [
    {
      name: "name",
      label: "Nombre",
      type: "text",
      value: formData.name,
      setValue: (value: string) => setFormData({ ...formData, name: value }),
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      value: formData.email,
      setValue: (value: string) => setFormData({ ...formData, email: value }),
    },
    {
      name: "password",
      label: "Contraseña",
      type: "password",
      value: formData.password,
      setValue: (value: string) =>
        setFormData({ ...formData, password: value }),
    },
    {
      name: "role",
      label: "Rol",
      type: "select",
      options: [
        { label: "None", value: '' },
        { label: "Usuario", value: "usuario" },
        { label: "Administrador", value: "administrador" },
      ],
      value: formData.role,
      setValue: (value: string) =>
        setFormData({ ...formData, role: value }),
    },
  ];

  return (
    <div className="flex h-full w-full justify-center items-center">
      <div className="flex justify-around border shadow-lg rounded-lg px-4 py-8 bg-white m-2">
        <CustomForm
          fields={fields as Field[]}
          title="Registrarse"
          textButton={"Registrate"}
          handleSubmitCreateCustom={handleSubmitCreateCustom}
          isValidCloseIcon={false}
        />
      </div>
    </div>
  );
}
