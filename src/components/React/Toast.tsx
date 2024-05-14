import { Toaster, toast } from "sonner";

export function Toast(props: any) {
  setTimeout(() => {
    toast.success(props.message);
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
