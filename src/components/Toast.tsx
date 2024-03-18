import { Toaster, toast } from "sonner";

export function Toast(props: any) {
  setTimeout(() => {
    toast.success("Cuenta creada exitosamente");
  });
  return (
    <Toaster
      theme={props.theme}
      position={props.direction}
      expand={true}
      richColors
    />
  );
}
