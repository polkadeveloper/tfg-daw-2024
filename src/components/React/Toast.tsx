import { Toaster, toast } from "sonner";
import "@/styles/sonner.css";

export function Toast(props: any) {
  setTimeout(() => {
    if (props.error === "true") {
      toast.error(props.message);
    } else {
      toast.success(props.message);
    }
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
